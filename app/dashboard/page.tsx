'use client';

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RiskMap } from '@/components/map/RiskMap';
import { ExpandedMapOverlay } from '@/components/map/ExpandedMapOverlay';
import { CommandFeed } from '@/components/timeline/CommandFeed';
import { IncidentCards } from '@/components/cards/IncidentCards';
import { AICommand } from '@/components/ai/AICommand';
import { WeatherWidget } from '@/components/panels/WeatherWidget';
import { SimulationControl } from '@/components/panels/SimulationControl';
import { SimulationProvider } from '@/context/SimulationContext';
import { CityProvider } from '@/src/context/CityContext';
import { DashboardInteractionProvider } from '@/context/DashboardInteractionContext';

export default function DashboardPage() {
  const [mapExpanded, setMapExpanded] = useState(false);
  const openMap  = useCallback(() => setMapExpanded(true),  []);
  const closeMap = useCallback(() => setMapExpanded(false), []);

  return (
    <CityProvider>
      <SimulationProvider>
        <DashboardInteractionProvider>

          {/* ── Fullscreen map overlay ── */}
          <ExpandedMapOverlay isOpen={mapExpanded} onClose={closeMap} />

          <DashboardLayout>

            {/* ════════════════════════════════════════════════════════════════
                DESKTOP layout  (md and up)
                ════════════════════════════════════════════════════════════════ */}
            <div className="hidden md:flex h-full flex-col overflow-y-auto overflow-x-hidden">

              {/* Upper: Risk Map */}
              <div className="relative flex-1 min-h-[400px] shrink-0 border-b border-white/[0.05]">
                <RiskMap onExpandClick={openMap} />
              </div>

              {/* ── Simulation + Command strip ── */}
              <div className="h-[36px] shrink-0 flex items-center gap-3 px-3 border-b border-white/[0.05] bg-[#070B14]">
                <SimulationControl compact />
              </div>

              {/* Lower: Three-column command section */}
              <div className="shrink-0 flex min-h-[300px]">
                <div className="w-[26%] min-w-0">
                  <CommandFeed />
                </div>
                <div className="flex-1 min-w-0">
                  <IncidentCards />
                </div>
                <div className="w-[32%] min-w-0">
                  <AICommand />
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                MOBILE layout  (below md) — stacked, scrollable
                ════════════════════════════════════════════════════════════════ */}
            <div className="flex md:hidden flex-col flex-1 overflow-y-auto min-h-0 bg-[#090D1A]">

              {/* 1. Map */}
              <div className="relative shrink-0" style={{ height: '56vw', minHeight: '240px', maxHeight: '380px' }}>
                <RiskMap mobileMode onExpandClick={openMap} />
              </div>

              {/* 2. Weather Widget */}
              <div className="px-3 pt-3">
                <WeatherWidget />
              </div>

              {/* 3. Simulation Control */}
              <div className="px-3 pt-3">
                <SimulationControl />
              </div>

              {/* 4. Command Feed */}
              <div className="px-3 pt-3">
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden h-[300px] overscroll-contain">
                  <CommandFeed />
                </div>
              </div>

              {/* 5. Incident Cards */}
              <div className="px-3 pt-3">
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden h-[350px] overscroll-contain">
                  <IncidentCards />
                </div>
              </div>

              {/* 6. AI Command */}
              <div className="px-3 pt-3 pb-6">
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden h-[350px] overscroll-contain">
                  <AICommand />
                </div>
              </div>
            </div>

          </DashboardLayout>
        </DashboardInteractionProvider>
      </SimulationProvider>
    </CityProvider>
  );
}
