'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Bell, Cloud, Wind } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function BrandMark() {
  return (
    <div className="flex items-center gap-3 px-5 shrink-0">
      {/* Animated brand icon */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/25">
        {/* Outer ring pulse */}
        <span className="absolute inset-0 rounded-full border border-blue-400/30 animate-pulse" />
        {/* WiFi-like concentric arcs */}
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-white" fill="none">
          <path d="M10 14a1 1 0 110-2 1 1 0 010 2z" fill="currentColor"/>
          <path d="M6.5 11.5a5 5 0 017 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3.5 8.5a9 9 0 0113 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-white">CityNerve</span>
        <span className="text-[9px] font-semibold tracking-[0.18em] text-white/30 uppercase mt-0.5">
          Urban Disaster Intelligence
        </span>
      </div>
    </div>
  );
}

function CommandZoneSelector() {
  return (
    <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
      </span>
      <span className="text-sm font-semibold text-white/85">Mumbai Command Zone</span>
      <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
    </button>
  );
}

function WeatherInfo() {
  return (
    <div className="hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
      <Cloud className="w-4 h-4 text-blue-300/70 shrink-0" />
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-white/80">29°C</span>
        <span className="text-white/30">·</span>
        <span className="text-white/50">heavy rain</span>
        <span className="text-white/30">·</span>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-white/30" />
          <span className="text-white/40 text-xs">SW 18 km/h</span>
        </div>
      </div>
    </div>
  );
}

function NotificationBell() {
  return (
    <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all">
      <Bell className="w-4 h-4" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0B0F1C]">
        3
      </span>
    </button>
  );
}

function UserProfile() {
  return (
    <button className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-2 pr-3.5 py-1.5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-[11px] font-bold text-white border-0">
          OR
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-white/75 hidden xl:block">Officer Rao</span>
      <ChevronDown className="w-3 h-3 text-white/30 hidden xl:block" />
    </button>
  );
}

export function TopNavbar() {
  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'h-[72px] shrink-0 flex items-center justify-between gap-4',
        'bg-[#0B0F1C] border-b border-white/[0.06]',
        'px-4 z-50 relative',
      )}
    >
      {/* Left: Brand */}
      <BrandMark />

      {/* Center: Command Zone */}
      <div className="flex items-center gap-3">
        <CommandZoneSelector />
        <WeatherInfo />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <NotificationBell />
        <div className="h-5 w-px bg-white/[0.08]" />
        <UserProfile />
      </div>
    </motion.header>
  );
}
