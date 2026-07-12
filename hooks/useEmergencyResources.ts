import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface EmergencyResourceCount {
  available: number;
  busy: number;
  enRoute: number;
}

export interface EmergencyResourcesData {
  ambulance: EmergencyResourceCount;
  police: EmergencyResourceCount;
  fire: EmergencyResourceCount;
  rescue: EmergencyResourceCount;
}

const DEFAULT_DATA: EmergencyResourcesData = {
  ambulance: { available: 0, busy: 0, enRoute: 0 },
  police: { available: 0, busy: 0, enRoute: 0 },
  fire: { available: 0, busy: 0, enRoute: 0 },
  rescue: { available: 0, busy: 0, enRoute: 0 }
};

export function useEmergencyResources(cityId: string) {
  const [data, setData] = useState<EmergencyResourcesData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = useCallback(async () => {
    if (!cityId) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/emergency-resources?cityId=${cityId}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    fetchResources();

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

  return { data, isLoading, error, refetch: fetchResources };
}
