'use client';

import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw 
} from 'lucide-react';
import { useSimulationContext } from '@/context/SimulationContext';
import { cn } from '@/lib/utils';
import { STAGE_LABELS } from '@/data/simulationScenario';

export function SimulationControls() {
  const sim = useSimulationContext();
  if (!sim) return null;

  const { 
    status,
    phase,
    progress, 
    elapsed,
    startSimulation, 
    pauseSimulation,
    resumeSimulation, 
    resetSimulation, 
    nextStage, 
    previousStage 
  } = sim;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col gap-2 p-3 rounded-2xl border border-white/[0.08] bg-[#0C1220]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-auto min-w-[320px]"
    >
      {/* Top row: Status & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            {status === 'idle' ? 'Ready' : status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Completed'}
          </span>
          <span className="text-sm font-bold text-white/90">
            {STAGE_LABELS[phase]}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            Progress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-mono text-white/40">{elapsed}s</span>
            <span className="text-sm font-bold text-blue-400 tabular-nums">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <button
          onClick={previousStage}
          disabled={phase === 0}
          className="p-2 rounded-lg text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
          title="Previous Stage"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {status === 'idle' || status === 'complete' ? (
          <button
            onClick={startSimulation}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span className="text-sm">Start</span>
          </button>
        ) : status === 'running' ? (
          <button
            onClick={pauseSimulation}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span className="text-sm">Pause</span>
          </button>
        ) : (
          <button
            onClick={resumeSimulation}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span className="text-sm">Resume</span>
          </button>
        )}

        <button
          onClick={nextStage}
          disabled={phase === Object.keys(STAGE_LABELS).length - 1}
          className="p-2 rounded-lg text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
          title="Next Stage"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          onClick={resetSimulation}
          className="p-2 rounded-lg text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
