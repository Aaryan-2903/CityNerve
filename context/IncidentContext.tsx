'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, useRef } from 'react';
import type { Incident } from '@/types/incident';
import { useCity } from '@/context/CityContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface IncidentContextState {
  incidents: Incident[];
  isLoading: boolean;
  error: Error | null;
  isReconnecting: boolean;
  refetch: (isSilent?: boolean) => Promise<void>;
}

const IncidentContext = createContext<IncidentContextState>({
  incidents: [],
  isLoading: false,
  error: null,
  isReconnecting: false,
  refetch: async () => {},
});

export function IncidentProvider({ children }: { children: ReactNode }) {
  const { currentCity } = useCity();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  // Use a ref to prevent stale closures and track visibility
  const visibilityRef = useRef<DocumentVisibilityState>('visible');

  const fetchIncidents = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/v1/incidents?cityId=${currentCity.id}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setIncidents(data);
      setError(null);
      setIsReconnecting(false); // Clear reconnecting on success
    } catch (err) {
      console.warn('[CityNerve] Live Incident Sync warning:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      // If it was a background poll, mark as reconnecting
      if (isSilent) {
        setIsReconnecting(true);
      }
      // Note: We deliberately do NOT clear incidents on error.
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [currentCity.id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (visibilityRef.current === 'visible') {
            void fetchIncidents(true); // silent refetch
          }
        }, 15000);
      }
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      visibilityRef.current = document.visibilityState;
      if (document.visibilityState === 'visible') {
        // User came back to the tab, fetch immediately to sync up
        void fetchIncidents(true);
        startPolling();
      } else {
        // Tab hidden, pause polling
        stopPolling();
      }
    };

    // Make the initial fetch async to avoid "set state in effect" strict mode warnings
    const initialFetchTimer = setTimeout(() => {
      void fetchIncidents();
    }, 0);

    visibilityRef.current = document.visibilityState;
    if (document.visibilityState === 'visible') {
      startPolling();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialFetchTimer);
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchIncidents]);

  return (
    <IncidentContext.Provider value={{ incidents, isLoading, error, isReconnecting, refetch: fetchIncidents }}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidentsContext() {
  return useContext(IncidentContext);
}
