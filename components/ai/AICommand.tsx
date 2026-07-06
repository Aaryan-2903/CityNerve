'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, ChevronRight, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useCity } from '@/src/context/CityContext';
import { CITY_SCENARIOS } from '@/data/cityScenarios';
import type { ThreatLevel } from '@/data/simulationScenario';

// ─── Config ──────────────────────────────────────────────────────────────────

const REASONING = [
  'Heavy rainfall',
  'River overflow',
  'Historical floodplain',
  'Citizen reports',
];

const ACTION_SUGGESTIONS = [
  { id: 'a1', text: 'Close Bridge 4' },
  { id: 'a2', text: 'Open Shelter Alpha' },
  { id: 'a3', text: 'Deploy Rescue Team Bravo' },
];

const THREAT_CONFIG: Record<
  ThreatLevel,
  { color: string; bg: string; border: string; label: string }
> = {
  LOW:      { color: '#22C55E', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)',   label: 'LOW'      },
  MODERATE: { color: '#EAB308', bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.3)',   label: 'MODERATE' },
  HIGH:     { color: '#EF4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)',   label: 'HIGH'     },
  CRITICAL: { color: '#EF4444', bg: 'rgba(239,68,68,0.2)',    border: 'rgba(239,68,68,0.4)',   label: 'CRITICAL' },
};

// ─── Prediction text by threat ────────────────────────────────────────────────
// Dynamically generated inside the component now.

// ─── Component ────────────────────────────────────────────────────────────────

export function AICommand() {
  const sim = useSimulationContext();
  const { currentCity } = useCity();

  const threatLevel: ThreatLevel = sim?.threatLevel ?? 'LOW';
  const confidence = sim?.confidence ?? 72;
  const showActionPlan = sim?.showActionPlan ?? false;
  const showPrediction = sim?.showPrediction ?? false;

  const scenario = CITY_SCENARIOS[currentCity.id] || CITY_SCENARIOS['mumbai'];
  const targetArea = scenario.targetArea;

  const PREDICTION_TEXT: Partial<Record<ThreatLevel, string>> = {
    HIGH:     `Flood expected to reach ${targetArea} within 30 minutes.`,
    MODERATE: `Flood waters receding. ${targetArea} risk reducing.`,
    CRITICAL: `Imminent breach — multiple ${targetArea} sectors at risk within 15 minutes.`,
  };

  const threatCfg = THREAT_CONFIG[threatLevel];
  const predictionText = PREDICTION_TEXT[threatLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex h-full flex-col bg-[#090D1A] relative overflow-hidden"
    >
      {/* Subtle purple ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-purple-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-600/6 blur-2xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/20 border border-purple-500/25">
              <Brain className="w-3 h-3 text-purple-400" />
            </div>
            <h2 className="text-sm font-bold text-white/90">AI Command</h2>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.12em] text-purple-400/70 uppercase ml-7">
            {showActionPlan ? 'Action Plan Ready' : showPrediction ? 'Analyzing...' : 'Monitoring'}
          </p>
        </div>

        {/* Threat badge — animates on change */}
        <motion.div
          key={threatLevel}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring' }}
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
          style={{ backgroundColor: threatCfg.bg, borderColor: threatCfg.border }}
        >
          <span
            className="h-1 w-1 rounded-full animate-pulse"
            style={{ backgroundColor: threatCfg.color }}
          />
          <span
            className="text-[10px] font-bold tracking-widest"
            style={{ color: threatCfg.color }}
          >
            {threatCfg.label}
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto p-4 gap-4 scrollbar-thin">

        {/* Prediction Block — visible from phase 3 */}
        <AnimatePresence>
          {showPrediction && predictionText && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
                Prediction
              </h3>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-white/90">
                {predictionText.split(targetArea).map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <span className="text-orange-400 font-semibold">{targetArea}</span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reasoning Block */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
              Reasoning
            </h3>
            <motion.span
              key={confidence}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold text-green-400 tracking-wider"
            >
              {confidence}% CONFIDENCE
            </motion.span>
          </div>
          <ul className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
            {REASONING.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-[11.5px] text-white/70">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/20 mt-1.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Action checklist — visible from phase 5 */}
        <div>
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
            Recommended Actions
          </h3>
          <div className="flex flex-col gap-1.5">
            <AnimatePresence>
              {ACTION_SUGGESTIONS.map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ delay: showActionPlan ? 0.05 + i * 0.08 : 0 }}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[11px] font-medium transition-all duration-500',
                    showActionPlan
                      ? 'border-green-500/20 bg-green-500/10 text-green-400'
                      : 'border-white/[0.06] bg-white/[0.02] text-white/30',
                  )}
                >
                  {showActionPlan ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-white/15 shrink-0" />
                  )}
                  {action.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative border-t border-white/[0.06] p-3 shrink-0 flex flex-col gap-2">
        <Button
          disabled={!showActionPlan}
          className={cn(
            'w-full h-10 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg',
            showActionPlan
              ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-purple-500/20 border-0'
              : 'bg-white/[0.04] text-white/20 border border-white/[0.06] cursor-not-allowed shadow-none',
          )}
        >
          {showActionPlan ? (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Approve Action Plan
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Awaiting Analysis...
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full h-8 rounded-lg text-xs font-semibold border-white/[0.08] bg-transparent text-white/60 hover:text-white/90 hover:bg-white/[0.03]"
        >
          View Explanation
        </Button>
      </div>
    </motion.div>
  );
}
