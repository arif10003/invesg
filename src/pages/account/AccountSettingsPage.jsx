import LogoutControl from '../../components/auth/LogoutControl';
import React from 'react';
import MemberLayout from '../../components/member/MemberLayout';
import { useMemberSession } from '../../context/MemberSessionContext';
import { saveProfile } from '../../api/member';
import VerificationResend from '../../components/auth/VerificationResend';
import { updateSessionProfile } from '../../api/client';
export default function AccountSettingsPage({preview:requestedPreview=false}) {
  const preview=import.meta.env.DEV && requestedPreview;
  const liveSession = useMemberSession(); const session = preview ? {status:'guest',profile:null} : liveSession; const [name, setName] = React.useState(session.profile?.name || ''); const [feedback, setFeedback] = React.useState(''); const [busy, setBusy] = React.useState(false);
  React.useEffect(()=>setName(session.profile?.name || ''),[session.profile?.name]);
  async function act(operation) { setBusy(true); try { const result = await operation(); setFeedback(result?.message || 'Profile updated.'); } catch(error) { setFeedback(error.message); } finally { setBusy(false); } }
  return <MemberLayout title="Account Settings" path="/account/settings">{session.status !== 'authenticated' ? <div className="member-state"><h2>Sign in to manage your account</h2><a href="/login?returnTo=%2Faccount%2Fsettings">Log in</a></div> : <><p className="form-feedback" role="status">{feedback}</p><form className="member-settings" onSubmit={e=>{e.preventDefault();act(async()=>{const result=await saveProfile(name);updateSessionProfile(result.data);});}}><fieldset disabled={busy}><legend>Profile</legend><label>Full name<input name="name" minLength={2} maxLength={200} required value={name} onChange={e=>setName(e.target.value)}/></label><label>Email address<input readOnly value={session.profile.email}/></label><p>Email verification: {session.profile.email_verified_at ? 'Verified' : 'Not verified'}</p><button type="submit">Save profile</button></fieldset></form>{!session.profile.email_verified_at && <VerificationResend key={session.profile.id} userId={session.profile.id} />}<section className="member-settings-signout"><h2>Account security</h2><a href="/account/recovery">Request a password reset</a><p>Changing email, Google connection and marketing preferences are not offered in this release.</p><LogoutControl /><LogoutControl all /></section></>}</MemberLayout>;
}

