import type { Incident } from '@/types/incident';
import type { Resource } from '@/hooks/useResources';
import type { Shelter } from '@/hooks/useShelters';
import type { Hospital } from '@/hooks/useHospitals';
import type { Weather } from '@/types/weather';

export interface DashboardAPIResponse {
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

export interface CityDashboardMock {
  incidents: Incident[];
  resources: Resource[];
  shelters: Shelter[];
  hospitals: Hospital[];
  weather: Weather;
  apiData: DashboardAPIResponse;
}

const generateIncidents = (cityId: string, count: number, baseLat: number, baseLng: number): Incident[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-inc-${cityId}-${i}`,
    type: 'fire',
    severity: i === 0 ? 'critical' : i % 2 === 0 ? 'high' : 'medium',
    status: 'active',
    title: `Simulated Incident ${i+1} in ${cityId}`,
    description: `Auto-generated mock incident for ${cityId}`,
    location: {
      lat: baseLat + (Math.random() - 0.5) * 0.1,
      lng: baseLng + (Math.random() - 0.5) * 0.1,
      address: `Sector ${i}, ${cityId}`,
      district: `${cityId} Central`,
    },
    timestamp: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    affectedPopulation: 1000 * (i + 1),
    casualties: i,
    resourcesDeployed: ['RES-1'],
    aiRiskScore: 60 + i * 5,
    trending: 'stable',
  }));
};

const generatePOIs = (type: string, cityId: string, count: number, baseLat: number, baseLng: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-${type}-${cityId}-${i}`,
    cityId,
    name: `${cityId} ${type.charAt(0).toUpperCase() + type.slice(1)} ${i+1}`,
    lat: baseLat + (Math.random() - 0.5) * 0.1,
    lng: baseLng + (Math.random() - 0.5) * 0.1,
  }));
};

const createMockCity = (
  cityId: string, 
  baseLat: number, 
  baseLng: number, 
  incidentCount: number, 
  resourceCount: number, 
  shelterCount: number, 
  hospitalCount: number,
  weatherLabel: string,
  riskScore: number,
  aiStatus: string
): CityDashboardMock => {
  const weather: Weather = {
    id: `mock-weather-${cityId}`,
    city_id: cityId,
    temperature: 28,
    apparent_temperature: 30,
    rainfall: 10,
    precipitation_probability: 80,
    humidity: 75,
    wind_speed: 15,
    wind_direction: 180,
    weather_condition: weatherLabel,
    cloud_cover: 90,
    label: weatherLabel,
    emoji: '🌥️',
    alertText: 'Simulation Scenario Active',
    alertLevel: 'advisory',
    last_updated: new Date().toISOString()
  };

  return {
    incidents: generateIncidents(cityId, incidentCount, baseLat, baseLng),
    resources: generatePOIs('resource', cityId, resourceCount, baseLat, baseLng) as Resource[],
    shelters: generatePOIs('shelter', cityId, shelterCount, baseLat, baseLng) as Shelter[],
    hospitals: generatePOIs('hospital', cityId, hospitalCount, baseLat, baseLng) as Hospital[],
    weather,
    apiData: {
      cityId,
      populationAffected: `${incidentCount * 2}k`,
      hospitalsNearby: hospitalCount,
      sheltersAvailable: shelterCount,
      roadsClosed: incidentCount * 2,
      deployedUnits: resourceCount,
      activeIncidents: incidentCount,
      averageResponseTime: '8m',
      weather,
      aiStatus,
      riskScore
    }
  };
};

export const CITY_DASHBOARD_DATA: Record<string, CityDashboardMock> = {
  mumbai: createMockCity('mumbai', 19.076, 72.8777, 8, 15, 6, 4, 'Heavy Rain', 88, 'Flood Alert'),
  pune: createMockCity('pune', 18.5204, 73.8567, 4, 8, 3, 2, 'Overcast', 62, 'River Watch'),
  delhi: createMockCity('delhi', 28.7041, 77.1025, 12, 20, 10, 8, 'Haze', 81, 'Haze Advisory'),
  bengaluru: createMockCity('bengaluru', 12.9716, 77.5946, 6, 12, 4, 3, 'Partly Cloudy', 38, 'Traffic/Flood Watch'),
  chennai: createMockCity('chennai', 13.0827, 80.2707, 7, 14, 5, 4, 'Stormy', 91, 'Cyclone Alert'),
  kolkata: createMockCity('kolkata', 22.5726, 88.3639, 9, 16, 7, 5, 'Heavy Rain', 84, 'Flood Alert'),
  hyderabad: createMockCity('hyderabad', 17.385, 78.4867, 5, 10, 4, 2, 'Partly Cloudy', 55, 'Monitoring'),
};
