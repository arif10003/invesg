import { requestJson, guestOrderToken, rememberGuestOrder, safePaymentUrl } from './client.js';
export const commerceAvailability = Object.freeze({ checkout: true, orderLookup: true, memberPricing: true, downloads: true });
export function isOrderReference(value) { return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(value); }
export async function loadOrderStatus(orderId, { signal } = {}) {
  signal?.throwIfAborted();
  if (!isOrderReference(orderId)) return { kind: 'invalid' };
  try { const result = await requestJson(`/api/v1/orders/${encodeURIComponent(orderId)}`, { signal, guestToken: guestOrderToken(orderId) }); return { kind: 'ready', order: result.data }; }
  catch (error) { if (error.name === 'AbortError') throw error; return { kind: error.status === 404 || error.status === 401 ? 'unauthorized' : 'unavailable' }; }
}
export const quoteOrder = (values, { signal } = {}) => requestJson('/api/v1/checkout/quotes', { method: 'POST', body: values, signal });
export async function createOrder(quote, key) {
  const result = await requestJson('/api/v1/orders', { method: 'POST', idempotencyKey: key, body: { quote_id: quote.id, terms_version: quote.terms_version, accept_terms: true } });
  if (result.guest_order_token) rememberGuestOrder(result.data.id, result.guest_order_token);
  return result;
}
export async function startPayment(id) { const result = await requestJson(`/api/v1/orders/${encodeURIComponent(id)}/payment`, { method: 'POST', guestToken: guestOrderToken(id) }); return safePaymentUrl(result.data.url); }

// Presentation only. This function must receive an authorized server response,
// never search parameters, local storage, a Snap callback or a client-set flag.
export function paymentPresentation(status) {
  const states = {
    free_completed: ['Your e-book is ready', 'Your free redemption is complete. Open My Library or your secure access email to read the book.'],
    charged_back: ['Payment charged back', 'Access has been revoked following a verified chargeback.'],
    partially_charged_back: ['Partial chargeback', 'Digital access is suspended pending commerce review.'],
    draft: ['Order created', 'Payment has not yet been verified.'],
    pending: ['Payment pending', 'Your payment has not yet been confirmed. Digital access is not available while payment is pending.'],
    creating_payment: ['Payment is being reconciled', 'The payment request needs confirmation. Do not start a second payment. Check again later or contact INVESG with your order reference.'],
    paid: ['Payment confirmed', 'Payment has been verified. Digital access is provided separately after your purchase entitlement has been checked.'],
    failed: ['Payment failed', 'This payment was not completed. No digital access has been granted. Check the order before attempting another payment.'],
    cancelled: ['Payment cancelled', 'This payment was cancelled. No digital access has been granted.'],
    expired: ['Payment expired', 'The payment window has expired. No digital access has been granted.'],
    refunded: ['Payment refunded', 'This payment has been refunded. Digital access depends on the current entitlement for this purchase.'],
    partially_refunded: ['Payment partially refunded', 'The order has a partial refund. Contact INVESG for the current purchase and access details.'],
  };
  const [title, description] = (Object.hasOwn(states, status) ? states[status] : null) || ['Payment status unavailable', 'We cannot verify the current payment status. A return from the payment provider does not confirm payment or grant digital access.'];
  return { title, description };
}
