import { Hero } from '@/components/landing/Hero';
import { Architecture } from '@/components/landing/Architecture';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { TechStack } from '@/components/landing/TechStack';
import { Footer } from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CityNerve — AI Disaster Intelligence Platform',
  description: 'AI-powered Emergency Operations Center for real-time disaster intelligence, incident management, and decision support.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-slate-50 overflow-x-hidden selection:bg-blue-500/30">
      <Hero />
      <Architecture />
      <ProblemSolution />
      <DashboardPreview />
      <Features />
      <HowItWorks />
      <TechStack />
      <Footer />
    </main>
  );
}
