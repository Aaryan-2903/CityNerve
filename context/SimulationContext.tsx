'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSimulation, type SimulationState } from '@/hooks/useSimulationLegacy';

const SimulationContext = createContext<SimulationState | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const simulation = useSimulation();
  return (
    <SimulationContext.Provider value={simulation}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext(): SimulationState | null {
  return useContext(SimulationContext);
}
