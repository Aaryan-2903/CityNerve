import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface RiskZone {
  id: string;
  cityId: string;
  type: string;
  geometry: any;
}

export interface EvacuationRoute {
  id: string;
  cityId: string;
  geometry: any;
}

export function useMapZones(cityId: string) {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [evacRoutes, setEvacRoutes] = useState<EvacuationRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchZones() {
      setIsLoading(true);
      try {
        const [resRisk, resEvac] = await Promise.all([
          fetch(`${API_BASE}/api/v1/zones/risk-zones?cityId=${cityId}`),
          fetch(`${API_BASE}/api/v1/zones/evacuation-routes?cityId=${cityId}`)
        ]);
        
        if (resRisk.ok && !cancelled) setRiskZones(await resRisk.json());
        if (resEvac.ok && !cancelled) setEvacRoutes(await resEvac.json());
      } catch (err) {
        console.error("Failed to fetch map zones", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    fetchZones();
    return () => { cancelled = true; };
  }, [cityId]);

  return { riskZones, evacRoutes, isLoading };
}
