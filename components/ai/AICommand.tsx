'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, ChevronRight, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useCity } from '@/src/context/CityContext';
import { CITY_SCENARIOS } from '@/data/cityScenarios';
import type { ThreatLevel } from '@/data/simulationScenario';
import { useAIDecisionContext } from '@/context/AIDecisionContext';

// ─── Config ──────────────────────────────────────────────────────────────────

// Action suggestions will be generated dynamically

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
  const { currentRecommendation, approve, reject } = useAIDecisionContext();

  const threatLevel: ThreatLevel = sim?.threatLevel ?? 'LOW';
  const confidence = currentRecommendation?.confidence ?? sim?.confidence ?? 72;
  const showActionPlan = sim?.showActionPlan ?? false;
  const showPrediction = sim?.showPrediction ?? false;
  const phase = sim?.phase ?? 0;

  // Flash "analyzing" for 600ms whenever the phase changes
  const [analyzing, setAnalyzing] = useState(false);
  useEffect(() => {
    if (phase === 0) return;
    setAnalyzing(true);
    const t = setTimeout(() => setAnalyzing(false), 600);
    return () => clearTimeout(t);
  }, [phase]);

  const scenario = CITY_SCENARIOS[currentCity.id] || CITY_SCENARIOS['mumbai'];
  const targetArea = scenario.targetArea;

  const PREDICTION_TEXT: Partial<Record<ThreatLevel, string>> = {
    HIGH:     `Flood expected to reach ${targetArea} within 30 minutes.`,
    MODERATE: `Flood waters receding. ${targetArea} risk reducing.`,
    CRITICAL: `Imminent breach — multiple ${targetArea} sectors at risk within 15 minutes.`,
  };

  const threatCfg = THREAT_CONFIG[threatLevel];
  const predictionText = PREDICTION_TEXT[threatLevel];

  const [detailsExpanded, setDetailsExpanded] = useState(false);

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
            {analyzing ? (
              <motion.span
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, times: [0, 0.4, 1] }}
                className="text-purple-300"
              >
                ⚡ Analyzing...
              </motion.span>
            ) : showActionPlan ? 'Action Plan Ready' : showPrediction ? 'Analyzing...' : 'Monitoring'}
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

      {/* Content — keyed on phase so it re-animates on each stage transition */}
      <div key={phase} className="relative flex flex-col flex-1 min-h-0 overflow-y-auto p-4 gap-4 scrollbar-thin">

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
              AI Assessment
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
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-white/90">
            <div className="font-semibold text-purple-300 mb-1">{currentRecommendation?.title}</div>
            <div className="text-[12px] text-white/70 mb-2">{currentRecommendation?.recommendation}</div>
            
            <AnimatePresence>
              {detailsExpanded && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 mt-2 border-t border-white/10 pt-2"
                >
                  {currentRecommendation?.reasoning.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-white/50">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      {point}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative border-t border-white/[0.06] p-3 shrink-0 flex flex-col gap-2">
        {currentRecommendation?.status === 'Pending' ? (
          <div className="flex gap-2">
            <Button
              onClick={approve}
              className="flex-1 h-9 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-purple-500/20 border-0"
            >
              Approve
            </Button>
            <Button
              onClick={reject}
              variant="outline"
              className="h-9 px-4 rounded-lg text-xs font-semibold border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white/90 hover:bg-white/[0.05]"
            >
              Reject
            </Button>
          </div>
        ) : (
          <Button
            disabled
            className="w-full h-9 rounded-lg text-xs font-bold bg-white/[0.04] text-white/40 border border-white/[0.06] cursor-not-allowed shadow-none"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400/50" />
              {currentRecommendation?.status === 'Approved' ? 'Executed' : 'Rejected'}
            </span>
          </Button>
        )}

        <Button
          onClick={() => setDetailsExpanded((prev) => !prev)}
          variant="outline"
          className="w-full h-8 rounded-lg text-[11px] font-semibold border-transparent bg-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
        >
          {detailsExpanded ? 'Hide Details' : 'View Details'}
        </Button>
      </div>
    </motion.div>
  );
}
