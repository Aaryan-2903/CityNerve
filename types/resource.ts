export type ResourceType =
  | 'fire_engine'
  | 'ambulance'
  | 'police'
  | 'helicopter'
  | 'hazmat_team'
  | 'rescue_team'
  | 'national_guard'
  | 'command_vehicle'
  | 'water_tanker'
  | 'medical_unit';

export type ResourceStatus =
  | 'available'
  | 'deployed'
  | 'en_route'
  | 'returning'
  | 'maintenance'
  | 'standby';

export interface ResourceLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Resource {
  id: string;
  callSign: string;
  type: ResourceType;
  status: ResourceStatus;
  unit: string;
  agency: string;
  location: ResourceLocation;
  assignedIncidentId: string | null;
  personnel: number;
  eta?: number;
  lastUpdated: string;
}
