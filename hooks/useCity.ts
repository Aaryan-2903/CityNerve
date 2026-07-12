'use client';

import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_CITY, type CityProfile } from '@/data/cities';

const API_BASE = 'http://127.0.0.1:8000';

export interface UseCityReturn {
  currentCity: CityProfile;
  setCity: (cityId: string) => void;
  isDetecting: boolean;
  detectLocation: () => void;
  availableCities: CityProfile[];
  isLoadingCities: boolean;
}

// ---------------------------------------------------------------------------
// Backend response shape (subset we care about)
// ---------------------------------------------------------------------------
interface BackendCity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  population: number;
  riskLevel: string;
  weatherRegion: string;
  isActive: boolean;
}

/** Map a backend city to the frontend CityProfile shape. */
function mapBackendCity(c: BackendCity): CityProfile {
  return {
    id: c.name.toLowerCase().replace(/\s+/g, '-'),
    name: c.name,
    latitude: c.latitude,
    longitude: c.longitude,
    displayLabel: `${c.name} Command Zone`,
    weatherLabel: `${c.name} Metro Area`,
    state: c.state || '',
    openMeteoCoordinates: { latitude: c.latitude, longitude: c.longitude },
  };
}

// ---------------------------------------------------------------------------
// Geolocation helpers
// ---------------------------------------------------------------------------
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestCity(lat: number, lng: number, cities: CityProfile[]): CityProfile {
  let nearest = cities[0] ?? DEFAULT_CITY;
  let minDistance = Infinity;
  for (const city of cities) {
    const dist = calculateDistance(lat, lng, city.latitude, city.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  }
  return nearest;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useCityInternal(): UseCityReturn {
  const [availableCities, setAvailableCities] = useState<CityProfile[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [currentCity, setCurrentCity] = useState<CityProfile>(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState(false);

  // Fetch cities from the backend on mount; fall back to local mock on failure.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchCities() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/cities`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: BackendCity[] = await res.json();
        if (!cancelled && data.length > 0) {
          const mapped = data.map(mapBackendCity);
          setAvailableCities(mapped);

          // Re-sync currentCity to the mapped list (match by name to be safe)
          setCurrentCity((prev: CityProfile) => {
            const match = mapped.find(c => c.name === prev.name);
            return match ?? mapped[0] ?? prev;
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[CityNerve] Could not reach backend for cities.', err);
        }
      } finally {
        if (!cancelled) setIsLoadingCities(false);
        clearTimeout(timeoutId);
      }
    }

    fetchCities();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const setCity = useCallback((cityId: string) => {
    // Search both the live list and the local fallback so selection never breaks
    const city = availableCities.find(c => c.id === cityId);
    if (city) setCurrentCity(city);
  }, [availableCities]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestCity(latitude, longitude, availableCities);
        setCurrentCity(nearest);
        setIsDetecting(false);
      },
      (error) => {
        console.warn('Geolocation permission denied or failed:', error);
        setCurrentCity(DEFAULT_CITY);
        setIsDetecting(false);
      },
    );
  }, [availableCities]);

  return { currentCity, setCity, isDetecting, detectLocation, availableCities, isLoadingCities };
}
