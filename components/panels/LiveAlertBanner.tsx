'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationContext } from '@/context/SimulationContext';
import { SIMULATION_ALERTS } from '@/data/simulationAlerts';
import { useEffect, useState } from 'react';

export function LiveAlertBanner() {
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;
  const alert = SIMULATION_ALERTS[phase];

  // We want to update the timestamp when the phase changes
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [phase, sim?.status]);

  if (!alert) return null;

  const Icon = alert.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b backdrop-blur-md z-50 ${alert.colorClass}`}
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 ${alert.dotClass}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${alert.dotClass}`} />
          </span>
          <Icon className="w-5 h-5 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 overflow-hidden">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase shrink-0">
              {alert.title}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-current opacity-30 shrink-0" />
            <span className="text-[11px] sm:text-xs font-medium opacity-90 truncate">
              {alert.description}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end shrink-0 ml-4">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60">
            {alert.severity}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono opacity-80">
            {timestamp}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
