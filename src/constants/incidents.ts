import type { Severity, IncidentType } from '@/src/types/incident';

export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bgColor: string; borderColor: string; glowColor: string }
> = {
  critical: {
    label: 'CRITICAL',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  high: {
    label: 'HIGH',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    glowColor: 'rgba(249, 115, 22, 0.4)',
  },
  medium: {
    label: 'MEDIUM',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    glowColor: 'rgba(234, 179, 8, 0.4)',
  },
  low: {
    label: 'LOW',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
  resolved: {
    label: 'RESOLVED',
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.12)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
    glowColor: 'rgba(107, 114, 128, 0.2)',
  },
};

export const INCIDENT_TYPE_CONFIG: Record<
  IncidentType,
  { label: string; icon: string; mapboxSymbol: string }
> = {
  fire: { label: 'Structure Fire', icon: '🔥', mapboxSymbol: 'fire-station' },
  flood: { label: 'Flooding', icon: '🌊', mapboxSymbol: 'harbor' },
  earthquake: { label: 'Earthquake', icon: '⚡', mapboxSymbol: 'danger' },
  hazmat: { label: 'HazMat Spill', icon: '☢️', mapboxSymbol: 'danger' },
  mass_casualty: { label: 'Mass Casualty', icon: '🚑', mapboxSymbol: 'hospital' },
  infrastructure: { label: 'Infrastructure', icon: '🏗️', mapboxSymbol: 'roadblock' },
  storm: { label: 'Severe Storm', icon: '🌪️', mapboxSymbol: 'danger' },
  blackout: { label: 'Power Blackout', icon: '⚡', mapboxSymbol: 'danger' },
  tsunami: { label: 'Tsunami Warning', icon: '🌊', mapboxSymbol: 'harbor' },
  civil_unrest: { label: 'Civil Unrest', icon: '⚠️', mapboxSymbol: 'danger' },
};

export const INCIDENT_STATUS_CONFIG = {
  active: { label: 'Active', color: '#EF4444' },
  contained: { label: 'Contained', color: '#F97316' },
  escalating: { label: 'Escalating', color: '#7C3AED' },
  resolved: { label: 'Resolved', color: '#22C55E' },
} as const;
