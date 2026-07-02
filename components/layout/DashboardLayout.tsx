'use client';

import { TopNavbar } from '@/components/layout/TopNavbar';
import { Sidebar } from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#090D1A]">
      {/* Top Navigation Bar — 72px */}
      <TopNavbar />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar — 90px */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
