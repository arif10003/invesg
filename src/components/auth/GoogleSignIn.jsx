import React from 'react';
import { useNavigate } from 'react-router-dom';
import { requestJson, acceptSession, getSession } from '../../api/client';
import { readAuthIntent } from '../../utils/authIntent';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
let scriptPromise;
let challengePromise;
let challengeCreated = 0;
let activeCallback;
let initialized = false;

function loadGoogle() {
  if (globalThis.google?.accounts?.id) return Promise.resolve(globalThis.google.accounts.id);
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => reject(new Error('Google sign-in did not load. You can use email sign-in.')), 15000);
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.onload = () => {
      clearTimeout(timeout);
      if (globalThis.google?.accounts?.id) resolve(globalThis.google.accounts.id);
      else reject(new Error('Google sign-in is unavailable. You can use email sign-in.'));
    };
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Google sign-in could not load. You can use email sign-in.')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

function challenge() {
  // Share bootstrap in React Strict Mode so two mounts cannot race the cookie.
  if (!challengePromise || Date.now() - challengeCreated > 240000) {
    challengeCreated = Date.now();
    challengePromise = requestJson('/api/v1/auth/google/challenge', { method: 'POST', auth: 'none', skipRefresh: true })
      .catch(error => { challengePromise = undefined; throw error; });
  }
  return challengePromise;
}

export default function GoogleSignIn({ signup, search, preview, busy, setBusy, setFeedback }) {
  const target = React.useRef(null);
  const busyRef = React.useRef(busy);
  busyRef.current = busy;
  const navigate = useNavigate();
  const [status, setStatus] = React.useState('loading');

  React.useEffect(() => {
    if (preview || !clientId) return undefined;
    let disposed = false;
    let callback;
    const revision = getSession().revision;
    Promise.all([loadGoogle(), challenge()]).then(([google, result]) => {
      if (disposed) return;
      if (!/^[a-f0-9]{64}$/.test(result?.nonce || '')) throw new Error('Google sign-in could not be prepared.');
      callback = async response => {
        if (disposed || busyRef.current) return;
        busyRef.current = true; setBusy(true); setFeedback('');
        try {
          if (getSession().revision !== revision) throw new Error('Your account changed. Reload this page.');
          const session = await requestJson('/api/v1/auth/google', {
            method: 'POST', auth: 'none', skipRefresh: true,
            body: { credential: response.credential, nonce: result.nonce },
          });
          if (disposed || getSession().revision !== revision) throw new Error('Your account changed. Reload this page.');
          const user = acceptSession(session);
          challengePromise = undefined;
          const intent = readAuthIntent(search);
          navigate(intent?.returnTo || (user.email_verified_at ? '/account/library' : '/account/verify-email'), { replace: true });
        } catch (error) {
          if (!disposed) {
            setFeedback((error.message || 'Google sign-in failed.') + ' You can use email sign-in, or reload this page to retry Google.');
            setStatus('failed');
          }
          challengePromise = undefined;
        } finally {
          busyRef.current = false;
          if (!disposed) setBusy(false);
        }
      };
      activeCallback = callback;
      // One active auth form per page; nonce changes require reinitialization.
      google.initialize({ client_id: clientId, nonce: result.nonce, auto_select: false,
        callback: response => activeCallback?.(response) });
      initialized = true;
      google.renderButton(target.current, { type: 'standard', theme: 'outline', size: 'large',
        text: signup ? 'signup_with' : 'signin_with', width: Math.min(400, target.current.clientWidth || 320) });
      setStatus('ready');
    }).catch(error => {
      if (!disposed) { setStatus('failed'); setFeedback(error.message || 'Google sign-in is unavailable. You can use email sign-in.'); }
    });
    return () => {
      disposed = true;
      if (activeCallback === callback) activeCallback = undefined;
      if (initialized) globalThis.google?.accounts?.id?.cancel();
    };
  }, [preview, signup, search, navigate, setBusy, setFeedback]);

  if (preview || !clientId) return <button className="auth-google" type="button" disabled>Google sign-in unavailable</button>;
  return <div aria-busy={busy || status === 'loading'}>
    {status === 'loading' && <p role="status">Preparing Google sign-in…</p>}
    {status === 'failed' && <p role="status">Google sign-in unavailable. Please use email or reload to retry.</p>}
    <div ref={target} inert={busy || status === 'failed' ? true : undefined} style={{ pointerEvents: busy || status === 'failed' ? 'none' : undefined }} />
  </div>;
}
