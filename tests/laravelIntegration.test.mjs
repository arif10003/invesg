import test from 'node:test';
import assert from 'node:assert/strict';
import {requestJson, clearSession, acceptSession, getSession, safeDownloadUrl, safePaymentUrl, rememberGuestOrder, guestOrderToken} from '../src/api/client.js';
import {login, logout, verifyEmail, resetPassword} from '../src/api/auth.js';
import {loadBooks, loadBook} from '../src/api/books.js';
import {loadInsights, loadArticle} from '../src/api/insights.js';
import {quoteOrder, createOrder, startPayment, loadOrderStatus} from '../src/api/orders.js';
import {loadMemberLibrary, saveBookmark, removeBookmark, downloadPdf, downloadBook, claimPurchases, exchangeGuestAccess} from '../src/api/member.js';
const session=(id=1,extra={})=>({access_token:'synthetic-test-token-'+id,expires_in:3600,user:{id,name:'Fixture reader',email:'reader@example.test',email_verified_at:'2026-11-01',...extra}});
function mock(t,handler){const original=globalThis.fetch;clearSession();globalThis.fetch=handler;t.after(()=>{globalThis.fetch=original;clearSession();});}
const reply=(data,status=200)=>Response.json(data,{status});

test('email sign-in sends credentials only to login, and subsequent member calls use bearer identity',async t=>{
 const seen=[];mock(t,async(path,options)=>{seen.push({path,options});return path.endsWith('/auth/login')?reply(session()):reply({data:{id:1}});});
 await login({email:'reader@example.test',password:'test-only-password'});
 await requestJson('/api/v1/me/profile',{auth:'required'});
 assert.equal(getSession().status,'authenticated');assert.equal(seen[0].options.headers.Authorization,undefined);
 assert.match(seen[1].options.headers.Authorization,/^Bearer synthetic/);assert.equal(seen[1].options.credentials,'include');
 assert.equal(seen[1].options.cache,'no-store');
});
test('401 revokes local identity and signed-out member calls fail before making a network request',async t=>{
 let calls=0;mock(t,async()=>{calls++;return reply({message:'Expired session'},401);});acceptSession(session());
 await assert.rejects(requestJson('/api/v1/me/profile',{auth:'required'}),error=>error.status===401);
 assert.equal(getSession().status,'guest');await assert.rejects(requestJson('/api/v1/me/profile',{auth:'required'}),error=>error.status===401);assert.equal(calls,1);
});
test('a late account response cannot populate a newly signed-in user',async t=>{
 let resolve;mock(t,()=>new Promise(r=>{resolve=r;}));acceptSession(session(1));
 const pending=requestJson('/api/v1/me/profile',{auth:'required'});acceptSession(session(2));resolve(reply({data:{id:1,name:'Previous identity'}}));
 await assert.rejects(pending,error=>error.status===401);assert.equal(getSession().profile.id,2);
});
test('concurrent near-expiry requests rotate the JWT once, then use the new bearer',async t=>{
 let refreshes=0;const headers=[];mock(t,async(path,options)=>{if(path.endsWith('/auth/refresh')){refreshes++;await new Promise(resolve=>setTimeout(resolve,10));return reply(session());}headers.push(options.headers.Authorization);return reply({data:{id:1}});});
 acceptSession({...session(),expires_in:30});await Promise.all([requestJson('/api/v1/me/profile'),requestJson('/api/v1/me/profile')]);assert.equal(refreshes,1);assert.equal(headers.length,2);
});
test('logout preserves identity on transport failure so a persistent session is not falsely shown as revoked',async t=>{
 let endpoint;mock(t,async(path)=>{endpoint=path;throw new Error('Network down');});acceptSession(session());
 await assert.rejects(logout());assert.match(endpoint,/\/auth\/logout$/);assert.equal(getSession().status,'authenticated');
});
test('multi-title catalog comes from every server page; published detail price overrides approved promotional copy',async t=>{
 const seen=[];mock(t,async(path)=>{seen.push(path);return path.includes('/products/esg-')?reply({data:{id:'p1',slug:'esg-is-a-lens',title:'Server title',author:'Server author',description:'Approved server description',price:175000,sale_price:160000,currency:'IDR',can_purchase:true}}):reply({data:[{id:path.includes('page=2')?'p2':'p1',slug:path.includes('page=2')?'second-title':'esg-is-a-lens',title:'Fixture',author:'Author',price:175000,currency:'IDR'}],last_page:2});});
 const books=await loadBooks();assert.equal(books.length,2);assert.equal(books[1].slug,'second-title');const book=await loadBook('esg-is-a-lens');assert.equal(book.title,'Server title');assert.equal(book.commerce.price,160000);assert.equal(book.canPurchase,true);assert.match(seen[1],/page=2/);
});
test('published and member article bodies follow server authorization, and structured images remain metadata references',async t=>{
 const publication={id:'a1',slug:'policy-test',title:'Policy',author:'Author',content_type:'policy_analysis',categories:['Climate'],can_read:false,has_pdf:true,pdf_access:'member',document:null};
 mock(t,async path=>reply(path.includes('/publications/')?{data:{...publication,can_read:true,document:{version:1,blocks:[{type:'image',media_id:'media-id',alt:'Approved figure'},{type:'citation',text:'Reference',url:'https://example.test/source'}]}}}:{data:[publication],last_page:1}));
 const list=await loadInsights();assert.equal(list.articles[0].canRead,false);assert.deepEqual(list.articles[0].body,[]);assert.equal(list.articles[0].contentType,'analysis');const article=await loadArticle('policy-test');assert.equal(article.body[0].media_id,'media-id');assert.equal(article.body[0].src,undefined);assert.equal(article.body[1].type,'citation');
});
test('guest checkout reuses its idempotency key, keeps scoped authorization and never treats a redirect as paid',async t=>{
 const calls=[];const guest='Az09gH'.repeat(11).slice(0,64);mock(t,async(path,options)=>{calls.push({path,options});if(path.includes('/quotes'))return reply({data:{id:'q1',total_amount:150000,terms_version:'v1'}});if(path==='/api/v1/orders')return reply({data:{id:'INV-1',status:'draft'},guest_order_token:guest});if(path.endsWith('/payment'))return reply({data:{url:'https://app.sandbox.midtrans.com/snap/v4/redirection/test'}});return reply({data:{id:'INV-1',status:'pending',access_status:'not_granted'}});});
 const q=(await quoteOrder({product_id:'p1',customer:'Reader',email:'reader@example.test'})).data;const key='a397a3bf-2baa-4cbd-9851-aa4cdd04c067';
 await createOrder(q,key);await createOrder(q,key);assert.equal(calls[1].options.headers['Idempotency-Key'],key);assert.equal(calls[2].options.headers['Idempotency-Key'],key);assert.equal(JSON.parse(calls[1].options.body).total,undefined);
 await startPayment('INV-1');assert.equal(calls[3].options.headers['X-Guest-Token'],guest);const state=await loadOrderStatus('INV-1');assert.equal(state.order.status,'pending');assert.equal(state.order.access_status,'not_granted');
});
test('order reference alone does not authorize lookup and unsafe payment destinations are rejected',async t=>{
 mock(t,async()=>reply({message:'Not found'},404));assert.deepEqual(await loadOrderStatus('INV-1'),{kind:'unauthorized'});assert.deepEqual(await loadOrderStatus('../admin'),{kind:'invalid'});
 for(const url of ['https://app.midtrans.com.evil.test/pay','http://app.midtrans.com/pay','https://user:secret@app.midtrans.com/pay','https://app.midtrans.com:444/pay'])assert.throws(()=>safePaymentUrl(url));
});
test('member library does not infer purchases from public catalog and bookmark writes are server-side',async t=>{
 const seen=[];mock(t,async(path,options)=>{seen.push({path,options});if(options.method==='DELETE')return new Response(null,{status:204});return reply({data:[],last_page:1});});
 assert.equal((await loadMemberLibrary('books')).status,'unauthorized');assert.equal(seen.length,0);acceptSession(session());assert.equal((await loadMemberLibrary('books')).status,'ready');await saveBookmark('a1');await removeBookmark('a1');assert.equal(seen[1].options.method,'PUT');assert.equal(seen[2].options.method,'DELETE');
});
test('secure download authorization accepts only short-lived backend download routes',async t=>{
 let call;mock(t,async(path,options)=>{call={path,options};return reply({data:{url:'/api/v1/downloads/'+'b'.repeat(64)}});});acceptSession(session());const url=await downloadPdf('a1');assert.match(url,/\/api\/v1\/downloads\/b{64}$/);assert.equal(call.options.method,'POST');
 for(const value of ['https://evil.test/api/v1/downloads/'+'a'.repeat(64),'/storage/paid.pdf','/api/v1/downloads/'+'a'.repeat(64)+'?token=bad'])assert.throws(()=>safeDownloadUrl(value));
});
test('guest email exchange and purchased-book download use distinct purpose-scoped tokens',async t=>{
 const calls=[];mock(t,async(path,options)=>{calls.push({path,options});return path.endsWith('/exchange')?reply({data:{guest_access_token:'c'.repeat(64),entitlement_id:'e1'}}):reply({data:{url:'/api/v1/downloads/'+'d'.repeat(64)}});});
 const result=await exchangeGuestAccess('e'.repeat(64));await downloadBook(result.data.entitlement_id,result.data.guest_access_token);assert.equal(calls[1].options.headers['X-Guest-Token'],'c'.repeat(64));assert.equal(calls[1].options.headers.Authorization,undefined);
});
test('verified purchase claims, email confirmation and reset use their actual Laravel contracts',async t=>{
 const calls=[];mock(t,async(path,options)=>{calls.push({path,options});return reply({message:'Accepted',data:{claimed_count:1}});});acceptSession(session());await claimPurchases();await verifyEmail('a'.repeat(64));await resetPassword({email:'reader@example.test',token:'b'.repeat(64),password:'new-test-password',password_confirmation:'new-test-password'});assert.match(calls[0].path,/\/me\/purchase-claims$/);assert.equal(calls[1].options.headers.Authorization,undefined);assert.equal(JSON.parse(calls[2].options.body).password_confirmation,'new-test-password');
});


test('startup restores identity through one credentialed refresh with no browser-stored bearer', async t => {
 const client = await import('../src/api/client.js?startup-test');
 let calls = 0;
 const original = globalThis.fetch;
 globalThis.fetch = async (path, options) => {
   calls++;
   assert.equal(path, '/api/v1/auth/refresh');
   assert.equal(options.credentials, 'include');
   assert.equal(options.headers['X-Invesg-Session'], '1');
   assert.equal(options.headers.Authorization, undefined);
   return reply(session(42));
 };
 t.after(() => { globalThis.fetch = original; client.clearSession(); });
 await Promise.all([client.restoreSession(), client.restoreSession()]);
 assert.equal(calls, 1);
 assert.equal(client.getSession().profile.id, 42);
});


test('logout bypasses refresh and lets the server revoke an expired or rotated cookie credential', async t => {
 const calls = [];
 mock(t, async path => { calls.push(path); return reply(path.endsWith('/refresh') ? session() : { message: 'Signed out.' }); });
 acceptSession({ ...session(), expires_in: 30 });
 await logout();
 assert.deepEqual(calls, ['/api/v1/auth/logout']);
 assert.equal(getSession().status, 'guest');
});


test('logout errors retain identity and scoped data until a confirmed retry succeeds', async t => {
 let status = 500;
 mock(t, async () => reply({ message: status === 200 ? 'Signed out.' : 'Revocation unavailable' }, status));
 acceptSession(session(1, {role:'admin'}));
 rememberGuestOrder('FIXTURE-ORDER', 'a'.repeat(64));
 for (const failure of [500, 403, 401]) {
  status = failure;
  await assert.rejects(logout());
  assert.equal(getSession().status, 'authenticated');
  assert.equal(guestOrderToken('FIXTURE-ORDER'), 'a'.repeat(64));
 }
 status = 200; await logout();
 assert.equal(getSession().status, 'guest'); assert.equal(getSession().profile, null);
 assert.equal(guestOrderToken('FIXTURE-ORDER'), undefined);
});

test('confirmed logout rejects old private responses before another member signs in', async t => {
 let release;
 mock(t, (path) => path.endsWith('/auth/logout') ? Promise.resolve(reply({message:'Signed out.'})) : path.endsWith('/auth/login') ? Promise.resolve(reply(session(2, {role:'member',name:'Second member'}))) : new Promise(resolve => { release = resolve; }));
 acceptSession(session(1, {role:'admin',name:'Previous administrator'}));
 const pending = requestJson('/api/v1/me/profile', {auth:'required'});
 await logout();
 release(reply({data:{id:1,name:'Previous administrator'}}));
 await assert.rejects(pending, error => error.status === 401);
 await login({email:'second@example.test',password:'fixture-password'});
 assert.equal(getSession().profile.id, 2);assert.equal(getSession().profile.role, 'member');
 assert.equal(getSession().profile.name, 'Second member');
});

test('logout removes a cached bootstrap so refresh cannot revive an already revoked identity', async t => {
 const client = await import('../src/api/client.js?logout-bootstrap-test');
 const previous = globalThis.fetch; let calls = 0;
 globalThis.fetch = async () => ++calls === 1 ? reply(session(1)) : reply({message:'Revoked'},401);
 t.after(() => { globalThis.fetch=previous;client.clearSession(); });
 await client.restoreSession(); assert.equal(client.getSession().status,'authenticated');
 client.finishLogout(); await client.restoreSession();
 assert.equal(calls,2);assert.equal(client.getSession().status,'guest');assert.equal(client.getSession().profile,null);
});


test('Laravel mixed-case capabilities authorize guest orders, ebooks and member PDFs without broadening download destinations', async t => {
  const originalLocation = globalThis.location;
  globalThis.location = { origin: 'http://localhost:8000' };
  t.after(() => { if (originalLocation === undefined) delete globalThis.location; else globalThis.location = originalLocation; });
  const guest = 'Az09gH'.repeat(11).slice(0,64);
  const download = 'Qz57Lm'.repeat(11).slice(0,64);
  const calls = [];
  mock(t, async (path, options) => {
    calls.push({path,options});
    if (path === '/api/v1/orders') return reply({data:{id:'INV-MIXED',status:'draft'},guest_order_token:guest});
    if (path.endsWith('/payment')) return reply({data:{url:'https://app.sandbox.midtrans.com/snap/example'}});
    if (path.startsWith('/api/v1/orders/')) return reply({data:{id:'INV-MIXED',status:'pending'}});
    return reply({data:{url:'http://localhost:8000/api/v1/downloads/'+download}});
  });
  await createOrder({id:'fixture-quote',terms_version:'fixture-terms'},'fixture-idempotency');
  assert.equal(guestOrderToken('INV-MIXED'),guest);
  await startPayment('INV-MIXED');
  assert.equal(calls.at(-1).options.headers['X-Guest-Token'],guest);
  assert.equal((await loadOrderStatus('INV-MIXED')).kind,'ready');
  assert.equal(calls.at(-1).options.headers['X-Guest-Token'],guest);
  const url = await downloadBook('fixture-entitlement',guest);
  assert.equal(new URL(url).pathname,'/api/v1/downloads/'+download);
  assert.equal(calls.at(-1).options.headers['X-Guest-Token'],guest);
  assert.equal(calls.at(-1).options.headers.Authorization,undefined);
  acceptSession(session(18));
  assert.equal(guestOrderToken('INV-MIXED'),undefined);
  assert.equal(await downloadPdf('fixture-publication'),url);
  assert.equal(calls.at(-1).options.headers.Authorization,'Bearer synthetic-test-token-18');
  for (const token of ['', 'a'.repeat(63), 'a'.repeat(65), 'a'.repeat(64)+'\n', 'a'.repeat(63)+'_', String.fromCharCode(233)+'a'.repeat(63)]) {
    rememberGuestOrder('INV-INVALID',token);
    assert.equal(guestOrderToken('INV-INVALID'),undefined);
    assert.throws(()=>safeDownloadUrl('/api/v1/downloads/'+token));
  }
  for (const value of [
    'https://evil.test/api/v1/downloads/'+download,
    'http://user:password@localhost:8000/api/v1/downloads/'+download,
    '/api/v1/downloads/'+download+'?order=another',
    '/api/v1/downloads/'+download+'#fragment',
    '/api/v1/downloads/'+download+'/extra',
    '/api/v1/downloads/'+download+'%2Fextra',
    '/storage/private.pdf',
  ]) assert.throws(()=>safeDownloadUrl(value));
  assert.equal(safeDownloadUrl('/api/v1/downloads/'+'b'.repeat(64)),'http://localhost:8000/api/v1/downloads/'+'b'.repeat(64));
  clearSession();assert.equal(guestOrderToken('INV-MIXED'),undefined);
});
