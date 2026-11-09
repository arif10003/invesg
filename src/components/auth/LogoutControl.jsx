import React from 'react';
import { LogOut } from 'lucide-react';
import { useLogout } from '../../hooks/useLogout';
export default function LogoutControl({ all = false, className = '' }) {
  const { busy, error, signOut } = useLogout();
  return <div className={`logout-control ${className}`}><button type="button" disabled={busy} onClick={() => signOut(all)}><LogOut size={18} aria-hidden="true" />{busy ? 'Signing out...' : all ? 'Log out all sessions' : 'Log out'}</button>{error && <div className="logout-error"><p role="alert">{error}</p><button type="button" disabled={busy} onClick={() => signOut(all)}>Try again</button></div>}</div>;
}
