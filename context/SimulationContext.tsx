'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSimulationEngine } from '@/hooks/useSimulationEngine';
import type { SimulationState } from '@/hooks/useSimulationEngine';

const SimulationContext = createContext<SimulationState | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const activeSimulation = useSimulationEngine();

  return (
    <SimulationContext.Provider value={activeSimulation}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext(): SimulationState | null {
  return useContext(SimulationContext);
}
