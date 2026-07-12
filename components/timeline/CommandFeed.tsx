'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, Activity, Radio, Truck, ArrowDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAIDecisionContext } from '@/context/AIDecisionContext';

interface FeedEntry {
  id: string;
  time: string;
  text: string;
  dotColor: string;
  category: 'dispatch' | 'shelter' | 'advisory' | 'report';
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
}

const CATEGORY_ICONS: Record<FeedEntry['category'], React.ElementType> = {
  dispatch: Truck,
  shelter: ShieldAlert,
  advisory: Activity,
  report: Radio,
};

const SEVERITY_STYLES: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

interface FeedEntryRowProps {
  entry: FeedEntry;
  index: number;
  isNew?: boolean;
  isLatest?: boolean;
  isLast?: boolean;
}

function FeedEntryRow({ entry, index, isNew, isLatest, isLast }: FeedEntryRowProps) {
  const Icon = CATEGORY_ICONS[entry.category] || Activity;
  const severityStyle = entry.severity ? SEVERITY_STYLES[entry.severity] : 'bg-white/5 text-white/50 border-white/10';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: isNew ? 0 : index * 0.05 }}
      className="relative flex items-start gap-4 py-3 px-4 group"
    >
      {/* Timeline connection line */}
      {!isLast && (
        <div className="absolute left-[33px] top-[40px] bottom-[-12px] w-[1px] bg-white/[0.05] flex justify-center">
          <ArrowDown className="w-2.5 h-2.5 text-white/[0.1] absolute top-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Icon node */}
      <div className="relative shrink-0 flex items-center justify-center mt-1 z-base">
        <div 
          className={cn("w-8 h-8 rounded-full flex items-center justify-center border", isLatest ? "border-white/20 bg-white/10" : "border-white/5 bg-[#0A0E1A]")}
          style={isLatest ? { boxShadow: `0 0 15px ${entry.dotColor}30` } : {}}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: entry.dotColor }} />
        </div>
        {isLatest && (
          <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" style={{ borderColor: entry.dotColor }} />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 min-w-0 flex flex-col gap-1.5 p-3 rounded-xl border transition-all duration-300",
        isLatest ? "bg-white/[0.03] border-white/[0.08]" : "bg-transparent border-transparent group-hover:bg-white/[0.01] group-hover:border-white/[0.04]"
      )}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-white/40 tabular-nums">
            {entry.time}
          </span>
          {entry.severity && (
            <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", severityStyle)}>
              {entry.severity}
            </span>
          )}
        </div>
        <p className={cn(
          "text-[12px] leading-relaxed transition-colors",
          isLatest ? "text-white/90" : "text-white/60"
        )}>
          {entry.text}
        </p>
      </div>
    </motion.div>
  );
}

export function CommandFeed() {
  const sim = useSimulationContext();
  const { baseFeed } = useDashboardData();
  const { approvedFeedEntries } = useAIDecisionContext();
  const feedEntries = sim?.feedEntries ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine and sort entries by time/creation order
  const allEntries: FeedEntry[] = [
    ...(approvedFeedEntries as FeedEntry[]),
    ...(feedEntries as unknown as FeedEntry[]),
    ...baseFeed,
  ].map((e: any) => ({
    ...e,
    // Add fake severity for UI demo purposes if none exists
    severity: e.severity || (e.category === 'dispatch' ? 'High' : e.category === 'report' ? 'Critical' : 'Medium')
  }));

  // Auto-scroll to bottom since it's a feed, or top if we reverse
  // The original implementation had new items at the top. Timeline usually goes top-to-bottom.
  // We'll keep new items at the top for dashboard logic.
  
  useEffect(() => {
    const container = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [allEntries.length]);

  const latestSimId = allEntries[0]?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex h-full flex-col border-r border-white/[0.06] bg-[#0A0E1A]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-yellow-400/15">
            <Zap className="w-3 h-3 text-yellow-400" />
          </div>
          <h2 className="text-[11px] font-bold tracking-[0.15em] text-white/70 uppercase">
            Live Operations
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 animate-ping opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          <span className="text-[10px] font-mono text-white/25">TIMELINE</span>
        </div>
      </div>

      {/* Feed list */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="flex flex-col pb-4">
            <AnimatePresence mode="popLayout">
              {allEntries.map((entry, i) => (
                <FeedEntryRow
                  key={entry.id}
                  entry={entry}
                  index={i}
                  isNew={i === 0}
                  isLatest={entry.id === latestSimId}
                  isLast={i === allEntries.length - 1}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-4 py-2 shrink-0 bg-black/20">
        <p className="text-[10px] text-white/30 font-mono flex justify-between">
          <span>{allEntries.length} events logged</span>
          <span>Auto-sync active</span>
        </p>
      </div>
    </motion.div>
  );
}
