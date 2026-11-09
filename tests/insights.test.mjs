import test from 'node:test';
import assert from 'node:assert/strict';
import { publicLink, selectSpotlight } from '../src/utils/publication.js';
import { makeInsightIntent } from '../src/utils/intendedAction.js';
import { loadInsights } from '../src/api/insights.js';

test('spotlight rejects drafts and unsafe links, deduplicates, orders and caps at three', () => {
  const item = (id, displayOrder, extra = {}) => ({ id, displayOrder, title: id, destination: `/insights/${id}`, status: 'published', ...extra });
  assert.deepEqual(selectSpotlight([item('draft', 0, { status: 'draft' }), item('bad', 0, { destination: 'javascript:alert(1)' }), item('d', 4), item('b', 2), item('a', 1), item('a', 1), item('c', 3)]).map(item => item.id), ['a', 'b', 'c']);
  for (const url of ['//other.test', '/\\other.test', 'data:text/html,test', 'javascript:alert(1)', 'https://example.test/\npath']) assert.equal(publicLink(url), null);
  assert.equal(publicLink('/insights/books'), '/insights/books');
});

test('approved source remains empty and abortable, without fabricated publications', async () => {
  const original=globalThis.fetch;
  try {globalThis.fetch=async()=>Response.json({data:[],last_page:1});assert.deepEqual(await loadInsights(), { articles: [], spotlight: [] });}finally{globalThis.fetch=original;}
  const controller = new AbortController(); controller.abort();
  await assert.rejects(loadInsights({ signal: controller.signal }), { name: 'AbortError' });
});

test('member intent allows only internal article actions', () => {
  assert.deepEqual(makeInsightIntent('climate-risk', 'save'), { returnTo: '/insights/climate-risk', resourceSlug: 'climate-risk', action: 'save' });
  for (const slug of ['//evil.test', '../account', 'a?returnTo=https://evil.test']) assert.equal(makeInsightIntent(slug, 'save'), null);
  assert.equal(makeInsightIntent('article', 'purchase'), null);
});

test('publication rendering supports structured content and honest member availability', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Body } = await server.ssrLoadModule('/src/components/insights/ArticleBody.jsx');
    const html = renderToStaticMarkup(React.createElement(Body, { value: [
      { type: 'paragraph', text: '<script>unsafe</script>' },
      { type: 'figure', src: '/assets/esg-hero.png', alt: 'Landscape', caption: 'Figure 1' },
      { type: 'table', caption: 'Comparison', columns: ['Metric'], rows: [['Value']] },
      { type: 'quote', text: 'A quotation', attribution: 'Source' },
      { type: 'figure', src: 'javascript:alert(1)' },
    ] }));
    assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /javascript:|<script>/);
    assert.match(html, /<figcaption>Figure 1/); assert.match(html, /scope="col"/); assert.match(html, /<cite>Source/);
    const { default: Tools } = await server.ssrLoadModule('/src/components/insights/PublicationTools.jsx');
    const renderTools = pdf => renderToStaticMarkup(React.createElement(Tools, { article: { slug: 'example', title: 'Example', pdf } }));
    assert.doesNotMatch(renderTools(), /download PDF/);
    assert.match(renderTools({ available: true }), /download PDF/);
    assert.match(renderTools(), /href="\/login\?/); assert.match(renderTools(), /does not grant additional access/);
    const { default: Spotlight } = await server.ssrLoadModule('/src/components/insights/FeaturedInsight.jsx');
    const renderSpotlight = items => renderToStaticMarkup(React.createElement(Spotlight, { items }));
    assert.equal(renderSpotlight([]), '');
    const first = { id: 'one', title: 'One', destination: '/insights/one', status: 'published' };
    assert.doesNotMatch(renderSpotlight([first]), /Next featured publication/);
    assert.match(renderSpotlight([first, { ...first, id: 'two', title: 'Two' }]), /Next featured publication/);
  } finally { await server.close(); }
});
