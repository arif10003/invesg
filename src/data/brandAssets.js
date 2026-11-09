import bookArtwork from './bookArtwork.json' with { type: 'json' };
// Promoted from the reviewed compositions after the user's instruction to continue.
// Rendered desktop/mobile acceptance remains separate from enabling these assets.
export const approvedHeroAssets = {
  home: {
    desktop: '/assets/brand/invesg-homepage-hero-desktop.webp',
    mobile: '/assets/brand/invesg-homepage-hero-mobile.webp',
    width: 1672, height: 941,
    diagramLeft: '51.3%', diagramTop: '10.8%', diagramWidth: '38%',
  },
  solutions: {
    desktop: '/assets/brand/invesg-solutions-hero-desktop.webp',
    mobile: '/assets/brand/invesg-solutions-hero-mobile.webp',
    width: 1672, height: 941,
  },
};

export const approvedBookPromotion = { src: bookArtwork.promotion['esg-is-a-lens'], alt: 'ESG is a Lens by Arif R. Darana - complete book mockup' };

export const approvedBookCovers = bookArtwork.covers;

// Only replace the previously selected promotional mockup. New API cover uploads
// remain authoritative so the catalog editor continues to work normally.
export function productCoverArtwork(slug, source) {
  const approved = approvedBookCovers[slug];
  const path = typeof source === 'string' ? source.replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0] : '';
  return approved && (!source || bookArtwork.legacyMockupSources[slug]?.includes(path)) ? approved : source;
}
