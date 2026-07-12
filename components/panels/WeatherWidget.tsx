'use client';

import { Cloud, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/GlassCard';
import { useDashboardData } from '@/hooks/useDashboardData';

export function WeatherWidget() {
  const { liveWeather, isLoadingDashboard } = useDashboardData();
  const currentWeather = liveWeather;

  const ALERT_STYLE = {
    warning:  { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.2)'  },
    advisory: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.2)'  },
  };

  const currentAlertStyle = currentWeather ? ALERT_STYLE[currentWeather.alertLevel as keyof typeof ALERT_STYLE] : undefined;

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-300" />
          <h2 className="text-sm font-semibold text-white/90">Weather Conditions</h2>
          <AnimatePresence>
            {isLoadingDashboard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-3 h-3 text-white/40 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {currentWeather?.last_updated && (
          <span className="text-[10px] text-white/40 font-mono">
            UPDATED: {new Date(currentWeather.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {/* Current conditions */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentWeather?.last_updated || 'static'}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-white/90 flex items-center gap-2">
              <span>{currentWeather?.emoji}</span>
              <span className="text-lg">{currentWeather?.label}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Temperature */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2">
            <div className="w-3.5 h-3.5 shrink-0 text-orange-400 flex items-center justify-center">🌡️</div>
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Temp / Feels</p>
              <p className="text-[11px] font-semibold text-white/80">
                {currentWeather?.temperature}°C <span className="text-white/40 font-normal">/ {currentWeather?.apparent_temperature}°C</span>
              </p>
            </div>
          </div>
          {/* Rainfall */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2">
            <Droplets className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Rainfall</p>
              <p className="text-[11px] font-semibold text-blue-400">{currentWeather?.rainfall} mm/h</p>
            </div>
          </div>
          {/* Humidity */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2">
            <div className="w-3.5 h-3.5 shrink-0 text-cyan-400 flex items-center justify-center">💧</div>
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Humidity</p>
              <p className="text-[11px] font-semibold text-cyan-400">{currentWeather?.humidity}%</p>
            </div>
          </div>
          {/* Wind */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2">
            <div className="w-3.5 h-3.5 shrink-0 text-slate-400 flex items-center justify-center">💨</div>
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Wind</p>
              <p className="text-[11px] font-semibold text-slate-300">{currentWeather?.wind_speed} km/h</p>
            </div>
          </div>
        </div>
      </div>
        </motion.div>
      </AnimatePresence>

      {/* Weather Alert */}
      {currentWeather && currentAlertStyle && (
        <div className="px-3 py-2.5">
          <div
            className="flex items-start gap-2 rounded-lg px-2.5 py-2"
            style={{ backgroundColor: currentAlertStyle.bg, border: `1px solid ${currentAlertStyle.border}` }}
          >
            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: currentAlertStyle.color }} />
            <p className="text-[10px] leading-snug" style={{ color: currentAlertStyle.color }}>
              {currentWeather.alertText}
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
