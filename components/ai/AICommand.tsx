'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIMetric {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  color: string;
}

const AI_METRICS: AIMetric[] = [
  { id: 'health', label: 'Health', value: 74, displayValue: '74', color: '#3B82F6' },
  { id: 'conf', label: 'Conf.', value: 94, displayValue: '94%', color: '#22C55E' },
  { id: 'ready', label: 'Ready', value: 91, displayValue: '91%', color: '#A855F7' },
];

interface ActionSuggestion {
  id: string;
  text: string;
}

const ACTION_SUGGESTIONS: ActionSuggestion[] = [
  { id: 'a1', text: 'Close Bridge 4 immediately' },
  { id: 'a2', text: 'Open Shelter Alpha for Ward 7' },
  { id: 'a3', text: 'Deploy Team Bravo to Riverside' },
];

export function AICommand() {
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApproved(true);
    }, 1200);
  };

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
            Action Plan Ready
          </p>
        </div>

        {/* HIGH threat badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-1">
          <span className="h-1 w-1 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] font-bold text-red-400 tracking-widest">HIGH</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto p-4 gap-4">
        {/* AI Recommendation text */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <p className="text-[12px] leading-relaxed text-white/65">
            Flood likely to spread to{' '}
            <span className="text-orange-400 font-semibold">Ward 7</span> within{' '}
            <span className="text-white/85 font-semibold">30 minutes</span>. Close Bridge 4,
            open Shelter Alpha, deploy Bravo to Riverside Underpass sector.
          </p>
        </div>

        {/* Action checklist */}
        <div className="flex flex-col gap-2">
          {ACTION_SUGGESTIONS.map((action, i) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[11px] transition-all',
                approved
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : 'border-white/[0.06] bg-white/[0.02] text-white/50',
              )}
            >
              {approved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-white/25 shrink-0" />
              )}
              {action.text}
            </motion.div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          {AI_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 px-2"
            >
              <span
                className="text-lg font-bold tabular-nums leading-none"
                style={{ color: metric.color }}
              >
                {metric.displayValue}
              </span>
              {/* Custom thin progress bar */}
              <div className="h-0.5 w-10 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                />
              </div>
              <span className="text-[10px] text-white/30">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Action Button */}
      <div className="relative border-t border-white/[0.06] p-3 shrink-0 flex items-center gap-2">
        <Button
          onClick={handleApprove}
          disabled={approved || loading}
          className={cn(
            'flex-1 h-9 rounded-xl text-sm font-semibold transition-all duration-300',
            approved
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20 border-0',
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              Authorizing...
            </span>
          ) : approved ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Plan Approved
            </span>
          ) : (
            'Approve Action Plan'
          )}
        </Button>

        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white/60 hover:border-white/[0.15] transition-all"
          aria-label="Help"
          title="AI Command Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
