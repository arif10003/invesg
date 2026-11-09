import React from 'react';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import { AuthForm, ReturnLink } from '../../components/auth/AuthForms';
export default function LoginPage() {
  return <AuthFormLayout title="Welcome back." description="Log in to your INVESG account." canonicalPath="/login"><p>Access your books, saved Insights, and eligible publications.</p><AuthForm /><ReturnLink /></AuthFormLayout>;
}
