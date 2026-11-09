import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
test('public/member and admin use the same final official brand definitions',async()=>{
 const palette=await read('src/styles/brand-palette.css');
 assert.match(palette,/--invesg-navy:\s*#001C44;/);
 assert.match(palette,/--invesg-emerald:\s*#007579;/);
 assert.match(await read('src/styles.css'),/@import "\.\/styles\/brand-palette\.css"/);
 const admin=await read('invesg-backend-unified/resources/css/globals.css');
 assert.match(admin,/@import '\.\.\/\.\.\/\.\.\/src\/styles\/brand-palette\.css'/);
 assert.match(admin,/--navy:var\(--invesg-navy\);--teal:var\(--invesg-emerald\)/);
 const hero=await read('src/styles/company-heroes.css');
 // Intentional neutral alpha border is not an official brand definition.
 assert.doesNotMatch(hero,/#(?:0b1f3a|0e9a81)(?![\da-f])/i);
 assert.match(hero,/color:var\(--invesg-emerald\)/);
});
