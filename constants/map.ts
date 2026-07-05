import type { MapViewport, MapLayer } from '@/types/map';

export const DEFAULT_VIEWPORT: MapViewport = {
  longitude: 72.8777,
  latitude:  19.0760,
  zoom:      11.5,
  pitch:     30,
  bearing:   -5,
};

export const MAPLIBRE_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const DEFAULT_MAP_LAYERS: MapLayer[] = [
  { id: 'incidents', label: 'Incidents', enabled: true, icon: 'AlertTriangle' },
  { id: 'resources', label: 'Resources', enabled: true, icon: 'Truck' },
  { id: 'heatmap', label: 'Risk Heatmap', enabled: true, icon: 'Activity' },
  { id: 'zones', label: 'Risk Zones', enabled: false, icon: 'Map' },
  { id: 'weather', label: 'Weather', enabled: false, icon: 'Cloud' },
  { id: 'evacuation_routes', label: 'Evacuation Routes', enabled: false, icon: 'Navigation' },
];

export const MARKER_SIZES: Record<string, number> = {
  critical: 20,
  high: 16,
  medium: 13,
  low: 10,
  resolved: 8,
};
