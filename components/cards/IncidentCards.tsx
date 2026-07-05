'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Users, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import type { SimIncident } from '@/data/simulationScenario';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface Incident {
  id: string;
  title: string;
  severity: Severity;
  time: string;
  team: string;
  status: string;
  impact: string;
  location: string;
  isNew?: boolean;
}

const INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    title: 'Riverside Underpass',
    severity: 'CRITICAL',
    time: '22:20',
    team: 'Bravo-2',
    status: 'Responding',
    impact: '1,180 residents affected',
    location: 'Ward 6, South Zone',
  },
  {
    id: 'INC-002',
    title: 'Bridge 4 Approach',
    severity: 'HIGH',
    time: '22:23',
    team: 'Traffic-7',
    status: 'Closure pending',
    impact: '6 road segments blocked',
    location: 'East River Corridor',
  },
  {
    id: 'INC-003',
    title: 'Dharavi Sector 9',
    severity: 'HIGH',
    time: '22:15',
    team: 'Delta-1',
    status: 'Evacuating',
    impact: '340 families displaced',
    location: 'Central Ward',
  },
  {
    id: 'INC-004',
    title: 'Bandra Pumping Station',
    severity: 'MEDIUM',
    time: '22:08',
    team: 'Eng-3',
    status: 'Under repair',
    impact: 'Drainage backup — 2 sq km',
    location: 'North District',
  },
];

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  CRITICAL: {
    label: 'CRITICAL',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    icon: '🔴',
  },
  HIGH: {
    label: 'HIGH',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
    icon: '🟠',
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: '#EAB308',
    bg: 'rgba(234,179,8,0.12)',
    border: 'rgba(234,179,8,0.25)',
    icon: '🟡',
  },
  LOW: {
    label: 'LOW',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    icon: '🟢',
  },
};

const STATUS_COLOR: Record<string, string> = {
  Responding:        '#22C55E',
  Evacuating:        '#F97316',
  'Closure pending': '#EAB308',
  'Under repair':    '#3B82F6',
  Unverified:        '#6B7280',
};

interface IncidentCardItemProps {
  incident: Incident;
  index: number;
}

function IncidentCardItem({ incident, index }: IncidentCardItemProps) {
  const sConfig = SEVERITY_CONFIG[incident.severity];
  const statusColor = STATUS_COLOR[incident.status] ?? '#6B7280';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.3, delay: incident.isNew ? 0 : 0.06 * index }}
      className={cn(
        'rounded-xl border p-3.5 cursor-pointer transition-all duration-200',
        'hover:brightness-110 hover:scale-[1.005]',
        incident.isNew && 'ring-1 ring-orange-500/40',
      )}
      style={{
        backgroundColor: sConfig.bg,
        borderColor: sConfig.border,
      }}
    >
      {/* New badge */}
      {incident.isNew && (
        <div className="flex items-center gap-1 mb-2">
          <span className="rounded-full bg-orange-500/20 border border-orange-500/30 px-2 py-0.5 text-[9px] font-bold text-orange-400 tracking-widest uppercase animate-pulse">
            ● NEW · Citizen Report
          </span>
        </div>
      )}

      {/* Top row: title + severity */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-[13px] font-semibold text-white/90 leading-tight">{incident.title}</p>
        <span
          className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
          style={{
            color: sConfig.color,
            backgroundColor: `${sConfig.color}18`,
            border: `1px solid ${sConfig.border}`,
          }}
        >
          {incident.severity}
        </span>
      </div>

      {/* Detail row: time, team, status */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-white/20" />
          <span className="font-mono text-[11px] text-white/40">{incident.time}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-white/20" />
          <span className="text-[11px] text-white/50">{incident.team}</span>
        </div>
        <span className="text-[11px] font-semibold" style={{ color: statusColor }}>
          {incident.status}
        </span>
      </div>

      {/* Impact row */}
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-white/20 shrink-0" />
        <span className="text-[11px] text-white/35">{incident.impact}</span>
        <span className="text-white/15 mx-1">·</span>
        <span className="text-[10px] text-white/20 font-mono">{incident.location}</span>
      </div>

      {/* ID tag */}
      <div className="mt-2 pt-2 border-t border-white/[0.05]">
        <span className="text-[9px] font-mono text-white/15">{incident.id}</span>
      </div>
    </motion.div>
  );
}

export function IncidentCards() {
  const sim = useSimulationContext();
  const simIncidents = sim?.simIncidents ?? [];

  // Merge sim incidents (prepended) with static incidents
  const allIncidents: Incident[] = [
    ...(simIncidents as Incident[]),
    ...INCIDENTS,
  ];

  const criticalCount = allIncidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount     = allIncidents.filter((i) => i.severity === 'HIGH').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="flex h-full flex-col border-r border-white/[0.06] bg-[#090D1A]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-white/70 uppercase">
            Incident Cards
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/25 px-2 py-0.5">
              <span className="h-1 w-1 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-400">{criticalCount} critical</span>
            </span>
          )}
          {highCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/25 px-2 py-0.5">
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              <span className="text-[10px] font-bold text-orange-400">{highCount} high</span>
            </span>
          )}
        </div>
      </div>

      {/* Incident list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-3">
          <AnimatePresence mode="popLayout">
            {allIncidents.map((incident, i) => (
              <IncidentCardItem key={incident.id} incident={incident} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-4 py-2 shrink-0">
        <p className="text-[10px] text-white/20 font-mono">
          {allIncidents.length} active · sorted by severity
        </p>
      </div>
    </motion.div>
  );
}
