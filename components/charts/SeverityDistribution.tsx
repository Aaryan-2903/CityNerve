'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard } from '@/components/shared/GlassCard';
import { BarChart3 } from 'lucide-react';
import type { Incident } from '@/types/incident';
import { SEVERITY_CONFIG } from '@/constants/incidents';

interface SeverityDistributionProps {
  incidents: Incident[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.1] bg-[#0D1420]/95 p-2.5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
        <span className="text-[11px] text-white/60">{payload[0].name}:</span>
        <span className="text-[11px] font-bold text-white/80">{payload[0].value}</span>
      </div>
    </div>
  );
}

export function SeverityDistribution({ incidents }: SeverityDistributionProps) {
  const counts = {
    critical: incidents.filter((i) => i.severity === 'critical').length,
    high: incidents.filter((i) => i.severity === 'high').length,
    medium: incidents.filter((i) => i.severity === 'medium').length,
    low: incidents.filter((i) => i.severity === 'low').length,
    resolved: incidents.filter((i) => i.severity === 'resolved').length,
  };

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: SEVERITY_CONFIG[key as keyof typeof counts].label,
      value,
      fill: SEVERITY_CONFIG[key as keyof typeof counts].color,
    }));

  const active = incidents.filter(
    (i) => i.status === 'active' || i.status === 'escalating',
  ).length;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white/90">Severity Split</h3>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={46}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-white/90 leading-none">{active}</span>
            <span className="text-[9px] text-white/30 leading-none mt-0.5">active</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-[10px] text-white/40">{entry.name}</span>
              </div>
              <span className="text-[10px] font-bold font-mono text-white/60">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
