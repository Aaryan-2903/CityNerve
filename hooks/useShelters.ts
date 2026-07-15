import { useState, useEffect } from 'react';
import { CITY_DASHBOARD_DATA } from '@/data/cityDashboardData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface Shelter {
  id: string;
  cityId: string;
  name: string;
  lat: number;
  lng: number;
}

export function useShelters(cityId: string) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchShelters() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/v1/poi/shelters?cityId=${cityId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();
        
        if (!data || data.length === 0) {
          const mockCity = CITY_DASHBOARD_DATA[cityId];
          if (mockCity && mockCity.shelters) {
            data = mockCity.shelters;
          }
        }
        
        if (!cancelled) setShelters(data);
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          const mockCity = CITY_DASHBOARD_DATA[cityId];
          if (mockCity && mockCity.shelters) {
            setShelters(mockCity.shelters);
            setError(null); // Clear error since we recovered with mock
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    fetchShelters();
    return () => { cancelled = true; };
  }, [cityId]);

  return { shelters, isLoading, error };
}
