import React from 'react';
import BrandLogo from './BrandLogo';

export default function BrandLoading({ exiting = false, onTransitionEnd }) {
  return <div className="brand-loading" data-phase={exiting ? 'exiting' : 'loading'} role="status" aria-live="polite" aria-label="Loading INVESG" aria-hidden={exiting || undefined} onTransitionEnd={onTransitionEnd}><div className="brand-loading-lockup"><BrandLogo placement="loading" /><span className="brand-loading-rule" aria-hidden="true" /><span className="brand-loading-signature">ESG IS A LENS</span><span className="brand-loading-dots" aria-hidden="true"><span /><span /><span /></span></div></div>;
}

// Remain mounted for the exit transition while the ready page is already usable.
export function BrandLoadingOverlay({ loading }) {
  const [visible, setVisible] = React.useState(loading);
  React.useEffect(() => {
    if (loading) { setVisible(true); return; }
    if (!visible) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Backstop also removes the overlay if transitionend is interrupted or missing.
    const timer = window.setTimeout(() => setVisible(false), reduced ? 0 : 550);
    return () => window.clearTimeout(timer);
  }, [loading, visible]);
  if (!visible) return null;
  return <BrandLoading exiting={!loading} onTransitionEnd={event => {
    if (!loading && event.target === event.currentTarget && event.propertyName === 'opacity') setVisible(false);
  }} />;
}
