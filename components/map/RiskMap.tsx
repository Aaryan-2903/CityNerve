'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { MetricCards } from '@/components/cards/MetricCards';
import { cn } from '@/lib/utils';

const FILTER_TAGS = [
  'Districts',
  'Roads',
  'Shelters',
  'Rescue',
  'AI 30 min forecast',
];

/* ─── Placeholder Map Markers ────────────────────────────────────── */
interface MapMarker {
  id: string;
  x: string;
  y: string;
  color: string;
  glowColor: string;
  size: number;
  pulse: boolean;
  icon?: string;
  label?: string;
}

const MARKERS: MapMarker[] = [
  { id: 'm1', x: '28%', y: '38%', color: '#22C55E', glowColor: '#22C55E40', size: 14, pulse: true, icon: '▲' },
  { id: 'm2', x: '48%', y: '47%', color: '#EAB308', glowColor: '#EAB30840', size: 16, pulse: true },
  { id: 'm3', x: '55%', y: '56%', color: '#EF4444', glowColor: '#EF444440', size: 13, pulse: true, label: 'Citizen Incident · flooding' },
  { id: 'm4', x: '67%', y: '44%', color: '#A855F7', glowColor: '#A855F740', size: 16, pulse: false, icon: '⚑' },
  { id: 'm5', x: '82%', y: '40%', color: '#3B82F6', glowColor: '#3B82F640', size: 14, pulse: false, icon: '⊕' },
];

/* ─── Abstract placeholder map SVG ──────────────────────────────── */
function MapBackground() {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        {/* Subtle dot grid */}
        <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.8" fill="rgba(255,255,255,0.04)" />
        </pattern>
        {/* Blue gradient overlay */}
        <radialGradient id="map-glow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(37,99,235,0.06)" />
          <stop offset="100%" stopColor="rgba(5,10,20,0)" />
        </radialGradient>
        {/* Marker glow filters */}
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Base fill */}
      <rect width="1200" height="520" fill="#080D18" />
      {/* Dot grid overlay */}
      <rect width="1200" height="520" fill="url(#dot-grid)" />
      {/* Center glow */}
      <rect width="1200" height="520" fill="url(#map-glow)" />

      {/* ── Water/River curves ── */}
      <path
        d="M-10,195 C150,170 320,230 520,185 C720,140 900,210 1210,165"
        stroke="rgba(147,197,253,0.14)" strokeWidth="2" fill="none"
      />
      <path
        d="M-10,260 C200,245 440,285 680,255 C870,235 1050,270 1210,250"
        stroke="rgba(147,197,253,0.09)" strokeWidth="1.5" fill="none"
      />

      {/* ── Road lines ── */}
      <line x1="280" y1="0" x2="310" y2="520" stroke="rgba(200,220,255,0.06)" strokeWidth="1.2" />
      <line x1="630" y1="0" x2="600" y2="520" stroke="rgba(200,220,255,0.05)" strokeWidth="1" />
      <line x1="920" y1="0" x2="950" y2="520" stroke="rgba(200,220,255,0.04)" strokeWidth="1" />
      <line x1="0" y1="310" x2="1200" y2="295" stroke="rgba(200,220,255,0.05)" strokeWidth="1" />

      {/* ── Terrain polygons ── */}
      <polygon
        points="60,400 170,220 280,400"
        fill="rgba(15,22,45,0.9)" stroke="rgba(40,60,110,0.25)" strokeWidth="1"
      />
      <polygon
        points="850,80 970,310 1090,80"
        fill="rgba(15,22,45,0.7)" stroke="rgba(40,60,110,0.2)" strokeWidth="1"
      />
      <polygon
        points="450,380 530,260 620,380"
        fill="rgba(15,22,45,0.6)" stroke="rgba(40,60,110,0.15)" strokeWidth="1"
      />

      {/* ── Evacuation route (dashed green line) ── */}
      <path
        d="M340,185 Q450,165 570,215 Q680,255 810,210"
        stroke="#22C55E" strokeWidth="2" fill="none"
        strokeDasharray="8,5" opacity="0.45"
      />

      {/* ── District zone overlay (very subtle) ── */}
      <rect x="350" y="120" width="320" height="220" rx="4"
        fill="rgba(59,130,246,0.03)" stroke="rgba(59,130,246,0.08)" strokeWidth="1" strokeDasharray="4,4"
      />
    </svg>
  );
}

function MapMarkerDot({ marker }: { marker: MapMarker }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 + Math.random() * 0.3, type: 'spring', stiffness: 200 }}
      className="absolute"
      style={{ left: marker.x, top: marker.y, transform: 'translate(-50%, -50%)' }}
    >
      {/* Pulse ring */}
      {marker.pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ backgroundColor: marker.color, borderRadius: '50%', margin: -4 }}
        />
      )}

      {/* Marker circle */}
      <div
        className="relative flex items-center justify-center rounded-full text-white font-bold select-none cursor-pointer"
        style={{
          width: marker.size + 8,
          height: marker.size + 8,
          backgroundColor: marker.color,
          boxShadow: `0 0 16px ${marker.glowColor}, 0 0 4px ${marker.color}80`,
          fontSize: marker.size * 0.55,
        }}
      >
        {marker.icon ?? ''}
      </div>

      {/* Floating tooltip */}
      {marker.label && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.3 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap rounded-lg border border-white/[0.1] bg-[#0D1420]/90 px-2.5 py-1.5 text-[11px] text-white/80 backdrop-blur-md shadow-xl font-medium pointer-events-none"
        >
          <span className="text-red-400 mr-1">●</span>
          {marker.label}
          {/* Tooltip arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/10" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function RiskMap() {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['Districts', 'Roads', 'Shelters']),
  );

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="absolute inset-0 bg-[#080D18]"
    >
      {/* ── Abstract map background ── */}
      <MapBackground />

      {/* ── Markers ── */}
      {MARKERS.map((m) => (
        <MapMarkerDot key={m.id} marker={m} />
      ))}

      {/* ── Top overlay: Live badge + filters ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-5 pt-4 pb-3 bg-gradient-to-b from-[#080D18]/70 to-transparent pointer-events-none">
        {/* LIVE RISK MAP badge */}
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 pointer-events-auto">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 animate-ping opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
            Live Risk Map
          </span>
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className={cn(
                'text-[11px] font-medium transition-colors px-0.5',
                activeFilters.has(tag) ? 'text-white/65' : 'text-white/25 line-through',
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Separator dots between tags (non-interactive) */}
        <div className="flex items-center gap-1.5 pointer-events-none">
          {/* dots rendered by the gap between tags above */}
        </div>
      </div>

      {/* ── Layer controls (top-right) ── */}
      <div className="absolute top-4 right-5">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-[#0B1020]/80 text-white/40 hover:text-white/80 hover:border-white/[0.2] backdrop-blur-sm transition-all"
          aria-label="Toggle map layers"
          title="Map Layers"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* ── Edge vignette ── */}
      <div className="absolute inset-0 pointer-events-none rounded-none"
        style={{
          background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 50%, rgba(5,8,16,0.6) 100%)',
        }}
      />

      {/* ── Metric cards overlay (bottom) ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="pointer-events-auto">
          <MetricCards />
        </div>
      </div>
    </motion.div>
  );
}
