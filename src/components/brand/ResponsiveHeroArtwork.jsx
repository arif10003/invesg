import React from 'react';
import EsgSystemDiagram from './EsgSystemDiagram';

export default function ResponsiveHeroArtwork({ artwork, kind = 'home' }) {
  if (!artwork?.desktop) return null;
  return <figure
    className={`brand-hero-art brand-hero-art--${kind}${artwork.mobile ? '' : ' brand-hero-art--no-mobile'}`}
    style={kind === 'home' ? {
      '--diagram-left': artwork.diagramLeft || '51.3%',
      '--diagram-top': artwork.diagramTop || '10.8%',
      '--diagram-width': artwork.diagramWidth || '38%',
    } : undefined}
  >
    <picture>
      {artwork.mobile && <source media="(max-width: 760px)" srcSet={`${artwork.mobile} 1122w`} sizes="100vw" width="1122" height="1402" />}
      <source media="(min-width: 761px)" srcSet={`${artwork.desktop} ${artwork.width || 1672}w`} sizes="100vw" />
      <img src={artwork.desktop}
        alt={kind === 'home' ? 'A circular magnifying glass revealing connected forests, water, communities, governance, industry and renewable energy.' : 'Branching decision pathways through a landscape of communities, water, infrastructure and natural systems.'}
        width={artwork.width || 1672} height={artwork.height || 941} fetchPriority="high" decoding="async" />
    </picture>
    {kind === 'home' && <EsgSystemDiagram />}
  </figure>;
}
