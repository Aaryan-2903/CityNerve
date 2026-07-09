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
import { useCity } from '@/src/context/CityContext';
import { CITY_SCENARIOS } from '@/data/cityScenarios';
import {
  SIMULATION_DURATION,
  PHASE_TIMESTAMPS,
  PHASE_THREAT,
  PHASE_CONFIDENCE,
  PHASE_RESOURCES,
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
  
  // Aliases for SimulationControls
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  nextStage: () => void;
  previousStage: () => void;
  setStage: (index: number) => void;
}

/** Returns the stage index (0-6) for a given elapsed time */
function getStageForElapsed(elapsed: number): number {
  const stages = Object.entries(PHASE_TIMESTAMPS)
    .map(([stage, time]) => ({ stage: Number(stage), time }))
    .sort((a, b) => b.time - a.time); // descending

  const match = stages.find((s) => elapsed >= s.time);
  return match ? match.stage : 0;
}

export function useSimulation(): SimulationState {
  const { currentCity } = useCity();

  // Load the active city scenario (fallback to Mumbai if not explicitly mapped)
  const scenario = useMemo(() => {
    return CITY_SCENARIOS[currentCity.id] || CITY_SCENARIOS['mumbai'];
  }, [currentCity.id]);

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
  const weather     = scenario.weather[phase]  ?? scenario.weather[0];
  const resources   = PHASE_RESOURCES[phase]   ?? PHASE_RESOURCES[0];

  // Stage 4+ → flood polygon visible on map
  const showFloodOverlay = phase >= 4;
  // Stage 5+ → action plan lit up in AICommand
  const showActionPlan   = phase >= 5;
  // Stage 3+ → prediction text visible in AICommand
  const showPrediction   = phase >= 3;

  // Incident injection
  const simIncidents = useMemo<SimIncident[]>(() => {
    if (phase < 2)  return [];
    if (phase >= 6) return [scenario.incidents[2]]; // Resolved
    if (phase >= 5) return [scenario.incidents[1]]; // Responding
    return [scenario.incidents[0]];                 // Report
  }, [phase, scenario.incidents]);

  const feedEntries = useMemo(() => {
    const entries: SimFeedEntry[] = [];
    for (let s = phase; s >= 0; s--) {
      entries.push(...(scenario.feedEntries[s] ?? []));
    }
    return entries;
  }, [phase, scenario.feedEntries]);

  const nextStage = useCallback(() => {
    setElapsed((prev) => {
      const p = getStageForElapsed(prev);
      return Math.min(60, (p + 1) * 10);
    });
  }, []);

  const previousStage = useCallback(() => {
    setElapsed((prev) => {
      const p = getStageForElapsed(prev);
      return Math.max(0, (p - 1) * 10);
    });
  }, []);

  const setStage = useCallback((index: number) => {
    // Each stage is 10 seconds of elapsed time (0-80)
    setElapsed(Math.max(0, Math.min(80, index * 10)));
  }, []);

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
    
    // Aliases
    startSimulation: start,
    pauseSimulation: pause,
    resumeSimulation: start,
    resetSimulation: reset,
    nextStage,
    previousStage,
    setStage,
  };
}
