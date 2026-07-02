'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Metric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  dotColor: string;
  glowColor: string;
}

const METRICS: Metric[] = [
  {
    id: 'incidents',
    label: 'Active Incidents',
    value: '18',
    subtext: '+5 in last hour',
    dotColor: '#EF4444',
    glowColor: 'rgba(239,68,68,0.3)',
  },
  {
    id: 'teams',
    label: 'Rescue Teams',
    value: '42',
    subtext: '12 en route',
    dotColor: '#22C55E',
    glowColor: 'rgba(34,197,94,0.3)',
  },
  {
    id: 'shelters',
    label: 'Shelters',
    value: '27',
    subtext: '3 near capacity',
    dotColor: '#EAB308',
    glowColor: 'rgba(234,179,8,0.3)',
  },
  {
    id: 'response',
    label: 'Average Response',
    value: '7m 42s',
    subtext: 'Improving',
    dotColor: '#22C55E',
    glowColor: 'rgba(34,197,94,0.3)',
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
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60"
            style={{ backgroundColor: metric.dotColor }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: metric.dotColor }}
          />
        </span>
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
