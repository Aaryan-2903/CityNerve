'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2 } from 'lucide-react';
import { MapContent } from './MapContent';

interface ExpandedMapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Fullscreen map overlay rendered as a React portal to document.body.
 *
 * Rendering to body is critical: it escapes any ancestor overflow:hidden or
 * CSS transform stacking context (including DashboardLayout's h-screen wrapper),
 * which on iOS Safari can otherwise confine position:fixed children to a
 * sub-viewport containing block instead of the true viewport.
 *
 * City + simulation state come from context — no props needed.
 */
export function ExpandedMapOverlay({ isOpen, onClose }: ExpandedMapOverlayProps) {
  const portalRoot = useRef<HTMLElement | null>(null);

  // Resolve portal target on the client only
  useEffect(() => {
    portalRoot.current = document.body;
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // iOS Safari: also prevent touchmove on body
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Don't attempt to portal during SSR
  if (typeof window === 'undefined') return null;

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="expanded-map"
          // Opacity-only animation — avoids CSS transform stacking context
          // that can confine position:fixed on iOS Safari/WebKit
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            // Use dynamic viewport height so the overlay covers the full screen
            // even when the iOS Safari address bar is visible
            width: '100vw',
            height: '100dvh',
            zIndex: 9999,
            background: '#080D18',
            display: 'flex',
            flexDirection: 'column',
            // Ensure no transform inheritance bleeds in
            transform: 'none',
            willChange: 'opacity',
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Expanded map view"
        >
          {/* ── Close controls — top-right, always on top ────────────────── */}
          <div
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
            className="flex items-center gap-2"
          >
            {/* Label pill */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0B0F1C]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
              <Minimize2 className="w-3 h-3 text-white/40" />
              <span className="text-[11px] font-semibold text-white/60 tracking-wide">
                EXPANDED VIEW
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-[#0B0F1C]/90 text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.2] active:scale-95 transition-all backdrop-blur-md shadow-lg"
              aria-label="Close expanded map"
              title="Close expanded map (Escape)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Full-viewport map ─────────────────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <MapContent showMetricCards />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
