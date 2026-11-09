import { publishSessionEnd } from '../utils/sessionEvents.js';
export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) { super(message); this.name = 'ApiError'; this.status = status; this.errors = errors; }
}
const listeners = new Set();
let identity = { status: 'guest', profile: null, revision: 0 };
let accessToken = null, expiresAt = 0, refreshing = null, bootstrap = null;
const guestOrders = new Map();
export const getSession = () => identity;
export const subscribeSession = listener => { listeners.add(listener); return () => listeners.delete(listener); };
function emit() { for (const listener of listeners) listener(); }
export function clearSession() {
  accessToken = null; expiresAt = 0; bootstrap = null; guestOrders.clear();
  identity = { status: 'guest', profile: null, revision: identity.revision + 1 }; emit();
}
export function acceptSession(result) {
  if (!result?.access_token || !result?.user?.id || !(Number(result.expires_in) > 0)) throw new ApiError('Incomplete sign-in response.', 502);
  guestOrders.clear(); accessToken = result.access_token; expiresAt = Date.now() + result.expires_in * 1000;
  identity = { status: 'authenticated', profile: result.user, revision: identity.revision + 1 }; emit();
  return result.user;
}
export function updateSessionProfile(profile) {
  if (!accessToken || profile?.id !== identity.profile?.id) throw new ApiError('Sign in again.', 401);
  identity = { ...identity, profile, revision: identity.revision + 1 }; emit();
}
export function apiOrigin() { return (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, ''); }
export function apiUrl(path) {
  if (!path.startsWith('/') || path.startsWith('//') || /[\\\u0000-\u0020]/.test(path)) throw new ApiError('Invalid API path.');
  return `${apiOrigin()}${path}`;
}
// Laravel TokenService uses Str::random(64), including mixed-case letters and digits.
function isAccessCapability(value) { return typeof value === 'string' && value.length === 64 && /^[A-Za-z0-9]{64}$/.test(value); }
export function rememberGuestOrder(id, token) { if (/^[a-zA-Z0-9_-]{1,80}$/.test(id) && isAccessCapability(token)) guestOrders.set(id, token); }
export const guestOrderToken = id => guestOrders.get(id);
export async function requestJson(path, { signal, method = 'GET', body, auth = 'optional', guestToken, idempotencyKey, skipRefresh = false } = {}) {
  signal?.throwIfAborted();
  if (auth === 'required' && !accessToken) throw new ApiError('Please sign in to continue.', 401);
  if (!skipRefresh && auth !== 'none' && accessToken && expiresAt - Date.now() < 60000) {
    if (!refreshing) {
      const revision = identity.revision;
      refreshing = requestJson('/api/v1/auth/refresh', { method: 'POST', auth: 'required', skipRefresh: true }).then(result => {
        if (revision !== identity.revision) throw new ApiError('Your account changed. Try again.', 401);
        acceptSession(result);
      }).finally(() => { refreshing = null; });
    }
    await refreshing;
  }
  const revision = identity.revision;
  const headers = { Accept: 'application/json' };
  if (!apiOrigin() || apiOrigin() === globalThis.location?.origin) headers['X-Invesg-Session'] = '1';
  if (auth !== 'none' && accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (guestToken) headers['X-Guest-Token'] = guestToken;
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(apiUrl(path), { method, signal, headers, credentials: 'same-origin', cache: 'no-store', ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  // A late response from a former identity must never populate the next account.
  if (auth !== 'none' && revision !== identity.revision) throw new ApiError('Your account changed. Please try again.', 401);
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && headers.Authorization && revision === identity.revision && !/^\/api\/v1\/auth\/logout(?:-all)?$/.test(path)) clearSession();
    throw new ApiError(data.message || 'The request could not be completed.', response.status, data.errors);
  }
  return data;
}
export const requestPublicJson = (path, options = {}) => requestJson(path, { ...options, auth: 'none' });
// Follow our own pagination indices, never a server-supplied cross-origin next URL.
export async function collectPages(path, options = {}) {
  const items = []; let page = 1;
  do {
    const result = await requestJson(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`, options);
    if (!Array.isArray(result.data) || !Number.isInteger(result.last_page) || result.last_page < page) throw new ApiError('Incomplete collection response.', 502);
    items.push(...result.data);
    if (page >= result.last_page) return items;
    if (++page > 100) throw new ApiError('This collection is too large. Narrow the search.', 422);
  } while (true);
}
export function safeDownloadUrl(value) {
  if (typeof value !== 'string' || /[\\\u0000-\u0020\u007f]/.test(value)) throw new ApiError('Invalid download response.', 502);
  const base = apiOrigin() || globalThis.location?.origin || 'http://localhost';
  const expected = new URL(base), url = new URL(value, base);
  const prefix = '/api/v1/downloads/';
  if (url.origin !== expected.origin || url.username || url.password || !url.pathname.startsWith(prefix) || !isAccessCapability(url.pathname.slice(prefix.length)) || url.search || url.hash) throw new ApiError('Invalid download response.', 502);
  return url.href;
}
export function safePaymentUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !['app.midtrans.com', 'app.sandbox.midtrans.com'].includes(url.hostname) || url.username || url.password || url.port) throw new ApiError('Payment destination could not be verified.', 502);
  return url.href;
}

export function publicMediaUrl(value) {
  if (typeof value !== 'string' || /[\\\u0000-\u0020]/.test(value)) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    if (url.username || url.password) return null;
    const base = apiOrigin() || globalThis.location?.origin;
    const local = hostname => ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
    const page = globalThis.location?.origin;
    if (page && /^\/(storage\/|api\/v1\/media\/)/.test(url.pathname)) {
      const current = new URL(page);
      if (['http:', 'https:'].includes(url.protocol) && (url.origin === current.origin ||
          (local(current.hostname) && local(url.hostname) && url.port === '8000'))) return url.pathname + url.search;
    }
    if (url.protocol === 'https:') return value;
    if (base && url.protocol === 'http:' && url.origin === new URL(base).origin && /^(\/storage\/|\/api\/v1\/media\/)/.test(url.pathname)) return value;
  } catch {}
  return null;
}

// Bootstrap once, including StrictMode remounts. A network failure must be retryable
// without silently showing the former account or treating a member as a guest.
export function restoreSession() {
  const revision = identity.revision;
  if (!bootstrap) bootstrap = requestJson('/api/v1/auth/refresh', {
    method: 'POST', auth: 'none', skipRefresh: true,
  }).then(result => {
    if (revision !== identity.revision) throw new ApiError('Your account changed. Please try again.', 401);
    return acceptSession(result);
  }).catch(error => {
    if (revision === identity.revision) clearSession();
    if (![401, 403].includes(error.status)) { bootstrap = null; throw error; }
  });
  return bootstrap;
}

export function finishLogout() {
  clearSession();
  publishSessionEnd();
}
