import { AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AlertSeverity = 'normal' | 'advisory' | 'watch' | 'warning' | 'critical' | 'emergency' | 'recovery';

export interface SimulationAlert {
  title: string;
  description: string;
  severity: AlertSeverity;
  icon: LucideIcon;
  colorClass: string;
  dotClass: string;
}

const severityConfig: Record<AlertSeverity, { icon: LucideIcon, colorClass: string, dotClass: string }> = {
  normal: {
    icon: CheckCircle2,
    colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400'
  },
  advisory: {
    icon: Info,
    colorClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    dotClass: 'bg-cyan-400'
  },
  watch: {
    icon: AlertCircle,
    colorClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    dotClass: 'bg-yellow-400'
  },
  warning: {
    icon: AlertTriangle,
    colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    dotClass: 'bg-orange-400'
  },
  critical: {
    icon: AlertTriangle,
    colorClass: 'bg-red-500/20 text-red-400 border-red-500/30',
    dotClass: 'bg-red-400'
  },
  emergency: {
    icon: ShieldAlert,
    colorClass: 'bg-red-950/60 text-red-500 border-red-800/50',
    dotClass: 'bg-red-500'
  },
  recovery: {
    icon: CheckCircle2,
    colorClass: 'bg-green-500/20 text-green-400 border-green-500/30',
    dotClass: 'bg-green-400'
  }
};

export const SIMULATION_ALERTS: Record<number, SimulationAlert> = {
  0: {
    title: 'SYSTEM NORMAL',
    description: 'All city services operating at standard capacity.',
    severity: 'normal',
    ...severityConfig.normal
  },
  1: {
    title: 'WEATHER ADVISORY',
    description: 'Heavy rainfall detected. Monitoring low-lying areas.',
    severity: 'advisory',
    ...severityConfig.advisory
  },
  2: {
    title: 'STORM WATCH',
    description: 'Citizen reports of localized water pooling received.',
    severity: 'watch',
    ...severityConfig.watch
  },
  3: {
    title: 'FLASH FLOOD WARNING',
    description: 'Water levels rising rapidly in coastal sectors.',
    severity: 'warning',
    ...severityConfig.warning
  },
  4: {
    title: 'INFRASTRUCTURE WARNING',
    description: 'Multiple major arterial roads closed due to flooding.',
    severity: 'warning',
    ...severityConfig.warning
  },
  5: {
    title: 'CRITICAL ALERT',
    description: 'Evacuation orders issued. Emergency shelters activated.',
    severity: 'critical',
    ...severityConfig.critical
  },
  6: {
    title: 'EMERGENCY STATE',
    description: 'Active rescue operations in progress. Stay indoors.',
    severity: 'emergency',
    ...severityConfig.emergency
  },
  7: {
    title: 'RECOVERY PHASE',
    description: 'Water levels receding. Cleanup crews dispatched.',
    severity: 'recovery',
    ...severityConfig.recovery
  },
  8: {
    title: 'ALL CLEAR',
    description: 'Simulation complete. City services returning to normal.',
    severity: 'normal',
    ...severityConfig.normal
  }
};
