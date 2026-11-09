import React from 'react';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import { AuthForm, ReturnLink } from '../../components/auth/AuthForms';
export default function RecoveryPage() {
  return <AuthFormLayout title="Recover your account" description="Recover access to your INVESG account." canonicalPath="/account/recovery"><p>Enter your account email to request a password reset. The response does not reveal whether an account exists.</p><AuthForm recovery /><ReturnLink /></AuthFormLayout>;
}
