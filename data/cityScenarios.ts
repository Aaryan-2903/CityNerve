import type { SimWeather, SimIncident, SimFeedEntry } from '@/data/simulationScenario';

export interface CityScenarioData {
  simulationTitle: string;
  targetArea: string;
  weather: Record<number, SimWeather>;
  incidents: SimIncident[];
  feedEntries: Record<number, SimFeedEntry[]>;
  mapLayers: {
    incidents: any[];
    rescue: any[];
    shelters: any[];
    hospitals: any[];
    floodZone: any;
    evacRoute: any;
    simFlood: any;
  };
}

export const CITY_SCENARIOS: Record<string, CityScenarioData> = {
  mumbai: {
    simulationTitle: 'Kurla Station Flood',
    targetArea: 'Kurla',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '36 mm/hr', forecast: 'Rain likely tonight', alertText: 'Dense Fog Advisory — Harbour areas', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '193 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — Kurla & Eastern Suburbs', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '211 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Kurla Station Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '246 mm/hr', forecast: 'Flood Imminent — Kurla', alertText: '🚨 Flash Flood Emergency — Mithi River Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '257 mm/hr', forecast: 'Flooding — Kurla, Ghatkopar', alertText: '🚨 Evacuation Order — Kurla East & West', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '173 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — Kurla East & West', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '74 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding near Kurla Station', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~400 commuters stranded', location: 'Kurla Station, East Annex', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding near Kurla Station', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~400 being evacuated', location: 'Kurla Station, East Annex', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding near Kurla Station', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Kurla Station, East Annex', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 193 mm/hr — Flash Flood Watch issued for Mumbai metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding near Kurla Station — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Kurla in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Kurla, Ghatkopar, Chembur zones at immediate risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Kurla Station — 14 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — Kurla Sports Ground — capacity 800', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 72.8777, lat: 19.0760, name: 'Riverside Underpass Flooding', severity: 'CRITICAL', affected: '1,180', status: 'Responding' },
        { id: 'inc-2', lng: 72.8550, lat: 19.0550, name: 'Bridge 4 Approach Flood',      severity: 'HIGH',     affected: '450',   status: 'Closure pending' },
        { id: 'inc-3', lng: 72.8950, lat: 19.0650, name: 'Dharavi Sector 9 Waterlogged', severity: 'HIGH',     affected: '1,050', status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 72.8600, lat: 19.0600, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 72.8900, lat: 19.0800, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 72.8700, lat: 19.0900, name: 'Shelter Alpha — Cap. 500' },
        { id: 'shl-2', lng: 72.8400, lat: 19.0400, name: 'Shelter Beta — Cap. 300' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 72.8350, lat: 19.1150, name: 'KEM Hospital — Surge Ready' },
        { id: 'hosp-2', lng: 72.9180, lat: 19.0280, name: 'Sion Hospital — 89% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[72.8600, 19.0500],[72.8900, 19.0500],[72.9000, 19.0700],[72.8800, 19.0900],[72.8500, 19.0700],[72.8600, 19.0500]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[72.8777, 19.0760],[72.8700, 19.0900],[72.8500, 19.1100],[72.8200, 19.1300]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[72.8620, 19.0580],[72.8960, 19.0580],[72.9080, 19.0760],[72.8950, 19.0980],[72.8660, 19.1020],[72.8510, 19.0820],[72.8560, 19.0620],[72.8620, 19.0580]]] } }] }
    }
  },
  pune: {
    simulationTitle: 'Mula-Mutha Overflow',
    targetArea: 'Shivajinagar',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '25 mm/hr', forecast: 'Rain likely tonight', alertText: 'Advisory — River areas', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '160 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — Shivajinagar & Deccan', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '185 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Shivajinagar Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '220 mm/hr', forecast: 'Flood Imminent — Shivajinagar', alertText: '🚨 Flash Flood Emergency — Mula-Mutha Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '240 mm/hr', forecast: 'Flooding — Shivajinagar, Deccan', alertText: '🚨 Evacuation Order — Riverfront areas', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '150 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — Riverfront areas', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '60 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding near Shivajinagar', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~300 commuters stranded', location: 'Shivajinagar Station Road', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding near Shivajinagar', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~300 being evacuated', location: 'Shivajinagar Station Road', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding near Shivajinagar', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Shivajinagar Station Road', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 160 mm/hr — Flash Flood Watch issued for Pune metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding near Shivajinagar — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Shivajinagar in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Shivajinagar, Deccan, Kothrud zones at immediate risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Shivajinagar — 12 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — COEP Ground — capacity 600', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 73.8567, lat: 18.5204, name: 'Deccan Underpass Flooding', severity: 'CRITICAL', affected: '850', status: 'Responding' },
        { id: 'inc-2', lng: 73.8350, lat: 18.4950, name: 'Bridge Approach Flood',      severity: 'HIGH',     affected: '300', status: 'Closure pending' },
        { id: 'inc-3', lng: 73.8750, lat: 18.5050, name: 'Swargate Waterlogged',       severity: 'HIGH',     affected: '750', status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 73.8400, lat: 18.5000, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 73.8700, lat: 18.5200, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 73.8500, lat: 18.5300, name: 'Shelter Alpha — Cap. 500' },
        { id: 'shl-2', lng: 73.8200, lat: 18.4800, name: 'Shelter Beta — Cap. 300' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 73.8150, lat: 18.5550, name: 'Sassoon Hospital — Surge Ready' },
        { id: 'hosp-2', lng: 73.8980, lat: 18.4680, name: 'Ruby Hall — 89% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[73.8400, 18.4900],[73.8700, 18.4900],[73.8800, 18.5100],[73.8600, 18.5300],[73.8300, 18.5100],[73.8400, 18.4900]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[73.8567, 18.5204],[73.8500, 18.5300],[73.8300, 18.5500],[73.8000, 18.5700]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[73.8420, 18.4980],[73.8760, 18.4980],[73.8880, 18.5160],[73.8750, 18.5380],[73.8460, 18.5420],[73.8310, 18.5220],[73.8360, 18.5020],[73.8420, 18.4980]]] } }] }
    }
  },
  bengaluru: {
    simulationTitle: 'Bellandur Flood',
    targetArea: 'Koramangala',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '30 mm/hr', forecast: 'Rain likely tonight', alertText: 'Advisory — Lake areas', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '170 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — Koramangala & Indiranagar', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '190 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Koramangala Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '230 mm/hr', forecast: 'Flood Imminent — Koramangala', alertText: '🚨 Flash Flood Emergency — Bellandur Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '250 mm/hr', forecast: 'Flooding — Koramangala, HSR Layout', alertText: '🚨 Evacuation Order — Koramangala & HSR', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '160 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — Koramangala & HSR', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '65 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding in Koramangala', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~500 residents stranded', location: 'Koramangala 4th Block', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding in Koramangala', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~500 being evacuated', location: 'Koramangala 4th Block', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding in Koramangala', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Koramangala 4th Block', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 170 mm/hr — Flash Flood Watch issued for Bengaluru metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding in Koramangala — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Koramangala in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Koramangala, HSR Layout, Bellandur at immediate risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Koramangala — 15 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — National Games Village — capacity 1000', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 77.5946, lat: 12.9716, name: 'Silk Board Underpass Flooding', severity: 'CRITICAL', affected: '1,200', status: 'Responding' },
        { id: 'inc-2', lng: 77.5720, lat: 12.9500, name: 'Ring Road Approach Flood',      severity: 'HIGH',     affected: '400',   status: 'Closure pending' },
        { id: 'inc-3', lng: 77.6120, lat: 12.9600, name: 'Indiranagar 100ft Waterlogged', severity: 'HIGH',     affected: '900',   status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 77.5770, lat: 12.9550, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 77.6070, lat: 12.9750, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 77.5870, lat: 12.9850, name: 'Shelter Alpha — Cap. 600' },
        { id: 'shl-2', lng: 77.5570, lat: 12.9350, name: 'Shelter Beta — Cap. 400' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 77.5520, lat: 13.0100, name: 'Manipal Hospital — Surge Ready' },
        { id: 'hosp-2', lng: 77.6350, lat: 12.9230, name: 'Apollo Hospital — 85% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[77.5770, 12.9450],[77.6070, 12.9450],[77.6170, 12.9650],[77.5970, 12.9850],[77.5670, 12.9650],[77.5770, 12.9450]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[77.5946, 12.9716],[77.5870, 12.9850],[77.5670, 13.0050],[77.5370, 13.0250]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[77.5790, 12.9530],[77.6130, 12.9530],[77.6250, 12.9710],[77.6120, 12.9930],[77.5830, 12.9970],[77.5680, 12.9770],[77.5730, 12.9570],[77.5790, 12.9530]]] } }] }
    }
  },
  delhi: {
    simulationTitle: 'Yamuna River Overflow',
    targetArea: 'Kashmere Gate',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '28 mm/hr', forecast: 'Rain likely tonight', alertText: 'Advisory — Yamuna floodplain', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '180 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — North & East Delhi', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '200 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Kashmere Gate Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '235 mm/hr', forecast: 'Flood Imminent — Kashmere Gate', alertText: '🚨 Flash Flood Emergency — Yamuna Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '245 mm/hr', forecast: 'Flooding — Kashmere Gate, Civil Lines', alertText: '🚨 Evacuation Order — North & East Delhi', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '165 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — North & East Delhi', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '70 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding near Kashmere Gate', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~600 commuters stranded', location: 'Kashmere Gate ISBT', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding near Kashmere Gate', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~600 being evacuated', location: 'Kashmere Gate ISBT', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding near Kashmere Gate', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Kashmere Gate ISBT', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 180 mm/hr — Flash Flood Watch issued for Delhi metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding near Kashmere Gate — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Kashmere Gate in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Kashmere Gate, Civil Lines, Yamuna Bank at risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Kashmere Gate — 16 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — DU North Campus — capacity 1200', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 77.1025, lat: 28.7041, name: 'ISBT Underpass Flooding', severity: 'CRITICAL', affected: '1,500', status: 'Responding' },
        { id: 'inc-2', lng: 77.0800, lat: 28.6800, name: 'Ring Road Approach Flood',  severity: 'HIGH',     affected: '500',   status: 'Closure pending' },
        { id: 'inc-3', lng: 77.1200, lat: 28.6900, name: 'Civil Lines Waterlogged',    severity: 'HIGH',     affected: '800',   status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 77.0850, lat: 28.6850, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 77.1150, lat: 28.7050, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 77.0950, lat: 28.7150, name: 'Shelter Alpha — Cap. 800' },
        { id: 'shl-2', lng: 77.0650, lat: 28.6650, name: 'Shelter Beta — Cap. 500' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 77.0600, lat: 28.7400, name: 'AIIMS — Surge Ready' },
        { id: 'hosp-2', lng: 77.1430, lat: 28.6530, name: 'Safdarjung — 88% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[77.0850, 28.6750],[77.1150, 28.6750],[77.1250, 28.6950],[77.1050, 28.7150],[77.0750, 28.6950],[77.0850, 28.6750]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[77.1025, 28.7041],[77.0950, 28.7150],[77.0750, 28.7350],[77.0450, 28.7550]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[77.0870, 28.6830],[77.1210, 28.6830],[77.1330, 28.7010],[77.1200, 28.7230],[77.0910, 28.7270],[77.0760, 28.7070],[77.0810, 28.6870],[77.0870, 28.6830]]] } }] }
    }
  },
  chennai: {
    simulationTitle: 'Adyar River Flood',
    targetArea: 'Saidapet',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '35 mm/hr', forecast: 'Rain likely tonight', alertText: 'Advisory — Coastal areas', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '195 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — Adyar & Saidapet', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '215 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Saidapet Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '250 mm/hr', forecast: 'Flood Imminent — Saidapet', alertText: '🚨 Flash Flood Emergency — Adyar Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '260 mm/hr', forecast: 'Flooding — Saidapet, Guindy', alertText: '🚨 Evacuation Order — South Chennai', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '175 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — South Chennai', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '75 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding near Saidapet', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~450 residents stranded', location: 'Saidapet Bridge', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding near Saidapet', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~450 being evacuated', location: 'Saidapet Bridge', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding near Saidapet', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Saidapet Bridge', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 195 mm/hr — Flash Flood Watch issued for Chennai metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding near Saidapet — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Saidapet in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Saidapet, Guindy, Adyar zones at immediate risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Saidapet — 14 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — Guindy Engineering College — capacity 900', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 80.2707, lat: 13.0827, name: 'Mount Road Underpass Flooding', severity: 'CRITICAL', affected: '1,100', status: 'Responding' },
        { id: 'inc-2', lng: 80.2480, lat: 13.0610, name: 'Bridge Approach Flood',         severity: 'HIGH',     affected: '400',   status: 'Closure pending' },
        { id: 'inc-3', lng: 80.2880, lat: 13.0710, name: 'T Nagar Waterlogged',           severity: 'HIGH',     affected: '950',   status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 80.2530, lat: 13.0660, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 80.2830, lat: 13.0860, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 80.2630, lat: 13.0960, name: 'Shelter Alpha — Cap. 550' },
        { id: 'shl-2', lng: 80.2330, lat: 13.0460, name: 'Shelter Beta — Cap. 350' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 80.2280, lat: 13.1210, name: 'Apollo Main — Surge Ready' },
        { id: 'hosp-2', lng: 80.3110, lat: 13.0340, name: 'Fortis Malar — 86% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[80.2530, 13.0560],[80.2830, 13.0560],[80.2930, 13.0760],[80.2730, 13.0960],[80.2430, 13.0760],[80.2530, 13.0560]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[80.2707, 13.0827],[80.2630, 13.0960],[80.2430, 13.1160],[80.2130, 13.1360]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[80.2550, 13.0640],[80.2890, 13.0640],[80.3010, 13.0820],[80.2880, 13.1040],[80.2590, 13.1080],[80.2440, 13.0880],[80.2490, 13.0680],[80.2550, 13.0640]]] } }] }
    }
  },
  hyderabad: {
    simulationTitle: 'Musi River Flood',
    targetArea: 'Malakpet',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '32 mm/hr', forecast: 'Rain likely tonight', alertText: 'Advisory — Low-lying areas', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '185 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — Old City & Malakpet', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '205 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Malakpet Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '240 mm/hr', forecast: 'Flood Imminent — Malakpet', alertText: '🚨 Flash Flood Emergency — Musi River Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '252 mm/hr', forecast: 'Flooding — Malakpet, Dilsukhnagar', alertText: '🚨 Evacuation Order — Old City', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '168 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — Old City', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '72 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding near Malakpet', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~400 commuters stranded', location: 'Malakpet Station', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding near Malakpet', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~400 being evacuated', location: 'Malakpet Station', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding near Malakpet', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Malakpet Station', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 185 mm/hr — Flash Flood Watch issued for Hyderabad metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding near Malakpet — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Malakpet in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Malakpet, Dilsukhnagar, Chaderghat zones at risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Malakpet — 14 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — Nizam College Grounds — capacity 800', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 78.4867, lat: 17.3850, name: 'Chaderghat Bridge Flooding', severity: 'CRITICAL', affected: '1,150', status: 'Responding' },
        { id: 'inc-2', lng: 78.4640, lat: 17.3640, name: 'Moosarambagh Approach Flood',  severity: 'HIGH',     affected: '420',   status: 'Closure pending' },
        { id: 'inc-3', lng: 78.5040, lat: 17.3740, name: 'Dilsukhnagar Waterlogged',     severity: 'HIGH',     affected: '980',   status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 78.4690, lat: 17.3690, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 78.4990, lat: 17.3890, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 78.4790, lat: 17.3990, name: 'Shelter Alpha — Cap. 550' },
        { id: 'shl-2', lng: 78.4490, lat: 17.3490, name: 'Shelter Beta — Cap. 350' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 78.4440, lat: 17.4240, name: 'Osmania General — Surge Ready' },
        { id: 'hosp-2', lng: 78.5270, lat: 17.3370, name: 'KIMS Hospital — 87% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[78.4690, 17.3590],[78.4990, 17.3590],[78.5090, 17.3790],[78.4890, 17.3990],[78.4590, 17.3790],[78.4690, 17.3590]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[78.4867, 17.3850],[78.4790, 17.3990],[78.4590, 17.4190],[78.4290, 17.4390]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[78.4710, 17.3670],[78.5050, 17.3670],[78.5170, 17.3850],[78.5040, 17.4070],[78.4750, 17.4110],[78.4600, 17.3910],[78.4650, 17.3710],[78.4710, 17.3670]]] } }] }
    }
  },
  kolkata: {
    simulationTitle: 'Hooghly River Overflow',
    targetArea: 'Howrah',
    weather: {
      0: { label: 'Overcast', emoji: '🌥️', rainfall: '36 mm/hr', forecast: 'Rain likely tonight', alertText: 'Advisory — River areas', alertLevel: 'advisory' },
      1: { label: 'Torrential', emoji: '🌧️', rainfall: '190 mm/hr', forecast: 'Flood Risk — Extreme', alertText: '⚡ Flash Flood Watch — Howrah & Central', alertLevel: 'warning' },
      2: { label: 'Torrential', emoji: '🌧️', rainfall: '210 mm/hr', forecast: 'Flood Risk — Critical', alertText: '🚨 Flash Flood Warning — Howrah Bridge Zone', alertLevel: 'warning' },
      3: { label: 'Torrential', emoji: '⛈️', rainfall: '245 mm/hr', forecast: 'Flood Imminent — Howrah', alertText: '🚨 Flash Flood Emergency — Hooghly Overflow', alertLevel: 'warning' },
      4: { label: 'Torrential', emoji: '⛈️', rainfall: '255 mm/hr', forecast: 'Flooding — Howrah, BBD Bagh', alertText: '🚨 Evacuation Order — Riverside', alertLevel: 'warning' },
      5: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '170 mm/hr', forecast: 'Easing — 2 hours', alertText: '⚠️ Evacuation Order — Riverside', alertLevel: 'warning' },
      6: { label: 'Moderate Rain', emoji: '🌦️', rainfall: '73 mm/hr', forecast: 'Clearing by 02:00', alertText: 'Advisory: Flooded roads — proceed with caution', alertLevel: 'advisory' }
    },
    incidents: [
      { id: 'SIM-001', title: 'Citizen Report: Flooding near Howrah Station', severity: 'HIGH', time: '22:18', team: 'Unassigned', status: 'Unverified', impact: '~700 commuters stranded', location: 'Howrah Station', isNew: true },
      { id: 'SIM-001-res', title: 'Citizen Report: Flooding near Howrah Station', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Responding', impact: '~700 being evacuated', location: 'Howrah Station', isNew: false },
      { id: 'SIM-001-rsl', title: 'Citizen Report: Flooding near Howrah Station', severity: 'HIGH', time: '22:18', team: 'Rescue Alpha', status: 'Resolved', impact: 'Area cleared', location: 'Howrah Station', isNew: false }
    ],
    feedEntries: {
      0: [],
      1: [{ id: 'sim-f-1', time: '22:08', text: 'IMD: Rainfall intensifying to 190 mm/hr — Flash Flood Watch issued for Kolkata metro', dotColor: '#EAB308', category: 'advisory' }],
      2: [{ id: 'sim-f-2', time: '22:18', text: 'Citizen reported flooding near Howrah Station — water level rising rapidly', dotColor: '#3B82F6', category: 'report' }],
      3: [{ id: 'sim-f-3', time: '22:28', text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Howrah in 30 minutes', dotColor: '#A855F7', category: 'report' }],
      4: [{ id: 'sim-f-4', time: '22:38', text: 'Flood polygon active — Howrah, BBD Bagh, Sealdah zones at immediate risk', dotColor: '#EF4444', category: 'advisory' }],
      5: [
        { id: 'sim-f-5', time: '22:48', text: 'Rescue Team Alpha deployed to Howrah Station — 14 personnel en route', dotColor: '#22C55E', category: 'dispatch' },
        { id: 'sim-f-6', time: '22:48', text: 'Shelter Gamma opened — Eden Gardens — capacity 1500', dotColor: '#22C55E', category: 'shelter' }
      ],
      6: [{ id: 'sim-f-7', time: '22:58', text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing', dotColor: '#EAB308', category: 'advisory' }]
    },
    mapLayers: {
      incidents: [
        { id: 'inc-1', lng: 88.3639, lat: 22.5726, name: 'Howrah Bridge Flooding', severity: 'CRITICAL', affected: '1,250', status: 'Responding' },
        { id: 'inc-2', lng: 88.3410, lat: 22.5510, name: 'Park Street Approach Flood', severity: 'HIGH',     affected: '480',   status: 'Closure pending' },
        { id: 'inc-3', lng: 88.3810, lat: 22.5610, name: 'Sealdah Waterlogged',        severity: 'HIGH',     affected: '1,050', status: 'Evacuating' },
      ],
      rescue: [
        { id: 'res-1', lng: 88.3460, lat: 22.5560, name: 'Rescue Team Bravo' },
        { id: 'res-2', lng: 88.3760, lat: 22.5760, name: 'Rescue Team Delta' },
      ],
      shelters: [
        { id: 'shl-1', lng: 88.3560, lat: 22.5860, name: 'Shelter Alpha — Cap. 600' },
        { id: 'shl-2', lng: 88.3260, lat: 22.5360, name: 'Shelter Beta — Cap. 400' },
      ],
      hospitals: [
        { id: 'hosp-1', lng: 88.3210, lat: 22.6110, name: 'Medical College — Surge Ready' },
        { id: 'hosp-2', lng: 88.4040, lat: 22.5240, name: 'AMRI Hospital — 89% capacity' },
      ],
      floodZone: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[88.3460, 22.5460],[88.3760, 22.5460],[88.3860, 22.5660],[88.3660, 22.5860],[88.3360, 22.5660],[88.3460, 22.5460]]] } }] },
      evacRoute: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[88.3639, 22.5726],[88.3560, 22.5860],[88.3360, 22.6060],[88.3060, 22.6260]] } }] },
      simFlood:  { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[88.3480, 22.5540],[88.3820, 22.5540],[88.3940, 22.5720],[88.3810, 22.5940],[88.3520, 22.5980],[88.3370, 22.5780],[88.3420, 22.5580],[88.3480, 22.5540]]] } }] }
    }
  }
};
