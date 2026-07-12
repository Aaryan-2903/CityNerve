'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationContext } from '@/context/SimulationContext';
import { SIMULATION_ALERTS } from '@/data/simulationAlerts';
import { useEffect, useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AlertTriangle, Info } from 'lucide-react';

export function LiveAlertBanner() {
  const sim = useSimulationContext();
  const { liveWeather } = useDashboardData();
  const phase = sim?.phase ?? 0;
  
  let alert = SIMULATION_ALERTS[phase];

  // Dynamic weather-based alert override if phase is low
  if (liveWeather && phase < 3) {
    if (liveWeather.alertLevel === 'warning') {
      alert = {
        title: 'SEVERE WEATHER WARNING',
        description: liveWeather.alertText || 'Severe weather conditions detected.',
        severity: 'warning',
        icon: AlertTriangle,
        colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        dotClass: 'bg-orange-400'
      };
    } else if (liveWeather.alertLevel === 'advisory' && phase < 1) {
      alert = {
        title: 'WEATHER ADVISORY',
        description: liveWeather.alertText || 'Monitoring weather conditions.',
        severity: 'advisory',
        icon: Info,
        colorClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        dotClass: 'bg-cyan-400'
      };
    }
  }

  // We want to update the timestamp when the phase changes
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [phase, sim?.status, liveWeather?.alertLevel]);

  if (!alert) return null;

  const Icon = alert.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`px-4 sm:px-6 py-2.5 sm:py-3 border-b backdrop-blur-md z-50 transition-colors duration-500 ease-in-out ${alert.colorClass}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={alert.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between w-full"
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
    </motion.div>
  );
}
