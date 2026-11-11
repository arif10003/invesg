import React from 'react';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import { ReturnLink } from '../../components/auth/AuthForms';
import VerificationResend from '../../components/auth/VerificationResend';
import { verifyEmail, reloadProfile } from '../../api/auth';
import { getSession } from '../../api/client';
import { useMemberSession } from '../../context/MemberSessionContext';
import { useEmailProof } from '../../hooks/useEmailProof';

export default function VerifyEmailPage({ preview: requestedPreview = false }) {
  const preview = import.meta.env.DEV && requestedPreview;
  const proof = useEmailProof();
  const session = useMemberSession();
  const request = React.useRef(null);
  const [result, setResult] = React.useState({ status: 'loading', message: 'Checking your verification link…' });

  React.useEffect(() => {
    if (preview || !proof.current?.token) {
      setResult({ status: 'waiting', message: 'Open the link in your verification email to verify your address.' });
      return;
    }
    let active = true;
    // Reuse the request when React re-runs effects in development.
    request.current ??= verifyEmail(proof.current.token);
    request.current.then(
      response => {
        if (!active) return;
        setResult({ status: 'verified', message: response.message });
        if (getSession().status === 'authenticated') void reloadProfile().catch(() => {});
      },
      error => {
        if (active) setResult({ status: 'error', message: error.message });
      },
    );
    return () => { active = false; };
  }, [preview, proof]);

  const verified = result.status === 'verified'
    || (result.status === 'waiting' && Boolean(session.profile?.email_verified_at));
  const showResend = !preview && !verified && result.status !== 'loading'
    && session.status === 'authenticated' && !session.profile?.email_verified_at;

  return <AuthFormLayout title="Email verification" description="Verify your invesg email." canonicalPath="/account/verify-email" landscape={false}>
    <p role="status">{verified && result.status === 'waiting' ? 'Your email is already verified.' : result.message}</p>
    {showResend && <VerificationResend key={session.profile.id} userId={session.profile.id} className="auth-submit" />}
    {!verified && result.status !== 'loading' && <p>Verification links expire after one hour.{session.status === 'guest' && ' Sign in to request a new email.'}</p>}
    <ReturnLink />
  </AuthFormLayout>;
}
