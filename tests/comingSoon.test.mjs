import test from 'node:test';
import assert from 'node:assert/strict';
import {mapBook,getPublishedBooks} from '../src/api/books.js';
test('Coming Soon preserves public metadata and stable detail links without exposing purchase or unset facts',async()=>{
 const {createServer}=await import('vite');
 const React=await import('react');
 const {renderToStaticMarkup}=await import('react-dom/server');
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const book=mapBook({slug:'esg-is-a-lens',status:'coming_soon',publication_status:'coming_soon',publisher:'PT INVESG NEXUS NITYA',language:'English',displayFormat:'Digital E-book (PDF)',shortDescription:'**Approved synopsis**.',title:'ESG is a Lens',author:'Arif R. Darana',description:'**Approved synopsis**.',cover_url:'/assets/books/esg-is-a-lens-cover.png',price:0,currency:'IDR',can_purchase:true});
  assert.equal(book.canPurchase,false);assert.equal(book.commerce,null);
  const {default:Card}=await server.ssrLoadModule('/src/components/books/BookCard.jsx');
  const {BookDetailContent}=await server.ssrLoadModule('/src/pages/BookDetailPage.jsx');
  const card=renderToStaticMarkup(React.createElement(Card,{book}));
  const detail=renderToStaticMarkup(React.createElement(BookDetailContent,{book}));
  for(const html of [card,detail]){
   assert.match(html,/Coming Soon/);assert.match(html,/PT INVESG NEXUS NITYA/);assert.match(html,/<strong>Approved synopsis<\/strong>/);
   assert.doesNotMatch(html,/href="\/checkout|Notify me|ISBN approved|Rp\s*0/);
  }
  assert.match(card,/href="\/insights\/books\/esg-is-a-lens"/);
  assert.match(detail,/English/);assert.match(detail,/Digital E-book \(PDF\)/);
  assert.doesNotMatch(detail,/<dt>ISBN<\/dt>/);
  const provided=renderToStaticMarkup(React.createElement(BookDetailContent,{book:{...book,isbn:'Provided fixture identifier'}}));
  assert.match(provided,/<dt>ISBN<\/dt><dd>Provided fixture identifier<\/dd>/);
  const launched=mapBook({...book,description:'**Approved synopsis**.',status:'published',publication_status:'launched',can_purchase:true,price:150000,currency:'IDR'});
  assert.equal(launched.canPurchase,true);
  assert.match(renderToStaticMarkup(React.createElement(Card,{book:launched})),/href="\/checkout\/esg-is-a-lens"/);
 }finally{await server.close();}
});

