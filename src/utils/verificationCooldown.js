export const VERIFICATION_WAIT_SECONDS = 120;
const deadlines = new Map();
const storageKey = id => `invesg.verification.resend.${id}`;

export function rememberVerificationRequest(id, seconds = VERIFICATION_WAIT_SECONDS) {
  if (id == null || !Number.isFinite(seconds) || seconds <= 0) return;
  const deadline = Date.now() + seconds * 1000;
  deadlines.set(id, deadline);
  try { localStorage.setItem(storageKey(id), String(deadline)); } catch {}
}

export function verificationWait(id) {
  let deadline = deadlines.get(id) || 0;
  try { deadline = Math.max(deadline, Number(localStorage.getItem(storageKey(id))) || 0); } catch {}
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}
