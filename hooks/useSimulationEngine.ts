'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
export type SimStatus = 'idle' | 'running' | 'paused' | 'complete';
export interface SimulationState {
  status: SimStatus;
  phase: number;
  elapsed: number;
  progress: number;
  threatLevel: string;
  confidence: number;
  weather: any;
  simIncidents: any[];
  feedEntries: any[];
  resources: any;
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
  const [backendState, setBackendState] = useState<any>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean>(true);

  // Poll backend
  useEffect(() => {
    let mounted = true;
    let timer: any;

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
    timer = setInterval(fetchStatus, 1000);

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
    const current = backendState.currentStageIndex;
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
      phase: backendState.currentStageIndex,
      elapsed: backendState.progress * 80, // rough approximation for UI timers if any
      progress: backendState.progress,
      threatLevel: backendState.threatLevel,
      confidence: backendState.confidence,
      weather: backendState.weather,
      simIncidents: backendState.incidents,
      feedEntries: backendState.feedEntries,
      resources: backendState.resources,
      showFloodOverlay: backendState.showFloodOverlay,
      showActionPlan: backendState.showActionPlan,
      showPrediction: backendState.showPrediction,
      start, pause, reset,
      startSimulation: start, pauseSimulation: pause, resumeSimulation: start, resetSimulation: reset,
      nextStage, previousStage, setStage
    };
  }, [backendState, start, pause, reset, nextStage, previousStage, setStage]);

  return { ...state, isBackendAvailable };
}
