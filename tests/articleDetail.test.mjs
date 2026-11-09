import test from 'node:test';
import assert from 'node:assert/strict';
import { articleShareData } from '../src/utils/articlePublication.js';

test('article sharing uses the valid public or preview destination and preserves citation identity', () => {
  const data = articleShareData({ slug: 'example', title: 'Example', href: '/__preview?screen=article&specimen=example', citationNote: 'Development specimen.', publishedAt: '2026-11-01' }, { name: 'Preview author' }, 'http://localhost:5175');
  assert.equal(data.url, 'http://localhost:5175/__preview?screen=article&specimen=example');
  assert.match(data.citation, /Preview author\. Example\. Development specimen\. 2026-11-01/);
  assert.equal(articleShareData({ slug: 'example', title: 'Example', href: 'javascript:alert(1)' }, null, 'https://invesg.co').url, 'https://invesg.co/insights/example');
});

test('article fixture renders complete public reading, dated metadata, protected actions and valid outline targets', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Detail } = await server.ssrLoadModule('/src/components/insights/ArticleDetail.jsx');
    const { previewArticle, previewAuthor } = await server.ssrLoadModule('/src/dev/fixtures.js');
    const render = article => renderToStaticMarkup(React.createElement(Detail, { article, author: previewAuthor }));
    const html = render(previewArticle);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /dateTime="2026-11-01"/i);
    assert.match(html, /preview date/);
    assert.match(html, /Preview author/);
    assert.match(html, /Executive Summary/);
    assert.match(html, /Figure 1/);
    assert.match(html, /<table>/);
    assert.match(html, /<caption>/);
    assert.match(html, /References &amp; Sources/);
    assert.match(html, /Share article/);
    assert.match(html, /Copy citation/);
    assert.match(html, /action=download/);
    assert.match(html, /action=save/);
    assert.doesNotMatch(html, /RequireAuth|manuscript\.pdf|signed_url|access_token/);
    for (const match of html.matchAll(/href="#(article-section-[0-9]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`));
    assert.doesNotMatch(render({ ...previewArticle, pdf: null }), /action=download/);
    assert.match(render({ slug: 'legacy', title: 'Legacy article', sections: { whatHappened: ['Public legacy body.'] } }), /Public legacy body/);
  } finally { await server.close(); }
});
