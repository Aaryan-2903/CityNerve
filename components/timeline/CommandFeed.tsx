'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface FeedEntry {
  id: string;
  time: string;
  text: string;
  dotColor: string;
  category: 'dispatch' | 'shelter' | 'advisory' | 'report';
}

const FEED_ENTRIES: FeedEntry[] = [
  {
    id: 'f1',
    time: '22:31',
    text: 'Emergency Team Bravo dispatched to Bridge 4',
    dotColor: '#22C55E',
    category: 'dispatch',
  },
  {
    id: 'f2',
    time: '22:26',
    text: 'Shelter Alpha activated for Ward 7 overflow',
    dotColor: '#22C55E',
    category: 'shelter',
  },
  {
    id: 'f3',
    time: '22:23',
    text: 'Road closure recommended along East River Road',
    dotColor: '#EAB308',
    category: 'advisory',
  },
  {
    id: 'f4',
    time: '22:20',
    text: 'Citizen report verified near Riverside Underpass',
    dotColor: '#3B82F6',
    category: 'report',
  },
  {
    id: 'f5',
    time: '22:17',
    text: 'Flood barrier deployed at Sector 9 entry point',
    dotColor: '#22C55E',
    category: 'dispatch',
  },
  {
    id: 'f6',
    time: '22:14',
    text: 'Hospital surge alert issued — BYL Nair capacity at 89%',
    dotColor: '#EF4444',
    category: 'advisory',
  },
  {
    id: 'f7',
    time: '22:11',
    text: 'Helicopter Unit 3 repositioned to Landing Zone Delta',
    dotColor: '#A855F7',
    category: 'dispatch',
  },
  {
    id: 'f8',
    time: '22:08',
    text: 'AI model updated forecast: 92% rain probability next 2h',
    dotColor: '#3B82F6',
    category: 'report',
  },
];

const CATEGORY_LABELS: Record<FeedEntry['category'], string> = {
  dispatch: 'DISPATCH',
  shelter: 'SHELTER',
  advisory: 'ADVISORY',
  report: 'REPORT',
};

interface FeedEntryRowProps {
  entry: FeedEntry;
  index: number;
}

function FeedEntryRow({ entry, index }: FeedEntryRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className={cn(
        'flex items-start gap-3 py-2.5 px-4',
        'border-b border-white/[0.04] last:border-b-0',
        'hover:bg-white/[0.02] transition-colors group',
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
          {FEED_ENTRIES.map((entry, i) => (
            <FeedEntryRow key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </ScrollArea>

      {/* Footer: entry count */}
      <div className="border-t border-white/[0.04] px-4 py-2 shrink-0">
        <p className="text-[10px] text-white/20 font-mono">
          {FEED_ENTRIES.length} events · auto-updating
        </p>
      </div>
    </motion.div>
  );
}
