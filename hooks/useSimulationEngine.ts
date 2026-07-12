'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
export type SimStatus = 'idle' | 'running' | 'paused' | 'complete';
export interface SimWeather {
  label: string;
  emoji: string;
  rainfall: string;
  forecast: string;
  alertText: string;
  alertLevel: string;
}

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

const API_BASE = 'http://127.0.0.1:8000/api/v1/simulation';

export function useSimulationEngine(): SimulationState & { isBackendAvailable: boolean } {
  const [backendState, setBackendState] = useState<Record<string, unknown> | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean>(true);

  // Poll backend
  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        if (mounted) {
          setBackendState(data);
          setIsBackendAvailable(true);
        }
      } catch (err) {
        if (mounted) {
          setIsBackendAvailable(false);
        }
      }
    };

    fetchStatus();
    // Poll every 1 second
    const timer = setInterval(fetchStatus, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const action = useCallback(async (endpoint: string) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setBackendState(data);
      }
    } catch (e) {
      console.error(`Failed to execute ${endpoint}`, e);
    }
  }, []);

  const start = useCallback(() => action('start'), [action]);
  const pause = useCallback(() => action('pause'), [action]);
  const reset = useCallback(() => action('reset'), [action]);
  const nextStage = useCallback(() => action('next'), [action]);
  const previousStage = useCallback(() => action('previous'), [action]);

  const setStage = useCallback(async (index: number) => {
    if (!backendState) return;
    const current = backendState.currentStageIndex as number;
    if (index === current) return;
    
    // Safety check - if jumping, we must do it sequentially since no backend endpoint exists
    if (index > current) {
      for (let i = current; i < index; i++) await action('next');
    } else {
      for (let i = current; i > index; i--) await action('previous');
    }
  }, [backendState, action]);

  const state = useMemo((): SimulationState => {
    if (!backendState) {
      return {
        status: 'idle',
        phase: 0,
        elapsed: 0,
        progress: 0,
        threatLevel: 'LOW',
        confidence: 0,
        weather: { label: '', emoji: '', rainfall: '', forecast: '', alertText: '', alertLevel: 'advisory' },
        simIncidents: [],
        feedEntries: [],
        resources: { deployed: 0, available: 0, personnel: 0 },
        showFloodOverlay: false,
        showActionPlan: false,
        showPrediction: false,
        start, pause, reset,
        startSimulation: start, pauseSimulation: pause, resumeSimulation: start, resetSimulation: reset,
        nextStage, previousStage, setStage
      };
    }

    return {
      status: backendState.status as SimStatus,
      phase: backendState.currentStageIndex as number,
      elapsed: (backendState.progress as number) * 80, // rough approximation for UI timers if any
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
      start, pause, reset,
      startSimulation: start, pauseSimulation: pause, resumeSimulation: start, resetSimulation: reset,
      nextStage, previousStage, setStage
    };
  }, [backendState, start, pause, reset, nextStage, previousStage, setStage]);

  return { ...state, isBackendAvailable };
}
