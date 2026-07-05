'use client';

import { useState, useCallback, useMemo } from 'react';
import { SimulationEngine } from '@/src/simulation/simulationEngine';
import { getScenarioSequence } from '@/src/simulation/simulationUtils';
import { FloodStage } from '@/src/simulation/simulationStages';
import type { 
  SimulationStatus, 
  ScenarioType, 
  StagePayload 
} from '@/src/simulation/simulationTypes';

export interface UseSimulationReturn {
  scenario: ScenarioType;
  status: SimulationStatus;
  currentStage: string;
  currentStageIndex: number;
  currentStageData: StagePayload;
  progress: number;
  elapsedTime: number;
  remainingTime: number;
  
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  nextStage: () => void;
  previousStage: () => void;
  jumpToStage: (stage: string) => void;
  setScenario: (scenario: ScenarioType) => void;
}

export function useSimulation(): UseSimulationReturn {
  const [scenario, setScenarioState] = useState<ScenarioType>('FLOOD');
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [currentStage, setCurrentStage] = useState<string>(FloodStage.NORMAL);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const sequence = useMemo(() => getScenarioSequence(scenario), [scenario]);
  const currentStageIndex = sequence.indexOf(currentStage);
  const currentStageData = useMemo(() => SimulationEngine.getPayload(scenario, currentStage), [scenario, currentStage]);
  
  const totalDuration = currentStageData.durationMs;
  const remainingTime = Math.max(0, totalDuration - elapsedTime);
  const progress = totalDuration > 0 ? Math.min(elapsedTime / totalDuration, 1) : 1;

  const setScenario = useCallback((newScenario: ScenarioType) => {
    setScenarioState(newScenario);
    const newSequence = getScenarioSequence(newScenario);
    setCurrentStage(newSequence[0]);
    setStatus('idle');
    setElapsedTime(0);
  }, []);

  const startSimulation = useCallback(() => {
    if (status === 'idle') {
      setCurrentStage(sequence[0]);
      setElapsedTime(0);
    }
    setStatus('running');
  }, [status, sequence]);

  const pauseSimulation = useCallback(() => {
    if (status === 'running') setStatus('paused');
  }, [status]);

  const resumeSimulation = useCallback(() => {
    if (status === 'paused') setStatus('running');
  }, [status]);

  const resetSimulation = useCallback(() => {
    setStatus('idle');
    setCurrentStage(sequence[0]);
    setElapsedTime(0);
  }, [sequence]);

  const nextStage = useCallback(() => {
    setCurrentStage((prev) => SimulationEngine.getNextStage(scenario, prev));
    setElapsedTime(0);
  }, [scenario]);

  const previousStage = useCallback(() => {
    setCurrentStage((prev) => SimulationEngine.getPreviousStage(scenario, prev));
    setElapsedTime(0);
  }, [scenario]);

  const jumpToStage = useCallback((stage: string) => {
    if (sequence.includes(stage)) {
      setCurrentStage(stage);
      setElapsedTime(0);
    }
  }, [sequence]);

  return {
    scenario,
    status,
    currentStage,
    currentStageIndex,
    currentStageData,
    progress,
    elapsedTime,
    remainingTime,
    
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    nextStage,
    previousStage,
    jumpToStage,
    setScenario
  };
}
