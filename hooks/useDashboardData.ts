import { useMemo, useState, useEffect } from 'react';
import { useCity } from '@/src/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { CITY_SCENARIOS } from '@/data/cityScenarios';

// ── Backend connection ────────────────────────────────────────────────────────
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

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
    rainfall: string;
    forecast: string;
    alertText: string;
    alertLevel: string;
  };
  aiStatus: string;   // e.g. "Flood Alert", "Monitoring"
  riskScore: number;  // 0-100
}


// ── Hook ─────────────────────────────────────────────────────────────────────
export function useDashboardData() {
  const { currentCity } = useCity();
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;

  const scenario = CITY_SCENARIOS[currentCity.id] || CITY_SCENARIOS['mumbai'];

  // Live API overlay — null while loading or when backend is unreachable
  const [apiData, setApiData] = useState<DashboardAPIResponse | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchDashboard() {
      setIsLoadingDashboard(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/dashboard/${currentCity.id}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DashboardAPIResponse = await res.json();
        if (!cancelled) setApiData(json);
      } catch (err) {
        if (!cancelled) {
          console.warn(
            '[CityNerve] Dashboard API unavailable — using local mock data.',
            err,
          );
          setApiData(null); // keep / revert to mock
        }
      } finally {
        if (!cancelled) setIsLoadingDashboard(false);
        clearTimeout(timeoutId);
      }
    }

    fetchDashboard();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [currentCity.id]);

  // ── Computed mock baseline (phase=0 seed, always available as fallback) ───
  const data = useMemo(() => {
    const basePops: Record<string, number> = {
      mumbai: 12400, pune: 8300, bengaluru: 15200, delhi: 22100,
      chennai: 9400, hyderabad: 11200, kolkata: 13500,
    };
    const basePop = basePops[currentCity.id] || 12400;
    const popIncrement = phase * 2100;
    const totalPop = basePop + popIncrement;
    const popFormatted = (totalPop / 1000).toFixed(1) + 'k';

    const v =
      { mumbai: 0, pune: 1, bengaluru: 2, delhi: 3, chennai: 4, hyderabad: 5, kolkata: 6 }[
        currentCity.id
      ] ?? 0;

    const totalRoads = scenario.mapLayers.incidents.length + 1 + phase + v;
    const totalShelters = scenario.mapLayers.shelters.length + phase + (v % 3);
    const totalHospitals =
      scenario.mapLayers.hospitals.length + Math.max(0, 3 - Math.floor(phase / 2)) + v;

    const activeIncidents =
      scenario.mapLayers.incidents.length +
      (sim?.simIncidents?.length ?? 0) +
      Math.floor(phase / 2) +
      v;
    const deployedUnits = (sim?.resources?.deployed ?? 2) + phase * 2 + v;
    const avgResponseTime = Math.max(4, 24 - phase * 2 - v);

    // ── Overlay API baseline values when available (phase=0 seed from server) ─
    // Phase-driven deltas are still added on top so simulation still animates.
    const apiPop        = apiData ? apiData.populationAffected                          : null;
    const apiHospitals  = apiData ? apiData.hospitalsNearby  + Math.max(0, 3 - Math.floor(phase / 2)) + phase : null;
    const apiShelters   = apiData ? apiData.sheltersAvailable + phase                   : null;
    const apiRoads      = apiData ? apiData.roadsClosed       + phase                   : null;
    const apiDeployed   = apiData ? apiData.deployedUnits     + phase * 2               : null;
    const apiIncidents  = apiData
      ? apiData.activeIncidents + (sim?.simIncidents?.length ?? 0) + Math.floor(phase / 2)
      : null;
    const apiResponse   = apiData
      ? `${Math.max(4, parseInt(apiData.averageResponseTime) - phase * 2)}m`
      : null;

    const metricsData = {
      population: {
        value: apiPop ?? popFormatted,
        subtext: phase > 0 ? `+${(popIncrement / 1000).toFixed(1)}k in last hour` : 'Stable',
      },
      hospitals: {
        value: String(apiHospitals ?? totalHospitals),
        subtext: `${(apiHospitals ?? totalHospitals) - 1} at capacity`,
      },
      roads: {
        value: String(apiRoads ?? totalRoads),
        subtext: 'Major arterial blocked',
      },
      shelters: {
        value: String(apiShelters ?? totalShelters),
        subtext: `Total capacity: ${(apiShelters ?? totalShelters) * 450}`,
      },
      responseTime: {
        value: apiResponse ?? `${avgResponseTime}m`,
        subtext: phase > 0 ? 'Improving as units deploy' : 'Baseline',
      },
      deployed: {
        value: String(apiDeployed ?? deployedUnits),
        subtext: `${sim?.resources?.personnel ?? (18 + phase * 5)} personnel active`,
      },
      incidents: {
        value: String(apiIncidents ?? activeIncidents),
        subtext: `${sim?.simIncidents?.length ?? 0} new reports`,
      },
    };

    // Dynamically map base incidents from the city scenario mapLayers
    const baseIncidents = scenario.mapLayers.incidents.map((inc: any, i: number) => ({
      id: `INC-00${i + 1}`,
      title: inc.name,
      severity: inc.severity,
      time: `22:${20 - i * 3}`,
      team: i === 0 ? 'Bravo-2' : i === 1 ? 'Traffic-7' : 'Delta-1',
      status: inc.status,
      impact: `${inc.affected} affected`,
      location: scenario.targetArea,
      isNew: false,
    }));

    // Dynamically create background feed entries
    const baseFeed = [
      { id: 'bf1', time: '22:31', text: `Emergency Team Bravo dispatched to ${scenario.targetArea}`, dotColor: '#22C55E', category: 'dispatch' as const },
      { id: 'bf2', time: '22:26', text: `Shelter Alpha activated for ${scenario.targetArea} overflow`, dotColor: '#22C55E', category: 'shelter' as const },
      { id: 'bf3', time: '22:23', text: `Road closure recommended near ${scenario.targetArea}`, dotColor: '#EAB308', category: 'advisory' as const },
      { id: 'bf4', time: '22:20', text: `Citizen report verified near ${scenario.targetArea}`, dotColor: '#3B82F6', category: 'report' as const },
      { id: 'bf5', time: '22:17', text: `Flood barrier deployed near ${scenario.targetArea} entry point`, dotColor: '#22C55E', category: 'dispatch' as const },
      { id: 'bf6', time: '22:14', text: `Hospital surge alert issued — capacity at 89%`, dotColor: '#EF4444', category: 'advisory' as const },
    ];

    return {
      metricsData,
      baseIncidents,
      baseFeed,
      // Expose live weather from the API when available (used by callers that read weather)
      liveWeather: apiData?.weather ?? null,
      // Expose AI status and risk score from the API when available
      aiStatus: apiData?.aiStatus ?? null,
      riskScore: apiData?.riskScore ?? null,
    };
  }, [currentCity.id, phase, scenario, apiData, sim]);

  return { ...data, isLoadingDashboard };
}
