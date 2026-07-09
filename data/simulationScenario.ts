/**
 * simulationScenario.ts
 *
 * Generic mock data types and timings for the Disaster Simulation.
 * 7 stages over 60 seconds. Kept fully separate from component code.
 */

// ─── Stage timings (seconds from simulation start) ────────────────────────────
// Internal index 0 = Stage 1, index 6 = Stage 7

export const PHASE_TIMESTAMPS: Record<number, number> = {
  0: 0,   // Normal
  1: 8,   // Heavy Rain
  2: 18,  // Citizen Reports
  3: 28,  // Flood Warning
  4: 38,  // Road Closure
  5: 48,  // Shelter Activated
  6: 58,  // Rescue Deployment
  7: 68,  // Recovery
  8: 78,  // Completed
};

export const SIMULATION_DURATION = 60; // seconds

export const STAGE_LABELS: Record<number, string> = {
  0: 'Initial State',
  1: 'Heavy Rain',
  2: 'Citizen Reports',
  3: 'Flood Warning',
  4: 'Road Closure',
  5: 'Shelter Activated',
  6: 'Rescue Deployment',
  7: 'Recovery',
  8: 'Completed',
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
  6: 'HIGH',
  7: 'MODERATE',
  8: 'MODERATE',
};

// ─── AI confidence by stage ───────────────────────────────────────────────────

export const PHASE_CONFIDENCE: Record<number, number> = {
  0: 68,
  1: 73,
  2: 79,
  3: 88,
  4: 92,
  5: 94,
  6: 96,
  7: 90,
  8: 88,
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface SimWeather {
  label: string;
  emoji: string;
  rainfall: string;
  forecast: string;
  alertText: string;
  alertLevel: 'warning' | 'advisory';
}

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

export interface SimFeedEntry {
  id: string;
  time: string;
  text: string;
  dotColor: string;
  category: 'dispatch' | 'shelter' | 'advisory' | 'report';
}

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
  6: { deployed: 12, available: 4,  personnel: 80 },
  7: { deployed: 7, available: 9,  personnel: 50 },
  8: { deployed: 4, available: 12, personnel: 30 },
};
