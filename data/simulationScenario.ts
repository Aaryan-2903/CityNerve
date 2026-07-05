/**
 * simulationScenario.ts
 *
 * All mock data for the Kurla Flood Disaster Simulation.
 * 7 stages over 60 seconds. Kept fully separate from component code.
 */

// ─── Stage timings (seconds from simulation start) ────────────────────────────
// Internal index 0 = Stage 1, index 6 = Stage 7

export const PHASE_TIMESTAMPS: Record<number, number> = {
  0: 0,   // Stage 1 — Initial state, threat LOW
  1: 8,   // Stage 2 — Heavy rain begins
  2: 18,  // Stage 3 — Citizen report: Kurla Station
  3: 28,  // Stage 4 — AI analysis, threat → HIGH
  4: 38,  // Stage 5 — Flood polygon on map, markers pulse
  5: 48,  // Stage 6 — Rescue deployed, shelter OPEN, incident RESPONDING
  6: 58,  // Stage 7 — Recovery, threat → MODERATE, simulation ends
};

export const SIMULATION_DURATION = 60; // seconds

export const STAGE_LABELS: Record<number, string> = {
  0: 'Initial State',
  1: 'Heavy Rain',
  2: 'Citizen Report',
  3: 'AI Analysis',
  4: 'Flood Expansion',
  5: 'Rescue Deployed',
  6: 'Recovery',
};

// ─── Threat levels by stage ───────────────────────────────────────────────────

export type ThreatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export const PHASE_THREAT: Record<number, ThreatLevel> = {
  0: 'LOW',
  1: 'LOW',
  2: 'LOW',
  3: 'HIGH',
  4: 'HIGH',
  5: 'HIGH',
  6: 'MODERATE',
};

// ─── AI confidence by stage ───────────────────────────────────────────────────

export const PHASE_CONFIDENCE: Record<number, number> = {
  0: 68,
  1: 73,
  2: 79,
  3: 94,
  4: 94,
  5: 96,
  6: 88,
};

// ─── Weather conditions by stage ─────────────────────────────────────────────

export interface SimWeather {
  label: string;
  emoji: string;
  rainfall: string;
  forecast: string;
  alertText: string;
  alertLevel: 'warning' | 'advisory';
}

export const PHASE_WEATHER: Record<number, SimWeather> = {
  0: {
    label: 'Overcast',
    emoji: '🌥️',
    rainfall: '1.4 in/hr',
    forecast: 'Rain likely tonight',
    alertText: 'Dense Fog Advisory — Harbour areas',
    alertLevel: 'advisory',
  },
  1: {
    label: 'Torrential',
    emoji: '🌧️',
    rainfall: '7.6 in/hr',
    forecast: 'Flood Risk — Extreme',
    alertText: '⚡ Flash Flood Watch — Kurla & Eastern Suburbs',
    alertLevel: 'warning',
  },
  2: {
    label: 'Torrential',
    emoji: '🌧️',
    rainfall: '8.3 in/hr',
    forecast: 'Flood Risk — Critical',
    alertText: '🚨 Flash Flood Warning — Kurla Station Zone',
    alertLevel: 'warning',
  },
  3: {
    label: 'Torrential',
    emoji: '⛈️',
    rainfall: '9.7 in/hr',
    forecast: 'Flood Imminent — Kurla',
    alertText: '🚨 Flash Flood Emergency — Mithi River Overflow',
    alertLevel: 'warning',
  },
  4: {
    label: 'Torrential',
    emoji: '⛈️',
    rainfall: '10.1 in/hr',
    forecast: 'Flooding — Kurla, Ghatkopar',
    alertText: '🚨 Evacuation Order — Kurla East & West',
    alertLevel: 'warning',
  },
  5: {
    label: 'Heavy Rain',
    emoji: '🌧️',
    rainfall: '6.8 in/hr',
    forecast: 'Easing — 2 hours',
    alertText: '⚠️ Evacuation Order — Kurla East & West',
    alertLevel: 'warning',
  },
  6: {
    label: 'Moderate Rain',
    emoji: '🌦️',
    rainfall: '2.9 in/hr',
    forecast: 'Clearing by 02:00',
    alertText: 'Advisory: Flooded roads — proceed with caution',
    alertLevel: 'advisory',
  },
};

// ─── Sim Incidents ────────────────────────────────────────────────────────────

export interface SimIncident {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  team: string;
  status: string;
  impact: string;
  location: string;
  isNew?: boolean;
}

/** Stage 3: Citizen report — injected at stage index 2 */
export const CITIZEN_REPORT_INCIDENT: SimIncident = {
  id: 'SIM-001',
  title: 'Citizen Report: Flooding near Kurla Station',
  severity: 'HIGH',
  time: '22:18',
  team: 'Unassigned',
  status: 'Unverified',
  impact: '~400 commuters stranded',
  location: 'Kurla Station, East Annex',
  isNew: true,
};

/** Stage 6: Updated after rescue deployed */
export const CITIZEN_REPORT_RESPONDING: SimIncident = {
  ...CITIZEN_REPORT_INCIDENT,
  team: 'Rescue Alpha',
  status: 'Responding',
  impact: '~400 being evacuated',
  isNew: false,
};

/** Stage 7: Resolved */
export const CITIZEN_REPORT_RESOLVED: SimIncident = {
  ...CITIZEN_REPORT_INCIDENT,
  team: 'Rescue Alpha',
  status: 'Resolved',
  impact: 'Area cleared',
  isNew: false,
};

// ─── Command Feed entries by stage ────────────────────────────────────────────

export interface SimFeedEntry {
  id: string;
  time: string;
  text: string;
  dotColor: string;
  category: 'dispatch' | 'shelter' | 'advisory' | 'report';
}

export const PHASE_FEED_ENTRIES: Record<number, SimFeedEntry[]> = {
  0: [],
  1: [
    {
      id: 'sim-f-1',
      time: '22:08',
      text: 'NWS: Rainfall intensifying to 7.6 in/hr — Flash Flood Watch issued for Mumbai metro',
      dotColor: '#EAB308',
      category: 'advisory',
    },
  ],
  2: [
    {
      id: 'sim-f-2',
      time: '22:18',
      text: 'Citizen reported flooding near Kurla Station — water level rising rapidly',
      dotColor: '#3B82F6',
      category: 'report',
    },
  ],
  3: [
    {
      id: 'sim-f-3',
      time: '22:28',
      text: 'AI Analysis complete — Threat elevated to HIGH — Flood expected to reach Kurla in 30 minutes',
      dotColor: '#A855F7',
      category: 'report',
    },
  ],
  4: [
    {
      id: 'sim-f-4',
      time: '22:38',
      text: 'Flood polygon active — Kurla, Ghatkopar, Chembur zones at immediate risk',
      dotColor: '#EF4444',
      category: 'advisory',
    },
  ],
  5: [
    {
      id: 'sim-f-5',
      time: '22:48',
      text: 'Rescue Team Alpha deployed to Kurla Station — 14 personnel en route',
      dotColor: '#22C55E',
      category: 'dispatch',
    },
    {
      id: 'sim-f-6',
      time: '22:48',
      text: 'Shelter Gamma opened — Kurla Sports Ground — capacity 800',
      dotColor: '#22C55E',
      category: 'shelter',
    },
  ],
  6: [
    {
      id: 'sim-f-7',
      time: '22:58',
      text: 'Threat downgraded to MODERATE — rain easing — rescue operations ongoing',
      dotColor: '#EAB308',
      category: 'advisory',
    },
  ],
};

// ─── Resource counters by stage ───────────────────────────────────────────────

export interface SimResources {
  deployed: number;
  available: number;
  personnel: number;
}

export const PHASE_RESOURCES: Record<number, SimResources> = {
  0: { deployed: 2, available: 14, personnel: 18 },
  1: { deployed: 3, available: 13, personnel: 22 },
  2: { deployed: 4, available: 12, personnel: 28 },
  3: { deployed: 4, available: 12, personnel: 28 },
  4: { deployed: 6, available: 10, personnel: 40 },
  5: { deployed: 9, available: 7,  personnel: 62 },
  6: { deployed: 7, available: 9,  personnel: 50 },
};

// ─── Kurla flood GeoJSON (used in RiskMap at stage 4+) ───────────────────────
// Centred on Kurla Station (lat 19.0728, lng 72.8790)

export const KURLA_FLOOD_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [{
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [72.8620, 19.0580],
        [72.8960, 19.0580],
        [72.9080, 19.0760],
        [72.8950, 19.0980],
        [72.8660, 19.1020],
        [72.8510, 19.0820],
        [72.8560, 19.0620],
        [72.8620, 19.0580],
      ]],
    },
  }],
};
