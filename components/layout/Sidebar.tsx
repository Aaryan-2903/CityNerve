'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Map,
  Bell,
  Command,
  Activity,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Operations Center' },
  { id: 'map', icon: Map, label: 'Live Map' },
  { id: 'alerts', icon: Bell, label: 'Alerts', badge: 3 },
  { id: 'command', icon: Command, label: 'Command' },
  { id: 'activity', icon: Activity, label: 'Activity Feed' },
  { id: 'settings', icon: Settings, label: 'Settings' },
] as const;

interface SidebarProps {
  /** Whether the mobile drawer is open */
  isOpen?: boolean;
  /** Called when the user requests to close the mobile drawer */
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [activeId, setActiveId] = useState<string>('home');

  // ── Shared nav content ──────────────────────────────────────────────────────
  const navContent = (
    <nav className="flex flex-col items-center gap-1.5 flex-1 w-full px-3 pt-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;

        return (
          <motion.button
            key={item.id}
            onClick={() => {
              setActiveId(item.id);
              onClose?.();
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group',
              isActive
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-white/30 hover:text-white/70 hover:bg-white/[0.04] border border-transparent',
            )}
            aria-label={item.label}
            title={item.label}
          >
            {/* Active left border */}
            {isActive && (
              <motion.span
                layoutId="sidebar-active-bar"
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <Icon className="w-[18px] h-[18px]" />

            {/* Notification badge */}
            {'badge' in item && item.badge && !isActive && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#070B14]" />
            )}

            {/* Tooltip — desktop only */}
            <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-white/[0.08] bg-[#0D1420] px-2.5 py-1.5 text-[11px] font-medium text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-tooltip hidden md:block">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ── Desktop: permanent icon rail ─────────────────────────────────── */}
      <motion.aside
        initial={{ x: -90, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="hidden md:flex w-[90px] h-full shrink-0 flex-col items-center bg-[#070B14] border-r border-white/[0.05] py-3 relative z-sidebar"
      >
        {navContent}

        {/* Divider */}
        <div className="w-8 h-px bg-white/[0.06] my-3" />

        {/* Bottom spacer */}
        <div className="px-3 pb-2">
          <div className="w-12 h-12" />
        </div>
      </motion.aside>

      {/* ── Mobile: slide-in drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 bottom-0 z-sidebar flex flex-col w-[280px] bg-[#070B14] border-r border-white/[0.08] shadow-2xl md:hidden"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-white" fill="none">
                    <path d="M10 14a1 1 0 110-2 1 1 0 010 2z" fill="currentColor"/>
                    <path d="M6.5 11.5a5 5 0 017 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M3.5 8.5a9 9 0 0113 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold tracking-tight text-white">CityNerve</span>
                  <span className="text-[10px] text-white/30 tracking-widest uppercase">EOC Platform</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer nav — full labels */}
            <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
              <p className="px-3 py-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">
                Operations
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveId(item.id);
                      onClose?.();
                    }}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150 text-left w-full',
                      isActive
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent',
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r-full" />
                    )}
                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'text-white/40')} />
                    <span>{item.label}</span>
                    {'badge' in item && item.badge && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500/20 px-1.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div className="border-t border-white/[0.06] p-4">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-[11px] font-bold text-white">
                  EC
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-medium text-white/70">EOC Commander</span>
                  <span className="text-[10px] text-white/30">Level 5 Clearance</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
