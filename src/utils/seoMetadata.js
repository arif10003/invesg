// Restore pre-existing head attributes on route cleanup, including image/robots.
// This prevents account noindex metadata or article imagery leaking to another page.
export function applyPageMetadata(document, origin, options) {
  const { title, description, canonicalPath, image, article, robots = 'index,follow' } = options;
  const previousTitle = document.title;
  const undo = [];
  document.title = title;
  function update(selector, tag, attributes) {
    let element = document.head.querySelector(selector);
    const created = !element;
    if (!element) { element = document.createElement(tag); document.head.appendChild(element); }
    const previous = Object.fromEntries(Object.keys(attributes).map(key => [key, element.getAttribute(key)]));
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    undo.push(() => {
      if (created) element.remove();
      else for (const [key, value] of Object.entries(previous)) value === null ? element.removeAttribute(key) : element.setAttribute(key, value);
    });
  }
  const canonical = `${origin}${canonicalPath}`;
  const tags = [
    ['name', 'description', description], ['name', 'robots', robots],
    ['property', 'og:title', title], ['property', 'og:description', description],
    ['property', 'og:url', canonical], ['property', 'og:type', article ? 'article' : 'website'],
    ['name', 'twitter:card', image ? 'summary_large_image' : 'summary'],
    ['name', 'twitter:title', title], ['name', 'twitter:description', description],
  ];
  for (const [key, value, content] of tags) update(`meta[${key}="${value}"]`, 'meta', { [key]: value, content });
  for (const [key, value] of [['property', 'og:image'], ['name', 'twitter:image']]) {
    const selector = `meta[${key}="${value}"]`;
    if (image) update(selector, 'meta', { [key]: value, content: image.startsWith('https://') || image.startsWith('http://') ? image : `${origin}${image}` });
    else {
      const existing = document.head.querySelector(selector);
      if (existing) {
        const content = existing.getAttribute('content');
        existing.removeAttribute('content');
        undo.push(() => content === null ? existing.removeAttribute('content') : existing.setAttribute('content', content));
      }
    }
  }
  update('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical });
  if (article) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.invesgSeo = 'article';
    script.textContent = JSON.stringify(article).replace(/</g, '\\u003c');
    document.head.appendChild(script);
    undo.push(() => script.remove());
  }
  return () => { undo.reverse().forEach(restore => restore()); document.title = previousTitle; };
}
