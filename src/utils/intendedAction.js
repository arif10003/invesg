// Future authentication must authorize this intent server-side before execution.
export function makeInsightIntent(slug, action) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !['save', 'download'].includes(action)) return null;
  return { returnTo: `/insights/${slug}`, resourceSlug: slug, action };
}
