'use client';

import { useState } from 'react';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Sidebar } from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#090D1A]">
      {/* Top Navigation Bar */}
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-backdrop bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
