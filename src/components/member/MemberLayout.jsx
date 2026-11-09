import LogoutControl from '../auth/LogoutControl';
import React from 'react';
import { useMemberSession } from '../../context/MemberSessionContext';
import { canUseWorkspace } from '../../utils/memberAccess';
import BrandLogo from '../BrandLogo';
import Navbar from '../Navbar';
import SiteFooter from '../SiteFooter';
import { usePageSeo } from '../../utils/seo';
import '../../styles/account.css';

export default function MemberLayout({ title, path, children }) {
  const session = useMemberSession();
  usePageSeo({ title: `${title} | INVESG`, description: 'INVESG member library and account services.', canonicalPath: path, robots: 'noindex,nofollow' });
  return <main className="member-page"><Navbar activeNavItem="" /><div className="member-shell"><nav className="member-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">{title}</span></nav><div className="member-layout"><aside className="member-navigation"><a className="member-brand-home" href="/" aria-label="invesg home"><BrandLogo variant="reverse" placement="member" /></a><span>Member services</span><nav aria-label="Account navigation"><a href="/account/library" aria-current={path === '/account/library' ? 'page' : undefined}>My Library</a><a href="/account/settings" aria-current={path === '/account/settings' ? 'page' : undefined}>Account Settings</a><a href="/insights">Explore Insights</a><a href="/insights/books">Books &amp; Publications</a>{canUseWorkspace(session.profile) && <a href="/admin">Admin Workspace</a>}{session.status === 'authenticated' && <LogoutControl className="member-logout" />}</nav></aside><div className="member-content"><header className="member-heading"><span>INVESG Account</span><h1>{title}</h1></header>{children}</div></div></div><SiteFooter /></main>;
}

import '../../styles/visual-sprint.css';
