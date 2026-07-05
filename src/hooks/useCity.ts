'use client';

import { useState, useCallback } from 'react';
import { SUPPORTED_CITIES, DEFAULT_CITY, type CityProfile } from '@/src/data/cities';

export interface UseCityReturn {
  currentCity: CityProfile;
  setCity: (cityId: string) => void;
  isDetecting: boolean;
  detectLocation: () => void;
}

// Haversine formula to find the nearest city
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function findNearestCity(lat: number, lng: number): CityProfile {
  let nearest = DEFAULT_CITY;
  let minDistance = Infinity;

  for (const city of SUPPORTED_CITIES) {
    const dist = calculateDistance(lat, lng, city.latitude, city.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  }
  return nearest;
}

export function useCityInternal(): UseCityReturn {
  const [currentCity, setCurrentCity] = useState<CityProfile>(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState(false);

  const setCity = useCallback((cityId: string) => {
    const city = SUPPORTED_CITIES.find(c => c.id === cityId);
    if (city) {
      setCurrentCity(city);
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestCity(latitude, longitude);
        setCurrentCity(nearest);
        setIsDetecting(false);
      },
      (error) => {
        console.warn("Geolocation permission denied or failed:", error);
        setCurrentCity(DEFAULT_CITY); // fallback
        setIsDetecting(false);
      }
    );
  }, []);

  return { currentCity, setCity, isDetecting, detectLocation };
}
