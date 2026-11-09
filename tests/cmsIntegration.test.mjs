import test from 'node:test';
import assert from 'node:assert/strict';
import { requestPublicJson, clearSession } from '../src/api/client.js';
import { readFile } from 'node:fs/promises';

test('controlled landing copy uses the published page endpoint without credentials',async t=>{
 const old=globalThis.fetch;clearSession();let request;
 globalThis.fetch=async(path,options)=>{request={path,options};return Response.json({data:{hero_title:'Approved title',hero_subtitle:'Approved subtitle',sections:[]}});};t.after(()=>{globalThis.fetch=old;});
 const result=await requestPublicJson('/api/v1/pages/home');assert.equal(result.data.hero_title,'Approved title');assert.equal(request.path,'/api/v1/pages/home');assert.equal(request.options.headers.Authorization,undefined);
});
test('the latest source keeps approved brand artwork unchanged and does not inject CMS HTML',async()=>{
 for(const file of ['HomePage.jsx','InsightsPage.jsx']){const source=await readFile(new URL('../src/pages/'+file,import.meta.url),'utf8');assert.match(source,/usePageContent/);assert.match(source,/cms\?\.hero_title/);assert.doesNotMatch(source,/dangerouslySetInnerHTML/);}
 const home=await readFile(new URL('../src/pages/HomePage.jsx',import.meta.url),'utf8');assert.match(home,/approvedHeroAssets\.home/);
});
