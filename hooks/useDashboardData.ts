import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { CITY_DASHBOARD_DATA } from '@/data/cityDashboardData';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';
import { formatHHMM } from '@/utils/format';


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
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isRefetchingDashboard, setIsRefetchingDashboard] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // New hooks to fetch data that used to be in CITY_SCENARIOS
  const { shelters } = useShelters(currentCity.id);
  const { hospitals } = useHospitals(currentCity.id);
  const { resources, refetch: refetchResources, isRefetching: isRefetchingResources, error: resourcesError } = useResources(currentCity.id);
  const { notifications } = useNotifications(currentCity.id, phase);
  const { weather, refetch: refetchWeather, isRefetching: isRefetchingWeather, error: weatherError } = useWeather(currentCity.id, phase);
  const { incidents, refetch: refetchIncidents, error: incidentsError } = useIncidentsContext();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchDashboard(isSilent = false) {
      if (!isSilent) setIsLoadingDashboard(true);
      else setIsRefetchingDashboard(true);

        let json: DashboardAPIResponse | null = null;

        // Short-circuit: no backend URL configured, go straight to mock data.
        if (!API_BASE) {
          const mockCity = CITY_DASHBOARD_DATA[currentCity.id];
          if (mockCity?.apiData) json = mockCity.apiData;
        } else {
          try {
            const res = await fetch(`${API_BASE}/api/v1/dashboard/${currentCity.id}`, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            json = await res.json();
            if (json && json.activeIncidents === 0 && json.deployedUnits === 0) {
              throw new Error('City data empty');
            }
          } catch (err) {
            const mockCity = CITY_DASHBOARD_DATA[currentCity.id];
            if (mockCity?.apiData) {
              json = mockCity.apiData;
            } else {
              if (!cancelled) {
                console.warn('[CityNerve] Dashboard API error, using mock data:', err);
                setIsOffline(true);
              }
            }
          }
        }

        if (!cancelled && json) {
          setApiData(json);
          setIsOffline(false);
        }

        if (!cancelled) {
          setIsLoadingDashboard(false);
          setIsRefetchingDashboard(false);
        }
    }

    fetchDashboard();
    
    // Polling every 60 seconds (only if backend is configured)
    const intervalId = API_BASE ? setInterval(() => fetchDashboard(true), 60000) : null;

    return () => {
      cancelled = true;
      controller.abort();
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentCity.id]);


  const refetchAll = useCallback(async () => {
    setIsRefetchingDashboard(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/dashboard/${currentCity.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: DashboardAPIResponse = await res.json();
      if (json && json.activeIncidents === 0 && json.deployedUnits === 0) {
        throw new Error('City data empty');
      }
      setApiData(json);
      setIsOffline(false);
    } catch (err) {
      const mockCity = CITY_DASHBOARD_DATA[currentCity.id];
      if (mockCity && mockCity.apiData) {
        setApiData(mockCity.apiData);
        setIsOffline(false);
      } else {
        setIsOffline(true);
      }
    } finally {
      setIsRefetchingDashboard(false);
    }
    
    if (refetchWeather) void refetchWeather();
    if (refetchResources) void refetchResources(true);
    if (refetchIncidents) void refetchIncidents(true);
  }, [currentCity.id, refetchWeather, refetchResources, refetchIncidents]);

  // Aggregate offline state
  useEffect(() => {
    if (weatherError || resourcesError || incidentsError) {
      setIsOffline(true);
    }
  }, [weatherError, resourcesError, incidentsError]);

  const incidentFeed = useMemo(() => incidents.map(inc => ({
    id: `feed-${inc.id}`,
    time: formatHHMM(new Date(inc.timestamp)),
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
      time: formatHHMM(new Date(inc.timestamp)),
      team: inc.resourcesDeployed?.length ? `${inc.resourcesDeployed.length} Units` : 'Unassigned',
      status: inc.status.charAt(0).toUpperCase() + inc.status.slice(1),
      impact: `${inc.casualties || 0} Casualties`,
      location: inc.location?.district || inc.location?.address || 'Unknown',
      isNew: false
    };
  }), [incidents]);

  const data = useMemo(() => {
    // Always try to pull from mock data when apiData is missing (demo/offline mode)
    const mockCity = CITY_DASHBOARD_DATA[currentCity.id];
    const mockApiData = mockCity?.apiData;

    const totalShelters = apiData?.sheltersAvailable ?? mockApiData?.sheltersAvailable ?? shelters.length;
    const totalHospitals = apiData?.hospitalsNearby ?? mockApiData?.hospitalsNearby ?? hospitals.length;
    const totalResources = apiData?.deployedUnits ?? mockApiData?.deployedUnits ?? resources.length;

    const dynamicPop = apiData?.populationAffected ?? mockApiData?.populationAffected ?? `${incidents.length * 2}k`;
    const dynamicRoads = apiData?.roadsClosed ?? mockApiData?.roadsClosed ?? incidents.length * 2;
    const dynamicDeployed = apiData?.deployedUnits ?? mockApiData?.deployedUnits ?? totalResources;
    const dynamicIncidents = apiData?.activeIncidents ?? incidents.length;
    const dynamicResponse = apiData?.averageResponseTime ?? mockApiData?.averageResponseTime ?? '8m';

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
      liveWeather: weather ?? apiData?.weather ?? mockApiData?.weather ?? null,
      aiStatus: apiData?.aiStatus ?? mockApiData?.aiStatus ?? null,
      riskScore: apiData?.riskScore ?? mockApiData?.riskScore ?? null,
    };
  }, [apiData, shelters, hospitals, resources, notifications, weather, incidents, mappedBaseIncidents, incidentFeed, currentCity.id]);

  return { 
    ...data, 
    isLoadingDashboard, 
    isRefetchingDashboard,
    isRefetchingAny: isRefetchingDashboard || isRefetchingWeather || isRefetchingResources,
    isOffline, 
    refetchAll 
  };
}
