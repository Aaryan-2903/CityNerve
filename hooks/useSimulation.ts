'use client';

/**
 * useSimulation.ts
 *
 * Core simulation engine. Drives 7-stage transitions using a 1-second
 * interval and derives all panel state from the current stage index.
 *
 * Controls: start(), pause(), reset()
 * No backend, no API calls, no Gemini.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SIMULATION_DURATION,
  PHASE_TIMESTAMPS,
  PHASE_THREAT,
  PHASE_CONFIDENCE,
  PHASE_WEATHER,
  PHASE_FEED_ENTRIES,
  PHASE_RESOURCES,
  CITIZEN_REPORT_INCIDENT,
  CITIZEN_REPORT_RESPONDING,
  CITIZEN_REPORT_RESOLVED,
  type SimIncident,
  type SimFeedEntry,
  type SimResources,
  type SimWeather,
  type ThreatLevel,
} from '@/data/simulationScenario';

export type SimStatus = 'idle' | 'running' | 'paused' | 'complete';

export interface SimulationState {
  // Controls
  status: SimStatus;
  phase: number;        // 0-6 (internal stage index)
  elapsed: number;      // 0–60 seconds
  progress: number;     // 0–1

  // Derived panel state
  threatLevel: ThreatLevel;
  confidence: number;
  weather: SimWeather;
  simIncidents: SimIncident[];
  feedEntries: SimFeedEntry[];
  resources: SimResources;
  showFloodOverlay: boolean;
  showActionPlan: boolean;
  showPrediction: boolean;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/** Returns the stage index (0-6) for a given elapsed time */
function getStageForElapsed(elapsed: number): number {
  const stages = Object.entries(PHASE_TIMESTAMPS)
    .map(([stage, time]) => ({ stage: Number(stage), time }))
    .sort((a, b) => b.time - a.time); // descending

  const match = stages.find((s) => elapsed >= s.time);
  return match ? match.stage : 0;
}

/** Accumulates all feed entries from stage 0 up to (and including) the given stage */
function accumulateFeedEntries(stage: number): SimFeedEntry[] {
  const entries: SimFeedEntry[] = [];
  for (let s = stage; s >= 0; s--) {
    entries.push(...(PHASE_FEED_ENTRIES[s] ?? []));
  }
  return entries;
}

export function useSimulation(): SimulationState {
  const [status, setStatus] = useState<SimStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear interval helper
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus((prev) => (prev === 'running' ? 'paused' : prev));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setElapsed(0);
    setStatus('idle');
  }, [clearTimer]);

  // Tick every second when running
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= SIMULATION_DURATION) {
            clearTimer();
            setStatus('complete');
            return SIMULATION_DURATION;
          }
          return next;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [status, clearTimer]);

  // Derive all state from elapsed time
  const phase = useMemo(() => getStageForElapsed(elapsed), [elapsed]);
  const progress    = elapsed / SIMULATION_DURATION;
  const threatLevel = PHASE_THREAT[phase]      ?? 'LOW';
  const confidence  = PHASE_CONFIDENCE[phase]  ?? 68;
  const weather     = PHASE_WEATHER[phase]     ?? PHASE_WEATHER[0];
  const resources   = PHASE_RESOURCES[phase]   ?? PHASE_RESOURCES[0];

  // Stage 4+ → flood polygon visible on map
  const showFloodOverlay = phase >= 4;
  // Stage 5+ → action plan lit up in AICommand
  const showActionPlan   = phase >= 5;
  // Stage 3+ → prediction text visible in AICommand
  const showPrediction   = phase >= 3;

  // Incident injection:
  //   Stage 2 (index 2): citizen report appears (NEW badge)
  //   Stage 5 (index 5): incident → RESPONDING
  //   Stage 6 (index 6): incident → RESOLVED
  const simIncidents = useMemo<SimIncident[]>(() => {
    if (phase < 2)  return [];
    if (phase >= 6) return [CITIZEN_REPORT_RESOLVED];
    if (phase >= 5) return [CITIZEN_REPORT_RESPONDING];
    return [CITIZEN_REPORT_INCIDENT];
  }, [phase]);

  const feedEntries = useMemo(() => accumulateFeedEntries(phase), [phase]);

  return {
    status,
    phase,
    elapsed,
    progress,
    threatLevel,
    confidence,
    weather,
    simIncidents,
    feedEntries,
    resources,
    showFloodOverlay,
    showActionPlan,
    showPrediction,
    start,
    pause,
    reset,
  };
}
