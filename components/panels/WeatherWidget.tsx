'use client';

import { Cloud, Droplets, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { useSimulationContext } from '@/context/SimulationContext';
import { PHASE_WEATHER } from '@/data/simulationScenario';
import { useCity } from '@/src/context/CityContext';
import { localizeData } from '@/src/data/cities';
import { useMemo } from 'react';

export function WeatherWidget() {
  const sim = useSimulationContext();
  const { currentCity } = useCity();

  const fallbackWeather = useMemo(
    () => localizeData(PHASE_WEATHER[0], currentCity),
    [currentCity]
  );

  // Fallback to phase-0 weather when no simulation context exists
  const currentWeather = sim && sim.status !== 'idle' ? sim.weather : fallbackWeather;

  const ALERT_STYLE = {
    warning:  { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.2)'  },
    advisory: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.2)'  },
  };

  const currentAlertStyle = ALERT_STYLE[currentWeather.alertLevel];

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-300" />
          <h2 className="text-sm font-semibold text-white/90">Weather Conditions</h2>
        </div>
      </div>

      {/* Current conditions */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-white/90">
              {currentWeather.emoji} <span className="text-lg">{currentWeather.label}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Rainfall */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2">
            <Droplets className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Rainfall</p>
              <p className="text-[11px] font-semibold text-blue-400">{currentWeather.rainfall}</p>
            </div>
          </div>
          {/* Forecast */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2">
            <Cloud className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider">Forecast</p>
              <p className="text-[11px] font-semibold text-purple-400">{currentWeather.forecast}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alert */}
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
    </GlassCard>
  );
}
