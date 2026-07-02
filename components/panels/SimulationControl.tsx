'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { cn } from '@/lib/utils';

export function SimulationControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setHasStarted(false);
  };

  return (
    <GlassCard className="w-[280px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white/90 tracking-wide">Simulation</h2>
        </div>
        {isPlaying && (
          <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase">Running</span>
          </span>
        )}
      </div>

      {/* Details */}
      <div className="px-4 py-3 space-y-2 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/40 uppercase tracking-wider">Scenario</span>
          <span className="text-[12px] font-semibold text-white/80">Urban Flood</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/40 uppercase tracking-wider">Duration</span>
          <span className="text-[12px] font-semibold text-white/80">30 Minutes</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-3 py-2.5 gap-2 bg-white/[0.01]">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 border border-blue-500/20 transition-all text-xs font-semibold"
          >
            <Play className="w-3.5 h-3.5" />
            {hasStarted ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 py-2 border border-orange-500/20 transition-all text-xs font-semibold"
          >
            <Pause className="w-3.5 h-3.5" />
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          disabled={!hasStarted}
          className={cn(
            "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border transition-all",
            hasStarted 
              ? "border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-white/60" 
              : "border-transparent bg-transparent text-white/20 cursor-not-allowed"
          )}
          title="Reset Simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </GlassCard>
  );
}
