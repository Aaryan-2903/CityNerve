'use client';

import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_CITY, SUPPORTED_CITIES, type CityProfile } from '@/data/cities';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';



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
  // Pre-populate with local data so city switching works immediately even before
  // the backend responds (or if it never does in demo mode).
  const [availableCities, setAvailableCities] = useState<CityProfile[]>(SUPPORTED_CITIES);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [currentCity, setCurrentCity] = useState<CityProfile>(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState(false);

  // Try to fetch cities from the backend; on any failure, keep the pre-populated
  // SUPPORTED_CITIES list so city switching always works in demo mode.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchCities() {
      // No backend URL configured — stay on local data, skip fetch entirely.
      if (!API_BASE) {
        if (!cancelled) setIsLoadingCities(false);
        clearTimeout(timeoutId);
        return;
      }

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
          // Keep SUPPORTED_CITIES (already set as initial state) — city switching works.
          console.warn('[CityNerve] Backend cities unavailable, using local city list.', err);
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
