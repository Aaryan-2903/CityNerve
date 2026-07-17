'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';
import {
  PHASE_TIMESTAMPS,
  PHASE_THREAT,
  PHASE_CONFIDENCE,
  PHASE_RESOURCES,
  STAGE_LABELS,
  type SimWeather,
  type SimIncident,
  type SimFeedEntry,
} from '@/data/simulationScenario';
import { AI_COMMANDER_CONFIG } from '@/data/aiCommanderConfig';
import { formatHHMM } from '@/utils/format';
import { SIMULATION_ALERTS } from '@/data/simulationAlerts';

export type SimStatus = 'idle' | 'running' | 'paused' | 'complete';
export { type SimWeather };

export interface SimResource {
  deployed: number;
  available: number;
  personnel: number;
}

export interface SimulationState {
  status: SimStatus;
  phase: number;
  elapsed: number;
  progress: number;
  threatLevel: string;
  confidence: number;
  weather: SimWeather;
  simIncidents: Record<string, unknown>[];
  feedEntries: Record<string, unknown>[];
  resources: SimResource;
  showFloodOverlay: boolean;
  showActionPlan: boolean;
  showPrediction: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  nextStage: () => void;
  previousStage: () => void;
  setStage: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Per-phase client-side simulation data (used in demo / offline mode)
// ---------------------------------------------------------------------------

const PHASE_WEATHER: Record<number, SimWeather> = {
  0: { label: 'Clear Sky', emoji: '☀️', rainfall: '0 mm', forecast: 'Stable', alertText: 'Normal Conditions', alertLevel: 'advisory' },
  1: { label: 'Heavy Rain', emoji: '🌧️', rainfall: '48 mm/hr', forecast: 'Worsening', alertText: 'Weather Advisory', alertLevel: 'advisory' },
  2: { label: 'Intense Rain', emoji: '⛈️', rainfall: '72 mm/hr', forecast: 'Deteriorating', alertText: 'Storm Watch', alertLevel: 'warning' },
  3: { label: 'Flash Flood', emoji: '🌊', rainfall: '95 mm/hr', forecast: 'Critical', alertText: 'Flood Warning', alertLevel: 'warning' },
  4: { label: 'Flooding', emoji: '🚨', rainfall: '110 mm/hr', forecast: 'Emergency', alertText: 'Infrastructure Warning', alertLevel: 'warning' },
  5: { label: 'Severe Flood', emoji: '🆘', rainfall: '120 mm/hr', forecast: 'Emergency', alertText: 'Critical Alert', alertLevel: 'warning' },
  6: { label: 'Rescue Ops', emoji: '🚁', rainfall: '85 mm/hr', forecast: 'Stabilizing', alertText: 'Emergency State', alertLevel: 'warning' },
  7: { label: 'Clearing', emoji: '🌤️', rainfall: '20 mm/hr', forecast: 'Improving', alertText: 'Recovery Phase', alertLevel: 'advisory' },
  8: { label: 'Post-Event', emoji: '🌈', rainfall: '5 mm/hr', forecast: 'Stable', alertText: 'All Clear', alertLevel: 'advisory' },
};

const MAX_PHASE = Object.keys(PHASE_TIMESTAMPS).length - 1;

function buildClientState(phase: number, status: SimStatus, elapsed: number): SimulationState & { isBackendAvailable: boolean } {
  const cfg = AI_COMMANDER_CONFIG[phase] ?? AI_COMMANDER_CONFIG[0];
  const resources = PHASE_RESOURCES[phase] ?? PHASE_RESOURCES[0];
  const weather = PHASE_WEATHER[phase] ?? PHASE_WEATHER[0];
  const alert = SIMULATION_ALERTS[phase] ?? SIMULATION_ALERTS[0];

  const feedEntries: SimFeedEntry[] = cfg.recommendations.map((r, i) => ({
    id: `feed-${phase}-${i}`,
    time: formatHHMM(new Date()),
    text: r.recommendation,
    dotColor: '#A855F7',
    category: 'dispatch' as const,
  }));

  const simIncidents: SimIncident[] = cfg.recommendations.map((r, i) => ({
    id: `sim-inc-${phase}-${i}`,
    title: alert.title,
    severity: (cfg.threatLevel === 'CRITICAL' ? 'CRITICAL' : cfg.threatLevel === 'HIGH' ? 'HIGH' : cfg.threatLevel === 'MODERATE' ? 'MEDIUM' : 'LOW') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    time: formatHHMM(new Date()),
    team: `${resources.deployed} Units`,
    status: status === 'running' ? 'Active' : 'Standby',
    impact: `${cfg.riskScore}% risk`,
    location: STAGE_LABELS[phase] ?? 'City Center',
    isNew: phase > 0 && i === 0,
  }));

  const totalDuration = PHASE_TIMESTAMPS[MAX_PHASE] ?? 78;
  const progress = totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 0;

  return {
    status,
    phase,
    elapsed,
    progress,
    threatLevel: PHASE_THREAT[phase] ?? 'LOW',
    confidence: PHASE_CONFIDENCE[phase] ?? 68,
    weather,
    simIncidents: simIncidents as unknown as Record<string, unknown>[],
    feedEntries: feedEntries as unknown as Record<string, unknown>[],
    resources,
    showFloodOverlay: phase >= 3,
    showActionPlan: phase >= 2,
    showPrediction: phase >= 1,
    isBackendAvailable: false,
    start: () => {},
    pause: () => {},
    reset: () => {},
    startSimulation: () => {},
    pauseSimulation: () => {},
    resumeSimulation: () => {},
    resetSimulation: () => {},
    nextStage: () => {},
    previousStage: () => {},
    setStage: () => {},
  };
}

// ---------------------------------------------------------------------------
// Hook — tries backend first, falls back to full client-side simulation
// ---------------------------------------------------------------------------

export function useSimulationEngine(): SimulationState & { isBackendAvailable: boolean } {
  const [backendState, setBackendState] = useState<Record<string, unknown> | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean>(true);
  const [backendChecked, setBackendChecked] = useState(false);

  // Client-side simulation state (used when backend is unavailable)
  const [clientPhase, setClientPhase] = useState(0);
  const [clientStatus, setClientStatus] = useState<SimStatus>('idle');
  const [clientElapsed, setClientElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------------------------------------------------------------------------
  // Backend polling — check once, then poll only if backend is available
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    // If no URL, skip backend entirely.
    if (!API_BASE) {
      setIsBackendAvailable(false);
      setBackendChecked(true);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/status`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        if (mounted) {
          setBackendState(data);
          setIsBackendAvailable(true);
          setBackendChecked(true);
        }
      } catch {
        if (mounted) {
          setIsBackendAvailable(false);
          setBackendChecked(true);
        }
      }
    };

    fetchStatus();

    // Only start polling after we confirm backend is alive (avoid 60 errors/min)
    const initialTimer = setTimeout(() => {
      if (!mounted) return;
      // After first check: poll every 5s (much gentler than original 1s)
      const timer = setInterval(async () => {
        if (!mounted || !isBackendAvailable) return;
        try {
          const res = await fetch(`${API_BASE}/status`, { signal: AbortSignal.timeout(3000) });
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();
          if (mounted) setBackendState(data);
        } catch {
          if (mounted) setIsBackendAvailable(false);
        }
      }, 5000);
      timerRef.current = timer;
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(initialTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Client-side simulation controls
  // ---------------------------------------------------------------------------
  const clientStart = useCallback(() => {
    setClientStatus('running');
  }, []);

  const clientPause = useCallback(() => {
    setClientStatus('paused');
  }, []);

  const clientReset = useCallback(() => {
    setClientStatus('idle');
    setClientPhase(0);
    setClientElapsed(0);
  }, []);

  const clientNext = useCallback(() => {
    setClientPhase(p => Math.min(p + 1, MAX_PHASE));
  }, []);

  const clientPrevious = useCallback(() => {
    setClientPhase(p => Math.max(p - 1, 0));
  }, []);

  const clientSetStage = useCallback((index: number) => {
    setClientPhase(Math.max(0, Math.min(index, MAX_PHASE)));
  }, []);

  // Advance elapsed time when running
  useEffect(() => {
    if (isBackendAvailable) return; // backend handles its own clock
    if (clientStatus !== 'running') return;

    const id = setInterval(() => {
      setClientElapsed(e => {
        const next = e + 1;
        // Auto-advance phase based on phase timestamps
        const nextPhase = Object.entries(PHASE_TIMESTAMPS)
          .reverse()
          .find(([, ts]) => next >= ts)?.[0];
        if (nextPhase !== undefined) {
          const idx = parseInt(nextPhase, 10);
          setClientPhase(p => (idx > p ? idx : p));
        }
        if (next >= (PHASE_TIMESTAMPS[MAX_PHASE] ?? 78)) {
          setClientStatus('complete');
          return next;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [clientStatus, isBackendAvailable]);

  // ---------------------------------------------------------------------------
  // Backend action dispatcher (only used when backend IS available)
  // ---------------------------------------------------------------------------
  const action = useCallback(async (endpoint: string) => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        setBackendState(data);
      }
    } catch (e) {
      console.error(`Failed to execute ${endpoint}`, e);
    }
  }, []);

  const backendNext = useCallback(() => action('next'), [action]);
  const backendPrevious = useCallback(() => action('previous'), [action]);
  const backendStart = useCallback(() => action('start'), [action]);
  const backendPause = useCallback(() => action('pause'), [action]);
  const backendReset = useCallback(() => action('reset'), [action]);

  const backendSetStage = useCallback(async (index: number) => {
    if (!backendState) return;
    const current = backendState.currentStageIndex as number;
    if (index === current) return;
    if (index > current) {
      for (let i = current; i < index; i++) await action('next');
    } else {
      for (let i = current; i > index; i--) await action('previous');
    }
  }, [backendState, action]);

  // ---------------------------------------------------------------------------
  // Merge backend or client state into the unified SimulationState
  // ---------------------------------------------------------------------------
  const state = useMemo((): SimulationState & { isBackendAvailable: boolean } => {
    // Not yet determined which mode to use — return idle state
    if (!backendChecked) {
      const clientSt = buildClientState(0, 'idle', 0);
      clientSt.start = clientStart;
      clientSt.pause = clientPause;
      clientSt.reset = clientReset;
      clientSt.startSimulation = clientStart;
      clientSt.pauseSimulation = clientPause;
      clientSt.resumeSimulation = clientStart;
      clientSt.resetSimulation = clientReset;
      clientSt.nextStage = clientNext;
      clientSt.previousStage = clientPrevious;
      clientSt.setStage = clientSetStage;
      return clientSt;
    }

    // --- DEMO / OFFLINE MODE: full client-side simulation ---
    if (!isBackendAvailable) {
      const clientSt = buildClientState(clientPhase, clientStatus, clientElapsed);
      clientSt.start = clientStart;
      clientSt.pause = clientPause;
      clientSt.reset = clientReset;
      clientSt.startSimulation = clientStart;
      clientSt.pauseSimulation = clientPause;
      clientSt.resumeSimulation = clientStart;
      clientSt.resetSimulation = clientReset;
      clientSt.nextStage = clientNext;
      clientSt.previousStage = clientPrevious;
      clientSt.setStage = clientSetStage;
      return clientSt;
    }

    // --- LIVE MODE: use backend state ---
    if (!backendState) {
      return buildClientState(0, 'idle', 0);
    }

    return {
      status: backendState.status as SimStatus,
      phase: backendState.currentStageIndex as number,
      elapsed: (backendState.progress as number) * 80,
      progress: backendState.progress as number,
      threatLevel: backendState.threatLevel as string,
      confidence: backendState.confidence as number,
      weather: backendState.weather as SimWeather,
      simIncidents: backendState.incidents as Record<string, unknown>[],
      feedEntries: backendState.feedEntries as Record<string, unknown>[],
      resources: backendState.resources as SimResource,
      showFloodOverlay: backendState.showFloodOverlay as boolean,
      showActionPlan: backendState.showActionPlan as boolean,
      showPrediction: backendState.showPrediction as boolean,
      isBackendAvailable: true,
      start: backendStart,
      pause: backendPause,
      reset: backendReset,
      startSimulation: backendStart,
      pauseSimulation: backendPause,
      resumeSimulation: backendStart,
      resetSimulation: backendReset,
      nextStage: backendNext,
      previousStage: backendPrevious,
      setStage: backendSetStage,
    };
  }, [
    backendChecked, isBackendAvailable, backendState,
    clientPhase, clientStatus, clientElapsed,
    clientStart, clientPause, clientReset, clientNext, clientPrevious, clientSetStage,
    backendStart, backendPause, backendReset, backendNext, backendPrevious, backendSetStage,
  ]);

  return state;
}
