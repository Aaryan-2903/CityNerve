'use client';

import { Bell, RefreshCw, Wifi, AlertCircle, ChevronDown } from 'lucide-react';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { useRealTimeClock } from '@/hooks/useRealTimeClock';

interface TopBarProps {
  activeIncidents: number;
  criticalCount: number;
}

export function TopBar({ activeIncidents, criticalCount }: TopBarProps) {
  const { utcTime, utcDate } = useRealTimeClock();

  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[#070B14]/80 px-4 backdrop-blur-xl">
      {/* Left: Breadcrumb + Incident count */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/30">EOC</span>
          <span className="text-white/20">/</span>
          <span className="text-xs font-semibold text-white/80">Operations Center</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span className="font-mono text-xs font-bold text-red-400">{activeIncidents}</span>
          <span className="text-xs text-white/30">active incidents</span>
          {criticalCount > 0 && (
            <>
              <span className="text-white/20">·</span>
              <span className="font-mono text-xs font-bold text-red-500">{criticalCount} critical</span>
            </>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: System indicators + Clock */}
      <div className="flex items-center gap-4">
        {/* Data feed status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-mono text-white/30">FEEDS ONLINE</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <StatusIndicator variant="live" label="AI ONLINE" size="sm" />
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-white/30" />
            <span className="text-[10px] font-mono text-white/30">30s REFRESH</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* UTC Clock */}
        <div className="flex flex-col items-end leading-none" suppressHydrationWarning>
          <span suppressHydrationWarning className="font-mono text-xs font-bold text-white/80 tabular-nums">{utcTime}</span>
          <span suppressHydrationWarning className="font-mono text-[10px] text-white/25">{utcDate} UTC</span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Notifications */}
        <button
          className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/80 hover:border-white/15 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            {criticalCount}
          </span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 hover:border-white/15 transition-colors">
          <div className="h-4.5 w-4.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
            EC
          </div>
          <ChevronDown className="w-3 h-3 text-white/30" />
        </button>
      </div>
    </header>
  );
}
