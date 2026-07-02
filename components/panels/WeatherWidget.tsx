'use client';

import { Cloud, Wind, Thermometer, Droplets, Eye, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

interface WeatherCondition {
  label: string;
  value: string;
  icon: React.ElementType;
  color?: string;
}

const CONDITIONS: WeatherCondition[] = [
  { label: 'Wind', value: '34 mph SSW', icon: Wind, color: '#F97316' },
  { label: 'Temp', value: '62°F / 17°C', icon: Thermometer },
  { label: 'Humidity', value: '89%', icon: Droplets },
  { label: 'Visibility', value: '2.1 mi', icon: Eye, color: '#EAB308' },
];

const ALERTS = [
  { text: 'Tornado Warning — Staten Island until 22:45', level: 'warning' as const },
  { text: 'Storm Surge Advisory — Lower Manhattan', level: 'advisory' as const },
  { text: 'Dense Fog Advisory — Harbor areas', level: 'advisory' as const },
];

const ALERT_STYLE = {
  warning: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  advisory: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
};

export function WeatherWidget() {
  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-300" />
          <h2 className="text-sm font-semibold text-white/90">Weather Conditions</h2>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-bold text-red-400">{ALERTS.length} Alerts</span>
        </div>
      </div>

      {/* Current conditions */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-2xl font-bold text-white/90">
              🌩️ <span className="text-lg">Severe</span>
            </p>
            <p className="text-[11px] text-white/30 mt-0.5">NYC Metro Area · NWS</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Updated</p>
            <p className="text-[11px] font-mono text-white/50">3 min ago</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map((cond) => {
            const Icon = cond.icon;
            return (
              <div
                key={cond.label}
                className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2"
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: cond.color ?? 'rgba(255,255,255,0.35)' }}
                />
                <div>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider">{cond.label}</p>
                  <p
                    className="text-[11px] font-semibold"
                    style={{ color: cond.color ?? 'rgba(255,255,255,0.7)' }}
                  >
                    {cond.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="px-3 py-2.5 space-y-1.5">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-1">
          Active Alerts
        </p>
        {ALERTS.map((alert, i) => {
          const style = ALERT_STYLE[alert.level];
          return (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg px-2.5 py-2"
              style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
            >
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: style.color }} />
              <p className="text-[10px] leading-snug" style={{ color: style.color }}>
                {alert.text}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
