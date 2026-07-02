import type { Severity } from '@/types/incident';
import { SEVERITY_CONFIG } from '@/constants/incidents';

export function scoreToSeverity(score: number): Severity {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  if (score > 0) return 'low';
  return 'resolved';
}

export function getSeverityColor(severity: Severity): string {
  return SEVERITY_CONFIG[severity].color;
}

export function getSeverityGlow(severity: Severity): string {
  return SEVERITY_CONFIG[severity].glowColor;
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  resolved: 4,
};
