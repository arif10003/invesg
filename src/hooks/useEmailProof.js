import React from 'react';
// Capture sensitive fragments once and remove them from the visible URL immediately.
// Confirmation requires a deliberate click, preventing StrictMode/token replay.
export function useEmailProof() {
  const proof = React.useRef(null);
  React.useEffect(() => {
    if (proof.current !== null) return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    proof.current = { token: params.get('token') || query.get('token') || '', email: params.get('email') || query.get('email') || '' };
    const hasProof = query.has('token') || query.has('email');
    query.delete('token'); query.delete('email');
    if (window.location.hash || hasProof) window.history.replaceState(window.history.state, '', window.location.pathname + (query.size ? `?${query}` : ''));
  }, []);
  return proof;
}
