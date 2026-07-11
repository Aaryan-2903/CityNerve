import { useState, useEffect, useMemo } from 'react';
import { useCity } from '@/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { useAIDecisionContext } from '@/context/AIDecisionContext';
import { useShelters } from './useShelters';
import { useHospitals } from './useHospitals';
import { useResources } from './useResources';
import { useNotifications } from './useNotifications';
import { useWeather } from './useWeather';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface DashboardAPIResponse {
  cityId: string;
  populationAffected: string;
  hospitalsNearby: number;
  sheltersAvailable: number;
  roadsClosed: number;
  deployedUnits: number;
  activeIncidents: number;
  averageResponseTime: string;
  weather: {
    label: string;
    emoji: string;
    rainfall: number;
    wind_speed: number;
    humidity: number;
    alertText: string;
    alertLevel: string;
  };
  aiStatus: string;
  riskScore: number;
}

export function useDashboardData() {
  const { currentCity } = useCity();
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;
  const aiDecision = useAIDecisionContext();
  const extraDeployedUnits = aiDecision?.extraDeployedUnits ?? 0;

  const [apiData, setApiData] = useState<DashboardAPIResponse | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // New hooks to fetch data that used to be in CITY_SCENARIOS
  const { shelters } = useShelters(currentCity.id);
  const { hospitals } = useHospitals(currentCity.id);
  const { resources } = useResources(currentCity.id);
  const { notifications } = useNotifications(currentCity.id, phase);
  const { weather } = useWeather(currentCity.id, phase);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchDashboard() {
      setIsLoadingDashboard(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/dashboard/${currentCity.id}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DashboardAPIResponse = await res.json();
        if (!cancelled) setApiData(json);
      } catch (err) {
        if (!cancelled) {
          console.warn('[CityNerve] Dashboard API error:', err);
          setApiData(null);
        }
      } finally {
        if (!cancelled) setIsLoadingDashboard(false);
      }
    }

    fetchDashboard();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [currentCity.id]);

  const data = useMemo(() => {
    // Dynamic overlay computation using real API data limits where possible
    const totalShelters = apiData?.sheltersAvailable ?? shelters.length;
    const totalHospitals = apiData?.hospitalsNearby ?? hospitals.length;
    const totalResources = apiData?.deployedUnits ?? resources.length;
    
    // Animate some values with phase if we want to keep the UX dynamic
    const dynamicPop = apiData?.populationAffected ?? "12.4k";
    const dynamicRoads = (apiData?.roadsClosed ?? 0) + phase;
    const dynamicDeployed = totalResources + phase * 2 + extraDeployedUnits;
    const dynamicIncidents = (apiData?.activeIncidents ?? 0) + (sim?.simIncidents?.length ?? 0) + Math.floor(phase / 2);
    const dynamicResponse = Math.max(4, parseInt(apiData?.averageResponseTime || "24") - phase * 2);

    const metricsData = {
      population: {
        value: dynamicPop,
        subtext: phase > 0 ? 'Rising due to alerts' : 'Stable',
      },
      hospitals: {
        value: String(totalHospitals + Math.max(0, 3 - Math.floor(phase / 2))),
        subtext: 'Surge protocols active',
      },
      roads: {
        value: String(dynamicRoads),
        subtext: 'Major arterial blocked',
      },
      shelters: {
        value: String(totalShelters + phase),
        subtext: `Total capacity: ${(totalShelters + phase) * 450}`,
      },
      responseTime: {
        value: `${dynamicResponse}m`,
        subtext: phase > 0 ? 'Improving as units deploy' : 'Baseline',
      },
      deployed: {
        value: String(dynamicDeployed),
        subtext: `${sim?.resources?.personnel ?? (18 + phase * 5)} personnel active`,
      },
      incidents: {
        value: String(dynamicIncidents),
        subtext: `${sim?.simIncidents?.length ?? 0} new reports`,
      },
    };

    // Transform notifications into baseFeed
    const baseFeed = notifications.map((n) => ({
      id: n.id,
      time: n.time,
      text: n.text,
      dotColor: n.dotColor,
      category: n.category as any,
    }));

    return {
      metricsData,
      baseIncidents: [], // Handled separately by useIncidents if needed, or we can fetch them here.
      baseFeed,
      liveWeather: weather ?? apiData?.weather ?? null,
      aiStatus: apiData?.aiStatus ?? null,
      riskScore: apiData?.riskScore ?? null,
    };
  }, [apiData, shelters, hospitals, resources, notifications, weather, phase, sim, extraDeployedUnits]);

  return { ...data, isLoadingDashboard };
}
