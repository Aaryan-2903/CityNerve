'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSimulationContext } from '@/context/SimulationContext';

export function LiveAlertBanner() {
  const { metricsData, riskScore, liveWeather } = useDashboardData();
  const sim = useSimulationContext();
  
  let alert = null;
  const roadsClosed = parseInt(metricsData?.roads?.value ?? '0');
  
  if ((riskScore ?? 0) > 80) {
    alert = {
      type: 'critical',
      message: 'CRITICAL ALERT: Imminent Threat in Sector 4',
      icon: AlertTriangle,
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      dot: 'bg-red-400'
    };
  } else if ((sim?.phase ?? 0) > 3) {
    alert = {
      type: 'high',
      message: 'FLASH FLOOD WARNING: Evacuation Orders in Effect',
      icon: AlertTriangle,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-400'
    };
  } else if (roadsClosed > 0) {
    alert = {
      type: 'medium',
      message: `ROAD CLOSURES: ${roadsClosed} major arterials blocked`,
      icon: AlertCircle,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      dot: 'bg-yellow-400'
    };
  } else if (liveWeather?.label?.toLowerCase().includes('storm') || liveWeather?.label?.toLowerCase().includes('rain')) {
    alert = {
      type: 'info',
      message: `WEATHER ADVISORY: ${liveWeather.label} approaching`,
      icon: Info,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400'
    };
  }

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase border-b backdrop-blur-md z-50 ${alert.color}`}
        >
          <span className="relative flex h-2 w-2 mr-1">
            <span className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 ${alert.dot}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${alert.dot}`} />
          </span>
          <alert.icon className="w-4 h-4 mr-1" />
          {alert.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
