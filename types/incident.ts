export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'resolved';

export type IncidentStatus = 'active' | 'contained' | 'resolved' | 'escalating';

export type IncidentType =
  | 'fire'
  | 'flood'
  | 'earthquake'
  | 'hazmat'
  | 'mass_casualty'
  | 'infrastructure'
  | 'storm'
  | 'blackout'
  | 'tsunami'
  | 'civil_unrest';

export interface IncidentLocation {
  lat: number;
  lng: number;
  address: string;
  district: string;
  borough?: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  status: IncidentStatus;
  title: string;
  description: string;
  location: IncidentLocation;
  timestamp: string;
  updatedAt: string;
  affectedPopulation: number;
  casualties: number;
  resourcesDeployed: string[];
  aiRiskScore: number;
  trending: 'up' | 'down' | 'stable';
}
