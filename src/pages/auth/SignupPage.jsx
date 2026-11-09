import React from 'react';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import { AuthForm, ReturnLink } from '../../components/auth/AuthForms';
export default function SignupPage() {
  return <AuthFormLayout title="Create your free account" description="INVESG member registration." canonicalPath="/signup"><p>Build your personal collection of knowledge and perspectives.</p><AuthForm signup /><ReturnLink /></AuthFormLayout>;
}
