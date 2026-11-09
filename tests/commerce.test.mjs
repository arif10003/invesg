import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadOrderStatus, paymentPresentation, commerceAvailability } from '../src/api/orders.js';

test('order lookup stays unavailable and never accepts malformed references as authority', async () => {
  assert.deepEqual(await loadOrderStatus('INV-123'), { kind: 'unavailable' });
  for (const reference of ['', '../admin', 'https://evil.test', 'a?status=paid', 'x'.repeat(81)]) assert.deepEqual(await loadOrderStatus(reference), { kind: 'invalid' });
  assert.ok(Object.values(commerceAvailability).every(value => value === true));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(loadOrderStatus('INV-123', { signal: controller.signal }), { name: 'AbortError' });
  for (const status of [undefined, 'success', 'settlement', '__proto__', 'constructor']) assert.equal(paymentPresentation(status).title, 'Payment status unavailable');
  assert.match(paymentPresentation('paid').description, /entitlement has been checked/);
});

test('checkout and status pages provide no payment or download access from URL claims', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter, Routes, Route } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Checkout } = await server.ssrLoadModule('/src/pages/CheckoutPage.jsx');
    const render = (Page, path, route) => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(Routes, null, React.createElement(Route, { path: route, element: React.createElement(Page) }))));
    const checkout = render(Checkout, '/checkout/esg-is-a-lens', '/checkout/:productSlug');
    assert.match(checkout, /Loading publication/);
    assert.match(checkout, /Registration is not required/);
    assert.doesNotMatch(checkout, /name="(?:address|shipping|phone|country)"|app\.midtrans|5%|10%|Rp XXX|Pay Now|Download PDF/);
    assert.match(render(Checkout, '/checkout/missing', '/checkout/:productSlug'), /Loading publication/);
    const { default: Status, PaymentStatusContent } = await server.ssrLoadModule('/src/pages/OrderStatusPage.jsx');
    const status = render(Status, '/orders/INV-123/status?status=paid&download=https://evil.test/file.pdf', '/orders/:orderId/status');
    assert.doesNotMatch(status, /Payment confirmed|evil\.test|file\.pdf|Download PDF|href="\/account\/library"/);
    for (const state of ['pending', 'creating_payment', 'paid', 'failed', 'cancelled', 'expired', 'refunded', 'partially_refunded', 'unknown']) {
      const html = renderToStaticMarkup(React.createElement(PaymentStatusContent, { status: state }));
      assert.ok(html.includes(paymentPresentation(state).title));
      assert.doesNotMatch(html, /<a |<button |\.pdf|Download/);
    }
  } finally { await server.close(); }
});

test('commerce routes exist and transactional URLs stay out of sitemap', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  for (const path of ['/checkout/:productSlug', '/orders/:orderId/status']) assert.ok(app.includes(`path="${path}"`));
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.doesNotMatch(sitemap, /\/checkout|\/orders\//);
});
