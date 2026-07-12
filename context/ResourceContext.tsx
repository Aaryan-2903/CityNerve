'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCity } from '@/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { useIncidentsContext } from '@/context/IncidentContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface EmergencyResourceCount {
  available: number;
  busy: number;
  enRoute: number;
}

export interface EmergencyResourcesData {
  [key: string]: EmergencyResourceCount;
}

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
  
  const [resources, setResources] = useState<EmergencyResourcesData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = useCallback(async () => {
    if (!currentCity?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/resources?cityId=${currentCity.id}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResources(json);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [currentCity]);

  // Sync on city change, simulation change, or incidents change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResources();
  }, [fetchResources, sim?.phase, incidents]);

  // Also poll every 15s if visible
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchResources();
      }
    }, 15000);

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
