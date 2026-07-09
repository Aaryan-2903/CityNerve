'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface DashboardInteractionState {
  /** ID of the incident selected from the IncidentCards panel */
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
}

const DashboardInteractionContext = createContext<DashboardInteractionState>({
  selectedIncidentId: null,
  setSelectedIncidentId: () => {},
});

export function DashboardInteractionProvider({ children }: { children: ReactNode }) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  return (
    <DashboardInteractionContext.Provider value={{ selectedIncidentId, setSelectedIncidentId }}>
      {children}
    </DashboardInteractionContext.Provider>
  );
}

export function useDashboardInteraction() {
  return useContext(DashboardInteractionContext);
}
