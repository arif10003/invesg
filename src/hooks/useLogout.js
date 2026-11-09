import React from 'react';
import { logout } from '../api/auth';
export function useLogout(onSuccess) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const inFlight = React.useRef(false);
  async function signOut(all = false) {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      await logout(all);
      onSuccess?.();
      // A fresh public document also discards all mounted private-page state.
      window.location.replace('/');
    } catch (failure) {
      setError('Log out could not be confirmed. Your session may still be active. Please try again.');
    } finally { inFlight.current = false; setBusy(false); }
  }
  return { busy, error, signOut };
}
