'use client';

/**
 * SimulationControl.tsx
 *
 * Floating button overlay that controls the Disaster Simulation.
 *
 * Idle state   → single "▶ Start Flood Simulation" button (centred)
 * Running state → compact bar: stage label + progress bar + Pause + Reset
 * Complete state → "✓ Simulation Complete" with Reset
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { STAGE_LABELS } from '@/data/simulationScenario';

export function SimulationControl() {
  const sim = useSimulationContext();
  const status   = sim?.status   ?? 'idle';
  const phase    = sim?.phase    ?? 0;
  const elapsed  = sim?.elapsed  ?? 0;
  const progress = sim?.progress ?? 0;
  const start    = sim?.start    ?? (() => {});
  const pause    = sim?.pause    ?? (() => {});
  const reset    = sim?.reset    ?? (() => {});

  const isIdle     = status === 'idle';
  const isRunning  = status === 'running';
  const isPaused   = status === 'paused';
  const isComplete = status === 'complete';
  const hasStarted = !isIdle;

  return (
    <AnimatePresence mode="wait">
      {isIdle ? (
        /* ── IDLE: Big glowing start button ── */
        <motion.button
          key="idle-btn"
          onClick={start}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          className={cn(
            'group relative flex items-center gap-3 overflow-hidden',
            'rounded-2xl border border-blue-500/30 bg-[#070C1A]/90',
            'px-6 py-3.5 backdrop-blur-xl shadow-2xl shadow-blue-900/40',
            'hover:border-blue-400/50 hover:shadow-blue-700/40 transition-all duration-300',
          )}
        >
          {/* Animated gradient shimmer */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

          {/* Pulsing icon */}
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
            <span className="absolute inset-0 rounded-xl bg-blue-500/20 animate-ping opacity-50" />
            <Zap className="relative w-4 h-4 text-blue-400" />
          </span>

          <div className="relative text-left">
            <p className="text-[13px] font-bold text-white/90 tracking-wide group-hover:text-white transition-colors">
              Start Flood Simulation
            </p>
            <p className="text-[10px] text-blue-400/70 font-medium tracking-widest uppercase">
              Kurla Station · 60 sec
            </p>
          </div>

          <Play className="relative w-4 h-4 text-blue-400 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      ) : isComplete ? (
        /* ── COMPLETE: Success state ── */
        <motion.div
          key="complete-bar"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-[#070C1A]/90 px-5 py-3 backdrop-blur-xl shadow-2xl shadow-green-900/30"
        >
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-green-400 tracking-wide">Simulation Complete</span>
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Stage 7 — Recovery</span>
          </div>
          {/* Progress bar — full */}
          <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden mx-2">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 text-[11px] font-semibold text-white/60 hover:text-white/90 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </motion.div>
      ) : (
        /* ── RUNNING / PAUSED: Compact control bar ── */
        <motion.div
          key="running-bar"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#070C1A]/90 px-4 py-2.5 backdrop-blur-xl shadow-2xl shadow-black/50 min-w-[360px]"
        >
          {/* Running indicator */}
          <span className="flex items-center gap-1.5 shrink-0">
            {isRunning ? (
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-blue-400" />
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-orange-400" />
            )}
          </span>

          {/* Stage label */}
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="shrink-0"
          >
            <p className="text-[11px] font-bold text-white/80 tracking-wide leading-none">
              Stage {phase + 1}
            </p>
            <p className="text-[10px] text-white/35 leading-none mt-0.5">
              {STAGE_LABELS[phase] ?? '—'}
            </p>
          </motion.div>

          {/* Progress bar + timer */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="relative flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Stage tick marks */}
              {[8, 18, 28, 38, 48, 58].map((t) => (
                <div
                  key={t}
                  className={cn(
                    'absolute top-0 w-px h-full transition-colors duration-500',
                    elapsed >= t ? 'bg-white/30' : 'bg-white/10',
                  )}
                  style={{ left: `${(t / 60) * 100}%` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-white/30 tabular-nums shrink-0">
              {elapsed}s
            </span>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={isRunning ? pause : start}
            className={cn(
              'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all shrink-0',
              isRunning
                ? 'border-orange-500/25 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                : 'border-blue-500/25 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
            )}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRunning ? 'Pause' : 'Resume'}
          </button>

          {/* Reset */}
          <button
            onClick={reset}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1] text-white/40 hover:text-white/70 transition-all shrink-0"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
