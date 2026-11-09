import React from 'react';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import { AuthForm } from '../../components/auth/AuthForms';
export default function ResetPasswordPage() {
  return <AuthFormLayout title="Reset your password" description="Reset your INVESG account password." canonicalPath="/account/reset-password"><p>Use the original recovery email link. Resetting your password revokes previous sessions.</p><AuthForm reset /></AuthFormLayout>;
}
