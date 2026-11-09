import { requestJson, collectPages, apiUrl } from './client.js';
export function mapPublication(p) {
  const types = { brief: ['brief', 'INVESG Brief'], policy_analysis: ['analysis', 'Policy Analysis'], research_article: ['analysis', 'Research Article'], perspective: ['perspective', 'Perspective'], other: ['perspective', 'Insight'] };
  const [contentType, contentTypeLabel] = types[p.content_type] || types.other;
  const blocks = (p.document?.blocks || []).map(b => b.type === 'image' ? { type: 'image', media_id: b.media_id, alt: b.alt, caption: b.text } : b.type === 'table' ? { type: 'table', columns: b.rows?.[0] || [], rows: b.rows?.slice(1) || [] } : b.type === 'citation' ? { type: 'citation', text: b.text, url: b.url } : b);
  return { id: p.id, slug: p.slug, status: 'published', href: `/insights/${p.slug}`, title: p.title, excerpt: p.excerpt, authorName: p.author, contentType, contentTypeLabel, topics: p.categories || [], tags: p.tags || [], sectors: [], geographies: [], coverImage: p.featured_image_url, coverAlt: p.title, body: blocks, canRead: p.can_read === true, pdf: { available: p.has_pdf === true && p.pdf_access === 'member' }, publishedAt: p.published_at, seoDescription: p.seo?.description || p.excerpt };
}
export async function loadInsights({ signal } = {}) { return { articles: (await collectPages('/api/v1/publications', { signal })).map(mapPublication), spotlight: [] }; }
export async function loadArticle(slug, { signal } = {}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) return null;
  try { return mapPublication((await requestJson(`/api/v1/publications/${slug}`, { signal })).data); } catch (error) { if (error.status === 404) return null; throw error; }
}
