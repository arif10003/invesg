import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, Users, Sprout, Search, Network, CalendarDays, Globe2, Check, ChevronRight } from 'lucide-react';
import Navbar from '../Navbar';
import SiteFooter from '../SiteFooter';
import { usePageSeo } from '../../utils/seo';
import { ui, categories } from '../../data/learningContent';
import { learningImages } from '../../data/learningImages';
import '../../styles/learning.css';

const LocaleContext = React.createContext('en');
export function useLearningLocale() { return React.useContext(LocaleContext); }
export const textFor = (value, locale = 'en') => typeof value === 'string' ? value : value?.[locale] || value?.en || '';
export function useCopy() { const locale = useLearningLocale(); return value => textFor(value, locale); }
const icons = { book: BookOpen, building: Building2, users: Users, leaf: Sprout, search: Search, network: Network, calendar: CalendarDays, globe: Globe2 };
export function LearningIcon({ name }) { const Icon = icons[name] || BookOpen; return <Icon aria-hidden="true" strokeWidth={1.4} />; }

export function LearningLayout({ title, description, section = 'academy', children }) {
  // The selector changes only these resource-backed pages; it does not claim site-wide translation.
  const [locale, setLocale] = React.useState(() => { try { return sessionStorage.getItem('invesg-learning-locale') === 'id' ? 'id' : 'en'; } catch { return 'en'; } });
  const { pathname } = useLocation();
  const t = value => textFor(value, locale);
  usePageSeo({ title: `${t(title)} | invesg`, description: t(description), canonicalPath: pathname });
  React.useEffect(() => { try { sessionStorage.setItem('invesg-learning-locale', locale); } catch { /* Translation remains usable when storage is disabled. */ } }, [locale]);
  return <LocaleContext.Provider value={locale}><div className={`learning-page learning-page--${section}`}>
    <Navbar activeNavItem={section === 'academy' ? 'Academy' : 'Join Us'} />
    <main id="page-content" lang={locale}>
      <div className="learning-shell learning-utility"><span>{t(section === 'academy' ? ui.academy : ui.join)}</span><label>{locale === 'en' ? 'Page language' : 'Bahasa halaman'} <select aria-label="Page language" value={locale} onChange={event => setLocale(event.target.value)}><option value="en">English</option><option value="id">Bahasa Indonesia</option></select></label></div>
      {children}
    </main><SiteFooter />
  </div></LocaleContext.Provider>;
}
export function Action({ to, children, secondary = false }) { return <Link className={`learning-action${secondary ? ' learning-action--secondary' : ''}`} to={to}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>; }
export function TextLink({ to, children, className = '', ariaLabel }) { return <Link className={`learning-text-link ${className}`.trim()} to={to} aria-label={ariaLabel}>{children}<ArrowRight size={16} aria-hidden="true" /></Link>; }
export function Breadcrumb({ items }) { const t = useCopy(); return <nav aria-label="Breadcrumb" className="learning-shell learning-breadcrumb"><ol>{items.map(([label, href], i) => <li key={i}>{i > 0 && <ChevronRight size={12} aria-hidden="true" />}{href ? <Link to={href}>{t(label)}</Link> : <span aria-current="page">{t(label)}</span>}</li>)}</ol></nav>; }
export function LearningImage({ image, priority = false, sizes = '(max-width: 767px) 100vw, 50vw', className = '' }) {
  const t = useCopy();
  const asset = typeof image === 'string' ? learningImages[image] : image;
  if (!asset) return null;
  return <img className={`learning-photo ${className}`.trim()} src={asset.src} srcSet={asset.srcSet} sizes={sizes} alt={t(asset.alt)} width={asset.width} height={asset.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" style={{ objectPosition: asset.position }} />;
}

export function Hero({ eyebrow, title, description, children, dark = false, compact = false, image = 'academyWorkshop' }) {
  const t = useCopy();
  return <section className={`learning-hero${dark ? ' learning-hero--dark' : ''}${compact ? ' learning-hero--compact' : ''}`}>
    <div className="learning-hero-media"><LearningImage image={image} priority sizes="(max-width: 767px) 100vw, 58vw" /></div>
    <div className="learning-shell learning-hero-inner"><div className="learning-hero-copy"><span className="learning-eyebrow">{t(eyebrow)}</span><h1>{t(title)}</h1><p>{t(description)}</p>{children && <div className="learning-actions">{children}</div>}</div></div>
  </section>;
}
export function Section({ eyebrow, title, children, action, className = '', id }) { const t = useCopy(); return <section id={id} className={`learning-shell learning-section ${className}`}><div className="learning-section-heading"><div>{eyebrow && <span className="learning-eyebrow">{t(eyebrow)}</span>}{title && <h2>{t(title)}</h2>}</div>{action}</div>{children}</section>; }
export function FeatureGrid({ items, strip = false }) {
  const t = useCopy();
  return <div className={`learning-feature-grid${strip ? ' learning-feature-grid--strip' : ''}`} style={{ '--columns': Math.min(items.length, 4) }}>
    {items.map((item, index) => <article className={`learning-feature${item.image ? ' learning-feature--photographic' : ''}`} key={index}>
      {item.image && <div className="learning-feature-media"><LearningImage image={item.image} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" /></div>}
      <div className="learning-feature-copy"><span className="learning-icon"><LearningIcon name={item.icon} /></span><h3>{t(item.title)}</h3><p>{t(item.text)}</p>{item.href && <TextLink to={item.href} className="learning-card-link" ariaLabel={`${t(item.title)}: ${t(item.cta || ui.learn)}`}>{t(item.cta || ui.learn)}</TextLink>}</div>
    </article>)}
  </div>;
}
export function CheckList({ items }) { const t = useCopy(); return <ul className="learning-check-list">{items.map((item, i) => <li key={i}><Check size={16} aria-hidden="true" /><span>{t(item)}</span></li>)}</ul>; }
export function Editorial({ eyebrow, title, text, children, dark = false, image, reverse = false }) {
  const t = useCopy();
  return <section className={`learning-editorial${dark ? ' learning-editorial--dark' : ''}${reverse ? ' learning-editorial--reverse' : ''}`}><div className="learning-shell learning-editorial-inner">
    <div className="learning-editorial-copy">{eyebrow && <span className="learning-eyebrow">{t(eyebrow)}</span>}<h2>{t(title)}</h2><p>{t(text)}</p>{children}</div>
    {image ? <div className="learning-editorial-media"><LearningImage image={image} /></div> : <div className="learning-editorial-quote"><span>ESG is a Lens.</span><p>{t(ui.signature)}</p></div>}
  </div></section>;
}
export function CallToAction({ title, text, to, label }) { const t = useCopy(); return <section className="learning-cta"><div className="learning-shell"><div><span className="learning-eyebrow">invesg</span><h2>{t(title)}</h2>{text && <p>{t(text)}</p>}</div><Action to={to}>{t(label || ui.proposal)}</Action></div></section>; }
export function ProgramCard({ program }) { const t = useCopy(); return <article className="learning-program-card"><div className="learning-program-image"><LearningImage image={program.photoKey} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" /></div><div className="learning-program-copy"><span className="learning-card-category">{t(categories.find(category => category.id === program.category)?.title)}</span><h3>{t(program.title)}</h3><p>{t(program.summary)}</p><small>{t(ui.indicative)}</small><TextLink to={`/academy/programs/${program.slug}`} className="learning-card-link" ariaLabel={`${t(program.title)}: ${t(ui.learn)}`}>{t(ui.learn)}</TextLink></div></article>; }
export function ProgramGrid({ programs }) { return <div className="learning-program-grid" style={{ '--program-columns': Math.min(programs.length, 4) }}>{programs.map(program => <ProgramCard key={program.slug} program={program} />)}</div>; }
export const inquiryLink = topic => `/contact?source=contact&topic=${encodeURIComponent(topic)}`;
