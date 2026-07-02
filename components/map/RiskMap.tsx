'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MetricCards } from '@/components/cards/MetricCards';
import { SimulationControl } from '@/components/panels/SimulationControl';
import { cn } from '@/lib/utils';

/* ─── Mock Data (Mumbai) ─────────────────────────────────────────────────── */

const INCIDENTS = [
  { id: 'inc-1', lng: 72.8777, lat: 19.0760, name: 'Riverside Underpass Flooding', severity: 'CRITICAL', affected: '1,180', status: 'Responding' },
  { id: 'inc-2', lng: 72.8550, lat: 19.0550, name: 'Bridge 4 Approach', severity: 'HIGH', affected: '450', status: 'Closure pending' },
  { id: 'inc-3', lng: 72.9050, lat: 19.1000, name: 'Power Grid Failure', severity: 'HIGH', affected: '2,300', status: 'Investigating' },
];

const RESCUE_TEAMS = [
  { id: 'res-1', lng: 72.8600, lat: 19.0600 },
  { id: 'res-2', lng: 72.8900, lat: 19.0800 },
];

const SHELTERS = [
  { id: 'shl-1', lng: 72.8700, lat: 19.0900 },
  { id: 'shl-2', lng: 72.8400, lat: 19.0400 },
];

const FLOOD_ZONE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.8600, 19.0500],
            [72.8900, 19.0500],
            [72.9000, 19.0700],
            [72.8800, 19.0900],
            [72.8500, 19.0700],
            [72.8600, 19.0500],
          ],
        ],
      },
    },
  ],
};

const EVAC_ROUTE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8777, 19.0760],
          [72.8700, 19.0900],
          [72.8500, 19.1100],
          [72.8200, 19.1300],
        ],
      },
    },
  ],
};

/* ─── Layer Styles ───────────────────────────────────────────────────────── */

const floodZoneStyle = {
  id: 'flood-zone',
  type: 'fill',
  paint: {
    'fill-color': '#EAB308',
    'fill-opacity': 0.15,
  },
};

const floodZoneOutlineStyle = {
  id: 'flood-zone-outline',
  type: 'line',
  paint: {
    'line-color': '#EAB308',
    'line-width': 2,
    'line-dasharray': [2, 2],
  },
};

const evacRouteStyle = {
  id: 'evac-route',
  type: 'line',
  paint: {
    'line-color': '#FFFFFF',
    'line-width': 3,
    'line-dasharray': [4, 4],
    'line-opacity': 0.8,
  },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export function RiskMap() {
  // Layer toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);
  
  // Popup state
  const [selectedIncident, setSelectedIncident] = useState<typeof INCIDENTS[0] | null>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!MAPBOX_TOKEN) {
    return (
      <div className="absolute inset-0 bg-[#080D18] flex items-center justify-center text-white/50 text-sm">
        NEXT_PUBLIC_MAPBOX_TOKEN is missing in .env.local
      </div>
    );
  }

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
          latitude: 19.0760,
          zoom: 11.5,
          pitch: 45,
          bearing: -15,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={true}
      >
        {/* Risk Zones */}
        {showRiskZones && (
          <Source id="flood-zone-source" type="geojson" data={FLOOD_ZONE_GEOJSON as any}>
            <Layer {...floodZoneStyle as any} />
            <Layer {...floodZoneOutlineStyle as any} />
          </Source>
        )}

        {/* Evacuation Routes */}
        {showEvacRoutes && (
          <Source id="evac-route-source" type="geojson" data={EVAC_ROUTE_GEOJSON as any}>
            <Layer {...evacRouteStyle as any} />
          </Source>
        )}

        {/* Incidents (🔴 Red) */}
        {showIncidents &&
          INCIDENTS.map((inc) => (
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
                className="relative flex h-5 w-5 cursor-pointer items-center justify-center"
              >
                <span className="absolute inset-0 rounded-full bg-red-500 opacity-40 animate-ping" />
                <span className="relative h-3.5 w-3.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              </motion.div>
            </Marker>
          ))}

        {/* Rescue Teams (🟢 Green) */}
        {showResources &&
          RESCUE_TEAMS.map((res) => (
            <Marker key={res.id} longitude={res.lng} latitude={res.lat} anchor="center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="relative h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
              />
            </Marker>
          ))}

        {/* Shelters (🔵 Blue) */}
        {showResources &&
          SHELTERS.map((shl) => (
            <Marker key={shl.id} longitude={shl.lng} latitude={shl.lat} anchor="center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="relative h-3.5 w-3.5 rounded-sm bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </Marker>
          ))}

        {/* Incident Popup */}
        <AnimatePresence>
          {selectedIncident && (
            <Popup
              longitude={selectedIncident.lng}
              latitude={selectedIncident.lat}
              anchor="bottom"
              onClose={() => setSelectedIncident(null)}
              closeButton={false}
              closeOnClick={true}
              className="z-50"
              maxWidth="240px"
              offset={14}
            >
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#0C1220]/95 p-3 shadow-2xl backdrop-blur-xl"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">
                    {selectedIncident.severity}
                  </span>
                  <span className="text-[9px] text-white/40 uppercase tracking-wider">
                    {selectedIncident.status}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white/90 leading-tight">
                  {selectedIncident.name}
                </h3>
                <p className="text-xs text-white/60">
                  <strong className="text-white/80 tabular-nums">{selectedIncident.affected}</strong> people affected
                </p>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Map>

      {/* ── Top overlay: Live badge + filters ── */}
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

        {/* Filter tags (Interactive Toggles) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <FilterButton active={showIncidents} onClick={() => setShowIncidents(!showIncidents)} label="Incidents" />
          <FilterButton active={showResources} onClick={() => setShowResources(!showResources)} label="Resources" />
          <FilterButton active={showRiskZones} onClick={() => setShowRiskZones(!showRiskZones)} label="Risk Zones" />
          <FilterButton active={showEvacRoutes} onClick={() => setShowEvacRoutes(!showEvacRoutes)} label="Evacuation Routes" />
        </div>
      </div>

      {/* ── Simulation Control (top-right) ── */}
      <div className="absolute top-4 right-5 pointer-events-auto">
        <SimulationControl />
      </div>

      {/* ── Edge vignette ── */}
      <div className="absolute inset-0 pointer-events-none rounded-none"
        style={{
          background: 'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 60%, rgba(5,8,16,0.7) 100%)',
        }}
      />

      {/* ── Metric cards overlay (bottom) ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Subtle dark gradient to ensure text readability against the map */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080D18]/90 via-[#080D18]/40 to-transparent" />
        <div className="pointer-events-auto relative">
          <MetricCards />
        </div>
      </div>
    </motion.div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all backdrop-blur-md',
        active
          ? 'bg-white/10 text-white/90 shadow-sm border border-white/10'
          : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/60'
      )}
    >
      {label}
    </button>
  );
}
