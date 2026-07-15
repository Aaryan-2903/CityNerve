import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | CityNerve',
  description: 'Reset your password for the CityNerve Emergency Operations Center platform.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Password Recovery" 
      subtitle="Regain access to your operator terminal"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
