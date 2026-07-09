'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSimulation, type SimulationState } from '@/hooks/useSimulationLegacy';
import { useSimulationEngine } from '@/hooks/useSimulationEngine';

const SimulationContext = createContext<SimulationState | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const legacySimulation = useSimulation();
  const engineSimulation = useSimulationEngine();

  // Fallback to legacy if backend is not available
  const activeSimulation = engineSimulation.isBackendAvailable 
    ? engineSimulation 
    : legacySimulation;

  return (
    <SimulationContext.Provider value={activeSimulation}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext(): SimulationState | null {
  return useContext(SimulationContext);
}
