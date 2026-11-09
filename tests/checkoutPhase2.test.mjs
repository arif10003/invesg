import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {quoteOrder,createOrder,paymentPresentation} from '../src/api/orders.js';
import {acceptSession,clearSession} from '../src/api/client.js';
test('promo apply/remove and free order use existing APIs without provider URL',async t=>{
 const original=globalThis.fetch,calls=[];clearSession();acceptSession({access_token:'synthetic-member',expires_in:3600,user:{id:21,email:'reader@example.test',email_verified_at:'fixture'}});
 globalThis.fetch=async(path,options)=>{calls.push({path,options});const b=options.body?JSON.parse(options.body):{};return Response.json(path.endsWith('/quotes')?{data:{id:'fixture-quote',product_id:'ebook',base_amount:150000,discount_amount:b.promo_code?150000:0,total_amount:b.promo_code?0:150000,terms_version:'fixture',completion_kind:b.promo_code?'free':'paid',promotion:b.promo_code?{code:b.promo_code}:null}}:{data:{id:'INV-FREE',status:'free_completed',total:0,completion_kind:'free'}})};
 t.after(()=>{globalThis.fetch=original;clearSession()});
 const q=await quoteOrder({product_id:'ebook',customer:'Fixture Reader',email:'reader@example.test',promo_code:'FREE-FIXTURE'});assert.equal(q.data.total_amount,0);
 const normal=await quoteOrder({product_id:'ebook',customer:'Fixture Reader',email:'reader@example.test'});assert.equal(normal.data.total_amount,150000);assert.equal(JSON.parse(calls[1].options.body).promo_code,undefined);
 assert.equal((await createOrder(q.data,'fixture-key')).data.status,'free_completed');assert.equal(calls.length,3);assert.equal(calls.some(c=>c.path.endsWith('/payment')),false);assert.equal(JSON.parse(calls[2].options.body).price,undefined);
 assert.match(paymentPresentation('free_completed').description,/free/i);
});
test('checkout renders familiar labels, zero total and form-owned action',async()=>{
 const {createServer}=await import('vite'),React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{MemoryRouter,Routes,Route}=await import('react-router-dom');
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {default:Checkout,CheckoutSummary,CheckoutConfirmation}=await server.ssrLoadModule('/src/pages/CheckoutPage.jsx');
  const html=renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:['/checkout/esg-is-a-lens']},React.createElement(Routes,null,React.createElement(Route,{path:'/checkout/:productSlug',element:React.createElement(Checkout,{preview:true,previewSlug:'esg-is-a-lens'})}))));
  for(const label of ['Customer Information','Order Summary','Have a promo code?','Pay Now','Promo code','Apply','purchase terms'])assert.ok(html.includes(label),label);
  assert.match(html,/<details class="checkout-promo"/);assert.match(html,/<button[^>]+form="[^"]+"[^>]*type="submit"/);assert.doesNotMatch(html,/Secure Price Quote|Generate Quote|Accept Quote|Quote Token|Server Quote Reference|Review quote/);
  const summary=renderToStaticMarkup(React.createElement(CheckoutSummary,{book:{title:'Fixture',slug:'fixture',author:'Fixture',commerce:{price:150000,currency:'IDR'}},quote:{base_amount:150000,discount_amount:150000,total_amount:0,currency:'IDR',promotion:{code:'FREE-FIXTURE'}}}));
  assert.match(summary,/150\.000/);assert.match(summary,/Rp(?:\s|&nbsp;)*0/);assert.match(summary,/FREE-FIXTURE/);
  const confirmation=renderToStaticMarkup(React.createElement(CheckoutConfirmation,{order:{id:'INV-FREE'}}));assert.match(confirmation,/Your e-book is ready/);assert.match(confirmation,/href="\/account\/library"/);assert.doesNotMatch(confirmation,/midtrans\.com/);
 }finally{await server.close()}
});
test('free completion branches before payment while retries retain one request',async()=>{
 const s=await readFile(new URL('../src/pages/CheckoutPage.jsx',import.meta.url),'utf8');assert.ok(s.indexOf("current.status === 'free_completed'")<s.indexOf('await startPayment(current.id)'));assert.match(s,/setAttemptLocked\(true\)/);assert.match(s,/pricingRequest\.current\.sequence/);assert.match(s,/paymentWindow\.opener = null/);assert.doesNotMatch(s,/localStorage|sessionStorage|console\.log/);
});
