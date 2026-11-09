import React from 'react';
import { useNavigate } from 'react-router-dom';
// Keep ordinary internal anchors in the SPA so in-memory JWT identity survives navigation.
export default function InternalNavigation() {
  const navigate = useNavigate();
  React.useEffect(() => {
    function click(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const raw = anchor.getAttribute('href');
      if (!raw?.startsWith('/') || raw.startsWith('//') || raw.startsWith('/api/') || /^\/admin(?:\/|$)/.test(raw)) return;
      const url = new URL(raw, window.location.origin);
      if (url.pathname === window.location.pathname && url.hash && !url.search) return;
      if (url.origin === window.location.origin) { event.preventDefault(); navigate(url.pathname + url.search + url.hash); }
    }
    document.addEventListener('click', click); return () => document.removeEventListener('click', click);
  }, [navigate]);
  return null;
}
