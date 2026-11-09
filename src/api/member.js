import { requestJson, collectPages, getSession, safeDownloadUrl } from './client.js';
export const libraryKinds = ['books', 'saved', 'pdfs'];
export function libraryKind(value) { return libraryKinds.includes(value) ? value : 'books'; }
export async function loadMemberLibrary(kind, { signal } = {}) {
  signal?.throwIfAborted(); kind = libraryKind(kind);
  if (getSession().status !== 'authenticated') return { status: 'unauthorized', kind, items: null };
  try {
    const items = await collectPages(kind === 'saved' ? '/api/v1/me/bookmarks' : `/api/v1/me/library/${kind}`, { signal, auth: 'required' });
    return { status: 'ready', kind, items: items.map(item => kind === 'books' ? { ...item, title: item.product?.title || 'Purchased book', slug: item.product?.slug, author: item.product?.author, cover: item.product?.cover_url || null, coverLayout: 'flat', purchasedAt: item.granted_at, available: item.state === 'active', accessState: item.state } : { ...item, publishedAt: item.published_at }) };
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    if ([401,403].includes(error.status)) return { status: error.status === 401 ? 'unauthorized' : 'forbidden', kind, items: null };
    throw error;
  }
}
export async function loadMemberProfile({ signal } = {}) {
  signal?.throwIfAborted();
  if (getSession().status !== 'authenticated') return { status: 'unauthorized', profile: null };
  return { status: 'ready', profile: (await requestJson('/api/v1/me/profile', { signal, auth: 'required' })).data };
}
export const saveBookmark = id => requestJson(`/api/v1/me/bookmarks/${encodeURIComponent(id)}`, { method: 'PUT', auth: 'required' });
export const removeBookmark = id => requestJson(`/api/v1/me/bookmarks/${encodeURIComponent(id)}`, { method: 'DELETE', auth: 'required' });
export const listBookmarks = () => collectPages('/api/v1/me/bookmarks', { auth: 'required' });
export const claimPurchases = () => requestJson('/api/v1/me/purchase-claims', { method: 'POST', auth: 'required' });
export const saveProfile = name => requestJson('/api/v1/me/profile', { method: 'PATCH', auth: 'required', body: { name } });
export async function downloadBook(id, guestToken) {
  const result = await requestJson(`/api/v1/entitlements/${encodeURIComponent(id)}/download`, { method: 'POST', auth: guestToken ? 'none' : 'required', guestToken });
  return safeDownloadUrl(result.data.url);
}
export async function downloadPdf(id) {
  const result = await requestJson(`/api/v1/publications/${encodeURIComponent(id)}/pdf-download`, { method: 'POST', auth: 'required' });
  return safeDownloadUrl(result.data.url);
}
export const recoverAccess = email => requestJson('/api/v1/guest-access/recover', { method: 'POST', body: { email }, auth: 'none' });
export const exchangeGuestAccess = token => requestJson('/api/v1/guest-access/exchange', { method: 'POST', body: { token }, auth: 'none' });
