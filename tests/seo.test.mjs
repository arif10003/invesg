import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPageMetadata } from '../src/utils/seoMetadata.js';

// A minimal head DOM for lifecycle assertions; does not simulate browser layout.
function headDocument() {
  const nodes = [];
  const document = {
    title: 'Original',
    head: {
      appendChild(node) { nodes.push(node); },
      querySelector(selector) {
        const [, tag, key, value] = selector.match(/^(\w+)\[(\w+)="([^"]+)"\]$/);
        return nodes.find(node => node.tag === tag && node.getAttribute(key) === value) || null;
      },
    },
    createElement(tag) {
      const attributes = new Map();
      return { tag, dataset: {}, getAttribute: key => attributes.get(key) ?? null, setAttribute: (key, value) => attributes.set(key, value), removeAttribute: key => attributes.delete(key), remove() { const index = nodes.indexOf(this); if (index >= 0) nodes.splice(index, 1); } };
    },
  };
  return { document, nodes };
}

test('SEO restores existing metadata and isolates public/article/account transitions', () => {
  const { document, nodes } = headDocument();
  for (const [name, content] of [['robots', 'index,follow'], ['description', 'Original description']]) {
    const node = document.createElement('meta'); node.setAttribute('name', name); node.setAttribute('content', content); document.head.appendChild(node);
  }
  const canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical);
  const cleanupArticle = applyPageMetadata(document, 'https://invesg.co', { title: 'Article', description: 'Article description', canonicalPath: '/insights/test', image: '/cover.webp', article: { headline: '<test>' } });
  assert.equal(document.head.querySelector('meta[property="og:image"]').getAttribute('content'), 'https://invesg.co/cover.webp');
  assert.equal(document.head.querySelector('meta[name="twitter:image"]').getAttribute('content'), 'https://invesg.co/cover.webp');
  assert.ok(nodes.some(node => node.type === 'application/ld+json' && !node.textContent.includes('<')));
  cleanupArticle();
  assert.equal(canonical.getAttribute('href'), null);
  assert.equal(document.head.querySelector('meta[property="og:image"]'), null);
  const cleanupAccount = applyPageMetadata(document, 'https://invesg.co', { title: 'Account', description: 'Private', canonicalPath: '/account/library', robots: 'noindex,nofollow' });
  assert.equal(document.head.querySelector('meta[name="robots"]').getAttribute('content'), 'noindex,nofollow');
  cleanupAccount();
  assert.equal(document.head.querySelector('meta[name="robots"]').getAttribute('content'), 'index,follow');
  assert.equal(document.head.querySelector('meta[name="description"]').getAttribute('content'), 'Original description');
  assert.equal(document.title, 'Original');
});
