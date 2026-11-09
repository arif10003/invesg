import { MemberSessionContext } from '../context/MemberSessionContext';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import InsightsPage from '../pages/InsightsPage';
import BooksPage from '../pages/BooksPage';
import BookDetailPage from '../pages/BookDetailPage';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import ArticleDetail from '../components/insights/ArticleDetail';
import AuthFormLayout from '../components/auth/AuthFormLayout';
import { AuthForm } from '../components/auth/AuthForms';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import CheckoutPage from '../pages/CheckoutPage';
import { PaymentStatusContent } from '../pages/OrderStatusPage';
import LibraryPage from '../pages/account/LibraryPage';
import AccountSettingsPage from '../pages/account/AccountSettingsPage';
import HomePage from '../pages/HomePage';
import SolutionsFinderPage from '../pages/SolutionsFinderPage';
import ContactPage from '../pages/ContactPage';
import { BrandLoadingOverlay } from '../components/BrandLoading';
import { usePageSeo } from '../utils/seo';
import { previewArticles, previewArticle, previewAuthor, previewSpotlight, previewLibrary } from './fixtures';
import '../styles/insight-detail.css';
import '../styles/visual-sprint.css';
import './preview.css';

const screens = ['home', 'solutions', 'contact', 'loading', 'insights', 'article', 'books', 'book', 'login', 'signup', 'verify', 'recovery', 'reset', 'checkout', 'payment', 'library', 'settings'];
const states = ['filled', 'empty', 'loading', 'error', 'validation'];

export default function VisualPreviewPage() {
  const [params, setParams] = useSearchParams();
  const screen = screens.includes(params.get('screen')) ? params.get('screen') : 'insights';
  const state = states.includes(params.get('state')) ? params.get('state') : 'filled';
  const devices = { full: null, desktop: 1440, laptop: 1024, tablet: 768, mobile: 390 };
  const device = Object.hasOwn(devices, params.get("device")) ? params.get("device") : "full";
  const embedded = params.get("embedded") === "1";
  const frameParams = new URLSearchParams(params); frameParams.set("embedded", "1"); frameParams.delete("device");
  const paymentStates = ['pending', 'paid', 'failed', 'cancelled', 'expired', 'creating_payment', 'unknown'];
  const payment = paymentStates.includes(params.get('payment')) ? params.get('payment') : 'pending';
  usePageSeo({ title: 'Development visual preview | INVESG', description: 'Isolated visual fixtures. No transactions or account sessions.', canonicalPath: '/__preview', robots: 'noindex,nofollow' });
  const update = (key, value) => { const next = new URLSearchParams(params); next.set(key, value); setParams(next); };
  const specimen = previewArticles.find(article => article.slug === params.get("specimen")) || previewArticles[0];
  let page;
  if (screen === 'home') page = <HomePage />;
  else if (screen === 'solutions') page = <SolutionsFinderPage />;
  else if (screen === 'contact') page = <ContactPage />;
  else if (screen === 'loading') page = <LoadingPreview />;
  else if (screen === 'insights') page = <InsightsPage previewData={{ articles: state === 'empty' ? [] : previewArticles, spotlight: state === 'empty' ? [] : previewSpotlight, loading: state === 'loading', error: state === 'error' ? new Error('Preview') : null, retry: () => update('state', 'filled') }} />;
  else if (screen === 'article') page = <main className="insights-page article-page--finished"><Navbar activeNavItem="Insights" /><ArticleDetail article={{ ...previewArticle, ...specimen }} author={previewAuthor} relatedInsights={previewArticles.filter(article => article.slug !== specimen.slug).slice(0, 3)} /><SiteFooter /></main>;
  else if (screen === 'books') page = <BooksPage />;
  else if (screen === 'book') page = <BookDetailPage previewSlug="esg-is-a-lens" />;
  else if (['login', 'signup', 'recovery', 'reset'].includes(screen)) page = <AuthFormLayout title={{ login: 'Welcome back.', signup: 'Create your free account', recovery: 'Recover your account', reset: 'Reset your password' }[screen]} description="Development form preview" canonicalPath="/__preview"><p>Explore knowledge. Build your perspective.</p><AuthForm key={`${screen}-${state}`} preview previewError={state === 'validation' || state === 'error'} signup={screen === 'signup'} recovery={screen === 'recovery'} reset={screen === 'reset'} /></AuthFormLayout>;
  else if (screen === 'verify') page = <VerifyEmailPage preview />;
  else if (screen === 'checkout') page = <CheckoutPage preview previewSlug="esg-is-a-lens" />;
  else if (screen === 'payment') page = <main className="insights-page commerce-page"><Navbar activeNavItem="" /><div className="insights-shell commerce-shell"><header className="commerce-heading"><span>Visual specimen · not an order</span><h1>Payment Status</h1></header><section className={`order-status-card payment-state-${payment}`}><PaymentStatusContent status={payment} /><p className="preview-payment-warning">Preview state only. No payment has been verified and no download entitlement exists.</p><a href="/__preview?screen=checkout">Back to checkout preview</a></section></div><SiteFooter /></main>;
  else if (screen === 'library') page = <LibraryPage previewItems={state === 'empty' ? { books: [], saved: [], pdfs: [] } : previewLibrary} previewState={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'ready'} />;
  else page = <AccountSettingsPage preview />;
  return <MemberSessionContext.Provider value={{status:'guest',profile:null,revision:-1}}><div className="visual-preview-root">{!embedded && <aside className="preview-toolbar" aria-label="Development preview controls"><div><strong>Development preview</strong><span>Isolated fixtures · no session, payment, or entitlement</span></div><label>Page<select value={screen} onChange={event => update('screen', event.target.value)}>{screens.map(name => <option key={name}>{name}</option>)}</select></label><label>Visual state<select value={state} onChange={event => update('state', event.target.value)}>{states.map(name => <option key={name}>{name}</option>)}</select></label>{screen === 'payment' && <label>Payment specimen<select value={payment} onChange={event => update('payment', event.target.value)}>{paymentStates.map(name => <option key={name}>{name}</option>)}</select></label>}<label>Viewport<select value={device} onChange={event => update("device", event.target.value)}>{Object.entries(devices).map(([name, width]) => <option key={name} value={name}>{name}{width ? ` ? ${width}px` : ""}</option>)}</select></label><a href="/insights">Exit preview</a></aside>}{embedded && <div className="preview-embedded-note">DEVELOPMENT PREVIEW ? No real account, payment, or entitlement</div>}{['home', 'solutions'].includes(screen) && <div className="preview-art-note">HERO REVIEW: These artworks are active on the Homepage and Solutions routes.</div>}{!embedded && devices[device] ? <div className="preview-device-stage"><iframe title={`${screen} visual preview at ${devices[device]} pixels`} src={`/__preview?${frameParams}`} style={{ width: devices[device], height: 900 }} /></div> : page}</div></MemberSessionContext.Provider>;
}

function LoadingPreview() {
  const [loading, setLoading] = React.useState(true);
  return <><ContactPage /><BrandLoadingOverlay loading={loading} /><div className="preview-loader-controls"><span>Development: real readiness controls the exit in production.</span><button type="button" onClick={() => setLoading(current => !current)}>{loading ? 'Simulate application ready' : 'Replay loading preview'}</button></div></>;
}
