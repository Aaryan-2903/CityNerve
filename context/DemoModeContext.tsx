'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { API_BASE_URL, IS_API_UNCONFIGURED } from '@/lib/api-config';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DemoModeState {
  /** True when the backend is unreachable or unconfigured. */
  isDemoMode: boolean;
  /** True while the initial health-check is in progress. */
  isCheckingBackend: boolean;
}

const DemoModeContext = createContext<DemoModeState>({
  isDemoMode: false,
  isCheckingBackend: true,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(IS_API_UNCONFIGURED);
  const [isCheckingBackend, setIsCheckingBackend] = useState(!IS_API_UNCONFIGURED);

  useEffect(() => {
    // If we already know there's no URL, skip the health check.
    if (IS_API_UNCONFIGURED) {
      setIsDemoMode(true);
      setIsCheckingBackend(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

    async function healthCheck() {
      try {
        // Try a lightweight endpoint first; fall back to the base URL.
        const res = await fetch(`${API_BASE_URL}/api/v1/cities`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!cancelled) setIsDemoMode(false);
      } catch {
        if (!cancelled) {
          setIsDemoMode(true);
          console.info(
            '[CityNerve] Backend unreachable — Demo Mode active. ' +
            'All data is simulated. Set NEXT_PUBLIC_API_BASE_URL to use a live backend.'
          );
        }
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setIsCheckingBackend(false);
      }
    }

    void healthCheck();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, isCheckingBackend }}>
      {children}
      {isDemoMode && !isCheckingBackend && <DemoModeBadge />}
    </DemoModeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDemoMode(): DemoModeState {
  return useContext(DemoModeContext);
}

// ---------------------------------------------------------------------------
// Subtle Demo Badge — only visible when demo mode is active
// ---------------------------------------------------------------------------

function DemoModeBadge() {
  return (
    <div
      aria-label="Demo Mode active"
      title="The backend API is unavailable. Displaying simulated data."
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '9999px',
        background: 'rgba(168, 85, 247, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        backdropFilter: 'blur(8px)',
        color: 'rgba(216, 180, 254, 0.9)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        userSelect: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#A855F7',
          animation: 'pulse 2s infinite',
          flexShrink: 0,
        }}
      />
      Demo Mode
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
