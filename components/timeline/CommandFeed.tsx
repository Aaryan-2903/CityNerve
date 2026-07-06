'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useDashboardData } from '@/hooks/useDashboardData';

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
}

function FeedEntryRow({ entry, index, isNew }: FeedEntryRowProps) {
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
        'hover:bg-white/[0.02] transition-colors group',
        isNew && 'bg-white/[0.025]',
      )}
    >
      {/* Timestamp */}
      <span className="font-mono text-[11px] text-white/25 shrink-0 pt-0.5 tabular-nums">
        {entry.time}
      </span>

      {/* Dot indicator */}
      <span
        className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: entry.dotColor, boxShadow: `0 0 6px ${entry.dotColor}60` }}
      />

      {/* Text */}
      <p className="text-[12px] leading-relaxed text-white/60 group-hover:text-white/80 transition-colors flex-1 min-w-0">
        {entry.text}
      </p>

      {/* Category tag (visible on hover) */}
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
  const feedEntries = sim?.feedEntries ?? [];

  // Sim entries are prepended (most recent first), then dynamic base entries follow
  const allEntries: FeedEntry[] = [
    ...(feedEntries as FeedEntry[]),
    ...baseFeed,
  ];

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
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {allEntries.map((entry, i) => (
              <FeedEntryRow
                key={entry.id}
                entry={entry}
                index={i}
                isNew={feedEntries.some((f: { id: string }) => f.id === entry.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer: entry count */}
      <div className="border-t border-white/[0.04] px-4 py-2 shrink-0">
        <p className="text-[10px] text-white/20 font-mono">
          {allEntries.length} events · auto-updating
        </p>
      </div>
    </motion.div>
  );
}
