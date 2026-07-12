import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

import { Weather } from '@/types/weather';


export function useWeather(cityId: string, phase: number) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchWeather() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/weather/${cityId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setWeather(data);
      } catch (err) {
        console.error("Failed to fetch weather", err);
        if (!cancelled) setWeather(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    fetchWeather();
    
    // Auto-refresh weather every 5 minutes
    const intervalId = setInterval(fetchWeather, 5 * 60 * 1000);
    
    return () => { 
      cancelled = true; 
      clearInterval(intervalId);
    };
  }, [cityId, phase]);

  return { weather, isLoading };
}
