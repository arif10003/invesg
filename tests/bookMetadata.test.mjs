import test from 'node:test';
import assert from 'node:assert/strict';
import { mapBook } from '../src/api/books.js';

test('live editorial fields use API values for the flagship and other books',()=>{
 for(const slug of ['esg-is-a-lens','another-book']){
  const book=mapBook({slug,title:'From admin',author:'Another author',publisher:'Edited Publisher',language:'Japanese',displayFormat:'Digital E-book (PDF)',fileFormat:'PDF',edition:'Second edition',headline:'Edited headline',shortDescription:'Edited intro',description:'First.\n\nSecond.',authorDisplayName:'Edited author',authorBio:'Edited bio',closing:'Edited closing',can_purchase:true,price:1000,currency:'IDR'});
  assert.equal(book.publisher,'Edited Publisher');assert.equal(book.language,'Japanese');assert.equal(book.authorBio,'Edited bio');assert.equal(book.headline,'Edited headline');assert.deepEqual(book.description,['First.','Second.']);assert.equal(book.shortDescription,'Edited intro');assert.equal(book.commerce.price,1000);assert.equal(book.canPurchase,true);
 }
});
test('cleared optional API fields never resurrect template data',()=>{
 const book=mapBook({slug:'esg-is-a-lens',author:'Author',description:'Actual text',publisher:null,language:null,headline:null,closing:null,authorBio:null,edition:null});
 for(const key of ['publisher','language','headline','closing','edition','displayFormat'])assert.equal(book[key],null);
 assert.equal(book.authorBio,'');assert.equal(book.shortDescription,'');assert.deepEqual(book.description,['Actual text']);
});
test('coming soon still forbids checkout and public links are sanitized',()=>{
 const book=mapBook({slug:'any',status:'coming_soon',can_purchase:true,price:1000,currency:'IDR',authorPhoto:'javascript:alert(1)',authorProfileUrl:'data:text/html,x'});
 assert.equal(book.canPurchase,false);assert.equal(book.commerce,null);assert.equal(book.authorPhoto,null);assert.equal(book.authorProfileUrl,null);
});
test('book metadata and author output are editable, optional and escaped',async()=>{
 const {createServer}=await import('vite');const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');
 const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {BookPublicationMetadata,BookAuthor}=await server.ssrLoadModule('/src/components/books/BookMetadata.jsx');
  const render=(component,book)=>renderToStaticMarkup(React.createElement(component,{book}));
  assert.equal(render(BookPublicationMetadata,{}),'');assert.equal(render(BookAuthor,{author:'Someone',authorBio:''}),'');
  const fields=render(BookPublicationMetadata,{publisher:'Edited Publisher',language:'Japanese',displayFormat:'Digital E-book (PDF)',isbn:'978-1-234-56789-0'});assert.match(fields,/Edited Publisher/);assert.match(fields,/Japanese/);assert.doesNotMatch(fields,/English|PT INVESG/);
  const author=render(BookAuthor,{author:'Byline',authorDisplayName:'Edited Name',authorBio:'<script>alert(1)</script>',authorPhoto:'https://api.invesg.co/storage/photo.png',authorProfileUrl:'javascript:alert(1)'});assert.match(author,/Edited Name/);assert.match(author,/&lt;script&gt;/);assert.doesNotMatch(author,/<script>|href="javascript/);assert.match(author,/photo.png/);
 }finally{await server.close()}
});
test('intro and full description do not duplicate migrated paragraphs',async()=>{
 const {createServer}=await import('vite');const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{const {default:Description}=await server.ssrLoadModule('/src/components/books/BookDescription.jsx');const html=renderToStaticMarkup(React.createElement(Description,{book:{headline:'Managed title',shortDescription:'First intro.\n\nSecond intro.',description:['First intro.','Second intro.','Further detail.']}}));assert.equal((html.match(/First intro\./g)||[]).length,1);assert.equal((html.match(/Second intro\./g)||[]).length,1);assert.match(html,/Read more about the book/);assert.match(html,/Further detail/);}finally{await server.close()}
});
