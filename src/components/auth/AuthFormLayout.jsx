import BookImage from '../books/BookImage';
import { approvedBookPromotion } from '../../data/brandAssets';
import React from 'react';
import BrandLogo from '../BrandLogo';
import Navbar from '../Navbar';
import SiteFooter from '../SiteFooter';
import { usePageSeo } from '../../utils/seo';
import '../../styles/auth.css';
import '../../styles/mvp-visual.css';

export default function AuthFormLayout({ title, description, canonicalPath, children, landscape = true }) {
  usePageSeo({ title: `${title} | INVESG`, description, canonicalPath, robots: 'noindex,follow' });
  return <main className="auth-page"><Navbar activeNavItem="" /><div className="auth-shell"><nav className="auth-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">{title}</span></nav><div className={`auth-card${landscape ? '' : ' auth-card--single'}`}><section className="auth-content"><span className="auth-kicker">INVESG Account</span><h1>{title}</h1>{children}</section>{landscape && <aside className="auth-landscape" aria-label="Explore knowledge and connections"><a href="/" aria-label="invesg home"><BrandLogo placement="auth" variant="reverse" /></a><div><p>Explore knowledge.<br />See the connections.</p><span>For a more sustainable world.</span></div><BookImage src={approvedBookPromotion.src} alt={approvedBookPromotion.alt} /></aside>}</div></div><SiteFooter /></main>;
}

import '../../styles/visual-sprint.css';
