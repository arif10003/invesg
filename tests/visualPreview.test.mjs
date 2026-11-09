import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { insightArticles, insightAuthors, insightSpotlight } from '../src/data/insights.js';

test('development fixtures are quarantined from production sources and routing', async () => {
  assert.deepEqual(insightArticles, []); assert.deepEqual(insightAuthors, []); assert.deepEqual(insightSpotlight, []);
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /import\.meta\.env\.DEV \? React\.lazy\(\(\) => import\("\.\/dev\/VisualPreviewPage"\)\)/);
  assert.match(app, /import\.meta\.env\.DEV && <Route path="\/__preview"/);
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.doesNotMatch(sitemap, /__preview|preview-brief|preview-analysis/);
});

test('all preview screens render with explicit isolation labels and device inspection controls', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Preview } = await server.ssrLoadModule('/src/dev/VisualPreviewPage.jsx');
    const render = query => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [`/__preview?${query}`] }, React.createElement(Preview)));
    for (const screen of ['home', 'solutions', 'insights', 'article', 'books', 'book', 'login', 'signup', 'verify', 'recovery', 'reset', 'checkout', 'payment', 'library', 'settings']) {
      const html = render(`screen=${screen}`);
      assert.match(html, /Development preview/);
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, screen);
      assert.doesNotMatch(html, /Publication not found|Publication unavailable|NaN|undefined|href="#"/);
    }
    assert.match(render('screen=insights'), /Next featured publication/);
    assert.match(render('screen=insights'), /INVESG Brief/);
    assert.match(render('screen=article'), /Figure 1/);
    assert.match(render('screen=article'), /Illustrative framework/);
    assert.match(render('screen=article'), /action=download/);
    assert.match(render('screen=signup&state=validation'), /aria-invalid="true"/);
    assert.match(render('screen=checkout'), /Preview amount/);
    assert.match(render('screen=library'), /Development preview item/);
    assert.match(render('screen=library&state=empty'), /No purchased books yet/);
    assert.match(render('screen=library&state=error'), /could not be loaded/);
    assert.match(render('screen=payment&payment=paid'), /No payment has been verified/);
    assert.match(render('screen=article&device=mobile'), /<iframe[^>]*width:390px/);
    assert.match(render('screen=article&device=desktop'), /<iframe[^>]*width:1440px/);
  } finally { await server.close(); }
});
