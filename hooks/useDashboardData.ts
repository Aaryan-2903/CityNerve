import { useState, useEffect, useMemo } from 'react';
import { useCity } from '@/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { useAIDecisionContext } from '@/context/AIDecisionContext';
import { useShelters } from './useShelters';
import { useHospitals } from './useHospitals';
import { useResources } from './useResources';
import { useNotifications } from './useNotifications';
import { useWeather } from './useWeather';
import { Weather } from '@/types/weather';
import { useIncidentsContext } from '@/context/IncidentContext';

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
  weather: Weather;
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
  const { incidents } = useIncidentsContext();

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
    
    // Polling every 10 seconds to keep live data fresh
    const intervalId = setInterval(fetchDashboard, 10000);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [currentCity.id]);

  const incidentFeed = useMemo(() => incidents.map(inc => ({
    id: `feed-${inc.id}`,
    time: new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `Incident Update: ${inc.title}`,
    dotColor: inc.severity === 'critical' ? '#EF4444' : inc.severity === 'high' ? '#F97316' : inc.severity === 'medium' ? '#EAB308' : '#3B82F6',
    category: 'report' as const,
    severity: (inc.severity.charAt(0).toUpperCase() + inc.severity.slice(1)) as 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved'
  })), [incidents]);

  const mappedBaseIncidents = useMemo(() => incidents.map(inc => {
    let severityStr = inc.severity.toUpperCase();
    if (severityStr === 'RESOLVED') severityStr = 'LOW';
    return {
      id: inc.id,
      title: inc.title,
      severity: severityStr as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
      time: new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      team: inc.resourcesDeployed?.length ? `${inc.resourcesDeployed.length} Units` : 'Unassigned',
      status: inc.status.charAt(0).toUpperCase() + inc.status.slice(1),
      impact: `${inc.casualties || 0} Casualties`,
      location: inc.location?.district || inc.location?.address || 'Unknown',
      isNew: false
    };
  }), [incidents]);

  const data = useMemo(() => {
    const totalShelters = apiData?.sheltersAvailable ?? shelters.length;
    const totalHospitals = apiData?.hospitalsNearby ?? hospitals.length;
    const totalResources = apiData?.deployedUnits ?? resources.length;
    
    // Use true backend values without frontend mock additions
    const dynamicPop = apiData?.populationAffected ?? "Unknown";
    const dynamicRoads = apiData?.roadsClosed ?? 0;
    const dynamicDeployed = apiData?.deployedUnits ?? totalResources;
    const dynamicIncidents = apiData?.activeIncidents ?? incidents.length;
    const dynamicResponse = apiData?.averageResponseTime || "--m";

    const metricsData = {
      population: {
        value: dynamicPop,
        subtext: 'Current Affected Population',
      },
      hospitals: {
        value: String(totalHospitals),
        subtext: 'Active Medical Centers',
      },
      roads: {
        value: String(dynamicRoads),
        subtext: 'Current Road Closures',
      },
      shelters: {
        value: String(totalShelters),
        subtext: `Total Active Shelters`,
      },
      responseTime: {
        value: String(dynamicResponse),
        subtext: 'Estimated Unit Response',
      },
      deployed: {
        value: String(dynamicDeployed),
        subtext: 'Active Field Units',
      },
      incidents: {
        value: String(dynamicIncidents),
        subtext: 'Active Critical Events',
      },
    };

    // Transform notifications into baseFeed
    const notificationsFeed = notifications.map((n) => ({
      id: n.id,
      time: n.time,
      text: n.text,
      dotColor: n.dotColor,
      category: n.category,
    }));

    return {
      metricsData,
      baseIncidents: mappedBaseIncidents,
      baseFeed: [...incidentFeed, ...notificationsFeed],
      liveWeather: weather ?? apiData?.weather ?? null,
      aiStatus: apiData?.aiStatus ?? null,
      riskScore: apiData?.riskScore ?? null,
    };
  }, [apiData, shelters, hospitals, resources, notifications, weather, incidents, mappedBaseIncidents, incidentFeed]);

  return { ...data, isLoadingDashboard };
}
