import { useState, useEffect } from 'react';



import { Weather } from '@/types/weather';
import { CITY_DASHBOARD_DATA } from '@/data/cityDashboardData';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';


export function useWeather(cityId: string, phase: number) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchWeather(isSilent = false) {
      if (!isSilent) setIsLoading(true);
      else setIsRefetching(true);
      
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/v1/weather/${cityId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();
        
        if (!data || !data.label) {
          const mockCity = CITY_DASHBOARD_DATA[cityId];
          if (mockCity && mockCity.weather) {
            data = mockCity.weather;
          }
        }
        
        if (!cancelled) {
          setWeather(data);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
        if (!cancelled) {
          const mockCity = CITY_DASHBOARD_DATA[cityId];
          if (mockCity && mockCity.weather) {
            setWeather(mockCity.weather);
            setLastUpdated(new Date());
          } else {
            setWeather(null);
            setError(err as Error);
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefetching(false);
        }
      }
    }
    
    fetchWeather();
    
    // Auto-refresh weather every 60 seconds
    const intervalId = setInterval(() => fetchWeather(true), 60 * 1000);
    
    return () => { 
      cancelled = true; 
      clearInterval(intervalId);
    };
  }, [cityId, phase]);

  const refetch = async () => {
    setIsRefetching(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/weather/${cityId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      
      if (!data || !data.label) {
        const mockCity = CITY_DASHBOARD_DATA[cityId];
        if (mockCity && mockCity.weather) {
          data = mockCity.weather;
        }
      }
      
      setWeather(data);
      setLastUpdated(new Date());
    } catch (err) {
      const mockCity = CITY_DASHBOARD_DATA[cityId];
      if (mockCity && mockCity.weather) {
        setWeather(mockCity.weather);
        setLastUpdated(new Date());
      } else {
        setError(err as Error);
      }
    } finally {
      setIsRefetching(false);
    }
  };

  return { weather, isLoading, isRefetching, error, lastUpdated, refetch };
}
