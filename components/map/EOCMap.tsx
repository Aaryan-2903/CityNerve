'use client';

import { useCallback, useRef, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import type { Incident } from '@/types/incident';
import type { Resource } from '@/types/resource';
import type { MapViewport } from '@/types/map';
import { SEVERITY_CONFIG, INCIDENT_TYPE_CONFIG } from '@/constants/incidents';
import { MAPBOX_STYLE } from '@/constants/map';
import { formatRelativeTime, formatPopulation } from '@/utils/format';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { X, Maximize2, Users, Clock, TrendingUp } from 'lucide-react';

interface EOCMapProps {
  incidents: Incident[];
  resources: Resource[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string | null) => void;
  viewport: MapViewport;
  onViewportChange: (vp: MapViewport) => void;
  showIncidents: boolean;
  showResources: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

function IncidentMarkerPin({
  incident,
  isSelected,
}: {
  incident: Incident;
  isSelected: boolean;
}) {
  const config = SEVERITY_CONFIG[incident.severity];
  const typeConfig = INCIDENT_TYPE_CONFIG[incident.type];
  const size = incident.severity === 'critical' ? 36 : incident.severity === 'high' ? 30 : 26;

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: size, height: size }}
    >
      {/* Pulse ring for critical/high */}
      {(incident.severity === 'critical' || incident.severity === 'high') && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ backgroundColor: config.color }}
        />
      )}
      {/* Selected outer ring */}
      {isSelected && (
        <span
          className="absolute rounded-full"
          style={{
            inset: -4,
            border: `2px solid ${config.color}`,
            borderRadius: '50%',
          }}
        />
      )}
      {/* Main marker */}
      <div
        className="relative flex items-center justify-center rounded-full text-white font-bold shadow-lg"
        style={{
          width: size,
          height: size,
          backgroundColor: config.color,
          boxShadow: `0 0 ${isSelected ? 20 : 10}px ${config.glowColor}`,
          fontSize: size * 0.4,
        }}
      >
        {typeConfig.emoji}
      </div>
    </div>
  );
}

function ResourceMarkerPin({ resource }: { resource: Resource }) {
  const color =
    resource.status === 'deployed'
      ? '#3B82F6'
      : resource.status === 'en_route'
        ? '#EAB308'
        : '#22C55E';

  return (
    <div
      className="w-2.5 h-2.5 rounded-full border border-white/50 shadow-sm"
      style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
    />
  );
}

function NoTokenFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070B14] text-white/30">
      <div className="grid grid-cols-12 grid-rows-8 gap-0.5 opacity-10 absolute inset-0">
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="bg-blue-500/20 rounded-[1px]" />
        ))}
      </div>
      <div className="relative z-10 text-center space-y-2 p-8">
        <p className="text-sm font-mono text-white/50">MAPBOX TOKEN REQUIRED</p>
        <p className="text-xs text-white/25">
          Add <code className="text-blue-400">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{' '}
          <code className="text-blue-400">.env.local</code>
        </p>
        <p className="text-[10px] text-white/15 mt-4">Map will render here with incidents and resources overlaid</p>
      </div>
    </div>
  );
}

export function EOCMap({
  incidents,
  resources,
  selectedIncidentId,
  onSelectIncident,
  viewport,
  onViewportChange,
  showIncidents,
  showResources,
}: EOCMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupIncident, setPopupIncident] = useState<Incident | null>(null);

  const handleMarkerClick = useCallback(
    (incident: Incident) => {
      onSelectIncident(incident.id);
      setPopupIncident(incident);
    },
    [onSelectIncident],
  );

  const handleMapClick = useCallback(() => {
    setPopupIncident(null);
    onSelectIncident(null);
  }, [onSelectIncident]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <NoTokenFallback />
        {/* Overlay mock incident dots for visual effect */}
        <div className="absolute inset-0 pointer-events-none">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: SEVERITY_CONFIG[inc.severity].color,
                left: `${((inc.location.lng + 74.3) / 0.7) * 100}%`,
                top: `${((40.92 - inc.location.lat) / 0.5) * 100}%`,
                boxShadow: `0 0 12px ${SEVERITY_CONFIG[inc.severity].glowColor}`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        {...viewport}
        onMove={(evt) => onViewportChange(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={MAPBOX_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        <ScaleControl position="bottom-left" />

        {/* Resource markers */}
        {showResources &&
          resources
            .filter((r) => r.status !== 'available')
            .map((resource) => (
              <Marker
                key={resource.id}
                longitude={resource.location.lng}
                latitude={resource.location.lat}
                anchor="center"
              >
                <ResourceMarkerPin resource={resource} />
              </Marker>
            ))}

        {/* Incident markers */}
        {showIncidents &&
          incidents.map((incident) => (
            <Marker
              key={incident.id}
              longitude={incident.location.lng}
              latitude={incident.location.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(incident);
              }}
            >
              <IncidentMarkerPin
                incident={incident}
                isSelected={selectedIncidentId === incident.id}
              />
            </Marker>
          ))}

        {/* Incident popup */}
        {popupIncident && (
          <Popup
            longitude={popupIncident.location.lng}
            latitude={popupIncident.location.lat}
            anchor="bottom"
            offset={24}
            onClose={() => setPopupIncident(null)}
            closeButton={false}
            className="citynerve-popup"
          >
            <div className="bg-[#0D1420] border border-white/[0.1] rounded-xl p-3 min-w-[240px] shadow-2xl shadow-black/50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{INCIDENT_TYPE_CONFIG[popupIncident.type].emoji}</span>
                  <div>
                    <SeverityBadge severity={popupIncident.severity} size="sm" pulse />
                    <p className="text-xs font-semibold text-white/90 mt-0.5 leading-tight">
                      {popupIncident.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPopupIncident(null)}
                  className="text-white/30 hover:text-white/70 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-white/40 leading-snug mb-3 line-clamp-2">
                {popupIncident.description}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/[0.04] rounded-lg p-1.5">
                  <Users className="w-3 h-3 text-white/30 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-white/80">
                    {formatPopulation(popupIncident.affectedPopulation)}
                  </p>
                  <p className="text-[9px] text-white/25">Affected</p>
                </div>
                <div className="bg-white/[0.04] rounded-lg p-1.5">
                  <Clock className="w-3 h-3 text-white/30 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-white/80">
                    {formatRelativeTime(popupIncident.timestamp)}
                  </p>
                  <p className="text-[9px] text-white/25">Reported</p>
                </div>
                <div className="bg-white/[0.04] rounded-lg p-1.5">
                  <TrendingUp className="w-3 h-3 text-white/30 mx-auto mb-0.5" />
                  <p
                    className={cn(
                      'text-[10px] font-bold',
                      popupIncident.aiRiskScore >= 80
                        ? 'text-red-400'
                        : popupIncident.aiRiskScore >= 50
                          ? 'text-orange-400'
                          : 'text-green-400',
                    )}
                  >
                    {popupIncident.aiRiskScore}
                  </p>
                  <p className="text-[9px] text-white/25">AI Risk</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                <p className="text-[10px] text-white/30 font-mono">
                  {popupIncident.location.district} · {popupIncident.location.borough}
                </p>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map UI overlays */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 animate-ping opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          <span className="font-mono text-[10px] font-semibold text-white/60">LIVE FEED</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/60 px-2 py-1.5 backdrop-blur-sm">
          <Maximize2 className="w-3 h-3 text-white/40" />
          <span className="font-mono text-[10px] text-white/30">NYC Metro</span>
        </div>
      </div>
    </div>
  );
}
