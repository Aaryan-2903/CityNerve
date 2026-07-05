'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationStage } from '@/simulation/simulationStages';
import { SimulationEngine, type SimulationStatus } from '@/simulation/simulationEngine';

export interface UseSimulationReturn {
  currentStage: SimulationStage;
  status: SimulationStatus;
  progress: number;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  nextStage: () => void;
  previousStage: () => void;
}

export function useSimulation(): UseSimulationReturn {
  const [currentStage, setCurrentStage] = useState<SimulationStage>(SimulationStage.NORMAL);
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const nextStage = useCallback(() => {
    setCurrentStage((prev) => SimulationEngine.getNextStage(prev));
    setElapsedMs(0);
  }, []);

  const previousStage = useCallback(() => {
    setCurrentStage((prev) => SimulationEngine.getPreviousStage(prev));
    setElapsedMs(0);
  }, []);

  const startSimulation = useCallback(() => {
    if (status === 'idle') {
      setCurrentStage(SimulationStage.NORMAL);
      setElapsedMs(0);
    }
    setStatus('running');
  }, [status]);

  const pauseSimulation = useCallback(() => {
    if (status === 'running') setStatus('paused');
  }, [status]);

  const resumeSimulation = useCallback(() => {
    if (status === 'paused') setStatus('running');
  }, [status]);

  const resetSimulation = useCallback(() => {
    setStatus('idle');
    setCurrentStage(SimulationStage.NORMAL);
    setElapsedMs(0);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    lastTimeRef.current = undefined;
  }, []);

  const tick = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      
      setElapsedMs((prev) => {
        const newElapsed = prev + deltaTime;
        const duration = SimulationEngine.getStageDuration(currentStage);
        
        // Advance stage if duration met
        if (duration > 0 && newElapsed >= duration) {
          const next = SimulationEngine.getNextStage(currentStage);
          if (next === currentStage) {
            setStatus('completed');
            return duration;
          } else {
            setCurrentStage(next);
            return 0; // reset elapsed for new stage
          }
        }
        return newElapsed;
      });
    }
    lastTimeRef.current = time;
    if (status === 'running') {
      requestRef.current = requestAnimationFrame(tick);
    }
  }, [currentStage, status]);

  // Request Animation Frame loop
  useEffect(() => {
    if (status === 'running') {
      requestRef.current = requestAnimationFrame(tick);
    } else {
      lastTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, tick]);

  const duration = SimulationEngine.getStageDuration(currentStage);
  const progress = duration > 0 ? Math.min(elapsedMs / duration, 1) : 1;

  return {
    currentStage,
    status,
    progress,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    nextStage,
    previousStage
  };
}
