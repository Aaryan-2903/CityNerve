'use client';

import React from 'react';
import type { UseSimulationReturn } from '@/hooks/useSimulation';
import { STAGE_CONFIG } from '@/simulation/simulationData';

interface SimulationControlsProps {
  simulation: UseSimulationReturn;
}

export function SimulationControls({ simulation }: SimulationControlsProps) {
  const {
    currentStage,
    status,
    progress,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    nextStage,
    previousStage
  } = simulation;

  const stageData = STAGE_CONFIG[currentStage];

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-[#0C1220]/90 backdrop-blur-md flex flex-col gap-4 w-[320px] shadow-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white/90">Simulation Engine</h3>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 rounded text-white/50 tracking-wider">
          {status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-blue-400">{stageData.name}</p>
        <p className="text-xs text-white/40 leading-snug">{stageData.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-1">
        <button 
          onClick={previousStage} 
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs text-white/60 transition-colors"
        >
          Prev
        </button>

        {status === 'idle' && (
          <button 
            onClick={startSimulation} 
            className="px-3 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded text-xs flex-1 font-medium transition-colors"
          >
            Start
          </button>
        )}

        {status === 'running' && (
          <button 
            onClick={pauseSimulation} 
            className="px-3 py-1.5 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 rounded text-xs flex-1 font-medium transition-colors"
          >
            Pause
          </button>
        )}

        {status === 'paused' && (
          <button 
            onClick={resumeSimulation} 
            className="px-3 py-1.5 bg-green-500/20 text-green-300 hover:bg-green-500/30 rounded text-xs flex-1 font-medium transition-colors"
          >
            Resume
          </button>
        )}

        {(status === 'completed' || status === 'paused' || status === 'running') && (
          <button 
            onClick={resetSimulation} 
            className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded text-xs transition-colors"
          >
            Reset
          </button>
        )}

        <button 
          onClick={nextStage} 
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs text-white/60 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
