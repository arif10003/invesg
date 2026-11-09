import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { books } from '../src/data/books.js';
import { getBook, getPublishedBooks, bookPrice, mapBook } from '../src/api/books.js';

test('catalog only exposes valid published books and supports multiple titles', () => {
  const original = books[0];
  const second = { ...original, id: 'second', slug: 'second', title: 'Test fixture only' };
  const records = [original, second, { ...original, slug: 'draft', status: 'draft' }, { ...original, slug: '../invalid' }, original];
  assert.equal(getPublishedBooks(records).length, 2);
  assert.equal(getBook('second', records), second);
  assert.equal(getBook('draft', records), null);
  assert.equal(getBook('missing'), null);
  assert.equal(books[0].commerce, null);
  assert.equal(books[0].fileFormat, null);
  for (const metadata of [null, { price: 0, currency: 'IDR' }, { price: -1, currency: 'IDR' }, { price: '100', currency: 'IDR' }, { price: 100 }, { price: 100, currency: '../' }]) assert.equal(bookPrice(metadata), null);
  assert.match(bookPrice({ price: 1000, currency: 'IDR' }), /1\.000/);
});

test('original artwork is copied byte-for-byte and specific book routes precede article route', async () => {
  const copied = await readFile(new URL('../public/assets/books/esg-is-a-lens-wrap.webp', import.meta.url));
  // Approved original fingerprint: tests do not depend on the separate untracked backend.
  assert.equal(createHash('sha256').update(copied).digest('hex'), '7b219168bb18b62e8cb9f4413af1dd76e290a02deb3b9a3d9fb516cac7f1f484');
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  for (const route of ['/insights/books', '/insights/books/:slug']) assert.ok(app.indexOf(`path="${route}"`) < app.indexOf('path="/insights/:slug"'));
});

test('catalog, dynamic detail, empty and unavailable states render without fake commerce', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter, Routes, Route } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { BookCatalog } = await server.ssrLoadModule('/src/pages/BooksPage.jsx');
    const empty = renderToStaticMarkup(React.createElement(BookCatalog, { books: [] }));
    assert.match(empty, /Publications are in preparation/);
    const catalog = renderToStaticMarkup(React.createElement(BookCatalog, { books: [books[0], { ...books[0], slug: 'second', title: 'Test fixture only' }] }));
    assert.match(catalog, /More Publications/); assert.match(catalog, /href="\/insights\/books\/second"/);
    const { default: Detail } = await server.ssrLoadModule('/src/pages/BookDetailPage.jsx');
    const renderDetail = slug => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [`/insights/books/${slug}`] }, React.createElement(Routes, null, React.createElement(Route, { path: '/insights/books/:slug', element: React.createElement(Detail) }))));
    const detail = renderDetail('esg-is-a-lens');
    assert.match(detail, /Loading publication/);
    assert.doesNotMatch(detail, /Buy Now|Download PDF|Rp XXX|shipping address/i);
    assert.match(renderDetail('missing'), /Loading publication/);
    for (const label of ['Sustainability Intelligence', 'Opportunity Intelligence', 'Academy', 'Join Us']) assert.ok(detail.includes(label));
  } finally { await server.close(); }
});

test('API product artwork is preserved and missing covers do not borrow promotional artwork', () => {
  const source = 'http://localhost:8000/storage/assets/product.png';
  assert.equal(mapBook({slug:'esg-is-a-lens',cover_url:source}).cover, source);
  assert.equal(mapBook({slug:'esg-is-a-lens',cover_url:null}).cover, null);
});

test('local product image URLs resolve through Laravel and the Vite storage proxy', async () => {
  const { publicMediaUrl } = await import('../src/api/client.js');
  const previous = globalThis.location;
  try {
    for (const origin of ['http://localhost:8000','http://localhost:5173','http://127.0.0.1:8000']) {
      globalThis.location = {origin};
      assert.equal(publicMediaUrl('http://localhost:8000/storage/assets/cover.png'), '/storage/assets/cover.png');
      assert.equal(publicMediaUrl('http://127.0.0.1:8000/storage/assets/cover.png'), '/storage/assets/cover.png');
      assert.equal(publicMediaUrl('http://untrusted.example/storage/cover.png'), null);
      assert.equal(publicMediaUrl('http://localhost:8000/private/ebook.pdf'), null);
      assert.equal(publicMediaUrl('http://user:secret@localhost:8000/storage/cover.png'), null);
    }
  } finally { if(previous===undefined)delete globalThis.location;else globalThis.location=previous; }
});

test('book images render full source artwork and an informative fallback for missing images', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
  try {
    const {default:BookCover}=await server.ssrLoadModule('/src/components/books/BookCover.jsx');
    const present=renderToStaticMarkup(React.createElement(BookCover,{book:{title:'API title',author:'Author',cover:'/storage/assets/product.png',coverLayout:'wrap'}}));
    assert.match(present,/src="\/storage\/assets\/product.png"/);
    assert.doesNotMatch(present,/book-cover--wrap/);
    const known=renderToStaticMarkup(React.createElement(BookCover,{book:{slug:'esg-is-a-lens',title:'ESG is a Lens',cover:'/storage/assets/5caf083b-8448-4c0d-9a74-14c6ac062f91.png'}}));
    assert.match(known,/esg-is-a-lens-cover.png/);assert.doesNotMatch(known,/5caf083b/);
    const updated=renderToStaticMarkup(React.createElement(BookCover,{book:{slug:'esg-is-a-lens',title:'ESG is a Lens',cover:'/storage/assets/new-cover-upload.png'}}));
    assert.match(updated,/new-cover-upload.png/);assert.doesNotMatch(updated,/esg-is-a-lens-cover.png/);
    const missing=renderToStaticMarkup(React.createElement(BookCover,{book:{title:'Missing title',cover:null}}));
    assert.match(missing,/Book image unavailable/); assert.match(missing,/Missing title/); assert.doesNotMatch(missing,/<img/);
    const {default:Spotlight}=await server.ssrLoadModule('/src/components/insights/BookSpotlight.jsx');
    const promotion=renderToStaticMarkup(React.createElement(Spotlight,{book:{slug:'esg-is-a-lens',title:'ESG is a Lens',author:'Arif R. Darana',cover:'/storage/product.png'}}));
    assert.match(promotion,/By Arif R. Darana <span>\u00b7<\/span> invesg publications/);
    const {default:Library}=await server.ssrLoadModule('/src/components/member/LibraryCollection.jsx');
    const loading=renderToStaticMarkup(React.createElement(Library,{kind:'books',result:{status:'loading'}}));
    assert.match(loading,/Loading your collection\u2026/);
    assert.match(promotion,/esg-is-a-lens-mockup-transparent.png/); assert.doesNotMatch(promotion,/src="\/storage\/product.png"/);
  } finally { await server.close(); }
});


test('every book sales surface offers checkout for API-enabled products and preserves disabled sales', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const sources = ['/src/components/books/BookCard.jsx', '/src/components/books/BookPurchasePanel.jsx', '/src/components/insights/BookSpotlight.jsx'];
    for (const source of sources) {
      const { default: Surface } = await server.ssrLoadModule(source);
      for (const canPurchase of [true, false]) {
        const book = mapBook({ slug: 'esg-is-a-lens', title: 'ESG is a Lens', author: 'Arif R. Darana', can_purchase: canPurchase, price: 1000, currency: 'IDR' });
        const html = renderToStaticMarkup(React.createElement(Surface, { book }));
        if (canPurchase) { assert.match(html, /href="\/checkout\/esg-is-a-lens"/, source); assert.match(html, /Purchase e-book|Buy E-book/, source); }
        else { assert.doesNotMatch(html, /href="\/checkout\//, source); assert.match(html, /Purchasing is not open yet/, source); }
        assert.match(html, /book-purchase-action/, source);
      }
    }
    const { default: Purchase } = await server.ssrLoadModule('/src/components/books/BookPurchaseButton.jsx');
    const unknown = renderToStaticMarkup(React.createElement(Purchase, { book: { slug: 'esg-is-a-lens' } }));
    assert.doesNotMatch(unknown, /href=/);
  } finally { await server.close(); }
});


test('discovery and direct purchase share one product, with one detail purchase CTA and API pricing', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { loadBook } = await import('../src/api/books.js');
  const { quoteOrder } = await import('../src/api/orders.js');
  const { clearSession } = await import('../src/api/client.js');
  const previous = globalThis.fetch;
  const fixture = { id: 'api-ebook', slug: 'esg-is-a-lens', title: 'ESG is a Lens', author: 'Arif R. Darana', price: 200000, sale_price: 150000, currency: 'IDR', can_purchase: true, description: '**See the connections behind your decisions.**\n\nApproved first paragraph.\n\n*ESG is a Lens* preserves approved emphasis.\n\n**You do not need an ESG job title to begin seeing differently.**' };
  const calls = [];
  clearSession();
  globalThis.fetch = async (path, options) => { calls.push({ path, options }); return Response.json(path.includes('/products/') ? { data: fixture } : { data: { id: 'fixture-quote' } }); };
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const book = await loadBook(fixture.slug);
    const { default: Spotlight } = await server.ssrLoadModule('/src/components/insights/BookSpotlight.jsx');
    const { BookDetailContent } = await server.ssrLoadModule('/src/pages/BookDetailPage.jsx');
    const { CheckoutSummary } = await server.ssrLoadModule('/src/pages/CheckoutPage.jsx');
    const banner = renderToStaticMarkup(React.createElement(Spotlight, { book }));
    assert.match(banner, /class="book-purchase-action" href="\/insights\/books\/esg-is-a-lens">Explore the Book/);
    assert.match(banner, /class="book-purchase-link" href="\/checkout\/esg-is-a-lens">Buy E-book/);
    assert.equal((banner.match(/href="\/checkout\/esg-is-a-lens"/g) || []).length, 1);
    assert.ok(banner.indexOf('Explore the Book') < banner.indexOf('Buy E-book'));
    const detail = renderToStaticMarkup(React.createElement(BookDetailContent, { book }));
    assert.equal((detail.match(/href="\/checkout\/esg-is-a-lens"/g) || []).length, 1);
    assert.equal((detail.match(/See the connections behind your decisions\./g) || []).length, 1);
    assert.equal((detail.match(/You do not need an ESG job title to begin seeing differently\./g) || []).length, 1);
    assert.doesNotMatch(detail, /\*\*|server quote|Promo codes|Purchase e-book/);
    assert.match(detail, /<em>ESG is a Lens<\/em>/);
    assert.match(detail, /Digital edition \u00b7 PDF/);
    const price = bookPrice(book.commerce);
    assert.match(price, /150\.000/);
    assert.ok(banner.includes(price) && detail.includes(price));
    const summary = renderToStaticMarkup(React.createElement(CheckoutSummary, { book }));
    assert.ok(summary.includes(price));
    assert.doesNotMatch(summary, /server quote|backend|pricing token/);
    await quoteOrder({ product_id: book.id, customer: 'Example Reader', email: 'reader@example.test', source: 'website' });
    const submitted = JSON.parse(calls.at(-1).options.body);
    assert.equal(submitted.product_id, fixture.id);
    assert.equal(submitted.price, undefined); assert.equal(submitted.total, undefined);
  } finally { globalThis.fetch = previous; clearSession(); await server.close(); }
});

test('book description preserves approved text and escapes HTML while rendering headings and emphasis', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Description } = await server.ssrLoadModule('/src/components/books/BookDescription.jsx');
    const html = renderToStaticMarkup(React.createElement(Description, { book: { headline: 'Approved heading', closing: 'Approved closing', description: ['**Approved heading**', 'Keep **approved words** and *emphasis*.', '## A section', '<script>unsafe()</script>', '**Approved closing**'] } }));
    assert.equal((html.match(/Approved heading/g) || []).length, 1);
    assert.equal((html.match(/Approved closing/g) || []).length, 1);
    assert.match(html, /<strong>approved words<\/strong>/); assert.match(html, /<em>emphasis<\/em>/);
    assert.match(html, /<h3>A section<\/h3>/); assert.match(html, /Read more about the book/);
    assert.doesNotMatch(html, /<script>|\*\*|## A section/); assert.match(html, /&lt;script&gt;/);
  } finally { await server.close(); }
});

test('legal publisher metadata and nested emphasis remain safe across catalogue and detail', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { Inline } = await server.ssrLoadModule('/src/components/books/BookDescription.jsx');
    const text = renderToStaticMarkup(React.createElement(Inline, {text: '**Strong with *nested emphasis*** and \\*literal\\* <img src=x onerror=alert(1)>'}));
    assert.match(text, /<strong>Strong with <em>nested emphasis<\/em><\/strong>/);
    assert.match(text, /\*literal\*/);
    assert.match(text, /&lt;img/);
    assert.doesNotMatch(text, /<img/);
    const {default:Card} = await server.ssrLoadModule('/src/components/books/BookCard.jsx');
    const {BookDetailContent} = await server.ssrLoadModule('/src/pages/BookDetailPage.jsx');
    const book=mapBook({slug:'esg-is-a-lens',title:'ESG is a Lens',author:'Arif R. Darana',description:'**Approved emphasis** and *perspective*.',price:123456,currency:'IDR',can_purchase:true});
    assert.equal(book.publisher,'PT INVESG NEXUS NITYA');
    assert.equal(book.commerce.price,123456);
    const card=renderToStaticMarkup(React.createElement(Card,{book}));
    assert.match(card, /<strong>Approved emphasis<\/strong>/);
    assert.match(card, /<em>perspective<\/em>/);
    assert.doesNotMatch(card, /\*\*/);
    const detail=renderToStaticMarkup(React.createElement(BookDetailContent,{book}));
    for(const value of ['PT INVESG NEXUS NITYA','Digital E-book (PDF)','English'])assert.ok(detail.includes(value));
    assert.match(detail, /href="\/checkout\/esg-is-a-lens"/);
    assert.equal(mapBook({slug:'other-title',publisher:'Another publisher'}).publisher,'Another publisher');
  } finally { await server.close(); }
});
