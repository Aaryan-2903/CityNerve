'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCity } from '@/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { useIncidentsContext } from '@/context/IncidentContext';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';

export interface EmergencyResourceCount {
  available: number;
  busy: number;
  enRoute: number;
}

export interface EmergencyResourcesData {
  [key: string]: EmergencyResourceCount;
}

// ---------------------------------------------------------------------------
// Realistic per-city mock data for demo / offline mode
// ---------------------------------------------------------------------------
const MOCK_RESOURCES: Record<string, EmergencyResourcesData> = {
  mumbai:    { ambulance: { available: 14, busy: 6, enRoute: 4 }, police: { available: 32, busy: 18, enRoute: 7 }, fire: { available: 10, busy: 5, enRoute: 2 }, rescue: { available: 8, busy: 3, enRoute: 3 } },
  delhi:     { ambulance: { available: 20, busy: 10, enRoute: 5 }, police: { available: 45, busy: 22, enRoute: 9 }, fire: { available: 15, busy: 7, enRoute: 3 }, rescue: { available: 12, busy: 5, enRoute: 4 } },
  bengaluru: { ambulance: { available: 12, busy: 4, enRoute: 2 }, police: { available: 28, busy: 11, enRoute: 5 }, fire: { available: 9, busy: 3, enRoute: 1 }, rescue: { available: 6, busy: 2, enRoute: 1 } },
  chennai:   { ambulance: { available: 13, busy: 7, enRoute: 3 }, police: { available: 30, busy: 16, enRoute: 6 }, fire: { available: 11, busy: 6, enRoute: 2 }, rescue: { available: 9, busy: 4, enRoute: 2 } },
  kolkata:   { ambulance: { available: 15, busy: 8, enRoute: 4 }, police: { available: 38, busy: 20, enRoute: 8 }, fire: { available: 12, busy: 6, enRoute: 3 }, rescue: { available: 10, busy: 4, enRoute: 3 } },
  hyderabad: { ambulance: { available: 11, busy: 4, enRoute: 2 }, police: { available: 26, busy: 10, enRoute: 4 }, fire: { available: 8, busy: 3, enRoute: 1 }, rescue: { available: 5, busy: 2, enRoute: 1 } },
  pune:      { ambulance: { available: 9, busy: 3, enRoute: 2 }, police: { available: 22, busy: 9, enRoute: 3 }, fire: { available: 7, busy: 2, enRoute: 1 }, rescue: { available: 4, busy: 1, enRoute: 1 } },
};

const DEFAULT_MOCK: EmergencyResourcesData = {
  ambulance: { available: 10, busy: 4, enRoute: 2 },
  police:    { available: 25, busy: 12, enRoute: 5 },
  fire:      { available: 8,  busy: 3,  enRoute: 2 },
  rescue:    { available: 6,  busy: 2,  enRoute: 1 },
};

function getMockForCity(cityId: string): EmergencyResourcesData {
  return MOCK_RESOURCES[cityId] ?? DEFAULT_MOCK;
}

// ---------------------------------------------------------------------------

interface ResourceContextState {
  resources: EmergencyResourcesData;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ResourceContext = createContext<ResourceContextState | null>(null);

export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const { currentCity } = useCity();
  const sim = useSimulationContext();
  const { incidents } = useIncidentsContext();

  const [resources, setResources] = useState<EmergencyResourcesData>(() =>
    getMockForCity(currentCity?.id ?? '')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = useCallback(async () => {
    if (!currentCity?.id) return;

    // No backend URL — use mock data directly.
    if (!API_BASE) {
      setResources(getMockForCity(currentCity.id));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/resources?cityId=${currentCity.id}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // Guard: if all zeros, fall back to mock
      const total = Object.values(json as EmergencyResourcesData).reduce(
        (sum, r) => sum + r.available + r.busy + r.enRoute, 0
      );
      if (total === 0) throw new Error('Empty resource data');
      setResources(json);
      setError(null);
    } catch (err) {
      // Silent fallback — never leave resources empty.
      setResources(getMockForCity(currentCity.id));
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentCity]);

  // Reset to city-specific mock immediately on city switch (no empty flash)
  useEffect(() => {
    setResources(getMockForCity(currentCity?.id ?? ''));
    void fetchResources();
  }, [currentCity, fetchResources, sim?.phase, incidents]);

  // Poll every 30s when tab is visible
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchResources();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchResources();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchResources]);

  const value = {
    resources,
    isLoading,
    error,
    refetch: fetchResources,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResourceContext() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResourceContext must be used within a ResourceProvider');
  }
  return context;
}
