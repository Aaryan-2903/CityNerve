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
import { localizeData } from '@/src/data/cities';
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
  
  // Aliases for SimulationControls
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  nextStage: () => void;
  previousStage: () => void;
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

  // Localize simulation data based on the selected city
  const lWeather = useMemo(() => localizeData(PHASE_WEATHER, currentCity), [currentCity]);
  const lFeedEntries = useMemo(() => localizeData(PHASE_FEED_ENTRIES, currentCity), [currentCity]);
  const lReportInc = useMemo(() => localizeData(CITIZEN_REPORT_INCIDENT, currentCity), [currentCity]);
  const lReportRes = useMemo(() => localizeData(CITIZEN_REPORT_RESPONDING, currentCity), [currentCity]);
  const lReportRslvd = useMemo(() => localizeData(CITIZEN_REPORT_RESOLVED, currentCity), [currentCity]);

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
  const weather     = lWeather[phase]          ?? lWeather[0];
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
    if (phase >= 6) return [lReportRslvd];
    if (phase >= 5) return [lReportRes];
    return [lReportInc];
  }, [phase, lReportInc, lReportRes, lReportRslvd]);

  const feedEntries = useMemo(() => {
    const entries: SimFeedEntry[] = [];
    for (let s = phase; s >= 0; s--) {
      entries.push(...(lFeedEntries[s] ?? []));
    }
    return entries;
  }, [phase, lFeedEntries]);

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
  };
}
