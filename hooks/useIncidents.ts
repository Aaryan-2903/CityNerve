'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Incident, Severity, IncidentType, IncidentStatus } from '@/types/incident';
import { SEVERITY_ORDER } from '@/utils/severity';
import { useIncidentsContext } from '@/context/IncidentContext';

export interface IncidentFilters {
  severity: Severity | 'all';
  status: IncidentStatus | 'all';
  type: IncidentType | 'all';
  search: string;
}

const DEFAULT_FILTERS: IncidentFilters = {
  severity: 'all',
  status: 'all',
  type: 'all',
  search: '',
};

export function useIncidents() {
  const { incidents, isLoading, refetch } = useIncidentsContext();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [filters, setFilters] = useState<IncidentFilters>(DEFAULT_FILTERS);

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        if (filters.severity !== 'all' && inc.severity !== filters.severity) return false;
        if (filters.status !== 'all' && inc.status !== filters.status) return false;
        if (filters.type !== 'all' && inc.type !== filters.type) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          return (
            inc.title.toLowerCase().includes(q) ||
            inc.location.address.toLowerCase().includes(q) ||
            inc.location.district.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [incidents, filters]);

  const selectedIncident = useMemo(
    () => incidents.find((i) => i.id === selectedIncidentId) ?? null,
    [incidents, selectedIncidentId]
  );

  const selectIncident = useCallback((id: string | null) => {
    setSelectedIncidentId(id);
  }, []);

  const updateFilter = useCallback(
    <K extends keyof IncidentFilters>(key: K, value: IncidentFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const stats = useMemo(
    () => ({
      total: incidents.length,
      active: incidents.filter((i) => i.status === 'active' || i.status === 'escalating').length,
      critical: incidents.filter((i) => i.severity === 'critical').length,
      totalCasualties: incidents.reduce((sum, i) => sum + i.casualties, 0),
    }),
    [incidents]
  );

  return {
    incidents: filteredIncidents,
    allIncidents: incidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    filters,
    setFilters,
    isLoading,
    selectIncident,
    updateFilter,
    resetFilters,
    refetch,
    stats,
  };
}
