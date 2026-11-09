import { getBook, bookPrice } from '../api/books';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BookCover from '../components/books/BookCover';
import { useBooks } from '../hooks/useBooks';
import { useMemberSession } from '../context/MemberSessionContext';
import { quoteOrder, createOrder, startPayment } from '../api/orders';
import { guestOrderToken } from '../api/client';
import { usePageSeo } from '../utils/seo';
import '../styles/insights.css';
import '../styles/books.css';
import '../styles/commerce.css';
import '../styles/mvp-visual.css';
import '../styles/visual-sprint.css';

function money(value, currency = 'IDR') {
  if (value === 0) return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(0);
  return bookPrice({ price: value, currency }) || 'Not available';
}
function pricingSignature(value) {
  return JSON.stringify([value?.base_amount, value?.discount_amount, value?.total_amount, value?.currency, value?.terms_version, value?.promotion?.code || null]);
}
function checkoutMessage(error) {
  if (error?.status >= 500) return 'Checkout is temporarily unavailable. Please try again to check this same request before starting another purchase.';
  if (error?.status === 409) return 'Pricing, availability or promotion eligibility changed. Please review your order and try again.';
  const message = Object.values(error?.errors || {}).flat().join(' ') || error?.message || 'Checkout could not be completed. Please try again.';
  return /quote|idempotency|token/i.test(message) ? 'Your checkout details changed or expired. Please review your total and try again.' : message;
}
function validCustomer(name, email) {
  return name.trim().length >= 2 && name.trim().length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length <= 200;
}
function validPricing(value) {
  return value?.id && Number.isSafeInteger(value.total_amount) && value.total_amount >= 0 && Number.isSafeInteger(value.base_amount) && Number.isSafeInteger(value.discount_amount) && (value.total_amount !== 0 || value.completion_kind === 'free');
}
export function CheckoutSummary({ book, quote, preview = false, loading = false, children }) {
  const currency = quote?.currency || book.commerce?.currency || 'IDR';
  return <section className="checkout-summary" aria-busy={loading} aria-labelledby="checkout-summary-heading">
    <h2 id="checkout-summary-heading">Order Summary</h2>
    <div className="checkout-book"><BookCover book={book} /><div><h3>{book.title}</h3><p>By {book.author}</p><p>Digital PDF</p></div></div>
    <dl><div><dt>Price</dt><dd>{preview ? 'Preview amount' : money(quote?.base_amount ?? book.commerce?.price, currency)}</dd></div>
      <div><dt>Discount</dt><dd>{money(quote?.discount_amount ?? 0, currency)}</dd></div>
      <div className="checkout-total"><dt>Total</dt><dd>{preview ? 'Preview amount' : money(quote?.total_amount ?? book.commerce?.price, currency)}</dd></div></dl>
    {quote?.promotion && <p className="checkout-applied-promo"><CheckCircle2 aria-hidden="true" />Applied: <strong>{quote.promotion.code}</strong></p>}
    <p className="commerce-small" role="status" aria-live="polite">{loading ? 'Updating your total...' : !quote && !preview ? 'Enter your details to confirm your final total.' : 'Digital edition / PDF.'}</p>
    {children}
  </section>;
}
export function CheckoutConfirmation({ order }) {
  return <section className="checkout-confirmation" aria-labelledby="checkout-confirmation-title">
    <CheckCircle2 aria-hidden="true" /><h2 id="checkout-confirmation-title">Your e-book is ready</h2>
    <p>Your free redemption is complete. You can find this book in My Library.</p>
    <p>A confirmation email with secure access instructions has been queued for your verified email address.</p>
    <p className="commerce-small">Order reference: {order.id}</p>
    <a className="commerce-primary" href="/account/library">Open My Library</a><a className="commerce-secondary" href="/access">Secure email access</a>
  </section>;
}
export default function CheckoutPage({ preview: requestedPreview = false, previewSlug }) {
  const preview = import.meta.env.DEV && requestedPreview;
  const { productSlug: routeSlug } = useParams();
  const productSlug = preview ? previewSlug : routeSlug;
  const live = useBooks(productSlug, { enabled: !preview });
  const { book, loading, error } = preview ? { book: getBook(productSlug), loading: false, error: null } : live;
  const session = useMemberSession();
  const [customer, setCustomer] = React.useState(session.profile?.name || '');
  const [email, setEmail] = React.useState(session.profile?.email || '');
  const [quoteInfo, setQuoteInfo] = React.useState(null);
  const [pricingBusy, setPricingBusy] = React.useState(false);
  const [pricingError, setPricingError] = React.useState('');
  const [pricingVersion, setPricingVersion] = React.useState(0);
  const [promoInput, setPromoInput] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState('');
  const [promoMessage, setPromoMessage] = React.useState('');
  const [promoBusy, setPromoBusy] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [paymentUrl, setPaymentUrl] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [attemptLocked, setAttemptLocked] = React.useState(false);
  const formId = React.useId();
  const inFlight = React.useRef(false);
  const attempt = React.useRef({ key: null, quote: null });
  const pricingRequest = React.useRef({ sequence: 0, controller: null });
  const pricingTimer = React.useRef(null);
  const mounted = React.useRef(true);
  const latestVisible = React.useRef(null);
  const normalizedEmail = email.trim().toLowerCase();
  const fingerprint = JSON.stringify([book?.id, session.profile?.id || null, Boolean(session.profile?.email_verified_at), customer.trim(), normalizedEmail, appliedPromo]);
  const quote = quoteInfo?.fingerprint === fingerprint ? quoteInfo.value : null;
  latestVisible.current = quote;
  const free = quote?.completion_kind === 'free' && quote.total_amount === 0;
  const requiresVerification = Boolean(quote?.requires_verified_customer) || (free && !(session.status === 'authenticated' && session.profile?.email_verified_at));
  const locked = busy || promoBusy || Boolean(order) || attemptLocked;
  const returnTo = `/checkout/${encodeURIComponent(productSlug || '')}`;
  const authSearch = new URLSearchParams({ returnTo });

  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; pricingRequest.current.controller?.abort(); }; }, []);
  React.useEffect(() => {
    setCustomer(session.profile?.name || ''); setEmail(session.profile?.email || ''); setQuoteInfo(null);
    setOrder(null); setPaymentUrl(''); setAppliedPromo(''); setPromoInput(''); setPromoMessage(''); setFeedback(''); setAccepted(false); setAttemptLocked(false);
    attempt.current = { key: null, quote: null };
  }, [productSlug, session.profile?.id]);
  React.useEffect(() => { setAccepted(false); }, [fingerprint]);

  const requestPricing = React.useCallback(async (values, scope, commit = true) => {
    pricingRequest.current.controller?.abort();
    const controller = new AbortController();
    const sequence = ++pricingRequest.current.sequence;
    pricingRequest.current.controller = controller;
    setPricingBusy(true);
    try {
      const result = await quoteOrder(values, { signal: controller.signal });
      if (!mounted.current || sequence !== pricingRequest.current.sequence) throw new DOMException('Superseded', 'AbortError');
      if (!validPricing(result.data)) throw new Error('Your total could not be confirmed. Please try again.');
      if (commit) {
        if (latestVisible.current && pricingSignature(latestVisible.current) !== pricingSignature(result.data)) setAccepted(false);
        setQuoteInfo({ fingerprint: scope, value: result.data });
      }
      return result.data;
    } finally {
      if (mounted.current && sequence === pricingRequest.current.sequence) setPricingBusy(false);
    }
  }, []);
  React.useEffect(() => {
    if (preview || !book?.canPurchase || order || attemptLocked) return;
    if (!validCustomer(customer, email)) {
      pricingRequest.current.controller?.abort(); pricingRequest.current.sequence++;
      setQuoteInfo(null); setPricingBusy(false); setPricingError(''); return;
    }
    if (quote && Date.parse(quote.expires_at) > Date.now() + 60000) return;
    setPricingError('');
    const timer = setTimeout(() => {
      requestPricing({ product_id: book.id, customer: customer.trim(), email: normalizedEmail, source: 'website', ...(appliedPromo ? { promo_code: appliedPromo } : {}) }, fingerprint)
        .catch(failure => { if (failure.name !== 'AbortError' && mounted.current) setPricingError(checkoutMessage(failure)); });
    }, 350);
    pricingTimer.current = timer;
    return () => { clearTimeout(timer); pricingRequest.current.controller?.abort(); };
  }, [fingerprint, pricingVersion, book?.canPurchase, preview, order, attemptLocked, requestPricing]);
  React.useEffect(() => {
    if (!quote?.expires_at || order || attemptLocked) return;
    const timer = setTimeout(() => setPricingVersion(value => value + 1), Math.max(1000, Date.parse(quote.expires_at) - Date.now() - 30000));
    return () => clearTimeout(timer);
  }, [quote?.expires_at, order, attemptLocked]);

  usePageSeo({ title: 'Checkout | INVESG', description: 'Secure digital publication checkout.', canonicalPath: returnTo, robots: 'noindex,nofollow' });

  async function applyPromo() {
    if (preview) { setPromoMessage('Preview only. No code was submitted.'); return; }
    if (locked) return;
    if (!validCustomer(customer, email)) { setPromoMessage('Enter your name and email before applying a code.'); return; }
    const candidate = promoInput.trim().toUpperCase();
    if (!candidate) { setPromoMessage('Enter a promo code.'); return; }
    clearTimeout(pricingTimer.current);
    setPromoBusy(true); setPromoMessage(''); setAccepted(false);
    const scope = JSON.stringify([book.id, session.profile?.id || null, Boolean(session.profile?.email_verified_at), customer.trim(), normalizedEmail, candidate]);
    try {
      const next = await requestPricing({ product_id: book.id, customer: customer.trim(), email: normalizedEmail, source: 'website', promo_code: candidate }, scope, false);
      if (!next.promotion?.code) throw new Error('That promotion could not be applied. Please try again.');
      const confirmedScope = JSON.stringify([book.id, session.profile?.id || null, Boolean(session.profile?.email_verified_at), customer.trim(), normalizedEmail, next.promotion.code]);
      setAppliedPromo(next.promotion.code); setPromoInput(next.promotion.code); setQuoteInfo({ fingerprint: confirmedScope, value: next });
      setPromoMessage('Promo code applied.'); setPricingError('');
    } catch (failure) { if (failure.name !== 'AbortError') setPromoMessage(checkoutMessage(failure)); }
    finally { if (mounted.current) setPromoBusy(false); }
  }
  function removePromo() {
    if (locked) return;
    setAppliedPromo(''); setPromoInput(''); setPromoMessage('Promo code removed.'); setQuoteInfo(null); setAccepted(false); setPricingVersion(value => value + 1);
  }
  function closePaymentWindow(handle) { try { if (handle && !handle.closed) handle.close(); } catch { /* The fallback link remains available. */ } }
  async function submit(event) {
    event.preventDefault();
    if (preview) { setFeedback('Preview only. No order or payment was created.'); return; }
    if (inFlight.current || !book || !book.canPurchase) return;
    if (!validCustomer(customer, email) || !accepted) { setFeedback('Enter your details and accept the purchase terms before continuing.'); return; }
    if (requiresVerification) { setFeedback('Sign in and verify your purchase email to use this promotion.'); return; }
    if (!quote && !attempt.current.quote && !order) { setFeedback('Please wait for your total to update, then try again.'); setPricingVersion(value => value + 1); return; }
    inFlight.current = true; setBusy(true); setFeedback('');
    let paymentWindow = null;
    if ((order?.total ?? attempt.current.quote?.total_amount ?? quote?.total_amount) > 0) {
      try { paymentWindow = window.open('about:blank', '_blank'); if (paymentWindow) paymentWindow.opener = null; } catch { paymentWindow = null; }
    }
    try {
      let current = order;
      if (!current) {
        if (!attempt.current.quote) {
          const fresh = await requestPricing({ product_id: book.id, customer: customer.trim(), email: normalizedEmail, source: 'website', ...(appliedPromo ? { promo_code: appliedPromo } : {}) }, fingerprint);
          if (pricingSignature(fresh) !== pricingSignature(quote)) {
            closePaymentWindow(paymentWindow); setAccepted(false); setFeedback('Your total changed. Review the updated order and accept the terms again before continuing.'); return;
          }
          if (fresh.requires_verified_customer) { closePaymentWindow(paymentWindow); setFeedback('Sign in and verify your purchase email to use this promotion.'); return; }
          attempt.current = { key: crypto.randomUUID(), quote: fresh };
        }
        setAttemptLocked(true);
        const result = await createOrder(attempt.current.quote, attempt.current.key);
        if (!mounted.current) { closePaymentWindow(paymentWindow); return; }
        current = result.data; setOrder(current);
      }
      if (current.status === 'free_completed') { closePaymentWindow(paymentWindow); return; }
      if (!(current.total > 0)) throw new Error('Your order needs confirmation. Please check its status before continuing.');
      const url = await startPayment(current.id);
      if (!mounted.current) { closePaymentWindow(paymentWindow); return; }
      setPaymentUrl(url);
      try { if (paymentWindow && !paymentWindow.closed) paymentWindow.location.replace(url); } catch { closePaymentWindow(paymentWindow); }
      setFeedback('Your secure payment link is ready. After payment, return to this tab and check your order status.');
    } catch (failure) {
      closePaymentWindow(paymentWindow);
      if ([403, 404, 409, 410, 422].includes(failure.status) && !order) { attempt.current = { key: null, quote: null }; setAttemptLocked(false); setQuoteInfo(null); setAccepted(false); setPricingVersion(value => value + 1); }
      if (failure.name !== 'AbortError') setFeedback(checkoutMessage(failure));
    } finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  const statusHref = order ? `/orders/${encodeURIComponent(order.id)}/status${guestOrderToken(order.id) ? '#guest_order=' + guestOrderToken(order.id) : ''}` : '';
  const completedFree = order?.status === 'free_completed';
  const paidCheckoutUnavailable = book?.paid_checkout_available === false && !free && !order;
  const canSubmit = !busy && !promoBusy && !paidCheckoutUnavailable && Boolean(book?.canPurchase) && !requiresVerification && Boolean(order || attempt.current.quote || (quote && !pricingBusy));
  return <main className="insights-page commerce-page"><Navbar activeNavItem="Insights" />
    <div className="insights-shell commerce-shell"><nav className="commerce-breadcrumb" aria-label="Breadcrumb"><a href="/insights/books">Books &amp; Publications</a><span>/</span>Checkout</nav>
      <header className="commerce-heading"><span>Digital publications</span><h1>Checkout</h1><p>Registration is not required for guest purchases.</p></header>
      {loading ? <p role="status">Loading publication...</p> : error ? <p role="alert">The book catalog could not be loaded. Please try again later.</p> : !book ? <section className="commerce-notice"><h2>Publication unavailable</h2><a href="/insights/books">Browse publications</a></section> : completedFree ? <CheckoutConfirmation order={order} /> :
        <div className="checkout-layout checkout-layout--phase2">
          <section className="checkout-details"><form id={formId} onSubmit={submit}>
            <h2>Customer Information</h2>
            {session.status !== 'authenticated' && <p className="checkout-signin">Already a member? <a href={`/login?${authSearch}`}>Log in</a></p>}
            <fieldset disabled={locked || (!preview && !book.canPurchase)}><legend className="sr-only">Customer details</legend>
              <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200} value={email} readOnly={session.status === 'authenticated'} onChange={event => setEmail(event.target.value)} /></label>
              <label>Full name<input name="customer" autoComplete="name" minLength={2} maxLength={200} required value={customer} onChange={event => setCustomer(event.target.value)} /></label>
            </fieldset>
            <details className="checkout-promo"><summary>Have a promo code?</summary><div className="checkout-promo-content">
              <label htmlFor={`${formId}-promo`}>Promo code</label><div className="checkout-promo-controls"><input id={`${formId}-promo`} name="promo_code" maxLength={60} autoComplete="off" spellCheck={false} value={promoInput} disabled={locked || (!preview && !book.canPurchase)} onChange={event => { setPromoInput(event.target.value); setPromoMessage(''); }} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); applyPromo(); } }} /><button className="commerce-secondary" type="button" disabled={locked || (!preview && !book.canPurchase)} onClick={applyPromo}>{promoBusy ? 'Applying...' : 'Apply'}</button></div>
              {appliedPromo && <button type="button" className="checkout-remove-promo" disabled={locked} onClick={removePromo}>Remove promo</button>}
              <p className="checkout-promo-feedback" role="status" aria-live="polite">{promoMessage}</p>
            </div></details>
            {requiresVerification && <div className="commerce-notice checkout-verification"><h3>Verify your purchase email</h3><p>This promotion requires a verified email address. Sign in or create an account, verify your email, then return to checkout to use your code.</p>{session.status !== 'authenticated' ? <div><a href={`/login?${authSearch}`}>Log in</a><a href={`/signup?${authSearch}`}>Create an account</a></div> : <a href={`/account/verify-email?${authSearch}`}>Verify email</a>}<p>You can remove the promotion to continue with standard guest checkout.</p></div>}
            <label className="checkout-consent"><input type="checkbox" required checked={accepted} disabled={busy || Boolean(order) || attemptLocked} onChange={event => setAccepted(event.target.checked)} /><span>I accept the purchase terms and digital delivery policy.</span></label>
            <p className="commerce-small">Digital edition / PDF. A secure access email is provided after confirmed payment or eligible free redemption.</p>
            <div className="checkout-security"><ShieldCheck aria-hidden="true" /><p>Secure checkout. Paid orders are processed by Midtrans.</p></div>
            <a className="commerce-back" href="/access">Recover purchase access by email</a>
          </form></section>
          <CheckoutSummary book={book} quote={quote} preview={preview} loading={pricingBusy}>
            {pricingError && <div className="checkout-pricing-error"><p role="alert">{pricingError}</p><button type="button" className="commerce-secondary" disabled={busy || pricingBusy} onClick={() => setPricingVersion(value => value + 1)}>Try again</button></div>}
            <p className="checkout-feedback" role="status" aria-live="polite">{feedback}</p>
            {paymentUrl ? <a className="commerce-primary" href={paymentUrl} target="_blank" rel="noopener noreferrer">Open secure payment</a> : <button className="commerce-primary" form={formId} disabled={!preview && !canSubmit} type="submit">{busy ? 'Please wait...' : free ? 'Redeem for Free' : 'Pay Now'}</button>}
            {order && <div className="checkout-order-reference"><p>Order reference: {order.id}</p><a className="commerce-secondary" href={statusHref}>Check payment status</a></div>}
            {paidCheckoutUnavailable && <p>Paid checkout is currently unavailable. You can still apply a promo code.</p>}
            {!book.canPurchase && <p>This title is not available for purchase yet.</p>}
          </CheckoutSummary>
        </div>}
    </div><SiteFooter />
  </main>;
}
