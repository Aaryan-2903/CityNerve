'use client';

import { motion } from 'framer-motion';
import {
  Truck,
  Flame,
  Zap,
  Ambulance,
  Shield,
  Wind,
  Radio,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { ResourceSkeleton } from '@/components/shared/Skeletons';
import { Loader2 } from 'lucide-react';
import type { Resource, ResourceStatus, ResourceType } from '@/types/resource';
import { formatHHMMSS } from '@/utils/format';
import { formatRelativeTime, formatETA } from '@/utils/format';
import { useState, useEffect } from 'react';
import { useSimulationContext } from '@/context/SimulationContext';
import { useCity } from '@/context/CityContext';
import { useResources } from '@/hooks/useResources';

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  fire_engine: Flame,
  ambulance: Ambulance,
  police: Shield,
  helicopter: Wind,
  hazmat_team: Zap,
  rescue_team: Users,
  national_guard: Shield,
  command_vehicle: Radio,
  water_tanker: Truck,
  medical_unit: Ambulance,
};

const STATUS_VARIANT_MAP: Record<ResourceStatus, 'live' | 'active' | 'warning' | 'offline' | 'idle'> = {
  deployed: 'live',
  en_route: 'warning',
  available: 'active',
  returning: 'idle',
  maintenance: 'offline',
  standby: 'idle',
};

const STATUS_COLOR: Record<ResourceStatus, string> = {
  deployed: '#22C55E',
  en_route: '#EAB308',
  available: '#3B82F6',
  returning: '#6B7280',
  maintenance: '#6B7280',
  standby: '#6B7280',
};

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = TYPE_ICONS[resource.type] ?? Truck;
  const statusColor = STATUS_COLOR[resource.status];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
    >
      {/* Icon */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `${statusColor}15`,
          border: `1px solid ${statusColor}25`,
        }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: statusColor }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs font-bold text-white/80 font-mono truncate">
            {resource.callSign}
          </span>
          <StatusIndicator
            variant={STATUS_VARIANT_MAP[resource.status]}
            label={resource.status === 'en_route' ? 'EN ROUTE' : resource.status.toUpperCase()}
            size="sm"
          />
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] text-white/30 truncate">{resource.unit}</span>
          <span className="text-[10px] text-white/20 font-mono shrink-0">
            {mounted ? (resource.eta ? formatETA(resource.eta) : formatRelativeTime(resource.lastUpdated)) : '--'}
          </span>
        </div>
        {resource.assignedIncidentId && (
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-white/15" />
            <span className="text-[9px] text-white/20 font-mono">{resource.assignedIncidentId}</span>
            <span className="text-[9px] text-white/15">· {resource.personnel} personnel</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ResourceTracker() {
  const sim = useSimulationContext();
  const { currentCity } = useCity();
  const { resources, isLoading, isRefetching, lastUpdated } = useResources(currentCity.id);

  const deployed: Resource[] = resources.map((r: any, i: number) => ({
    id: r.id,
    type: 'rescue_team' as const,
    status: 'deployed' as const,
    callSign: r.name,
    agency: 'NDRF',
    unit: 'Search & Rescue',
    eta: 300,
    personnel: 12,
    assignedIncidentId: `INC-00${i + 1}`,
    location: { lat: r.lat ?? 0, lng: r.lng ?? 0, address: r.name ?? '' },
    lastUpdated: new Date().toISOString(),
  }));

  const available: Resource[] = [
    {
      id: 'avail-1',
      type: 'medical_unit' as const,
      status: 'available' as const,
      callSign: 'Medical Unit 4',
      agency: 'Health Dept',
      unit: 'First Aid',
      personnel: 5,
      assignedIncidentId: null,
      location: { lat: 0, lng: 0, address: '' },
      lastUpdated: new Date().toISOString(),
    }
  ];

  const agencyGroups = deployed.reduce<Record<string, Resource[]>>((acc, r) => {
    const key = r.agency;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <GlassCard className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white/90">Field Resources</h2>
          {isRefetching && !isLoading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
             </motion.div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/30">Deployed:</span>
            <span className="text-xs font-bold text-green-400 font-mono">{deployed.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/30">Available:</span>
            <span className="text-xs font-bold text-blue-400 font-mono">{available.length}</span>
          </div>
        </div>
      </div>

      {/* Utilization bar */}
      <div className="px-4 py-2.5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Unit Utilization</span>
          <span className="text-[10px] font-mono font-bold text-white/60">
            {Math.round((deployed.length / (deployed.length + available.length + 1)) * 100)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.round((deployed.length / (deployed.length + available.length + 1)) * 100)}%`,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex gap-3 mt-1.5">
          {Object.entries(agencyGroups).map(([agency, units]) => (
            <div key={agency} className="flex items-center gap-1">
              <span className="text-[9px] text-white/20 font-mono">{agency}:</span>
              <span className="text-[9px] text-white/40 font-mono font-bold">{units.length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resource list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <>
            <ResourceSkeleton />
            <ResourceSkeleton />
            <ResourceSkeleton />
          </>
        ) : (
          deployed.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        )}
      </div>
      
      {/* Footer */}
      {(lastUpdated || !isLoading) && (
        <div className="border-t border-white/[0.04] px-4 py-2 shrink-0">
          <p className="text-[10px] text-white/20 font-mono">
            {lastUpdated ? `UPDATED: ${formatHHMMSS(lastUpdated)}` : 'LIVE FEED'}
          </p>
        </div>
      )}
    </GlassCard>
  );
}
