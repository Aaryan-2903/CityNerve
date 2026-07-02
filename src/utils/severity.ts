import type { Severity } from '@/src/types/incident';
import { SEVERITY_CONFIG } from '@/src/constants/incidents';

/**
 * Maps a numeric AI risk score (0-100) to a Severity level
 */
export function scoreToSeverity(score: number): Severity {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  if (score > 0) return 'low';
  return 'resolved';
}

/**
 * Returns the hex color for a given severity level
 */
export function getSeverityColor(severity: Severity): string {
  return SEVERITY_CONFIG[severity].color;
}

/**
 * Returns the glow color for map markers
 */
export function getSeverityGlow(severity: Severity): string {
  return SEVERITY_CONFIG[severity].glowColor;
}

/**
 * Sorts severities from most to least critical
 */
export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  resolved: 4,
};
