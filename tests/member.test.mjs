import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { libraryKind, loadMemberLibrary, loadMemberProfile } from '../src/api/member.js';
import { readAuthIntent } from '../src/utils/authIntent.js';

test('member source cannot fabricate an empty or entitled account from tab parameters', async () => {
  for (const tab of ['books', 'saved', 'pdfs', 'paid', '__proto__', 'https://evil.test']) {
    const result = await loadMemberLibrary(tab);
    assert.equal(result.status, 'unauthorized'); assert.equal(result.items, null);
    assert.ok(['books', 'saved', 'pdfs'].includes(result.kind));
  }
  assert.equal(libraryKind('invalid'), 'books');
  assert.deepEqual(await loadMemberProfile(), { status: 'unauthorized', profile: null });
  const controller = new AbortController(); controller.abort();
  await assert.rejects(loadMemberLibrary('books', { signal: controller.signal }), { name: 'AbortError' });
  await assert.rejects(loadMemberProfile({ signal: controller.signal }), { name: 'AbortError' });
  assert.deepEqual(readAuthIntent('?returnTo=%2Faccount%2Fsettings'), { returnTo: '/account/settings' });
});

test('member pages and collections distinguish unavailable, empty, and eligible fixtures safely', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Collection } = await server.ssrLoadModule('/src/components/member/LibraryCollection.jsx');
    const collection = (kind, result) => renderToStaticMarkup(React.createElement(Collection, { kind, result }));
    for (const kind of ['books', 'saved', 'pdfs']) {
      assert.match(collection(kind, { status: 'unavailable', items: null }), /Library services are not available yet/);
      const empty = collection(kind, { status: 'ready', items: [] });
      assert.match(empty, /No (?:purchased books|saved insights|eligible PDF publications) yet/);
      assert.doesNotMatch(collection(kind, { status: 'ready', items: null }), /No purchased books|No saved insights/);
    }
    for (const status of ['unauthorized', 'forbidden', 'error', 'loading']) assert.ok(collection('books', { status }).length > 0);
    const saved = collection('saved', { status: 'ready', items: [{ id: 'one', available: false, title: 'Secret unpublished title', slug: 'hidden' }] });
    assert.match(saved, /Publication unavailable/); assert.doesNotMatch(saved, /Secret unpublished title|href="\/insights\/hidden"/);
    const eligible = collection('pdfs', { status: 'ready', items: [{ id: 'one', title: 'Fixture', slug: 'fixture', saved: false, downloadUrl: 'https://private.test/manuscript.pdf' }] });
    assert.match(eligible, /not marked as saved/); assert.match(eligible, /disabled=""/); assert.doesNotMatch(eligible, /private\.test|manuscript\.pdf/);
    const { default: Library } = await server.ssrLoadModule('/src/pages/account/LibraryPage.jsx');
    for (const tab of ['books', 'saved', 'pdfs', 'invalid']) {
      const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [`/account/library?tab=${tab}&user=FAKEUSER&paid=true`] }, React.createElement(Library)));
      assert.equal((html.match(/role="tab"/g) || []).length, 3);
      assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
      assert.doesNotMatch(html, /FAKEUSER|Verified purchase|No purchased books yet|Download PDF/);
    }
    const { default: Settings } = await server.ssrLoadModule('/src/pages/account/AccountSettingsPage.jsx');
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Settings)));
    assert.match(html, /Sign in to manage your account/);
    assert.doesNotMatch(html, /name="email"|name="marketing"|checked=""|Saved successfully|Logged out successfully/);
  } finally { await server.close(); }
});

test('member routes are registered and excluded from public sitemap', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  for (const route of ['/account/library', '/account/settings']) assert.ok(app.includes(`path="${route}"`));
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.doesNotMatch(sitemap, /\/account\//);
});
