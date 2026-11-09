export function publicLink(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const url = value.trim();
  if (/[\\\u0000-\u0020]/.test(url)) return null;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  try { return new URL(url).protocol === 'https:' ? url : null; } catch { return null; }
}

export function selectSpotlight(records = []) {
  return records.filter(item => item.status === 'published' && item.id && item.title && publicLink(item.destination))
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    .filter((item, index, items) => items.findIndex(other => other.id === item.id) === index).slice(0, 3);
}
