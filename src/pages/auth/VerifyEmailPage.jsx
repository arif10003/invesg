import React from 'react';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import { ReturnLink } from '../../components/auth/AuthForms';
import { verifyEmail, resendVerification, reloadProfile } from '../../api/auth';
import { useMemberSession } from '../../context/MemberSessionContext';
import { useEmailProof } from '../../hooks/useEmailProof';
export default function VerifyEmailPage({preview:requestedPreview=false}) {
  const preview=import.meta.env.DEV && requestedPreview;
  const proof = useEmailProof(); const session = useMemberSession(); const [message, setMessage] = React.useState('Open the link from your verification email and confirm below.'); const [busy, setBusy] = React.useState(false);
  async function act(confirm) {
    if(preview){setMessage('Preview only. No verification request was sent.');return;}
    setBusy(true);
    try {
      if (confirm && !proof.current?.token) throw new Error('Open the original verification link from your email.');
      const result = confirm ? await verifyEmail(proof.current.token) : await resendVerification();
      if (confirm) { proof.current = {}; if (session.status === 'authenticated') await reloadProfile(); }
      setMessage(result.message);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }
  return <AuthFormLayout title="Email verification" description="Verify your invesg email." canonicalPath="/account/verify-email" landscape={false}><p role="status">{message}</p><button className="auth-submit" disabled={busy} onClick={()=>act(true)}>Confirm email verification</button><button className="auth-submit" disabled={busy || session.status !== 'authenticated'} onClick={()=>act(false)}>Resend Verification Email</button><p>Resending requires sign-in. Links expire after one hour.</p><ReturnLink/></AuthFormLayout>;
}
