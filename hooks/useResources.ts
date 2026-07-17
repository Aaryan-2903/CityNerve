import { useState, useEffect, useCallback } from 'react';
import { CITY_DASHBOARD_DATA } from '@/data/cityDashboardData';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';



export interface Resource {
  id: string;
  cityId: string;
  name: string;
  lat: number;
  lng: number;
}

export function useResources(cityId: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = useCallback(async (isSilent = false) => {
    if (!cityId) return;
    if (!isSilent) setIsLoading(true);
    else setIsRefetching(true);
    
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/poi-resources?cityId=${cityId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      
      if (!data || data.length === 0) {
        const mockCity = CITY_DASHBOARD_DATA[cityId];
        if (mockCity && mockCity.resources) {
          data = mockCity.resources;
        }
      }
      
      setResources(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      const mockCity = CITY_DASHBOARD_DATA[cityId];
      if (mockCity && mockCity.resources) {
        setResources(mockCity.resources);
        setError(null);
      }
    } finally {
      if (!isSilent) setIsLoading(false);
      else setIsRefetching(false);
    }
  }, [cityId]);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function initFetch() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/v1/poi-resources?cityId=${cityId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();
        
        if (!data || data.length === 0) {
          const mockCity = CITY_DASHBOARD_DATA[cityId];
          if (mockCity && mockCity.resources) {
            data = mockCity.resources;
          }
        }
        
        if (!cancelled) {
          setResources(data);
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          const mockCity = CITY_DASHBOARD_DATA[cityId];
          if (mockCity && mockCity.resources) {
            setResources(mockCity.resources);
            setError(null);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    initFetch();

    // Auto-refresh resources every 60 seconds
    const intervalId = setInterval(() => {
      if (!cancelled) void fetchResources(true);
    }, 60 * 1000);

    return () => { 
      cancelled = true; 
      clearInterval(intervalId);
    };
  }, [cityId, fetchResources]);

  return { resources, isLoading, isRefetching, error, lastUpdated, refetch: fetchResources };
}
