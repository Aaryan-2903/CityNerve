import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface Hospital {
  id: string;
  cityId: string;
  name: string;
  lat: number;
  lng: number;
}

export function useHospitals(cityId: string) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchHospitals() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/v1/poi/hospitals?cityId=${cityId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setHospitals(data);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    fetchHospitals();
    return () => { cancelled = true; };
  }, [cityId]);

  return { hospitals, isLoading, error };
}
