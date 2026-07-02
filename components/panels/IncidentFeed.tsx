'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/shared/GlassCard';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import type { Incident, Severity } from '@/types/incident';
import { SEVERITY_CONFIG, INCIDENT_TYPE_CONFIG, INCIDENT_STATUS_CONFIG } from '@/constants/incidents';
import { formatRelativeTime, formatPopulation } from '@/utils/format';

const SEVERITY_FILTERS: Array<{ value: Severity | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Crit' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Med' },
];

interface IncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}

function IncidentCard({ incident, isSelected, onClick }: IncidentCardProps) {
  const severityConfig = SEVERITY_CONFIG[incident.severity];
  const typeConfig = INCIDENT_TYPE_CONFIG[incident.type];
  const statusConfig = INCIDENT_STATUS_CONFIG[incident.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard
        onClick={onClick}
        hoverable
        glowColor={isSelected ? severityConfig.color : undefined}
        className={cn(
          'p-3 transition-all duration-200',
          isSelected && 'border-opacity-30',
        )}
        style={
          isSelected
            ? { borderColor: severityConfig.borderColor }
            : undefined
        }
      >
        {/* Top row: severity + type + time */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm">{typeConfig.emoji}</span>
            <SeverityBadge severity={incident.severity} size="sm" pulse={incident.status === 'active' || incident.status === 'escalating'} />
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: statusConfig.color }}
            >
              {incident.status === 'escalating' ? '▲ ESCALATING' : statusConfig.label}
            </span>
          </div>
          <span suppressHydrationWarning className="text-[10px] font-mono text-white/25 shrink-0">
            {formatRelativeTime(incident.timestamp)}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-white/90 leading-tight mb-1.5 line-clamp-1">
          {incident.title}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-white/25 shrink-0" />
          <span className="text-[11px] text-white/35 truncate">{incident.location.district}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-white/20" />
              <span className="text-[10px] text-white/40 font-mono">
                {formatPopulation(incident.affectedPopulation)}
              </span>
            </div>
            {incident.casualties > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-red-400 font-mono font-bold">
                  {incident.casualties} cas.
                </span>
              </div>
            )}
          </div>

          {/* AI Risk Score */}
          <div
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5"
            style={{
              backgroundColor: `${severityConfig.bgColor}`,
              border: `1px solid ${severityConfig.borderColor}`,
            }}
          >
            <TrendingUp className="w-2.5 h-2.5" style={{ color: severityConfig.color }} />
            <span
              className="text-[10px] font-bold font-mono"
              style={{ color: severityConfig.color }}
            >
              {incident.aiRiskScore}
            </span>
          </div>
        </div>

        {/* Resources deployed */}
        {incident.resourcesDeployed.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center gap-1.5">
            <span className="text-[9px] text-white/20 uppercase tracking-wider">Resources:</span>
            <div className="flex gap-1 flex-wrap">
              {incident.resourcesDeployed.slice(0, 3).map((r) => (
                <span
                  key={r}
                  className="text-[9px] font-mono text-white/30 bg-white/[0.04] rounded px-1 py-0.5"
                >
                  {r}
                </span>
              ))}
              {incident.resourcesDeployed.length > 3 && (
                <span className="text-[9px] font-mono text-white/20">
                  +{incident.resourcesDeployed.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

interface IncidentFeedProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string | null) => void;
  totalCount: number;
}

export function IncidentFeed({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  totalCount,
}: IncidentFeedProps) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');

  const displayed = incidents.filter((inc) => {
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.location.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <StatusIndicator variant="live" showLabel={false} size="sm" />
          <h2 className="text-sm font-semibold text-white/90">Incident Feed</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500/20 px-1.5 text-[10px] font-bold text-red-400 border border-red-500/25">
            {totalCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-white/20" />
          <span className="text-[10px] text-white/25 font-mono">LIVE</span>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="border-b border-white/[0.06] px-3 py-2.5 shrink-0 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-8 pr-3 py-1.5 text-xs text-white/70 placeholder-white/20 outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-white/20" />
          <div className="flex gap-1">
            {SEVERITY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setSeverityFilter(f.value)}
                className={cn(
                  'rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all',
                  severityFilter === f.value
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-white/30 hover:text-white/60 border border-transparent hover:border-white/[0.08]',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <p className="text-sm text-white/20">No incidents match filters</p>
            </motion.div>
          ) : (
            displayed.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isSelected={selectedIncidentId === incident.id}
                onClick={() =>
                  onSelectIncident(selectedIncidentId === incident.id ? null : incident.id)
                }
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
