import React from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { canUseWorkspace } from '../../utils/memberAccess';
import { useMemberSession } from '../../context/MemberSessionContext';
import { useLogout } from '../../hooks/useLogout';

export default function AccountMenu({ mobile = false, onNavigate }) {
  const session = useMemberSession();
  const [open, setOpen] = React.useState(false);
  const root = React.useRef(null), trigger = React.useRef(null), panel = React.useRef(null);
  const initialFocus = React.useRef('first');
  const id = React.useId();
  const close = React.useCallback(() => setOpen(false), []);
  const { busy, error, signOut } = useLogout(() => { close(); onNavigate?.(); });
  const authenticated = session.status === 'authenticated';
  const name = session.profile?.name?.trim() || 'My Account';
  const items = () => [...(panel.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || [])];
  React.useEffect(() => {
    if (!open) return;
    const list = items(); (initialFocus.current === 'last' ? list.at(-1) : list[0])?.focus();
    function outside(event) { if (!root.current?.contains(event.target)) close(); }
    function escape(event) { if (event.key === 'Escape') { event.preventDefault(); close(); trigger.current?.focus(); } }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open, close]);
  React.useEffect(close, [session.profile?.id, close]);
  function keyboard(event) {
    const list = items(); const index = list.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown' ? (index + 1) % list.length : event.key === 'ArrowUp' ? (index - 1 + list.length) % list.length : event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : null;
    if (next !== null) { event.preventDefault(); list[next]?.focus(); }
  }
  if (!authenticated) return <a href="/login" onClick={onNavigate} className={mobile ? 'navbar-account-link navbar-account-link--mobile' : 'navbar-account-link'}>Login / Sign Up</a>;
  return <div ref={root} className={`account-menu${mobile ? ' account-menu--mobile' : ''}`} onBlur={event => { if (!busy && !event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <button ref={trigger} id={`${id}-trigger`} type="button" className={`navbar-account-link account-menu-trigger${mobile ? ' navbar-account-link--mobile' : ''}`} aria-expanded={open} aria-haspopup="menu" aria-controls={`${id}-panel`} onClick={() => { initialFocus.current = 'first'; setOpen(value => !value); }} onKeyDown={event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); initialFocus.current = event.key === 'ArrowUp' ? 'last' : 'first'; if (open) { const list = items(); (initialFocus.current === 'last' ? list.at(-1) : list[0])?.focus(); } else setOpen(true); } }}>
      <span className="account-avatar" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span><span>{name}</span><ChevronDown size={17} aria-hidden="true" />
    </button>
    <div ref={panel} id={`${id}-panel`} className="account-menu-panel" role="menu" aria-labelledby={`${id}-trigger`} hidden={!open} onKeyDown={keyboard}>
      <a role="menuitem" href="/account/library" onClick={() => { close(); onNavigate?.(); }}>My Library</a>
      <a role="menuitem" href="/account/settings" onClick={() => { close(); onNavigate?.(); }}>Account Settings</a>
      {canUseWorkspace(session.profile) && <a role="menuitem" href="/admin" onClick={() => { close(); onNavigate?.(); }}>Admin Workspace</a>}
      <button type="button" role="menuitem" className="account-menu-logout" disabled={busy} onClick={() => signOut()}><LogOut size={18} aria-hidden="true" />{busy ? 'Signing out...' : 'Log out'}</button>
      {error && <div className="account-menu-error"><p role="alert">{error}</p><button type="button" role="menuitem" disabled={busy} onClick={() => signOut()}>Try again</button></div>}
    </div>
  </div>;
}
