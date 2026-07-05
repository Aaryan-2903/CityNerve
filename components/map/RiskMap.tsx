'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MetricCards } from '@/components/cards/MetricCards';
import { cn } from '@/lib/utils';
import { useSimulationContext } from '@/context/SimulationContext';
import { KURLA_FLOOD_GEOJSON } from '@/data/simulationScenario';

/* ─── Dark tile style (CartoDB, free, no API key) ───────────────────────── */

const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/* ─── Mock Data (Mumbai) ─────────────────────────────────────────────────── */

interface FloodIncident {
  id: string;
  lng: number;
  lat: number;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affected: string;
  status: string;
}

const FLOOD_INCIDENTS: FloodIncident[] = [
  { id: 'inc-1', lng: 72.8777, lat: 19.0760, name: 'Riverside Underpass Flooding', severity: 'CRITICAL', affected: '1,180', status: 'Responding' },
  { id: 'inc-2', lng: 72.8550, lat: 19.0550, name: 'Bridge 4 Approach Flood',      severity: 'HIGH',     affected: '450',   status: 'Closure pending' },
  { id: 'inc-3', lng: 72.8950, lat: 19.0650, name: 'Dharavi Sector 9 Waterlogged', severity: 'HIGH',     affected: '1,050', status: 'Evacuating' },
];

const RESCUE_TEAMS = [
  { id: 'res-1', lng: 72.8600, lat: 19.0600, name: 'Rescue Team Bravo' },
  { id: 'res-2', lng: 72.8900, lat: 19.0800, name: 'Rescue Team Delta' },
];

const SHELTERS = [
  { id: 'shl-1', lng: 72.8700, lat: 19.0900, name: 'Shelter Alpha — Cap. 500' },
  { id: 'shl-2', lng: 72.8400, lat: 19.0400, name: 'Shelter Beta — Cap. 300' },
];

const HOSPITALS = [
  { id: 'hosp-1', lng: 72.8350, lat: 19.1150, name: 'KEM Hospital — Surge Ready' },
  { id: 'hosp-2', lng: 72.9180, lat: 19.0280, name: 'Sion Hospital — 89% capacity' },
];

/* ─── GeoJSON overlays ───────────────────────────────────────────────────── */

const FLOOD_ZONE_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [{
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[[72.8600, 19.0500],[72.8900, 19.0500],[72.9000, 19.0700],[72.8800, 19.0900],[72.8500, 19.0700],[72.8600, 19.0500]]],
    },
  }],
};

const EVAC_ROUTE_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [{
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: [[72.8777, 19.0760],[72.8700, 19.0900],[72.8500, 19.1100],[72.8200, 19.1300]],
    },
  }],
};

// Simulation flood overlay — Kurla Station area (imported from scenario data)
// Rendered at stage 4+ via showFloodOverlay from context

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

/* ─── Component ──────────────────────────────────────────────────────────── */

export function RiskMap() {
  // Layer toggles
  const [showIncidents,  setShowIncidents]  = useState(true);
  const [showResources,  setShowResources]  = useState(true);
  const [showRiskZones,  setShowRiskZones]  = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);

  // Popup state
  const [selectedIncident, setSelectedIncident] = useState<FloodIncident | null>(null);

  // Simulation context
  const sim = useSimulationContext();
  const showFloodOverlay = sim?.showFloodOverlay ?? false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="absolute inset-0 bg-[#080D18]"
    >
      <Map
        initialViewState={{
          longitude: 72.8777,
          latitude:  19.0760,
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
        {showRiskZones && (
          <Source id="flood-zone-source" type="geojson" data={FLOOD_ZONE_GEOJSON}>
            <Layer {...floodFillLayer} />
            <Layer {...floodLineLayer} />
          </Source>
        )}

        {/* ── Evacuation Routes ── */}
        {showEvacRoutes && (
          <Source id="evac-route-source" type="geojson" data={EVAC_ROUTE_GEOJSON}>
            <Layer {...evacLineLayer} />
          </Source>
        )}

        {/* ── Simulation: Kurla Flood Overlay (stage 4+) ── */}
        {showFloodOverlay && (
          <Source id="sim-flood-source" type="geojson" data={KURLA_FLOOD_GEOJSON}>
            <Layer {...simFloodFill} />
            <Layer {...simFloodLine} />
          </Source>
        )}

        {/* ── Flood Incident Markers 🌊 ── */}
        {showIncidents && FLOOD_INCIDENTS.map((inc) => (
          <Marker
            key={inc.id}
            longitude={inc.lng}
            latitude={inc.lat}
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
              title={inc.name}
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
        {showResources && RESCUE_TEAMS.map((res) => (
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
        {showResources && SHELTERS.map((shl) => (
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
        {showResources && HOSPITALS.map((hosp) => (
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
                  🌊 {selectedIncident.name}
                </h3>
                <p className="text-xs text-white/60">
                  <strong className="text-white/80 tabular-nums">{selectedIncident.affected}</strong> people affected
                </p>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Map>

      {/* ── Top overlay: Live badge + filter toggles ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-5 pt-4 pb-3 bg-gradient-to-b from-[#080D18]/90 via-[#080D18]/50 to-transparent pointer-events-none">
        {/* LIVE RISK MAP badge */}
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 pointer-events-auto shadow-lg backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 animate-ping opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
            Live Risk Map
          </span>
        </div>

        {/* Map layer filter buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <FilterButton active={showIncidents}  onClick={() => setShowIncidents(!showIncidents)}   label="Incidents" />
          <FilterButton active={showResources}  onClick={() => setShowResources(!showResources)}   label="Resources" />
          <FilterButton active={showRiskZones}  onClick={() => setShowRiskZones(!showRiskZones)}   label="Risk Zones" />
          <FilterButton active={showEvacRoutes} onClick={() => setShowEvacRoutes(!showEvacRoutes)} label="Evacuation Routes" />
        </div>

        {/* Map legend */}
        <div className="ml-auto flex items-center gap-2 pointer-events-auto">
          <Legend emoji="🌊" label="Flood"   color="#EF4444" />
          <Legend emoji="🚑" label="Rescue"  color="#16A34A" />
          <Legend emoji="🏠" label="Shelter" color="#2563EB" />
          <Legend emoji="🏥" label="Hospital" color="#0891B2" />
        </div>
      </div>


      {/* ── Edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 60%, rgba(5,8,16,0.7) 100%)',
        }}
      />

      {/* ── Metric cards overlay (bottom) ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080D18]/90 via-[#080D18]/40 to-transparent" />
        <div className="pointer-events-auto relative">
          <MetricCards />
        </div>
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
