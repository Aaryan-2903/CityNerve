'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Users, PlusSquare, MapPinOff, Home, Clock, Truck, AlertTriangle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface Metric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  dotColor: string;
  glowColor: string;
  icon: React.ElementType;
}

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
        'min-w-[150px] flex-1',
      )}
      style={{
        boxShadow: `0 0 0 1px ${metric.dotColor}15, 0 4px 24px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Label row */}
      <div className="flex items-center gap-2">
        <metric.icon className="w-3.5 h-3.5" style={{ color: metric.dotColor }} />
        <span className="text-[11px] font-medium text-white/45 tracking-wide whitespace-nowrap">
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
      <p className="text-[11px] text-white/30 leading-none whitespace-nowrap">{metric.subtext}</p>
    </motion.div>
  );
}

export function MetricCards() {
  const { metricsData } = useDashboardData();

  const metricsArray: Metric[] = [
    {
      id: 'population',
      label: 'Population Affected',
      value: metricsData.population.value,
      subtext: metricsData.population.subtext,
      dotColor: '#EF4444',
      glowColor: 'rgba(239,68,68,0.3)',
      icon: Users,
    },
    {
      id: 'hospitals',
      label: 'Hospitals Nearby',
      value: metricsData.hospitals.value,
      subtext: metricsData.hospitals.subtext,
      dotColor: '#EAB308',
      glowColor: 'rgba(234,179,8,0.3)',
      icon: PlusSquare,
    },
    {
      id: 'roads',
      label: 'Roads Closed',
      value: metricsData.roads.value,
      subtext: metricsData.roads.subtext,
      dotColor: '#F97316',
      glowColor: 'rgba(249,115,22,0.3)',
      icon: MapPinOff,
    },
    {
      id: 'shelters',
      label: 'Shelters Available',
      value: metricsData.shelters.value,
      subtext: metricsData.shelters.subtext,
      dotColor: '#22C55E',
      glowColor: 'rgba(34,197,94,0.3)',
      icon: Home,
    },
    {
      id: 'response_time',
      label: 'Avg Response Time',
      value: metricsData.responseTime.value,
      subtext: metricsData.responseTime.subtext,
      dotColor: '#A855F7',
      glowColor: 'rgba(168,85,247,0.3)',
      icon: Clock,
    },
    {
      id: 'deployed_units',
      label: 'Deployed Units',
      value: metricsData.deployed.value,
      subtext: metricsData.deployed.subtext,
      dotColor: '#3B82F6',
      glowColor: 'rgba(59,130,246,0.3)',
      icon: Truck,
    },
    {
      id: 'active_incidents',
      label: 'Active Incidents',
      value: metricsData.incidents.value,
      subtext: metricsData.incidents.subtext,
      dotColor: '#EF4444',
      glowColor: 'rgba(239,68,68,0.3)',
      icon: AlertTriangle,
    }
  ];

  return (
    <div className="flex items-end gap-3 px-5 pb-5 w-full overflow-x-auto scrollbar-hide">
      {metricsArray.map((metric, i) => (
        <MetricCardItem key={metric.id} metric={metric} index={i} />
      ))}
    </div>
  );
}
