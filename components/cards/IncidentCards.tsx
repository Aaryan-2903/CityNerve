'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Users, AlertTriangle, Crosshair } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardInteraction } from '@/context/DashboardInteractionContext';
import { ResourceStatusGrid } from '@/components/panels/ResourceStatusGrid';
import { IncidentSkeleton } from '@/components/shared/Skeletons';
import { Loader2 } from 'lucide-react';
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

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  CRITICAL: { label: 'CRITICAL', color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  icon: '🔴' },
  HIGH:     { label: 'HIGH',     color: '#F97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', icon: '🟠' },
  MEDIUM:   { label: 'MEDIUM',   color: '#EAB308', bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.25)',  icon: '🟡' },
  LOW:      { label: 'LOW',      color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.25)',  icon: '🟢' },
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
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function IncidentCardItem({ incident, index, isSelected, onSelect }: IncidentCardItemProps) {
  const sConfig = SEVERITY_CONFIG[incident.severity];
  const statusColor = STATUS_COLOR[incident.status] ?? '#6B7280';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.3, delay: incident.isNew ? 0 : 0.06 * index }}
      onClick={() => onSelect(incident.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(incident.id);
        }
      }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={`Incident: ${incident.title}, Severity: ${incident.severity}`}
      className={cn(
        'rounded-xl border p-3.5 cursor-pointer transition-all duration-200 relative',
        'hover:brightness-110 hover:shadow-md hover:border-white/30',
        incident.isNew && 'ring-1 ring-orange-500/40',
        'transition-all duration-200 cursor-pointer text-left',
        isSelected && 'ring-2 shadow-lg z-floating',
      )}
      style={{
        backgroundColor: sConfig.bg,
        borderColor: isSelected ? sConfig.color : sConfig.border,
        boxShadow: isSelected ? `0 0 0 2px ${sConfig.color}40, 0 4px 20px ${sConfig.color}15` : undefined,
      }}
    >
      {/* Selected: focus-on-map badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="selected-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            style={{ backgroundColor: `${sConfig.color}20`, color: sConfig.color, border: `1px solid ${sConfig.color}40` }}
          >
            <Crosshair className="w-2.5 h-2.5" />
            Focused
          </motion.div>
        )}
      </AnimatePresence>

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
        <p className="text-[13px] font-semibold text-white/90 leading-tight pr-14">{incident.title}</p>
        <span
          className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
          style={{ color: sConfig.color, backgroundColor: `${sConfig.color}18`, border: `1px solid ${sConfig.border}` }}
        >
          {incident.severity}
        </span>
      </div>

      {/* Detail row */}
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
  const { baseIncidents, isLoadingDashboard, isRefetchingDashboard } = useDashboardData();
  const { selectedIncidentId, setSelectedIncidentId } = useDashboardInteraction();

  const simIncidents = sim?.simIncidents ?? [];

  const allIncidents: Incident[] = [
    ...(simIncidents as unknown as Incident[]),
    ...(baseIncidents as unknown as Incident[]),
  ];

  const criticalCount = allIncidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount     = allIncidents.filter((i) => i.severity === 'HIGH').length;

  function handleSelect(id: string) {
    // Toggle: clicking selected card deselects
    setSelectedIncidentId(id === selectedIncidentId ? null : id);
  }

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
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-white/70 uppercase">Incident Cards</h2>
          <AnimatePresence>
            {isRefetchingDashboard && !isLoadingDashboard && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="popLayout">
            {criticalCount > 0 && (
              <motion.span 
                key="crit-count"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/25 px-2 py-0.5"
              >
                <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                <motion.span key={criticalCount} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] font-bold text-red-400">
                  {criticalCount} critical
                </motion.span>
              </motion.span>
            )}
            {highCount > 0 && (
              <motion.span 
                key="high-count"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/25 px-2 py-0.5"
              >
                <span className="h-1 w-1 rounded-full bg-orange-400 animate-pulse" />
                <motion.span key={highCount} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] font-bold text-orange-400">
                  {highCount} high
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
          {/* Hint text */}
          <span className="text-[9px] text-white/20 hidden sm:block">click to focus map</span>
        </div>
      </div>

      <ResourceStatusGrid />

      {/* Incident list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 p-3">
          <AnimatePresence mode="popLayout">
            {isLoadingDashboard ? (
              <>
                <motion.div key="skel1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IncidentSkeleton />
                </motion.div>
                <motion.div key="skel2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IncidentSkeleton />
                </motion.div>
                <motion.div key="skel3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IncidentSkeleton />
                </motion.div>
              </>
            ) : (
              allIncidents.map((incident, i) => (
                <IncidentCardItem
                  key={incident.id}
                  incident={incident}
                  index={i}
                  isSelected={selectedIncidentId === incident.id}
                  onSelect={handleSelect}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-4 py-2 shrink-0">
        <p className="text-[10px] text-white/20 font-mono">
          {allIncidents.length} active · sorted by severity
          {selectedIncidentId && (
            <span className="ml-2 text-cyan-400/60">· map focused</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
