export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';
export type ScenarioType = 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'FIRE' | 'HEATWAVE';

export interface WeatherData {
  temperature: number; // in Celsius
  rainfall: number; // in mm/hr
  humidity: number; // percentage
  windSpeed: number; // in km/h
  condition: string; // e.g. "Heavy Rain", "Clear"
}

export interface ThreatData {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0 to 100
  confidence: number; // 0 to 100
}

export interface AIData {
  title: string;
  summary: string;
  recommendation: string;
  reasoning: string[];
  confidence: number; // 0 to 100
}

export interface IncidentFeedItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestampOffset: number; // seconds from start of stage
  location: { lat: number; lng: number };
}

export interface ResourceData {
  rescueTeams: { deployed: number; available: number };
  ambulances: { deployed: number; available: number };
  fireUnits: { deployed: number; available: number };
  police: { deployed: number; available: number };
}

export interface ShelterData {
  available: number;
  occupied: number;
  capacity: number;
}

export interface RoadData {
  closed: number;
  congested: number;
  safe: number;
}

export interface PopulationData {
  affected: number;
  evacuated: number;
  atRisk: number;
}

export interface MapData {
  markers: Array<{ id: string; type: string; lat: number; lng: number }>;
  polygons: Array<{ id: string; type: string; coordinates: number[][][] }>;
  routes: Array<{ id: string; type: string; path: number[][] }>;
  heatmap: Array<{ lat: number; lng: number; intensity: number }>;
}

export interface StagePayload {
  stageEnum: string;
  name: string;
  description: string;
  durationMs: number;
  weather: WeatherData;
  threat: ThreatData;
  ai: AIData;
  incidentFeed: IncidentFeedItem[];
  resources: ResourceData;
  shelters: ShelterData;
  roads: RoadData;
  population: PopulationData;
  map: MapData;
}
