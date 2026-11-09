import test from 'node:test';
import assert from 'node:assert/strict';

test('landing prioritizes the knowledge hub, keeps filters and includes featured articles in filtered results', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Page } = await server.ssrLoadModule('/src/pages/InsightsPage.jsx');
    const { previewArticles, previewSpotlight } = await server.ssrLoadModule('/src/dev/fixtures.js');
    const render = query => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [`/__preview?screen=insights${query}`] }, React.createElement(Page, { previewData: { articles: previewArticles, spotlight: previewSpotlight, loading: false, error: null } })));
    const html = render('');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /<h1>INVESG Insights<\/h1>/);
    assert.match(html, /aria-label="Core editorial categories"/);
    for (const label of ['INVESG Briefs', 'Policy Analysis', 'Perspectives']) assert.ok(html.includes(label));
    assert.match(html, /Filter insights/);
    assert.match(html, /<h2>Latest Insights<\/h2>/);
    assert.match(html, /id="books-preview-title">Books &amp; Publications/);
    assert.match(html, /Next featured publication/);
    assert.match(html, /book-promotion/);
    assert.match(html, /esg-is-a-lens-mockup-transparent\.png/);
    assert.match(html, /aria-roledescription="slide"/);
    const filtered = render('&type=brief');
    assert.ok(filtered.includes(previewArticles[0].title), 'featured Brief remains discoverable when filtering Briefs');
    assert.match(filtered, /aria-pressed="true"/);
    assert.match(filtered, /Clear filters/);
    const empty = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Page, { previewData: { articles: [], spotlight: [], loading: false, error: null } })));
    assert.match(empty, /<h1>INVESG Insights<\/h1>/);
    assert.doesNotMatch(empty, /Next featured publication/);
    assert.match(empty, /Latest Insights/);
    assert.match(empty, /Core editorial categories/);
  } finally { await server.close(); }
});
