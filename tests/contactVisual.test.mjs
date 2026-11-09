import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Contact renders one accessible form and inquiry intents without changing backend fields', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { MemoryRouter } = await import('react-router-dom');
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Contact } = await server.ssrLoadModule('/src/pages/ContactPage.jsx');
    const { default: Loading, BrandLoadingOverlay } = await server.ssrLoadModule('/src/components/BrandLoading.jsx');
    const render = element => renderToStaticMarkup(React.createElement(MemoryRouter, null, element));
    const html = render(React.createElement(Contact));
    const inquiry = html.slice(html.indexOf('<section id="contact-form"'), html.indexOf('<section class="contact-shell contact-options"'));
    assert.equal((inquiry.match(/<form\b/g) || []).length, 1, 'The navbar search form is separate from the single inquiry form');
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    for (const label of ['Ask a Question', 'Explore Collaboration', 'Discuss Your Challenge']) assert.match(html, new RegExp(`aria-controls="contact-form"[^>]*[^]*?<span>${label}</span>`));
    for (const name of ['full_name', 'email', 'organization', 'country', 'inquiry_type', 'message', 'consent_given', 'website']) assert.match(html, new RegExp(`name="${name}"`));
    for (const value of ['General inquiry', 'Partnership', 'Advisory or consulting']) assert.match(html, new RegExp(`<option[^>]*>${value}</option>`));
    assert.match(html, /id="contact-inquiry-type"/);
    assert.match(html, /invesg-contact-global\.webp/);
    assert.match(html, /width="1671" height="941"/);
    assert.doesNotMatch(html, /esg-hero\.png|Explore Intelligence/);
    assert.ok(html.indexOf('id="contact-form"') < html.indexOf('General Inquiries'));
    assert.equal(render(React.createElement(BrandLoadingOverlay, { loading: false })), '');
    assert.match(render(React.createElement(BrandLoadingOverlay, { loading: true })), /data-phase="loading"/);
    assert.match(render(React.createElement(Loading, { exiting: true })), /data-phase="exiting"[^>]*aria-hidden="true"/);
  } finally { await server.close(); }
});

test('supplied loading and Contact delivery assets are compressed WebP', async () => {
  for (const name of ['invesg-marble-reveal', 'invesg-marble-reveal-mobile', 'invesg-contact-artwork', 'invesg-contact-artwork-small']) {
    const bytes = await readFile(new URL(`../public/assets/brand/${name}.webp`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    assert.ok(bytes.length < 200_000);
  }
});
