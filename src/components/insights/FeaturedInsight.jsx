import React from 'react';
import BookSpotlight from './BookSpotlight';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { publicLink, selectSpotlight } from '../../utils/publication.js';

export default function FeaturedInsight({ items = [] }) {
  const slides = selectSpotlight(items);
  const [index, setIndex] = React.useState(0);
  const current = Math.min(index, slides.length - 1);
  const item = slides[current];
  const panelId = React.useId();
  if (!item) return null;
  const move = delta => setIndex((current + delta + slides.length) % slides.length);
  return <section className="insights-shell editorial-spotlight" aria-label="Featured editorial publications" aria-roledescription={slides.length > 1 ? 'carousel' : undefined}>
    <header className="spotlight-heading"><span>Featured editorial</span><span>{String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span></header>
    {item.book ? <div className="spotlight-stage" id={panelId} aria-roledescription="slide" aria-label={`${current + 1} of ${slides.length}`}><BookSpotlight book={item.book} embedded /></div> : <div className="spotlight-panel spotlight-stage" id={panelId} aria-roledescription="slide" aria-label={`${current + 1} of ${slides.length}`}>
      {publicLink(item.image) && <img src={publicLink(item.image)} alt={item.imageAlt || ''} />}
      <div className="spotlight-copy"><span>{item.contentTypeLabel || item.contentType || 'Featured publication'}</span><h2>{item.title}</h2>{item.excerpt && <p>{item.excerpt}</p>}<a href={publicLink(item.destination)}>{item.ctaLabel || 'Explore publication'} <ArrowRight aria-hidden="true" /></a></div>
    </div>}
    {slides.length > 1 && <div className="spotlight-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous featured publication" aria-controls={panelId}><ArrowLeft aria-hidden="true" /></button>
      <div className="spotlight-indicators">{slides.map((slide, position) => <button type="button" key={slide.id} aria-label={`Show featured publication ${position + 1}: ${slide.title}`} aria-current={current === position ? 'true' : undefined} aria-controls={panelId} onClick={() => setIndex(position)}>{position + 1}</button>)}</div>
      <button type="button" onClick={() => move(1)} aria-label="Next featured publication" aria-controls={panelId}><ArrowRight aria-hidden="true" /></button>
      <span className="sr-only" role="status" aria-live="polite">Publication {current + 1} of {slides.length}: {item.title}</span>
    </div>}
  </section>;
}
