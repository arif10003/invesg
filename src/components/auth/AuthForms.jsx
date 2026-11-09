import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, register, forgotPassword, resetPassword } from '../../api/auth';
import { authHref, readAuthIntent } from '../../utils/authIntent';
import { useEmailProof } from '../../hooks/useEmailProof';
function PasswordInput({ id, ...props }) {
  const [visible, setVisible] = React.useState(false);
  return <span className="password-field"><input id={id} {...props} type={visible ? 'text' : 'password'} /><button className="password-toggle" type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-controls={id} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span>;
}
export function AvailabilityNotice() { return <div className="auth-notice"><p>Email accounts are connected to the invesg account service. Google sign-in is not available.</p></div>; }
export function AuthForm({ signup = false, recovery = false, reset = false, preview: requestedPreview = false, previewError = false }) {
  const preview = import.meta.env.DEV && requestedPreview;
  const { search } = useLocation(); const navigate = useNavigate(); const id = React.useId(); const proof = useEmailProof();
  const [feedback, setFeedback] = React.useState(previewError ? 'Please check your details.' : '');
  const [busy, setBusy] = React.useState(false);
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    if (preview) { setFeedback('Preview only - no details were sent and no account was created.'); return; }
    const data = Object.fromEntries(new FormData(event.currentTarget)); setBusy(true); setFeedback('');
    try {
      if (recovery) { const result = await forgotPassword(data.email); setFeedback(result.message); }
      else if (reset) {
        if (!proof.current?.token || !proof.current?.email) throw new Error('Open the original recovery email link to reset your password.');
        const result = await resetPassword({ email: proof.current.email, token: proof.current.token, password: data.password, password_confirmation: data.confirmation });
        proof.current = {}; setFeedback(result.message);
      } else {
        if (signup) await register({ name: data.name, email: data.email, password: data.password, password_confirmation: data.confirmation });
        else await login({ email: data.email, password: data.password });
        const intent = readAuthIntent(search);
        // Preserve destination only. Saving/downloading requires a separate authorized click.
        navigate(intent?.returnTo || (signup ? '/account/verify-email' : '/account/library'), { replace: true });
      }
    } catch (error) { setFeedback(Object.values(error.errors || {}).flat().join(' ') || error.message || 'Please try again.'); }
    finally { setBusy(false); }
  }
  return <form className="auth-form" onSubmit={submit}>
    {preview && <p className="auth-preview-note">Interactive layout preview. Nothing is sent or stored.</p>}
    <p className="form-feedback" role="status">{feedback}</p>
    <fieldset disabled={busy}><legend className="sr-only">{signup ? 'Registration details' : recovery ? 'Recovery email' : reset ? 'New password' : 'Login details'}</legend>
      {!recovery && !reset && <><button className="auth-google" type="button" disabled><span className="google-mark">G</span>Google sign-in unavailable</button><p className="auth-divider">or use email</p></>}
      {signup && <label htmlFor={`${id}-name`}>Full name<input id={`${id}-name`} name="name" autoComplete="name" minLength={2} maxLength={200} required /></label>}
      {!reset && <label htmlFor={`${id}-email`}>Email address<input id={`${id}-email`} name="email" type="email" aria-invalid={previewError || undefined} autoComplete="email" maxLength={200} required /></label>}
      {!recovery && <label htmlFor={`${id}-password`}>{reset ? 'New password' : 'Password'}<PasswordInput id={`${id}-password`} name="password" type="password" minLength={signup || reset ? 8 : undefined} maxLength={1024} autoComplete={signup || reset ? 'new-password' : 'current-password'} required /></label>}
      {(reset || signup) && <label htmlFor={`${id}-confirm`}>Confirm password<PasswordInput id={`${id}-confirm`} name="confirmation" type="password" minLength={8} maxLength={1024} autoComplete="new-password" required /></label>}
      {signup && <p className="auth-legal-note">Use at least 8 characters. A verification email will be queued. Registration does not subscribe you to marketing.</p>}
      <button className="auth-submit" type="submit">{busy ? 'Please wait…' : signup ? 'Create Account' : recovery ? 'Send Recovery Link' : reset ? 'Reset Password' : 'Log In'}</button>
    </fieldset>
    {!signup && !recovery && !reset && <a href={authHref('/account/recovery', search)}>Forgot password?</a>}
    {!recovery && !reset && <p className="auth-switch">{signup ? 'Already have an account? ' : 'New to invesg? '}<a href={authHref(signup ? '/login' : '/signup', search)}>{signup ? 'Log in' : 'Sign up'}</a></p>}
    {(recovery || reset) && <a href={authHref('/login', search)}>Back to Login</a>}
  </form>;
}
export function ReturnLink() {
  const { search } = useLocation(); const intent = readAuthIntent(search);
  return intent ? <p className="auth-return"><a href={intent.returnTo}>Return to your page</a></p> : <p className="auth-return"><a href="/insights">Explore Insights</a><br/><a href="/account/library">My Library</a></p>;
}
