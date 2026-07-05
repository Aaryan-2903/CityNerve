'use client';

import { Users, MapPinOff, Home, PlusSquare } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

interface ImpactSummaryProps {
  population: string;
  roadsClosed: number;
  sheltersOpen: number;
  hospitalsNearby: number;
}

export function ImpactSummary({ population, roadsClosed, sheltersOpen, hospitalsNearby }: ImpactSummaryProps) {
  const metrics = [
    { label: 'Affected Population', value: population, icon: Users, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Roads Closed', value: roadsClosed, icon: MapPinOff, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Shelters Open', value: sheltersOpen, icon: Home, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Hospitals Nearby', value: hospitalsNearby, icon: PlusSquare, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  ];

  return (
    <GlassCard className="px-4 py-3 flex items-center justify-between border-white/[0.06] bg-[#0C1220]/80">
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.05]" style={{ backgroundColor: m.bg }}>
            <m.icon className="h-4 w-4" style={{ color: m.color }} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{m.label}</p>
            <p className="text-lg font-bold leading-none tracking-tight text-white/90 mt-0.5">{m.value}</p>
          </div>
          {i < metrics.length - 1 && (
            <div className="mx-2 h-8 w-px bg-white/[0.06]" />
          )}
        </div>
      ))}
    </GlassCard>
  );
}
