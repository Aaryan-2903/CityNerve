'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Incident, Severity, IncidentType, IncidentStatus } from '@/types/incident';
import { SEVERITY_ORDER } from '@/utils/severity';
import { useCity } from '@/context/CityContext';

const API_BASE = 'http://127.0.0.1:8000';

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
  const { currentCity } = useCity();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [filters, setFilters] = useState<IncidentFilters>(DEFAULT_FILTERS);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIncidents = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/incidents?cityId=${currentCity.id}`);
      if (!res.ok) throw new Error('Failed to fetch incidents');
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [currentCity.id]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

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
    refetch: fetchIncidents,
  };
}
