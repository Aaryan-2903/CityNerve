import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Terminal Access | CityNerve',
  description: 'Login to the CityNerve Emergency Operations Center platform.',
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Secure Terminal Access" 
      subtitle="Authenticate to access CityNerve Command Center"
    >
      <LoginForm />
    </AuthLayout>
  );
}
