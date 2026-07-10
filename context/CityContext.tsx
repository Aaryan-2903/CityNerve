'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCityInternal, type UseCityReturn } from '@/hooks/useCity';

const CityContext = createContext<UseCityReturn | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const cityState = useCityInternal();
  return (
    <CityContext.Provider value={cityState}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity(): UseCityReturn {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
