'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { GlassCard } from '@/components/shared/GlassCard';
import { Activity } from 'lucide-react';

const DATA = [
  { time: '06:00', critical: 0, high: 1, medium: 2, low: 3 },
  { time: '08:00', critical: 0, high: 2, medium: 3, low: 4 },
  { time: '10:00', critical: 1, high: 2, medium: 4, low: 3 },
  { time: '12:00', critical: 1, high: 3, medium: 3, low: 5 },
  { time: '14:00', critical: 2, high: 3, medium: 5, low: 4 },
  { time: '16:00', critical: 2, high: 4, medium: 4, low: 6 },
  { time: '18:00', critical: 3, high: 5, medium: 6, low: 4 },
  { time: '20:00', critical: 3, high: 4, medium: 5, low: 3 },
  { time: '22:00', critical: 3, high: 5, medium: 4, low: 2 },
  { time: '00:00', critical: 4, high: 6, medium: 5, low: 3 },
];

const SERIES = [
  { key: 'critical', color: '#EF4444', label: 'Critical' },
  { key: 'high', color: '#F97316', label: 'High' },
  { key: 'medium', color: '#EAB308', label: 'Medium' },
  { key: 'low', color: '#22C55E', label: 'Low' },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.1] bg-[#0D1420]/95 p-3 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-mono text-white/40 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[11px] text-white/60">{entry.name}:</span>
          <span className="text-[11px] font-bold text-white/80">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function IncidentTimeline() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white/90">Incident Timeline</h3>
        </div>
        <span className="text-[10px] font-mono text-white/25">Last 18h</span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {SERIES.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={1.5}
              fill={`url(#grad-${s.key})`}
              stackId="1"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
