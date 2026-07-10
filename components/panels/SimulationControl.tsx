'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useCity } from '@/src/context/CityContext';
import { STAGE_LABELS } from '@/data/simulationScenario';

interface SimulationControlProps {
  /**
   * compact=true → slim single-line bar for the docked strip above the command panels.
   * compact=false (default) → full-height floating variant used on mobile.
   */
  compact?: boolean;
}

export function SimulationControl({ compact = false }: SimulationControlProps) {
  const sim = useSimulationContext();
  const { currentCity } = useCity();
  const status      = sim?.status      ?? 'idle';
  const phase       = sim?.phase       ?? 0;
  const elapsed     = sim?.elapsed     ?? 0;
  const progress    = sim?.progress    ?? 0;
  const start       = sim?.start       ?? (() => {});
  const pause       = sim?.pause       ?? (() => {});
  const reset       = sim?.reset       ?? (() => {});
  const nextStage   = sim?.nextStage   ?? (() => {});
  const prevStage   = sim?.previousStage ?? (() => {});

  const isIdle     = status === 'idle';
  const isRunning  = status === 'running';
  const isComplete = status === 'complete';

  /* ─── COMPACT mode (docked strip) ─────────────────────────────────────── */
  if (compact) {
    return (
      <div className="flex w-full items-center gap-2 h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {isIdle ? (
            /* IDLE — compact start button */
            <motion.button
              key="c-idle"
              onClick={start}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'group flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10',
                'px-3 py-1 text-[11px] font-bold text-blue-400',
                'hover:bg-blue-500/20 hover:border-blue-400/50 transition-all',
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-blue-400" />
              </span>
              <Zap className="w-3 h-3" />
              Start Simulation
              <span className="text-blue-400/50 font-normal">· {currentCity.name} Flash Flood</span>
            </motion.button>
          ) : isComplete ? (
            /* COMPLETE */
            <motion.div
              key="c-complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span className="text-[11px] font-bold text-green-400">Simulation Complete</span>
              <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1 rounded-md border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold text-white/50 hover:text-white/80 transition-all"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset
              </button>
            </motion.div>
          ) : (
            /* RUNNING / PAUSED */
            <motion.div
              key="c-running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full items-center gap-2 overflow-hidden"
            >
              {/* Live dot */}
              <span className="shrink-0 flex items-center">
                {isRunning ? (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-blue-400" />
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                )}
              </span>

              {/* Stage label */}
              <motion.span
                key={phase}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] font-bold text-white/75 shrink-0 whitespace-nowrap"
              >
                S{phase + 1} · {STAGE_LABELS[phase] ?? '—'}
              </motion.span>

              {/* Timeline Scrubber */}
              <div className="relative flex-1 flex items-center min-w-[60px] h-4 group">
                <div className="absolute left-0 right-0 h-1 rounded-full bg-white/[0.06] overflow-hidden pointer-events-none top-1/2 -translate-y-1/2">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    animate={{ width: `${(phase / 8) * 100}%` }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                  {Object.keys(STAGE_LABELS).map((_, i) => (
                    i > 0 && i < 8 && (
                      <div
                        key={i}
                        className="absolute top-0 w-px h-full bg-[#070B14]"
                        style={{ left: `${(i / 8) * 100}%` }}
                      />
                    )
                  ))}
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={phase}
                  onChange={(e) => sim?.setStage?.(parseInt(e.target.value, 10))}
                  disabled={!sim?.setStage}
                  className="w-full absolute inset-0 opacity-0 cursor-pointer"
                  style={{ WebkitAppearance: 'none' }}
                  title="Scrub timeline"
                />
                
                <motion.div 
                  className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] pointer-events-none top-1/2 -translate-y-1/2 -ml-[5px]"
                  animate={{ left: `${(phase / 8) * 100}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>

              <span className="text-[10px] font-mono text-white/25 tabular-nums shrink-0">{elapsed}s</span>

              {/* Prev / Pause-Resume / Next */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={prevStage}
                  className="flex h-5 w-5 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03] text-white/35 hover:text-white/70 hover:bg-white/[0.08] transition-all"
                  title="Previous stage"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>

                <button
                  onClick={isRunning ? pause : start}
                  className={cn(
                    'flex h-5 items-center gap-1 rounded border px-2 text-[10px] font-bold transition-all',
                    isRunning
                      ? 'border-orange-500/25 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                      : 'border-blue-500/25 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
                  )}
                >
                  {isRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                </button>

                <button
                  onClick={nextStage}
                  className="flex h-5 w-5 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03] text-white/35 hover:text-white/70 hover:bg-white/[0.08] transition-all"
                  title="Next stage"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>

                <button
                  onClick={reset}
                  className="flex h-5 w-5 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03] text-white/25 hover:text-white/60 hover:bg-white/[0.08] transition-all"
                  title="Reset"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ─── FULL mode (mobile stacked layout) ────────────────────────────────── */
  return (
    <AnimatePresence mode="wait">
      {isIdle ? (
        <motion.button
          key="idle-btn"
          onClick={start}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          className={cn(
            'group relative flex w-full items-center gap-3 overflow-hidden',
            'rounded-2xl border border-blue-500/30 bg-[#070C1A]/90',
            'px-5 py-3.5 backdrop-blur-xl shadow-2xl shadow-blue-900/40',
            'hover:border-blue-400/50 hover:shadow-blue-700/40 transition-all duration-300',
          )}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
            <span className="absolute inset-0 rounded-xl bg-blue-500/20 animate-ping opacity-50" />
            <Zap className="relative w-4 h-4 text-blue-400" />
          </span>
          <div className="relative text-left flex-1">
            <p className="text-[13px] font-bold text-white/90 tracking-wide group-hover:text-white transition-colors">
              Start Flood Simulation
            </p>
            <p className="text-[10px] text-blue-400/70 font-medium tracking-widest uppercase">
              {currentCity.name} Flash Flood · 60 sec
            </p>
          </div>
          <Play className="relative w-4 h-4 text-blue-400 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      ) : isComplete ? (
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
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden mx-2">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 text-[11px] font-semibold text-white/60 hover:text-white/90 transition-all"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="running-bar"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#070C1A]/90 px-4 py-2.5 backdrop-blur-xl shadow-2xl shadow-black/50 w-full"
        >
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

          <motion.div key={phase} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="shrink-0">
            <p className="text-[11px] font-bold text-white/80 tracking-wide leading-none">Stage {phase + 1}</p>
            <p className="text-[10px] text-white/35 leading-none mt-0.5">{STAGE_LABELS[phase] ?? '—'}</p>
          </motion.div>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            {/* Timeline Scrubber */}
            <div className="relative flex-1 flex items-center min-w-0 h-6 group">
              <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/[0.06] overflow-hidden pointer-events-none top-1/2 -translate-y-1/2">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  animate={{ width: `${(phase / 8) * 100}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
                {Object.keys(STAGE_LABELS).map((_, i) => (
                  i > 0 && i < 8 && (
                    <div
                      key={i}
                      className="absolute top-0 w-px h-full bg-[#070C1A]"
                      style={{ left: `${(i / 8) * 100}%` }}
                    />
                  )
                ))}
              </div>
              
              <input
                type="range"
                min="0"
                max="8"
                value={phase}
                onChange={(e) => sim?.setStage?.(parseInt(e.target.value, 10))}
                disabled={!sim?.setStage}
                className="w-full absolute inset-0 opacity-0 cursor-pointer"
                style={{ WebkitAppearance: 'none' }}
                title="Scrub timeline"
              />
              
              <motion.div 
                className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] pointer-events-none top-1/2 -translate-y-1/2 -ml-[7px]"
                animate={{ left: `${(phase / 8) * 100}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] font-mono text-white/30 tabular-nums shrink-0">{elapsed}s</span>
          </div>

          {/* Prev / Pause / Next */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={prevStage} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1] text-white/40 hover:text-white/70 transition-all" title="Previous stage">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={isRunning ? pause : start}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all',
                isRunning
                  ? 'border-orange-500/25 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                  : 'border-blue-500/25 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
              )}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button onClick={nextStage} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1] text-white/40 hover:text-white/70 transition-all" title="Next stage">
              <ChevronRight className="w-3 h-3" />
            </button>
            <button onClick={reset} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1] text-white/40 hover:text-white/70 transition-all" title="Reset">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
