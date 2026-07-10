'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, Popup, Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MetricCards } from '@/components/cards/MetricCards';
import { WeatherWidget } from '@/components/panels/WeatherWidget';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { useCity } from '@/src/context/CityContext';
import { useShelters } from '@/hooks/useShelters';
import { useHospitals } from '@/hooks/useHospitals';
import { useResources } from '@/hooks/useResources';
import { useMapZones } from '@/hooks/useMapZones';
import { useIncidents } from '@/hooks/useIncidents';
import { useDashboardInteraction } from '@/context/DashboardInteractionContext';
import { useDashboardData } from '@/hooks/useDashboardData';

/* ─── Dark tile style (CartoDB, free, no API key) ───────────────────────── */

const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

interface FloodIncident {
  id: string;
  lng: number;
  lat: number;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impact: string;
  status: string;
}

/* ─── Layer paint configs ────────────────────────────────────────────────── */

const floodFillLayer: LayerProps = { id: 'flood-zone',        type: 'fill', paint: { 'fill-color': '#EAB308', 'fill-opacity': 0.15 } };
const floodLineLayer: LayerProps = { id: 'flood-zone-outline', type: 'line', paint: { 'line-color': '#EAB308', 'line-width': 2, 'line-dasharray': [2, 2] } };
const evacLineLayer: LayerProps  = { id: 'evac-route',         type: 'line', paint: { 'line-color': '#FFFFFF', 'line-width': 3, 'line-dasharray': [4, 4], 'line-opacity': 0.8 } };
const simFloodFill: LayerProps   = { id: 'sim-flood-fill',     type: 'fill', paint: { 'fill-color': '#3B82F6', 'fill-opacity': 0.18 } };
const simFloodLine: LayerProps   = { id: 'sim-flood-outline',  type: 'line', paint: { 'line-color': '#3B82F6', 'line-width': 2.5, 'line-dasharray': [3, 3], 'line-opacity': 0.7 } };

/* ─── Severity colours ───────────────────────────────────────────────────── */

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH:     '#F97316',
  MEDIUM:   '#EAB308',
};

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface MapContentProps {
  /** When true, renders the MetricCards overlay at the bottom */
  showMetricCards?: boolean;
  /** When set, renders the Expand button and calls this when clicked */
  onExpandClick?: () => void;
}

/* ─── MapContent ─────────────────────────────────────────────────────────── */

/**
 * The core map rendering logic shared between RiskMap (dashboard) and
 * ExpandedMapOverlay (fullscreen). City + simulation state come from context.
 */
export function MapContent({ showMetricCards = false, onExpandClick }: MapContentProps) {
  // Layer toggles
  const [showIncidents,  setShowIncidents]  = useState(true);
  const [showResources,  setShowResources]  = useState(true);
  const [showRiskZones,  setShowRiskZones]  = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);

  // Popup state
  const [selectedIncident, setSelectedIncident] = useState<FloodIncident | null>(null);

  // Map ref for programmatic camera control
  const mapRef = useRef<MapRef>(null);

  // Simulation context
  const sim = useSimulationContext();
  const showFloodOverlay = sim?.showFloodOverlay ?? false;

  const { currentCity } = useCity();

  // Load backend data hooks instead of mock scenario
  const { shelters } = useShelters(currentCity.id);
  const { hospitals } = useHospitals(currentCity.id);
  const { resources } = useResources(currentCity.id);
  const { riskZones, evacRoutes } = useMapZones(currentCity.id);
  const { incidents } = useIncidents(); // automatically uses currentCity

  // Find specific zones
  const floodZoneData = riskZones.find(z => z.type === 'floodZone')?.geometry;
  const simFloodData = riskZones.find(z => z.type === 'simFlood')?.geometry;
  const evacRouteData = evacRoutes[0]?.geometry;

  // Cross-panel selection: fly to an incident when selected from IncidentCards
  const { selectedIncidentId } = useDashboardInteraction();

  useEffect(() => {
    if (!selectedIncidentId || !mapRef.current) return;
    
    // Find the target incident by ID
    const target = incidents.find((inc: any) => inc.id === selectedIncidentId);

    if (target) {
      // Smoothly move the map to the incident and slightly increase zoom
      mapRef.current.flyTo({
        center: [target.location.lng, target.location.lat],
        zoom: 13.5,
        pitch: 45,
        duration: 1000,
        essential: true,
      });
    } else {
      // If an incident has no coordinates, use the city's center instead to prevent crashes
      mapRef.current.flyTo({
        center: [currentCity.longitude, currentCity.latitude],
        zoom: 12.0,
        pitch: 40,
        duration: 1000,
        essential: true,
      });
    }
  }, [selectedIncidentId, incidents, currentCity]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex flex-col min-h-full w-full bg-[#080D18]"
    >
      <div className="absolute inset-0 z-0">
      <Map
        ref={mapRef}
        key={currentCity.id}
        initialViewState={{
          longitude: currentCity.longitude,
          latitude:  currentCity.latitude,
          zoom:      11.5,
          pitch:     40,
          bearing:   -12,
        }}
        mapStyle={DARK_STYLE}
        style={{ width: '100%', height: '100%' }}
        interactive={true}
        attributionControl={false}
        onClick={() => setSelectedIncident(null)}
      >
        {/* ── Risk Zones ── */}
        {showRiskZones && floodZoneData && (
          <Source id="flood-zone-source" type="geojson" data={floodZoneData}>
            <Layer {...floodFillLayer} />
            <Layer {...floodLineLayer} />
          </Source>
        )}

        {/* ── Evacuation Routes ── */}
        {showEvacRoutes && evacRouteData && (
          <Source id="evac-route-source" type="geojson" data={evacRouteData}>
            <Layer {...evacLineLayer} />
          </Source>
        )}

        {/* ── Simulation: Flood Overlay (stage 4+) ── */}
        {showFloodOverlay && simFloodData && (
          <Source id="sim-flood-source" type="geojson" data={simFloodData}>
            <Layer {...simFloodFill} />
            <Layer {...simFloodLine} />
          </Source>
        )}

        {/* ── Flood Incident Markers 🌊 ── */}
        {showIncidents && incidents.map((inc: any) => (
          <Marker
            key={inc.id}
            longitude={inc.location.lng}
            latitude={inc.location.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedIncident(inc);
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="relative flex h-6 w-6 cursor-pointer items-center justify-center"
              title={inc.title}
            >
              <span
                className="absolute inset-0 rounded-full opacity-40 animate-ping"
                style={{ backgroundColor: SEV_COLOR[inc.severity] }}
              />
              <span
                className="relative flex h-5 w-5 items-center justify-center rounded-full text-[11px] shadow-lg"
                style={{
                  backgroundColor: SEV_COLOR[inc.severity],
                  boxShadow: `0 0 14px ${SEV_COLOR[inc.severity]}99`,
                }}
              >
                🌊
              </span>
            </motion.div>
          </Marker>
        ))}

        {/* ── Rescue Team Markers 🚑 ── */}
        {showResources && resources.map((res: any) => (
          <Marker key={res.id} longitude={res.lng} latitude={res.lat} anchor="center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="relative flex h-5 w-5 items-center justify-center rounded-full text-[11px] cursor-default"
              style={{
                backgroundColor: '#16A34A',
                boxShadow: '0 0 12px rgba(22,163,74,0.7)',
              }}
              title={res.name}
            >
              🚑
            </motion.div>
          </Marker>
        ))}

        {/* ── Shelter Markers 🏠 ── */}
        {showResources && shelters.map((shl: any) => (
          <Marker key={shl.id} longitude={shl.lng} latitude={shl.lat} anchor="center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="relative flex h-5 w-5 items-center justify-center rounded-md text-[11px] cursor-default"
              style={{
                backgroundColor: '#2563EB',
                boxShadow: '0 0 12px rgba(37,99,235,0.7)',
              }}
              title={shl.name}
            >
              🏠
            </motion.div>
          </Marker>
        ))}

        {/* ── Hospital Markers 🏥 ── */}
        {showResources && hospitals.map((hosp: any) => (
          <Marker key={hosp.id} longitude={hosp.lng} latitude={hosp.lat} anchor="center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="relative flex h-5 w-5 items-center justify-center rounded-md text-[11px] cursor-default"
              style={{
                backgroundColor: '#0891B2',
                boxShadow: '0 0 12px rgba(8,145,178,0.7)',
              }}
              title={hosp.name}
            >
              🏥
            </motion.div>
          </Marker>
        ))}

        {/* ── Flood Incident Popup ── */}
        <AnimatePresence>
          {selectedIncident && (
            <Popup
              longitude={selectedIncident.lng}
              latitude={selectedIncident.lat}
              anchor="bottom"
              onClose={() => setSelectedIncident(null)}
              closeButton={false}
              closeOnClick={true}
              maxWidth="240px"
              offset={16}
            >
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#0C1220]/95 p-3 shadow-2xl backdrop-blur-xl"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: SEV_COLOR[selectedIncident.severity] }}
                  >
                    {selectedIncident.severity}
                  </span>
                  <span className="text-[9px] text-white/40 uppercase tracking-wider">
                    {selectedIncident.status}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white/90 leading-tight">
                  🌊 {selectedIncident.title}
                </h3>
                <p className="text-xs text-white/60">
                  <strong className="text-white/80 tabular-nums">{selectedIncident.impact}</strong>
                </p>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Map>
      </div>

      {/* ── Edge vignette (moved to background layer) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 60%, rgba(5,8,16,0.7) 100%)',
        }}
      />

      {/* ── UI Overlay Layer (Normal Document Flow) ── */}
      <div className="relative flex flex-col z-10 overflow-x-hidden pointer-events-none min-h-full w-full">
        
        {/* Top Area: Filters + Weather */}
        <div className="flex flex-col shrink-0">
          {/* Action Header */}
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-5 pt-3 sm:pt-4 pb-3 bg-gradient-to-b from-[#080D18]/90 via-[#080D18]/50 to-transparent pointer-events-auto">
            {/* LIVE RISK MAP badge */}
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 sm:px-3.5 py-1.5 pointer-events-auto shadow-lg backdrop-blur-md shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 animate-ping opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
              <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
                Live Risk Map
              </span>
            </div>

            {/* Map layer filter buttons */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pointer-events-auto">
              <FilterButton active={showIncidents}  onClick={() => setShowIncidents(!showIncidents)}   label="Incidents" />
              <FilterButton active={showResources}  onClick={() => setShowResources(!showResources)}   label="Resources" />
              <FilterButton active={showRiskZones}  onClick={() => setShowRiskZones(!showRiskZones)}   label="Risk Zones" />
              <FilterButton active={showEvacRoutes} onClick={() => setShowEvacRoutes(!showEvacRoutes)} label="Evac Routes" />
            </div>

            {/* Map legend */}
            <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
              <Legend emoji="🌊" label="Flood"    color="#EF4444" />
              <Legend emoji="🚑" label="Rescue"   color="#16A34A" />
              <Legend emoji="🏠" label="Shelter"  color="#2563EB" />
              <Legend emoji="🏥" label="Hospital" color="#0891B2" />
            </div>

            {/* Expand button */}
            {onExpandClick && (
              <div className="ml-auto pointer-events-auto">
                <ExpandButton onClick={onExpandClick} />
              </div>
            )}
          </div>

          {/* Weather Panel (Only in Desktop/Expanded mode, directly under filters) */}
          {showMetricCards && (
            <div className="px-3 sm:px-5 pt-2 pointer-events-auto w-full max-w-[340px]">
              <WeatherWidget />
            </div>
          )}
        </div>

        {/* Bottom Area: Metric Cards (KPI) */}
        {showMetricCards && (
          <div className="flex flex-col shrink-0 mt-auto pointer-events-auto w-full bg-gradient-to-t from-[#080D18]/90 via-[#080D18]/40 to-transparent pt-8">
            <MetricCards />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Helper components ──────────────────────────────────────────────────── */

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all backdrop-blur-md',
        active
          ? 'bg-white/10 text-white/90 shadow-sm border border-white/10'
          : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/60',
      )}
    >
      {label}
    </button>
  );
}

function Legend({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-white/[0.06] bg-black/30 px-2 py-1 backdrop-blur-md">
      <span className="text-[11px]">{emoji}</span>
      <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
    </div>
  );
}

function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-black/40 px-2.5 py-1.5',
        'text-[11px] font-semibold text-white/50',
        'hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white/90',
        'transition-all duration-150 backdrop-blur-md shadow-lg',
      )}
      aria-label="Expand map to fullscreen"
      title="Expand map (fullscreen)"
    >
      {/* Two-arrow expand icon built with SVG */}
      <svg
        className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.5 1.5H1.5v4M14.5 1.5h-4M10.5 14.5h4v-4M1.5 10.5v4h4" />
      </svg>
      <span>Expand</span>
    </button>
  );
}
