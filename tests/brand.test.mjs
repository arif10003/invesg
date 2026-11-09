import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { approvedHeroAssets } from '../src/data/brandAssets.js';

const read = path => readFile(new URL(`../${path}`, import.meta.url));

test('transparent logo preserves original outlines and requested colors; original book artwork remains intact', async () => {
  const logo = await read('public/assets/brand/invesg-logo-master.svg');
  assert.equal(createHash('sha256').update(logo).digest('hex'), '974c3f72870cd16c74c918cd152518cf0ec4c85d471528fe24c040f2297a5b01');
  assert.doesNotMatch(logo.toString(), /<text[ >]/);
  const transparent = (await read('public/assets/brand/invesg-logo-transparent.svg')).toString();
  const original = (await read('public/assets/images/logo-vector.svg')).toString();
  assert.doesNotMatch(transparent, /<(?:rect|image|text|foreignObject|style)[\s>]|background\s*[:=]/);
  assert.equal((transparent.match(/<path\b/g) || []).length, 7);
  const getPaths = svg => Object.fromEntries([...svg.matchAll(/<path\b[^>]*>/g)].map(([tag]) => [tag.match(/\bid="([^"]+)"/)[1], { d: tag.match(/\bd="([^"]+)"/)[1], fill: tag.match(/\bfill="([^"]+)"/)?.[1] }]));
  const selectedPaths = getPaths(transparent), originalPaths = getPaths(original);
  for (const [role, sourceId] of Object.entries({ dot: 'path9', i: 'path6', n: 'path7', v: 'path8', e: 'path5', s: 'path3', g: 'path2' })) {
    assert.equal(selectedPaths[role].d, originalPaths[sourceId].d, `${role} outline must remain unchanged`);
    assert.equal(selectedPaths[role].fill, ['i', 'n', 'v'].includes(role) ? '#001C44' : '#007579');
  }
  const reversePaths = getPaths((await read('public/assets/brand/invesg-logo-reverse.svg')).toString());
  for(const role of Object.keys(selectedPaths)){ assert.equal(reversePaths[role].d, selectedPaths[role].d); assert.equal(reversePaths[role].fill, ['i','n','v'].includes(role)?'#FFFFFF':'#007579'); }
  const cover = await read('public/assets/books/esg-is-a-lens-wrap.webp');
  assert.equal(createHash('sha256').update(cover).digest('hex'), '7b219168bb18b62e8cb9f4413af1dd76e290a02deb3b9a3d9fb516cac7f1f484');
  for (const name of ['invesg-marble-cream.webp', 'invesg-marble-navy.webp', ...['homepage', 'solutions'].flatMap(page => ['desktop', 'mobile'].map(device => `invesg-${page}-hero-${device}.webp`))]) {
    const data = await read(`public/assets/brand/${name}`);
    assert.equal(data.subarray(0, 4).toString(), 'RIFF');
    assert.equal(data.subarray(8, 12).toString(), 'WEBP');
    assert.ok(data.length < 500_000, name);
  }
  assert.doesNotMatch(JSON.stringify(approvedHeroAssets), /drafts/);
  for (const [page, asset] of Object.entries(approvedHeroAssets)) {
    assert.ok(asset.desktop && asset.mobile, `${page} requires separate desktop and mobile artwork`);
    assert.notEqual(asset.desktop, asset.mobile);
    for (const path of [asset.desktop, asset.mobile]) {
      const selected = await read(`public${path}`);
      const original = await read(`public/assets/brand/drafts/${path.split('/').pop()}`);
      assert.deepEqual(selected, original, 'Promoted artwork must preserve the reviewed pixels');
    }
  }
});

test('emerald action foreground and derived link ink meet normal-text contrast', () => {
  const navy = [0, 28, 68], emerald = [0, 117, 121], cream = [247, 244, 237];
  const luminance = rgb => rgb.map(x => x / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  const link = emerald.map((x, i) => x * .72 + navy[i] * .28);
  assert.ok(contrast([255,255,255], emerald) >= 4.5);
  assert.ok(contrast(link, cream) >= 4.5);
});

test('Navbar retains guest access; only a supplied verified session shows a member name', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Navbar } = await server.ssrLoadModule('/src/components/Navbar.jsx');
    const { default: Footer } = await server.ssrLoadModule('/src/components/SiteFooter.jsx');
    const { default: AccountMenu } = await server.ssrLoadModule('/src/components/auth/AccountMenu.jsx');
    const { MemberSessionContext } = await server.ssrLoadModule('/src/context/MemberSessionContext.jsx');
    const { default: Home } = await server.ssrLoadModule('/src/pages/HomePage.jsx');
    const { default: Solutions } = await server.ssrLoadModule('/src/pages/SolutionsFinderPage.jsx');
    const { default: Loading } = await server.ssrLoadModule('/src/components/BrandLoading.jsx');
    const render = element => renderToStaticMarkup(React.createElement(MemoryRouter, null, element));
    const nav = render(React.createElement(Navbar));
    assert.match(nav, /Login \/ Sign Up/);
    assert.match(nav, /invesg-logo-transparent\.svg/);
    assert.doesNotMatch(nav, /Explore Intelligence|linkedin\.com|instagram\.com/);
    for (const route of ['sustainability', 'opportunity', 'insights', 'solutions', 'academy', 'about', 'join-us', 'contact']) assert.match(nav, new RegExp(`href="/${route}"`));
    const footer = render(React.createElement(Footer));
    assert.match(footer, /linkedin\.com/);
    assert.match(footer, /invesg-logo-transparent\.svg/);
    for (const mobile of [false, true]) {
      const member = profile => render(React.createElement(MemberSessionContext.Provider, { value: { status: 'authenticated', profile } }, React.createElement(AccountMenu, { mobile })));
      const account = member({ name: 'Ari', email: 'private@example.test' });
      assert.match(account, /<button[^>]*type="button"[^>]*aria-expanded="false"/);
      assert.match(account, /<span>Ari<\/span>/);
      assert.match(account, /role="menuitem" href="\/account\/library"/);
      assert.match(account, /role="menuitem" href="\/account\/settings"/);
      assert.match(account, /Log out/);
      assert.doesNotMatch(member({ name: '', email: 'private@example.test' }), /private@example/);
      assert.match(member({}), /My Account/);
      for(const role of ['admin','super_admin','editor','publisher','commerce']) assert.match(member({role,name:'Staff'}), /href="\/admin"/);
      for(const role of ['member','viewer',undefined]) assert.doesNotMatch(member({role,name:'Reader'}), /Admin Workspace/);
      assert.match(render(React.createElement(AccountMenu, { mobile })), /href="\/login"/);
    }
    const home = render(React.createElement(Home));
    assert.match(home, /invesg-homepage-hero-mobile\.webp 1122w/);
    const homeHeader=home.match(/<header[\s\S]*?<\/header>/)?.[0];
    assert.ok(homeHeader);assert.doesNotMatch(homeHeader,/aria-current="page"/);
    const sustainabilityNav=render(React.createElement(Navbar,{activeNavItem:'Sustainability Intelligence'}));
    assert.match(sustainabilityNav,/href="\/sustainability" aria-current="page"/);
    assert.match(home, /<circle cx="50" cy="50" r="38"/);
    assert.doesNotMatch(home, /<ellipse/);
    assert.match(home, /system responses, learning and adaptation/);
    const solutions = render(React.createElement(Solutions));
    assert.match(solutions, /invesg-solutions-hero-mobile\.webp 1122w/);
    assert.match(solutions, /Search INVESG services/);
    assert.match(solutions, /PPKH/);
    assert.match(solutions, /id="solutions-explorer"/);
    assert.match(solutions, /Consider alternatives and possible pathways/);
    for (const html of [home, solutions]) {
      assert.doesNotMatch(html, /\/drafts\/|brand-hero-art--no-mobile/);
      assert.match(html, /<source media="\(max-width: 760px\)"[^>]+width="1122" height="1402"/);
    }
    const loading = render(React.createElement(Loading));
    assert.match(loading, /role="status"/);
    assert.match(loading, /invesg-logo-transparent\.svg/);
    assert.match(loading, /ESG IS A LENS/);
    assert.doesNotMatch(loading, /brand-loading-panel|Loading INVESG(?:…|\.\.\.)/);
    assert.doesNotMatch(loading, /spinner|setTimeout/);
  } finally { await server.close(); }
});
