import { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Request Clearance | CityNerve',
  description: 'Request access to the CityNerve Emergency Operations Center platform.',
};

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Request Operator Clearance" 
      subtitle="Submit credentials for EOC access authorization"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
