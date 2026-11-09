import { useMemberSession } from './context/MemberSessionContext';
import InternalNavigation from './components/InternalNavigation';
import GuestAccessPage from './pages/GuestAccessPage';
import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { BrandLoadingOverlay } from './components/BrandLoading';

const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const InsightsPage = React.lazy(() => import("./pages/InsightsPage"));
const LibraryPage = React.lazy(() => import("./pages/account/LibraryPage"));
const AccountSettingsPage = React.lazy(() => import("./pages/account/AccountSettingsPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const OrderStatusPage = React.lazy(() => import("./pages/OrderStatusPage"));
const BooksPage = React.lazy(() => import("./pages/BooksPage"));
const BookDetailPage = React.lazy(() => import("./pages/BookDetailPage"));
const InsightArticlePage = React.lazy(() => import("./pages/InsightArticlePage"));
const InsightArchivePage = React.lazy(() => import("./pages/InsightArchivePage"));
const InsightAuthorPage = React.lazy(() => import("./pages/InsightAuthorPage"));
const InsightMediaPage = React.lazy(() => import("./pages/InsightMediaPage"));
const SolutionsFinderPage = React.lazy(() => import("./pages/SolutionsFinderPage"));
const IntelligencePreviewPage = React.lazy(() => import("./pages/IntelligencePreviewPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const AcademyPage = React.lazy(() => import('./pages/academy/AcademyPage'));
const AcademyProgramsPage = React.lazy(() => import('./pages/academy/AcademyProgramsPage'));
const AcademyProgramDetailPage = React.lazy(() => import('./pages/academy/AcademyProgramDetailPage'));
const AcademyCorporatePage = React.lazy(() => import('./pages/academy/AcademyCorporatePage'));
const AcademyApproachPage = React.lazy(() => import('./pages/academy/AcademyApproachPage'));
const JoinUsPage = React.lazy(() => import('./pages/join/JoinUsPage'));
const CareersPage = React.lazy(() => import('./pages/join/CareersPage'));
const CollaborationPage = React.lazy(() => import('./pages/join/CollaborationPage'));
const LearningLabPage = React.lazy(() => import('./pages/join/LearningLabPage'));
const ResearchEditorialPage = React.lazy(() => import('./pages/join/ResearchEditorialPage'));
const LearningLabApplyPage = React.lazy(() => import('./pages/join/LearningLabApplyPage'));

const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/auth/SignupPage"));
const RecoveryPage = React.lazy(() => import("./pages/auth/RecoveryPage"));
const ResetPasswordPage = React.lazy(() => import("./pages/auth/ResetPasswordPage"));
const VerifyEmailPage = React.lazy(() => import("./pages/auth/VerifyEmailPage"));

const VisualPreviewPage = import.meta.env.DEV ? React.lazy(() => import("./dev/VisualPreviewPage")) : null;

function LegacyRoute({ to, book = false }) {
  const { search, hash } = useLocation();
  const { slug } = useParams();
  return <Navigate replace to={`${to}${book && slug ? `/${encodeURIComponent(slug)}` : ''}${search}${hash}`} />;
}

function RoutePosition() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    // Lazy routes may mount after this effect. Observe only until the destination mounts.
    const position = () => {
      const main = document.querySelector('main');
      if (!main) return false;
      if (main && !main.id) main.id = 'page-content';
      main.tabIndex = -1;
      if (hash) {
        let target = hash.slice(1);
        try { target = decodeURIComponent(target); } catch { /* Use the literal fragment. */ }
        document.getElementById(target)?.scrollIntoView();
      } else main.focus({ preventScroll: true });
      return true;
    };
    let observer;
    const frame = requestAnimationFrame(() => {
      if (position()) return;
      observer = new MutationObserver(() => { if (position()) observer.disconnect(); });
      observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    });
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [pathname, hash]);
  return null;
}

function ApplicationReady({ onReady }) {
  React.useLayoutEffect(() => { onReady(); }, [onReady]);
  return null;
}

export default function App() {
  const session = useMemberSession();
  const [ready, setReady] = React.useState(false);
  const markReady = React.useCallback(() => setReady(true), []);
  return <BrowserRouter><InternalNavigation /><RoutePosition /><BrandLoadingOverlay loading={!ready} /><React.Suspense fallback={ready ? <div className="route-pending" role="status">Loading page…</div> : null}><ApplicationReady onReady={markReady} /><Routes key={session.profile?.id ?? 'guest'}>
    {import.meta.env.DEV && <Route path="/__preview" element={<VisualPreviewPage />} />}
    <Route path="/" element={<HomePage />} />
    <Route path="/library" element={<LegacyRoute to="/account/library" />} />
    <Route path="/account" element={<LegacyRoute to="/account/settings" />} />
    <Route path="/register" element={<LegacyRoute to="/signup" />} />
    <Route path="/books" element={<LegacyRoute to="/insights/books" />} />
    <Route path="/books/:slug" element={<LegacyRoute to="/insights/books" book />} />
    <Route path="/checkout" element={<LegacyRoute to="/insights/books" />} />
    <Route path="/access" element={<GuestAccessPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/account/library" element={<LibraryPage />} />
    <Route path="/account/settings" element={<AccountSettingsPage />} />
    <Route path="/checkout/:productSlug" element={<CheckoutPage />} />
    <Route path="/orders/:orderId/status" element={<OrderStatusPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/account/recovery" element={<RecoveryPage />} />
    <Route path="/account/reset-password" element={<ResetPasswordPage />} />
    <Route path="/account/verify-email" element={<VerifyEmailPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/academy" element={<AcademyPage />} />
    <Route path="/academy/programs" element={<AcademyProgramsPage />} />
    <Route path="/academy/programs/:slug" element={<AcademyProgramDetailPage />} />
    <Route path="/academy/corporate" element={<AcademyCorporatePage />} />
    <Route path="/academy/approach" element={<AcademyApproachPage />} />
    <Route path="/join-us" element={<JoinUsPage />} />
    <Route path="/join-us/careers" element={<CareersPage />} />
    <Route path="/join-us/collaboration" element={<CollaborationPage />} />
    <Route path="/join-us/learning-lab" element={<LearningLabPage />} />
    <Route path="/join-us/learning-lab/research-editorial" element={<ResearchEditorialPage />} />
    <Route path="/join-us/learning-lab/apply" element={<LearningLabApplyPage />} />
    <Route path="/solutions" element={<SolutionsFinderPage />} />
    <Route path="/solutions/explore" element={<Navigate to="/solutions" replace />} />
    <Route path="/insights" element={<InsightsPage />} />
    <Route path="/insights/media" element={<InsightMediaPage />} />
    <Route path="/insights/topics/:slug" element={<InsightArchivePage kind="topics" />} />
    <Route path="/insights/sectors/:slug" element={<InsightArchivePage kind="sectors" />} />
    <Route path="/insights/authors/:slug" element={<InsightAuthorPage />} />
    <Route path="/insights/books" element={<BooksPage />} />
    <Route path="/insights/books/:slug" element={<BookDetailPage />} />
    <Route path="/insights/:slug" element={<InsightArticlePage />} />

    <Route path="/sustainability" element={<IntelligencePreviewPage type="sustainability" />} />
    <Route path="/sustainability/issues/:slug" element={<Navigate to="/sustainability" replace />} />
    <Route path="/sustainability/:region" element={<Navigate to="/sustainability" replace />} />
    <Route path="/opportunity" element={<IntelligencePreviewPage type="opportunity" />} />
    <Route path="/opportunities" element={<Navigate to="/opportunity" replace />} />
    <Route path="/opportunities/:slug" element={<Navigate to="/opportunity" replace />} />
    <Route path="/opportunity/:region" element={<Navigate to="/opportunity" replace />} />
    <Route path="/decision-navigator" element={<Navigate to="/solutions" replace />} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes></React.Suspense></BrowserRouter>;
}
