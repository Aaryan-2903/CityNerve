'use client';

/**
 * SimulationContext.tsx
 *
 * React context that makes simulation state available to all
 * dashboard panel components without prop-drilling through the layout.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useSimulation, type SimulationState } from '@/hooks/useSimulation';

const SimulationContext = createContext<SimulationState | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const simulation = useSimulation();
  return (
    <SimulationContext.Provider value={simulation}>
      {children}
    </SimulationContext.Provider>
  );
}

/** Hook for consuming simulation state inside any panel component.
 * Returns null when used outside <SimulationProvider> — components should handle this gracefully.
 */
export function useSimulationContext(): SimulationState | null {
  return useContext(SimulationContext);
}
