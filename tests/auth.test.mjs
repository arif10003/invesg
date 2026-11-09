import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readAuthIntent, authHref } from '../src/utils/authIntent.js';
import { authAvailability } from '../src/api/auth.js';

test('auth links preserve valid intent and drop unsafe destinations and unrelated secrets', () => {
  assert.deepEqual(readAuthIntent('?returnTo=%2Finsights%2Fclimate-risk&action=save'), { returnTo: '/insights/climate-risk', action: 'save' });
  for (const returnTo of ['https://evil.test', '//evil.test', '/\\evil.test', '/insights/../account', '/insights/%2f%2fevil', '/login', '/account/reset-password?token=secret', '/insights/a\n']) assert.equal(readAuthIntent(new URLSearchParams({ returnTo }).toString()), null);
  assert.equal(authHref('/signup', '?returnTo=%2Finsights%2Fclimate-risk&action=download&token=secret&email=private'), '/signup?returnTo=%2Finsights%2Fclimate-risk&action=download');
  assert.deepEqual(readAuthIntent('?returnTo=/insights/books&action=download'), { returnTo: '/insights/books' });
  assert.equal(authHref('/login', '?returnTo=https://evil.test'), '/login');
  assert.equal(authAvailability.available, true);
});

test('account screens expose email forms but never claim success from URL parameters', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    for (const name of ['Login', 'Signup', 'Recovery', 'ResetPassword', 'VerifyEmail']) {
      const { default: Page } = await server.ssrLoadModule(`/src/pages/auth/${name}Page.jsx`);
      const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/login?token=SECRET&email=PRIVATE'] }, React.createElement(Page)));
      assert.doesNotMatch(html, /Accounts are coming soon/);
      assert.match(html, /<form|Confirm email verification/);
      assert.doesNotMatch(html, /SECRET|PRIVATE|Verification successful|Email sent|Account created/);
      if (name !== 'VerifyEmail') assert.match(html, /<fieldset>/);
      if (['Login', 'Signup', 'ResetPassword'].includes(name)) {
        assert.match(html, /aria-label="Show password"/);
        assert.match(html, /aria-pressed="false"/);
      }
      if (name === 'Signup') {
        assert.match(html, /minLength="8"/);
        assert.match(html, /name="confirmation"/);
        assert.doesNotMatch(html, /name="marketing"/);
      }
    }
    const { default: AccountMenu } = await server.ssrLoadModule('/src/components/auth/AccountMenu.jsx');
    for (const mobile of [false, true]) assert.match(renderToStaticMarkup(React.createElement(AccountMenu, { mobile })), /href="\/login"/);
  } finally { await server.close(); }
});

test('navbar extends desktop and mobile without changing the primary item order', async () => {
  const navbar = await readFile(new URL('../src/components/Navbar.jsx', import.meta.url), 'utf8');
  const labels = ['Sustainability Intelligence', 'Opportunity Intelligence', 'Insights', 'Solutions', 'Academy', 'About', 'Join Us', 'Contact'];
  let previous = -1;
  for (const label of labels) { const index = navbar.indexOf(`'${label}'`, navbar.indexOf('const navItems')); assert.ok(index > previous); previous = index; }
  assert.match(navbar, /<AccountMenu \/>/);
  assert.match(navbar, /<AccountMenu mobile/);
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.doesNotMatch(sitemap, /\/login|\/signup|\/account\//);
});
