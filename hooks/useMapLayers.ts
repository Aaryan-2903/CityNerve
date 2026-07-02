'use client';

import { useState, useCallback } from 'react';
import type { MapLayer, MapLayerId, MapViewport } from '@/types/map';
import { DEFAULT_MAP_LAYERS, DEFAULT_VIEWPORT } from '@/constants/map';

export function useMapLayers() {
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_MAP_LAYERS);
  const [viewport, setViewport] = useState<MapViewport>(DEFAULT_VIEWPORT);

  const toggleLayer = useCallback((id: MapLayerId) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  }, []);

  const isLayerEnabled = useCallback(
    (id: MapLayerId) => layers.find((l) => l.id === id)?.enabled ?? false,
    [layers],
  );

  const flyTo = useCallback((lat: number, lng: number, zoom = 14) => {
    setViewport({ latitude: lat, longitude: lng, zoom, pitch: 30, bearing: 0 });
  }, []);

  const resetViewport = useCallback(() => {
    setViewport(DEFAULT_VIEWPORT);
  }, []);

  return {
    layers,
    viewport,
    toggleLayer,
    isLayerEnabled,
    flyTo,
    resetViewport,
    setViewport,
  };
}
