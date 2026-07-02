'use client';

import { cn } from '@/lib/utils';
import type { MapLayer } from '@/types/map';
import {
  AlertTriangle,
  Truck,
  Activity,
  Map,
  Cloud,
  Navigation,
  RotateCcw,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  AlertTriangle,
  Truck,
  Activity,
  Map,
  Cloud,
  Navigation,
};

interface MapLayerControlsProps {
  layers: MapLayer[];
  onToggleLayer: (id: MapLayer['id']) => void;
  onResetView: () => void;
  className?: string;
}

export function MapLayerControls({
  layers,
  onToggleLayer,
  onResetView,
  className,
}: MapLayerControlsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-black/70 p-2 backdrop-blur-xl',
        className,
      )}
    >
      <p className="px-1 text-[9px] font-semibold text-white/25 uppercase tracking-widest mb-0.5">
        Layers
      </p>
      {layers.map((layer) => {
        const Icon = ICON_MAP[layer.icon] ?? Map;
        return (
          <button
            key={layer.id}
            onClick={() => onToggleLayer(layer.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all',
              layer.enabled
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04] border border-transparent',
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-medium leading-none">{layer.label}</span>
          </button>
        );
      })}

      <div className="mt-1 pt-1 border-t border-white/[0.06]">
        <button
          onClick={onResetView}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-medium leading-none">Reset View</span>
        </button>
      </div>
    </div>
  );
}
