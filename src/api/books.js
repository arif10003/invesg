import { books } from '../data/books.js';
import { publicLink } from '../utils/publication.js';
import { collectPages, requestPublicJson } from './client.js';
// Approved promotional copy remains separate from server catalog/pricing authority.
export function getPublishedBooks(records = books) {
  return records.filter(book => ['published', 'coming_soon'].includes(book.status) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.slug) && book.title && book.author && publicLink(book.cover)).filter((book, index, items) => items.findIndex(other => other.slug === book.slug) === index);
}
export function getBook(slug, records = books) { return getPublishedBooks(records).find(book => book.slug === slug) || null; }
// Live catalog fields come exclusively from the API. Editorial fixtures are preview-only.
export function mapBook(product) {
  const isPrint = product.bookFormat === 'print' || product.type === 'print';
  const comingSoon = product.status === 'coming_soon' || product.publication_status === 'coming_soon';
  const paragraphs = typeof product.description === 'string' ? product.description.split(/\n\s*\n/).filter(Boolean) : [];
  return {
    ...product,
    cover: product.cover_url || null, coverLayout: 'flat',
    publisher: product.publisher || null, language: product.language || null,
    displayFormat: product.displayFormat || null, fileFormat: product.fileFormat || null,
    edition: product.edition || (comingSoon ? 'Coming Soon' : null), isbn: product.isbn || null,
    headline: product.headline || null, closing: product.closing || null,
    shortDescription: product.shortDescription || '', description: paragraphs,
    authorDisplayName: product.authorDisplayName || product.author || '',
    authorBio: product.authorBio || '', authorPhoto: publicLink(product.authorPhoto),
    authorProfileUrl: publicLink(product.authorProfileUrl),
    isPrint, comingSoon, commerce: comingSoon ? null : { price: product.sale_price ?? product.price, currency: product.currency },
    canPurchase: !isPrint && !comingSoon && product.can_purchase === true,
  };
}
export async function loadBooks({ signal } = {}) { return (await collectPages('/api/v1/products', { signal, auth: 'none' })).map(mapBook); }
export async function loadBook(slug, { signal } = {}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) return null;
  try { return mapBook((await requestPublicJson(`/api/v1/products/${encodeURIComponent(slug)}`, { signal })).data); } catch (error) { if (error.status === 404) return null; throw error; }
}
export function bookPrice(commerce) {
  if (!commerce || !Number.isFinite(commerce.price) || commerce.price <= 0 || !/^[A-Z]{3}$/.test(commerce.currency || '')) return null;
  try { return new Intl.NumberFormat(commerce.currency === 'IDR' ? 'id-ID' : 'en-GB', { style: 'currency', currency: commerce.currency, maximumFractionDigits: 0 }).format(commerce.price); } catch { return null; }
}

