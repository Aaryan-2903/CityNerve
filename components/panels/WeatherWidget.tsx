'use client';

import { Cloud, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/GlassCard';
import { useWeather } from '@/hooks/useWeather';
import { useCity } from '@/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { WeatherSkeleton } from '@/components/shared/Skeletons';
import { formatHHMMSS } from '@/utils/format';

export function WeatherWidget() {
  const { currentCity } = useCity();
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;
  const { weather: currentWeather, isLoading, isRefetching, lastUpdated } = useWeather(currentCity.id, phase);

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
            {(isLoading || isRefetching) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {(lastUpdated || currentWeather?.last_updated) && (
          <span className="text-[10px] text-white/40 font-mono">
            UPDATED: {lastUpdated ? formatHHMMSS(lastUpdated) : currentWeather?.last_updated ? formatHHMMSS(new Date(currentWeather.last_updated)) : '--:--:--'}
          </span>
        )}
      </div>

      {/* Current conditions */}
      <AnimatePresence mode="wait">
        {isLoading && !currentWeather ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WeatherSkeleton />
          </motion.div>
        ) : !currentWeather ? (
          <motion.div 
            key="unavailable"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-8 border-b border-white/[0.06] flex flex-col items-center justify-center text-center gap-2"
          >
            <Cloud className="w-8 h-8 text-white/20" />
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Weather Data Unavailable</p>
          </motion.div>
        ) : (
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
                <span>{currentWeather?.emoji || '☁️'}</span>
                <span className="text-lg">{currentWeather?.label || '--'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            {/* Temperature */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 h-full">
              <div className="w-4 h-4 shrink-0 text-orange-400 flex items-center justify-center text-[14px]">🌡️</div>
              <div className="flex flex-col justify-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-0.5">Temp / Feels</p>
                <p className="text-[11px] font-bold text-white/90 leading-none">
                  {currentWeather?.temperature ?? '--'}°C <span className="text-white/40 font-semibold">/ {currentWeather?.apparent_temperature ?? '--'}°C</span>
                </p>
              </div>
            </div>
            {/* Rainfall */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 h-full">
              <Droplets className="w-4 h-4 shrink-0 text-blue-400" />
              <div className="flex flex-col justify-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-0.5">Rainfall</p>
                <p className="text-[11px] font-bold text-blue-400 leading-none">{currentWeather?.rainfall ?? '--'}</p>
              </div>
            </div>
            {/* Humidity */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 h-full">
              <div className="w-4 h-4 shrink-0 text-cyan-400 flex items-center justify-center text-[14px]">💧</div>
              <div className="flex flex-col justify-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-0.5">Humidity</p>
                <p className="text-[11px] font-bold text-cyan-400 leading-none">{currentWeather?.humidity ?? '--'}%</p>
              </div>
            </div>
            {/* Wind */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 h-full">
              <div className="w-4 h-4 shrink-0 text-slate-400 flex items-center justify-center text-[14px]">💨</div>
              <div className="flex flex-col justify-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-0.5">Wind</p>
                <p className="text-[11px] font-bold text-slate-300 leading-none">{currentWeather?.wind_speed ?? '--'} km/h</p>
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        )}
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
