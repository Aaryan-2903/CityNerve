'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertTriangle, Eye, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/shared/GlassCard';
import type { AIBriefing, ActionPriority } from '@/types/ai';
import { formatRelativeTime } from '@/utils/format';

const PRIORITY_CONFIG: Record<
  ActionPriority,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  immediate: {
    label: 'IMMEDIATE',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
    icon: Zap,
  },
  urgent: {
    label: 'URGENT',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.25)',
    icon: AlertTriangle,
  },
  monitor: {
    label: 'MONITOR',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
    icon: Eye,
  },
};

const THREAT_CONFIG = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'CRITICAL THREAT' },
  elevated: { color: '#F97316', bg: 'rgba(249,115,22,0.15)', label: 'ELEVATED THREAT' },
  guarded: { color: '#EAB308', bg: 'rgba(234,179,8,0.15)', label: 'GUARDED THREAT' },
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'LOW THREAT' },
};

function TypingText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

interface AIBriefingPanelProps {
  briefing: AIBriefing;
}

export function AIBriefingPanel({ briefing }: AIBriefingPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const threatConfig = THREAT_CONFIG[briefing.overallThreatLevel];
  const immediateRecs = briefing.recommendations.filter((r) => r.priority === 'immediate');
  const otherRecs = briefing.recommendations.filter((r) => r.priority !== 'immediate');
  const displayedRecs = expanded ? briefing.recommendations : immediateRecs;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <GlassCard
      className="flex flex-col overflow-hidden"
      glowColor="#7C3AED"
    >
      {/* AI Header */}
      <div className="relative border-b border-white/[0.06] px-4 py-3 shrink-0 overflow-hidden">
        {/* Purple gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-semibold text-white/90">AI Situational Brief</h2>
                <span className="rounded px-1 py-0.5 text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/25">
                  {briefing.modelVersion}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-lg px-2 py-1"
            style={{ backgroundColor: threatConfig.bg, border: `1px solid ${threatConfig.color}30` }}
          >
            <span
              className="relative flex h-1.5 w-1.5"
            >
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
                style={{ backgroundColor: threatConfig.color }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: threatConfig.color }}
              />
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest" style={{ color: threatConfig.color }}>
              {threatConfig.label}
            </span>
          </div>
        </div>
        <p className="relative text-[10px] text-purple-300/40 mt-0.5 font-mono">
          Generated {mounted ? formatRelativeTime(briefing.generatedAt) : '--'} · AI confidence: 91%
        </p>
      </div>

      {/* Situational Summary */}
      <div className="border-b border-white/[0.06] px-4 py-3 shrink-0">
        <p className="text-[11px] leading-relaxed text-white/50">
          <TypingText text={briefing.situationalSummary} speed={8} />
        </p>
      </div>

      {/* Key Risks */}
      <div className="border-b border-white/[0.06] px-4 py-3 shrink-0">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2">
          Key Risk Factors
        </p>
        <ul className="space-y-1.5">
          {briefing.keyRisks.slice(0, 3).map((risk, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500/60 mt-1.5" />
              <span className="text-[11px] text-white/40 leading-snug">{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-3 pb-1 flex items-center justify-between shrink-0">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
            Recommendations
          </p>
          <span className="text-[10px] font-mono text-white/20">
            {briefing.recommendations.length} actions
          </span>
        </div>

        <div className="px-3 pb-3 space-y-1.5">
          <AnimatePresence mode="popLayout">
            {displayedRecs.map((rec, i) => {
              const pConfig = PRIORITY_CONFIG[rec.priority];
              const PIcon = pConfig.icon;
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="rounded-xl p-3"
                  style={{ backgroundColor: pConfig.bg, border: `1px solid ${pConfig.border}` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <PIcon className="w-3 h-3 shrink-0" style={{ color: pConfig.color }} />
                      <span
                        className="text-[9px] font-mono font-bold tracking-widest"
                        style={{ color: pConfig.color }}
                      >
                        {pConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-white/20" />
                      <span className="text-[9px] font-mono text-white/30">
                        {Math.round(rec.confidence * 100)}% conf.
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-white/80 leading-snug mb-1">
                    {rec.action}
                  </p>
                  <p className="text-[10px] text-white/35 leading-snug">{rec.rationale}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {otherRecs.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                {otherRecs.length} more recommendations
              </>
            )}
          </button>
        )}
      </div>
    </GlassCard>
  );
}
