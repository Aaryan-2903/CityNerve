'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardInteraction } from '@/context/DashboardInteractionContext';
import { useAIDecisionContext } from '@/context/AIDecisionContext';

interface FeedEntry {
  id: string;
  time: string;
  text: string;
  dotColor: string;
  category: 'dispatch' | 'shelter' | 'advisory' | 'report';
}

const CATEGORY_LABELS: Record<FeedEntry['category'], string> = {
  dispatch: 'DISPATCH',
  shelter:  'SHELTER',
  advisory: 'ADVISORY',
  report:   'REPORT',
};

interface FeedEntryRowProps {
  entry: FeedEntry;
  index: number;
  isNew?: boolean;
  isLatest?: boolean;
}

function FeedEntryRow({ entry, index, isNew, isLatest }: FeedEntryRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.3, delay: isNew ? 0 : 0.05 * index }}
      className={cn(
        'flex items-start gap-3 py-2.5 px-4',
        'border-b border-white/[0.04] last:border-b-0',
        'hover:bg-white/[0.02] transition-colors group cursor-default',
        isNew && 'bg-white/[0.025]',
        // Latest entry gets a subtle left-border glow
        isLatest && 'bg-gradient-to-r from-white/[0.03] to-transparent',
      )}
    >
      {/* Newest-entry left accent bar */}
      {isLatest && (
        <span
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full opacity-80"
          style={{ backgroundColor: entry.dotColor }}
        />
      )}

      {/* Timestamp */}
      <span className="font-mono text-[11px] text-white/25 shrink-0 pt-0.5 tabular-nums">
        {entry.time}
      </span>

      {/* Dot indicator */}
      <span
        className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', isLatest && 'animate-pulse')}
        style={{ backgroundColor: entry.dotColor, boxShadow: `0 0 6px ${entry.dotColor}60` }}
      />

      {/* Text */}
      <p
        className={cn(
          'text-[12px] leading-relaxed flex-1 min-w-0 transition-colors',
          isLatest ? 'text-white/85' : 'text-white/55 group-hover:text-white/75',
        )}
      >
        {entry.text}
      </p>

      {/* Category tag */}
      <span
        className="shrink-0 text-[9px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pt-0.5"
        style={{ color: entry.dotColor }}
      >
        {CATEGORY_LABELS[entry.category]}
      </span>
    </motion.div>
  );
}

export function CommandFeed() {
  const sim = useSimulationContext();
  const { baseFeed } = useDashboardData();
  const { selectedIncidentId } = useDashboardInteraction();
  const { approvedFeedEntries } = useAIDecisionContext();
  const feedEntries = sim?.feedEntries ?? [];
  const phase = sim?.phase ?? -1;

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top when a new sim entry arrives (new phase)
  useEffect(() => {
    if (feedEntries.length === 0) return;
    const container = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase]);

  const allEntries: FeedEntry[] = [
    ...(approvedFeedEntries as FeedEntry[]),
    ...(feedEntries as FeedEntry[]),
    ...baseFeed,
  ];

  const latestSimId = (approvedFeedEntries.length > 0)
    ? (approvedFeedEntries[0] as FeedEntry).id
    : (feedEntries.length > 0 ? (feedEntries[0] as FeedEntry).id : null);

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
            Command Feed
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 animate-ping opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          <span className="text-[10px] font-mono text-white/25">LIVE</span>
        </div>
      </div>

      {/* Feed list */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col relative">
            <AnimatePresence mode="popLayout">
              {allEntries.map((entry, i) => (
                <FeedEntryRow
                  key={entry.id}
                  entry={entry}
                  index={i}
                  isNew={feedEntries.some((f: { id: string }) => f.id === entry.id)}
                  isLatest={entry.id === latestSimId}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-4 py-2 shrink-0">
        <p className="text-[10px] text-white/20 font-mono">
          {allEntries.length} events · auto-updating
        </p>
      </div>
    </motion.div>
  );
}
