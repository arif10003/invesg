import React from 'react';
import { resendVerification } from '../../api/auth';
import { rememberVerificationRequest, verificationWait, VERIFICATION_WAIT_SECONDS } from '../../utils/verificationCooldown';

export default function VerificationResend({ userId, className }) {
  const [remaining, setRemaining] = React.useState(() => verificationWait(userId));
  const [message, setMessage] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const sending = React.useRef(false);

  React.useEffect(() => {
    const tick = () => setRemaining(verificationWait(userId));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [userId]);

  async function resend() {
    if (sending.current || verificationWait(userId)) return;
    sending.current = true;
    setBusy(true);
    try {
      const result = await resendVerification();
      if (result.retry_after || result.message !== 'Your email is already verified.') {
        rememberVerificationRequest(userId, result.retry_after ?? VERIFICATION_WAIT_SECONDS);
      }
      setMessage(result.message);
    } catch (error) {
      const retryAfter = Number(error.errors?.retry_after);
      if (error.status === 429 && retryAfter > 0) rememberVerificationRequest(userId, retryAfter);
      setMessage(error.message);
    } finally {
      setRemaining(verificationWait(userId));
      sending.current = false;
      setBusy(false);
    }
  }

  const countdown = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  return <div>
    <p>Allow up to two minutes for delivery. Check your spam folder before requesting another email.</p>
    <button type="button" className={className} disabled={busy || remaining > 0} onClick={resend}>
      {busy ? 'Requesting email…' : remaining ? `Resend in ${countdown}` : 'Resend verification email'}
    </button>
    {message && <p role="status">{message}</p>}
  </div>;
}
