import type { Severity, IncidentType } from '@/types/incident';

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
  { label: string; emoji: string }
> = {
  fire: { label: 'Structure Fire', emoji: '🔥' },
  flood: { label: 'Flooding', emoji: '🌊' },
  earthquake: { label: 'Earthquake', emoji: '🌍' },
  hazmat: { label: 'HazMat Spill', emoji: '☢️' },
  mass_casualty: { label: 'Mass Casualty', emoji: '🚑' },
  infrastructure: { label: 'Infrastructure', emoji: '🏗️' },
  storm: { label: 'Severe Storm', emoji: '🌪️' },
  blackout: { label: 'Power Blackout', emoji: '⚡' },
  tsunami: { label: 'Tsunami', emoji: '🌊' },
  civil_unrest: { label: 'Civil Unrest', emoji: '⚠️' },
};

export const INCIDENT_STATUS_CONFIG = {
  active: { label: 'Active', color: '#EF4444' },
  contained: { label: 'Contained', color: '#F97316' },
  escalating: { label: 'Escalating', color: '#7C3AED' },
  resolved: { label: 'Resolved', color: '#22C55E' },
} as const;
