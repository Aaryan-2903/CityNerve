import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface WeatherState {
  id: string;
  cityId: string;
  phase: number;
  label: string;
  emoji: string;
  rainfall: string;
  forecast: string;
  alertText: string;
  alertLevel: string;
}

export function useWeather(cityId: string, phase: number) {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchWeather() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/scenario/weather?cityId=${cityId}&phase=${phase}`);
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
    return () => { cancelled = true; };
  }, [cityId, phase]);

  return { weather, isLoading };
}
