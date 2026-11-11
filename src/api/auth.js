import { requestJson, acceptSession, finishLogout, updateSessionProfile } from './client.js';
import { rememberVerificationRequest } from '../utils/verificationCooldown.js';
export const authAvailability = Object.freeze({ available: true, googleAvailable: Boolean(import.meta.env?.VITE_GOOGLE_CLIENT_ID), legalDocumentsAvailable: false, message: 'Email and configured Google accounts use the invesg Laravel service.' });
export async function login(values) { const result = await requestJson('/api/v1/auth/login', { method: 'POST', body: values, auth: 'none' }); return acceptSession(result); }
export async function register(values) { const result = await requestJson('/api/v1/auth/register', { method: 'POST', body: values, auth: 'none' }); rememberVerificationRequest(result.user?.id); return acceptSession(result); }
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

