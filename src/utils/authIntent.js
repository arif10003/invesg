// Keep only explicit first-party destinations and known article actions.
// Never accept an external URL or forward verification/reset tokens through links.
export function readAuthIntent(search = '') {
  const params = new URLSearchParams(search);
  const returnTo = params.get('returnTo') || '';
  const allowed = /^(?:\/insights(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){0,2}|\/checkout\/[a-z0-9]+(?:-[a-z0-9]+)*|\/account\/(?:library|settings))$/;
  if (!allowed.test(returnTo)) return null;
  const action = params.get('action');
  const isArticle = /^\/insights\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(returnTo) && !['/insights/books', '/insights/media'].includes(returnTo);
  return { returnTo, ...(isArticle && ['save', 'download'].includes(action) ? { action } : {}) };
}

export function authHref(path, search = '') {
  const intent = readAuthIntent(search);
  return intent ? `${path}?${new URLSearchParams(intent)}` : path;
}
