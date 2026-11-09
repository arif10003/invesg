import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('MVP screens retain one heading, resolve internal destinations, and reference existing assets', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter, Routes, Route } = await import('react-router-dom');
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const patterns = [...app.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]).filter(path => path !== '*').map(path => new RegExp('^' + path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z]+/g, '[^/]+') + '$'));
  const pages = [
    ['/insights', '/insights', 'InsightsPage'],
    ['/insights/books', '/insights/books', 'BooksPage'],
    ['/insights/books/esg-is-a-lens', '/insights/books/:slug', 'BookDetailPage'],
    ['/login', '/login', 'auth/LoginPage'], ['/signup', '/signup', 'auth/SignupPage'],
    ['/account/verify-email', '/account/verify-email', 'auth/VerifyEmailPage'],
    ['/account/recovery', '/account/recovery', 'auth/RecoveryPage'],
    ['/account/reset-password', '/account/reset-password', 'auth/ResetPasswordPage'],
    ['/checkout/esg-is-a-lens', '/checkout/:productSlug', 'CheckoutPage'],
    ['/orders/INV-123/status', '/orders/:orderId/status', 'OrderStatusPage'],
    ['/account/library', '/account/library', 'account/LibraryPage'],
    ['/account/settings', '/account/settings', 'account/AccountSettingsPage'],
  ];
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    for (const [path, pattern, module] of pages) {
      const { default: Page } = await server.ssrLoadModule(`/src/pages/${module}.jsx`);
      const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(Routes, null, React.createElement(Route, { path: pattern, element: React.createElement(Page) }))));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
      for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
        const destination = new URL(match[1].replaceAll('&amp;', '&'), 'https://invesg.co');
        if (destination.pathname.startsWith('/assets/')) { await access(new URL(`../public${destination.pathname}`, import.meta.url)); continue; }
        assert.ok(patterns.some(route => route.test(destination.pathname)), `${path}: unknown link ${destination.pathname}`);
      }
      for (const match of html.matchAll(/<img[^>]+src="(\/[^"#]+)"/g)) await access(new URL(`../public${match[1]}`, import.meta.url));
      assert.doesNotMatch(html, /href="#"|NaN|undefined|Rp XXX/);
    }
  } finally { await server.close(); }
});

test('production dependency manifest agrees with the committed lock structure', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  for (const [name, version] of Object.entries(manifest.dependencies)) {
    assert.equal(lock.packages[''].dependencies[name], version, name);
    assert.ok(lock.packages[`node_modules/${name}`], name);
  }
});
