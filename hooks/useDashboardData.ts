import { useMemo } from 'react';
import { useCity } from '@/src/context/CityContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { CITY_SCENARIOS } from '@/data/cityScenarios';

export function useDashboardData() {
  const { currentCity } = useCity();
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;

  const scenario = CITY_SCENARIOS[currentCity.id] || CITY_SCENARIOS['mumbai'];

  const data = useMemo(() => {
    // Dynamically calculate metrics based on phase & city data
    const basePops: Record<string, number> = {
      mumbai: 12400, pune: 8300, bengaluru: 15200, delhi: 22100, 
      chennai: 9400, hyderabad: 11200, kolkata: 13500
    };
    const basePop = basePops[currentCity.id] || 12400;
    const popIncrement = phase * 2100;
    const totalPop = basePop + popIncrement;
    const popFormatted = (totalPop / 1000).toFixed(1) + 'k';

    // Add city-specific variance so values differ across all 7 cities
    const v = { mumbai: 0, pune: 1, bengaluru: 2, delhi: 3, chennai: 4, hyderabad: 5, kolkata: 6 }[currentCity.id] ?? 0;

    // Mix phase and city variance so they ALL update on BOTH triggers
    const totalRoads = scenario.mapLayers.incidents.length + 1 + phase + v;
    const totalShelters = scenario.mapLayers.shelters.length + phase + (v % 3);
    // Hospitals drop as phase advances
    const totalHospitals = scenario.mapLayers.hospitals.length + Math.max(0, 3 - Math.floor(phase / 2)) + v;
    
    const activeIncidents = scenario.mapLayers.incidents.length + (sim?.simIncidents?.length ?? 0) + Math.floor(phase / 2) + v;
    const deployedUnits = (sim?.resources?.deployed ?? 2) + phase * 2 + v;
    const avgResponseTime = Math.max(4, 24 - phase * 2 - v); // Starts higher, drops as response ramps up

    const metricsData = {
      population: { 
        value: popFormatted, 
        subtext: phase > 0 ? `+${(popIncrement / 1000).toFixed(1)}k in last hour` : 'Stable' 
      },
      hospitals: { 
        value: String(totalHospitals), 
        subtext: `${totalHospitals - 1} at capacity` 
      },
      roads: { 
        value: String(totalRoads), 
        subtext: 'Major arterial blocked' 
      },
      shelters: { 
        value: String(totalShelters), 
        subtext: `Total capacity: ${totalShelters * 450}` 
      },
      responseTime: {
        value: `${avgResponseTime}m`,
        subtext: phase > 0 ? 'Improving as units deploy' : 'Baseline',
      },
      deployed: {
        value: String(deployedUnits),
        subtext: `${sim?.resources?.personnel ?? (18 + phase * 5)} personnel active`,
      },
      incidents: {
        value: String(activeIncidents),
        subtext: `${sim?.simIncidents?.length ?? 0} new reports`,
      },
    };

    // Dynamically map base incidents from the city scenario mapLayers
    const baseIncidents = scenario.mapLayers.incidents.map((inc: any, i: number) => ({
      id: `INC-00${i + 1}`,
      title: inc.name,
      severity: inc.severity,
      time: `22:${20 - i * 3}`, // staggered times
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
    };
  }, [currentCity.id, phase, scenario]);

  return data;
}
