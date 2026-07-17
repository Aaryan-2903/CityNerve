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
      aria-label="Demo Mode active — running on simulation dataset"
      title="Running on simulation dataset. All data is illustrative."
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        background: 'rgba(139, 92, 246, 0.12)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        backdropFilter: 'blur(12px)',
        pointerEvents: 'none',
        userSelect: 'none',
        boxShadow: '0 2px 16px rgba(139,92,246,0.15), 0 1px 4px rgba(0,0,0,0.4)',
      }}
    >
      {/* Purple circle icon */}
      <span style={{ fontSize: '10px', lineHeight: 1, flexShrink: 0 }}>🟣</span>

      {/* Label + subtitle */}
      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(196, 168, 255, 0.95)',
            lineHeight: 1,
          }}
        >
          Demo Mode
        </span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'rgba(167, 139, 250, 0.6)',
            lineHeight: 1,
          }}
        >
          Simulation Dataset
        </span>
      </span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
