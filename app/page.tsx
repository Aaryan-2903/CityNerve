'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Users,
  Truck,
  Brain,
  Activity,
  Layers,
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { EOCMap } from '@/components/map/EOCMap';
import { MapLayerControls } from '@/components/map/MapLayerControls';
import { IncidentFeed } from '@/components/panels/IncidentFeed';
import { ResourceTracker } from '@/components/panels/ResourceTracker';
import { AIBriefingPanel } from '@/components/panels/AIBriefing';
import { WeatherWidget } from '@/components/panels/WeatherWidget';
import { ImpactSummary } from '@/components/cards/ImpactSummary';
import { StatCard } from '@/components/shared/StatCard';
import { SimulationControls } from '@/components/simulation/SimulationControls';
import { useIncidents } from '@/hooks/useIncidents';
import { useMapLayers } from '@/hooks/useMapLayers';
import { MOCK_RESOURCES } from '@/data/mockResources';
import { MOCK_AI_BRIEFING } from '@/data/mockAIBriefing';
import { formatPopulation } from '@/utils/format';
import { useCity } from '@/src/context/CityContext';
import { localizeData } from '@/src/data/cities';
import { useMemo } from 'react';
import { useSimulationContext } from '@/context/SimulationContext';

export default function EOCDashboard() {
  const { currentCity } = useCity();

  const localizedResources = useMemo(
    () => localizeData(MOCK_RESOURCES, currentCity),
    [currentCity]
  );
  
  const localizedAIBriefing = useMemo(
    () => localizeData(MOCK_AI_BRIEFING, currentCity),
    [currentCity]
  );

  const {
    incidents,
    filteredIncidents,
    selectedIncidentId,
    stats,
    selectIncident,
  } = useIncidents();

  const {
    layers,
    viewport,
    toggleLayer,
    isLayerEnabled,
    flyTo,
    resetViewport,
    setViewport,
  } = useMapLayers();

  const [leftPanelTab, setLeftPanelTab] = useState<'incidents' | 'ai'>('incidents');

  // When an incident is selected, fly the map to it
  const handleSelectIncident = (id: string | null) => {
    selectIncident(id);
    if (id) {
      const inc = incidents.find((i) => i.id === id);
      if (inc) flyTo(inc.location.lat, inc.location.lng, 14);
    }
  };

  const deployedResources = localizedResources.filter(
    (r) => r.status === 'deployed' || r.status === 'en_route',
  );

  const sim = useSimulationContext();
  const activeIncidentsCount = stats.active;
  const deployedUnitsCount = deployedResources.length;
  
  const baseCasualties = incidents.reduce((sum, i) => sum + i.casualties, 0);
  const totalCasualties = baseCasualties;
  
  const baseAffected = incidents.reduce((sum, i) => sum + i.affectedPopulation, 0);
  const affectedPopulationCount = baseAffected;
  
  const avgResponseTimeSeconds = 272;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B14]">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* TopBar */}
        <TopBar
          activeIncidents={stats.active}
          criticalCount={stats.critical}
        />

        {/* KPI Stats Row */}
        <div className="shrink-0 grid grid-cols-4 gap-2 px-3 pt-3 pb-0">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
          >
            <StatCard
              label="Active Incidents"
              value={activeIncidentsCount}
              delta="+3 since 18:00"
              trend="up"
              trendPositive={false}
              accentColor="#EF4444"
              icon={<AlertTriangle className="w-4 h-4" />}
              sublabel={`${stats.critical} critical · ${stats.total} total`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <StatCard
              label="Deployed Units"
              value={deployedUnitsCount}
              delta="87% capacity"
              trend="up"
              trendPositive={false}
              accentColor="#F97316"
              icon={<Truck className="w-4 h-4" />}
              sublabel={`${localizedResources.length} total assets tracked`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatCard
              label="Affected Population"
              value={affectedPopulationCount}
              formatValue={(v) => formatPopulation(v)}
              delta={`${totalCasualties} casualties`}
              trend={totalCasualties > 0 ? 'up' : 'stable'}
              trendPositive={false}
              accentColor="#7C3AED"
              icon={<Users className="w-4 h-4" />}
              sublabel="Across all active incidents"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <StatCard
              label="Avg Response Time"
              value={avgResponseTimeSeconds}
              formatValue={(v) => `${Math.floor(v/60)}m ${v%60}s`}
              delta="-0m 48s vs baseline"
              trend="down"
              trendPositive={true}
              accentColor="#22C55E"
              icon={<Activity className="w-4 h-4" />}
              sublabel="All units · last 2 hours"
            />
          </motion.div>
        </div>

        {/* Main 3-column layout */}
        <div className="flex flex-1 gap-2 p-3 pt-2 min-h-0 overflow-hidden">
          {/* Left Panel */}
          <motion.div
            className="flex flex-col gap-2 overflow-hidden"
            style={{ width: 300, minWidth: 280, maxWidth: 340 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Tab toggle */}
            <div className="flex gap-1 p-1 rounded-xl border border-white/[0.06] bg-white/[0.02] shrink-0">
              <button
                onClick={() => setLeftPanelTab('incidents')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  leftPanelTab === 'incidents'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Incidents
              </button>
              <button
                onClick={() => setLeftPanelTab('ai')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  leftPanelTab === 'ai'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/25'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                <Brain className="w-3 h-3" />
                AI Brief
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {leftPanelTab === 'incidents' ? (
                <IncidentFeed
                  incidents={filteredIncidents}
                  selectedIncidentId={selectedIncidentId}
                  onSelectIncident={handleSelectIncident}
                  totalCount={stats.active}
                />
              ) : (
                <AIBriefingPanel briefing={localizedAIBriefing} />
              )}
            </div>
          </motion.div>

          {/* Center: Map Hero */}
          <motion.div
            className="flex-1 flex flex-col gap-2 min-w-0 min-h-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {/* Map */}
            <div className="relative flex-1 min-h-0">
              <EOCMap
                incidents={incidents}
                resources={localizedResources}
                selectedIncidentId={selectedIncidentId}
                onSelectIncident={handleSelectIncident}
                viewport={viewport}
                onViewportChange={setViewport}
                showIncidents={isLayerEnabled('incidents')}
                showResources={isLayerEnabled('resources')}
              />

              {/* Layer controls overlay */}
              <div className="absolute top-3 right-3 z-10">
                <MapLayerControls
                  layers={layers}
                  onToggleLayer={toggleLayer}
                  onResetView={resetViewport}
                />
              </div>

              {/* Simulation Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <SimulationControls />
              </div>
            </div>

            {/* Impact Summary */}
            <div className="shrink-0">
              <ImpactSummary
                population={formatPopulation(
                  incidents.reduce((sum, i) => sum + i.affectedPopulation, 0)
                )}
                roadsClosed={14}
                sheltersOpen={8}
                hospitalsNearby={4}
              />
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            className="flex flex-col gap-2 overflow-hidden"
            style={{ width: 272, minWidth: 260, maxWidth: 300 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Resources */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ResourceTracker resources={localizedResources} />
            </div>
            {/* Weather */}
            <div className="shrink-0">
              <WeatherWidget />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
