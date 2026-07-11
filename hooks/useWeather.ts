import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface WeatherState {
  id: string;
  city_id: string;
  temperature: number;
  apparent_temperature: number;
  rainfall: number;
  precipitation_probability: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_condition: string;
  cloud_cover: number;
  label: string;
  emoji: string;
  alertText: string;
  alertLevel: string;
  last_updated: string;
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
        const res = await fetch(`${API_BASE}/api/v1/weather/${cityId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setWeather(data);
      } catch (err) {
        console.error("Failed to fetch weather", err);
        // Fallback to mock data to prevent dashboard crash
        if (!cancelled) setWeather({
          id: "mock-fallback",
          city_id: cityId,
          temperature: 25.0,
          apparent_temperature: 26.0,
          rainfall: 0.0,
          precipitation_probability: 0,
          humidity: 50,
          wind_speed: 10.0,
          wind_direction: 180.0,
          weather_condition: "Clear sky",
          cloud_cover: 0,
          label: "Clear sky",
          emoji: "☀️",
          alertText: "Conditions normal",
          alertLevel: "info",
          last_updated: new Date().toISOString()
        });
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
