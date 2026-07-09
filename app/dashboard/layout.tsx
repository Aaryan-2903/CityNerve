import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CityNerve — EOC Operations Dashboard',
  description: 'Live Emergency Operations Center — AI-powered disaster intelligence and decision support.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
