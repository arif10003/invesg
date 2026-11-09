import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectText,auditSources} from '../invesg-backend-unified/scripts/check-utf8.mjs';

test('UTF-8 audit preserves valid names, punctuation, currencies and non-Latin scripts',()=>{
 for(const text of ['Fran\u00e7ois','Jo\u00e3o','Ana\u00efs','\u00c2ngela','Arif R. Darana \u00b7 invesg','\u201cL\u2019\u00e9conomie\u201d \u2013 \u2026','Rp\u00a0149.999,00 \u20ac \u00a5','\u65e5\u672c\u8a9e \ud83c\udf31']){
  const value=JSON.parse('"'+text+'"');assert.deepEqual(inspectText(value),[],value);
 }
});
test('UTF-8 audit detects single/repeated corruption, replacement characters and a BOM',()=>{
 for(const text of ['\u00c2\u00b7','\u00e2\u20ac\u2122','\u00e2\u20ac\u0153','\u00e2\u20ac\u201c','\u00c3\u0192\u00c2\u00a9','\u00ef\u00bb\u00bf','\ufffd','\ufeff']){
  const value=JSON.parse('"'+text+'"');assert.ok(inspectText(value).length>0);
 }
});
test('all active sources and templates decode as UTF-8 without corrupted text',async()=>{
 const result=await auditSources();assert.ok(result.files_scanned>300);assert.deepEqual(result.findings,[]);
});
