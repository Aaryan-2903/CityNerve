'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Users, PlusSquare, GraduationCap, MapPinOff, Home } from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  dotColor: string;
  glowColor: string;
  icon: React.ElementType;
}

const METRICS: Metric[] = [
  {
    id: 'population',
    label: 'Population Affected',
    value: '12.4k',
    subtext: '+2.1k in last hour',
    dotColor: '#EF4444',
    glowColor: 'rgba(239,68,68,0.3)',
    icon: Users,
  },
  {
    id: 'hospitals',
    label: 'Hospitals Nearby',
    value: '4',
    subtext: '2 at capacity',
    dotColor: '#EAB308',
    glowColor: 'rgba(234,179,8,0.3)',
    icon: PlusSquare,
  },
  {
    id: 'schools',
    label: 'Schools Nearby',
    value: '7',
    subtext: '3 used as shelters',
    dotColor: '#3B82F6',
    glowColor: 'rgba(59,130,246,0.3)',
    icon: GraduationCap,
  },
  {
    id: 'roads',
    label: 'Roads Closed',
    value: '14',
    subtext: 'Major arterial blocked',
    dotColor: '#F97316',
    glowColor: 'rgba(249,115,22,0.3)',
    icon: MapPinOff,
  },
  {
    id: 'shelters',
    label: 'Shelters Available',
    value: '8',
    subtext: 'Total capacity: 4.5k',
    dotColor: '#22C55E',
    glowColor: 'rgba(34,197,94,0.3)',
    icon: Home,
  },
];

interface MetricCardItemProps {
  metric: Metric;
  index: number;
}

function MetricCardItem({ metric, index }: MetricCardItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.07, ease: 'easeOut' }}
      className={cn(
        'flex flex-col gap-1.5 rounded-2xl border border-white/[0.08] px-5 py-4',
        'bg-[#0C1220]/85 backdrop-blur-xl',
        'shadow-[0_4px_32px_rgba(0,0,0,0.5)]',
        'min-w-[160px] flex-1',
      )}
      style={{
        boxShadow: `0 0 0 1px ${metric.dotColor}15, 0 4px 24px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Label row */}
      <div className="flex items-center gap-2">
        <metric.icon className="w-3.5 h-3.5" style={{ color: metric.dotColor }} />
        <span className="text-[11px] font-medium text-white/45 tracking-wide">
          {metric.label}
        </span>
      </div>

      {/* Value */}
      <p
        className="text-2xl font-bold tracking-tight tabular-nums leading-none"
        style={{ color: metric.dotColor }}
      >
        {metric.value}
      </p>

      {/* Subtext */}
      <p className="text-[11px] text-white/30 leading-none">{metric.subtext}</p>
    </motion.div>
  );
}

export function MetricCards() {
  return (
    <div className="flex items-end gap-3 px-5 pb-5 w-full">
      {METRICS.map((metric, i) => (
        <MetricCardItem key={metric.id} metric={metric} index={i} />
      ))}
    </div>
  );
}
