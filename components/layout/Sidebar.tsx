'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Map,
  Bell,
  Command,
  Activity,
  Settings,
  Menu,
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

export function Sidebar() {
  const [activeId, setActiveId] = useState<string>('home');

  return (
    <motion.aside
      initial={{ x: -90, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-[90px] h-full shrink-0 flex flex-col items-center bg-[#070B14] border-r border-white/[0.05] py-3"
    >
      {/* Nav Items */}
      <nav className="flex flex-col items-center gap-1.5 flex-1 w-full px-3 pt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveId(item.id)}
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

              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-white/[0.08] bg-[#0D1420] px-2.5 py-1.5 text-[11px] font-medium text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-white/[0.06] my-3" />

      {/* Bottom: collapse toggle */}
      <div className="px-3 pb-2">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-xl text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all border border-transparent group"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>
      </div>
    </motion.aside>
  );
}
