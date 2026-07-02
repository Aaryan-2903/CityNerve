'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  Truck,
  BarChart3,
  Brain,
  Radio,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/constants/navigation';
import { StatusIndicator } from '@/components/shared/StatusIndicator';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  AlertTriangle,
  Truck,
  BarChart3,
  Brain,
  Radio,
  Bell,
  Settings,
};

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  badge?: number;
  isCollapsed: boolean;
  isActive: boolean;
}

function NavItem({ href, icon, label, badge, isCollapsed, isActive }: NavItemProps) {
  const Icon = ICON_MAP[icon] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group',
        isActive
          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent',
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
      )}
      <Icon
        className={cn(
          'shrink-0 transition-colors',
          isCollapsed ? 'w-5 h-5' : 'w-4 h-4',
          isActive ? 'text-blue-400' : 'text-white/40 group-hover:text-white/70',
        )}
      />
      {!isCollapsed && (
        <span className="truncate leading-none">{label}</span>
      )}
      {!isCollapsed && badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500/20 px-1.5 text-[10px] font-bold text-red-400 border border-red-500/30">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-white/[0.06] bg-[#070B14] transition-all duration-300 ease-out shrink-0',
        isCollapsed ? 'w-[60px]' : 'w-[220px]',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-3 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col leading-none overflow-hidden">
            <span className="text-sm font-bold tracking-tight text-white">CityNerve</span>
            <span className="text-[10px] text-white/30 tracking-widest uppercase">EOC Platform</span>
          </div>
        )}
      </div>

      {/* System Status */}
      {!isCollapsed && (
        <div className="border-b border-white/[0.06] px-3 py-2.5">
          <div className="flex items-center justify-between">
            <StatusIndicator variant="live" label="SYSTEMS NOMINAL" />
            <Shield className="w-3.5 h-3.5 text-white/20" />
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 py-1.5 text-[10px] font-semibold text-white/20 uppercase tracking-widest">
            Operations
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={item.icon}
            label={item.label}
            badge={item.id === 'incidents' ? 6 : item.id === 'ai-center' ? 2 : undefined}
            isCollapsed={isCollapsed}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-white/[0.06] p-2 flex flex-col gap-0.5">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
            isActive={pathname === item.href}
          />
        ))}

        {/* EOC Commander */}
        {!isCollapsed && (
          <div className="mt-1 flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-[10px] font-bold text-white">
              EC
            </div>
            <div className="flex flex-col leading-none overflow-hidden">
              <span className="text-xs font-medium text-white/70 truncate">EOC Commander</span>
              <span className="text-[10px] text-white/30">Level 5 Clearance</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed((v) => !v)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.1] bg-[#0D1420] text-white/40 hover:text-white/80 hover:border-white/20 transition-colors z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
