'use client';

import { MapContent } from './MapContent';

interface RiskMapProps {
  /** When true, hides the MetricCards bottom overlay (they are shown in the mobile flow instead) */
  mobileMode?: boolean;
  /** When provided, shows the Expand button and calls this when clicked */
  onExpandClick?: () => void;
}

/**
 * Dashboard map container — thin wrapper around MapContent.
 * Renders as absolute inset-0 inside its positioned parent.
 */
export function RiskMap({ mobileMode = false, onExpandClick }: RiskMapProps) {
  return (
    <MapContent
      showMetricCards={!mobileMode}
      onExpandClick={onExpandClick}
    />
  );
}
