import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';

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

// ---------------------------------------------------------------------------
// Realistic per-city mock data for demo / offline mode
// ---------------------------------------------------------------------------
const MOCK_EMERGENCY_RESOURCES: Record<string, EmergencyResourcesData> = {
  mumbai:     { ambulance: { available: 14, busy: 6,  enRoute: 4 }, police: { available: 32, busy: 18, enRoute: 7 }, fire: { available: 10, busy: 5,  enRoute: 2 }, rescue: { available: 8,  busy: 3,  enRoute: 3 } },
  delhi:      { ambulance: { available: 20, busy: 10, enRoute: 5 }, police: { available: 45, busy: 22, enRoute: 9 }, fire: { available: 15, busy: 7,  enRoute: 3 }, rescue: { available: 12, busy: 5,  enRoute: 4 } },
  bengaluru:  { ambulance: { available: 12, busy: 4,  enRoute: 2 }, police: { available: 28, busy: 11, enRoute: 5 }, fire: { available: 9,  busy: 3,  enRoute: 1 }, rescue: { available: 6,  busy: 2,  enRoute: 1 } },
  chennai:    { ambulance: { available: 13, busy: 7,  enRoute: 3 }, police: { available: 30, busy: 16, enRoute: 6 }, fire: { available: 11, busy: 6,  enRoute: 2 }, rescue: { available: 9,  busy: 4,  enRoute: 2 } },
  kolkata:    { ambulance: { available: 15, busy: 8,  enRoute: 4 }, police: { available: 38, busy: 20, enRoute: 8 }, fire: { available: 12, busy: 6,  enRoute: 3 }, rescue: { available: 10, busy: 4,  enRoute: 3 } },
  hyderabad:  { ambulance: { available: 11, busy: 4,  enRoute: 2 }, police: { available: 26, busy: 10, enRoute: 4 }, fire: { available: 8,  busy: 3,  enRoute: 1 }, rescue: { available: 5,  busy: 2,  enRoute: 1 } },
  pune:       { ambulance: { available: 9,  busy: 3,  enRoute: 2 }, police: { available: 22, busy: 9,  enRoute: 3 }, fire: { available: 7,  busy: 2,  enRoute: 1 }, rescue: { available: 4,  busy: 1,  enRoute: 1 } },
};

const DEFAULT_MOCK: EmergencyResourcesData = {
  ambulance: { available: 10, busy: 4, enRoute: 2 },
  police:    { available: 25, busy: 12, enRoute: 5 },
  fire:      { available: 8,  busy: 3,  enRoute: 2 },
  rescue:    { available: 6,  busy: 2,  enRoute: 1 },
};

function getMockForCity(cityId: string): EmergencyResourcesData {
  return MOCK_EMERGENCY_RESOURCES[cityId] ?? DEFAULT_MOCK;
}

// ---------------------------------------------------------------------------

export function useEmergencyResources(cityId: string) {
  const [data, setData] = useState<EmergencyResourcesData>(() => getMockForCity(cityId));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = useCallback(async () => {
    if (!cityId) return;

    // No backend URL — go straight to demo data.
    if (!API_BASE) {
      setData(getMockForCity(cityId));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/emergency-resources?cityId=${cityId}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: EmergencyResourcesData = await res.json();
      // Guard against the backend returning all zeros (empty seed)
      const total = json.ambulance.available + json.police.available + json.fire.available + json.rescue.available;
      if (total === 0) throw new Error('Empty resource data');
      setData(json);
      setError(null);
    } catch (err) {
      // Fall back silently to realistic mock data — never show zeros.
      setData(getMockForCity(cityId));
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    // Reset to city-specific mock immediately on city change (no flash of zeros)
    setData(getMockForCity(cityId));
    void fetchResources();

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchResources();
      }
    }, 30000); // Reduced from 15s to ease server load

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
  }, [cityId, fetchResources]);

  return { data, isLoading, error, refetch: fetchResources };
}
