import React from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import { rememberGuestOrder } from '../api/client';
import { loadOrderStatus, paymentPresentation } from '../api/orders';
import { usePageSeo } from '../utils/seo';
import '../styles/insights.css';
import '../styles/commerce.css';
import '../styles/mvp-visual.css';
import '../styles/visual-sprint.css';

// Receives authorized backend data only. No URL-driven success or access links.
export function PaymentStatusContent({ status }) {
  const presentation = paymentPresentation(status);
  return <><h2>{presentation.title}</h2><p>{presentation.description}</p></>;
}

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const [attempt, refresh] = React.useReducer(value => value + 1, 0);
  const [state, setState] = React.useState({ kind: 'loading' });
  usePageSeo({ title: 'Payment Status | INVESG', description: 'Check the availability of your INVESG payment status.', canonicalPath: `/orders/${encodeURIComponent(orderId)}/status`, robots: 'noindex,nofollow' });
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    rememberGuestOrder(orderId, params.get('guest_order'));
    const controller = new AbortController();
    setState({ kind: 'loading' });
    loadOrderStatus(orderId, { signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setState(result);
    }).catch(() => { if (!controller.signal.aborted) setState({ kind: 'unavailable' }); });
    return () => controller.abort();
  }, [orderId, attempt]);
  return <main className="insights-page commerce-page"><Navbar activeNavItem="" /><div className="insights-shell commerce-shell"><nav className="commerce-breadcrumb" aria-label="Breadcrumb"><a href="/insights/books">Books &amp; Publications</a><span>/</span><span aria-current="page">Payment Status</span></nav><header className="commerce-heading"><span>Order information</span><h1>Payment Status</h1></header><section className="order-status-card" aria-busy={state.kind === 'loading'}><ShieldCheck aria-hidden="true" /><div role="status" aria-live="polite">{state.kind === 'loading' ? <p>Checking status availability…</p> : state.kind === 'invalid' ? <><h2>Invalid order reference</h2><p>This order reference cannot be checked. Use the original order link or contact INVESG.</p></> : state.kind === 'ready' ? <><PaymentStatusContent status={state.order.status}/><p>Order: {state.order.id}</p><p>Digital access: {state.order.access_status}</p><a href="/account/library">Open My Library</a><br/><a href="/access">Recover secure email access</a></> : <><PaymentStatusContent/><p>{state.kind === 'unauthorized' ? 'Sign in as the purchaser or use your original authorized order link. An order reference alone does not permit access.' : 'The order status could not be retrieved. Check again later.'}</p><a href="/login">Log in</a><p>If you have already paid, retain your receipt and contact INVESG before paying again.</p></>}</div><button className="commerce-secondary" type="button" disabled={state.kind === 'loading' || state.kind === 'invalid'} onClick={refresh}><RefreshCw aria-hidden="true" /> Check again</button><p className="commerce-small">This page does not create or retry a payment. Guest access and member Library access will require separate verified purchase authorization.</p><div className="order-status-links"><a href="/contact?source=contact">Contact INVESG</a><a href="/insights/books">Browse publications</a></div></section></div><SiteFooter /></main>;
}
