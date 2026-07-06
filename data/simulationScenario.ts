/**
 * simulationScenario.ts
 *
 * Generic mock data types and timings for the Disaster Simulation.
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
  6: { deployed: 7, available: 9,  personnel: 50 },
};
