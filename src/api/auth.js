import { requestJson, acceptSession, finishLogout, updateSessionProfile } from './client.js';
export const authAvailability = Object.freeze({ available: true, googleAvailable: false, legalDocumentsAvailable: false, message: 'Email accounts use the invesg Laravel service. Google sign-in is not available.' });
export async function login(values) { const result = await requestJson('/api/v1/auth/login', { method: 'POST', body: values, auth: 'none' }); return acceptSession(result); }
export async function register(values) { const result = await requestJson('/api/v1/auth/register', { method: 'POST', body: values, auth: 'none' }); return acceptSession(result); }
export const forgotPassword = email => requestJson('/api/v1/auth/password/forgot', { method: 'POST', body: { email }, auth: 'none' });
export const resetPassword = values => requestJson('/api/v1/auth/password/reset', { method: 'POST', body: values, auth: 'none' });
export const verifyEmail = token => requestJson('/api/v1/auth/email-verification/confirm', { method: 'POST', body: { token }, auth: 'none' });
export const resendVerification = () => requestJson('/api/v1/auth/email-verification/send', { method: 'POST', auth: 'required' });
export async function reloadProfile() { const result = await requestJson('/api/v1/me/profile', { auth: 'required' }); updateSessionProfile(result.data); return result.data; }
export async function logout(all = false) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const result = await requestJson(`/api/v1/auth/${all ? 'logout-all' : 'logout'}`, { method: 'POST', auth: 'optional', skipRefresh: true, signal: controller.signal });
    finishLogout();
    return result;
  } finally { clearTimeout(timeout); }
}
