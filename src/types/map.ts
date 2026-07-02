export type MapLayerId =
  | 'incidents'
  | 'resources'
  | 'heatmap'
  | 'zones'
  | 'weather'
  | 'evacuation_routes';

export interface MapLayer {
  id: MapLayerId;
  label: string;
  enabled: boolean;
  icon: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewport {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}
