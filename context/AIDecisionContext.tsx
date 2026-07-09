'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useSimulationContext } from '@/context/SimulationContext';
import { useDashboardData } from '@/hooks/useDashboardData';

export type AIPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AIRecommendation {
  id: string;
  title: string;
  recommendation: string;
  confidence: number;
  reasoning: string[];
  priority: AIPriority;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AIDecisionState {
  currentRecommendation: AIRecommendation | null;
  approvedFeedEntries: any[];
  extraDeployedUnits: number;
  approve: () => void;
  reject: () => void;
}

const AIDecisionContext = createContext<AIDecisionState | null>(null);

// Deterministic rules based on simulation phase
const PHASE_RECOMMENDATIONS: Record<number, AIRecommendation> = {
  0: {
    id: 'rec-0',
    title: 'Monitor Situation',
    recommendation: 'Maintain standard observation protocols.',
    confidence: 68,
    reasoning: ['Weather patterns stable', 'No active critical incidents'],
    priority: 'Low',
    status: 'Pending',
  },
  1: {
    id: 'rec-1',
    title: 'Pre-position Units',
    recommendation: 'Deploy rapid response units to vulnerable low-lying areas.',
    confidence: 75,
    reasoning: ['Heavy rainfall detected', 'Drainage systems nearing capacity'],
    priority: 'Medium',
    status: 'Pending',
  },
  2: {
    id: 'rec-2',
    title: 'Investigate Reports',
    recommendation: 'Dispatch reconnaissance to citizen report locations.',
    confidence: 82,
    reasoning: ['Multiple citizen reports in target area', 'Rising water levels verified'],
    priority: 'Medium',
    status: 'Pending',
  },
  3: {
    id: 'rec-3',
    title: 'Initiate Evacuation Prep',
    recommendation: 'Alert shelters and prepare evacuation routes for target zone.',
    confidence: 89,
    reasoning: ['Flood imminent within 30 minutes', 'Threat elevated to HIGH'],
    priority: 'High',
    status: 'Pending',
  },
  4: {
    id: 'rec-4',
    title: 'Execute Evacuation',
    recommendation: 'Enact mandatory evacuation and close primary arterial roads.',
    confidence: 93,
    reasoning: ['Flood polygon active', 'Imminent risk to life and property'],
    priority: 'Critical',
    status: 'Pending',
  },
  5: {
    id: 'rec-5',
    title: 'Deploy Rescue Teams',
    recommendation: 'Activate Rescue Team Alpha and open primary shelters.',
    confidence: 95,
    reasoning: ['Evacuation orders active', 'Shelter capacity required'],
    priority: 'Critical',
    status: 'Pending',
  },
  6: {
    id: 'rec-6',
    title: 'Sustain Operations',
    recommendation: 'Continue rescue operations and monitor shelter capacity.',
    confidence: 91,
    reasoning: ['Rescue operations ongoing', 'Rainfall easing but standing water remains'],
    priority: 'High',
    status: 'Pending',
  },
  7: {
    id: 'rec-7',
    title: 'Begin Recovery Assessment',
    recommendation: 'Deploy teams to assess structural damage and clear debris.',
    confidence: 88,
    reasoning: ['Threat downgraded to MODERATE', 'Water receding'],
    priority: 'Medium',
    status: 'Pending',
  },
  8: {
    id: 'rec-8',
    title: 'Stand Down',
    recommendation: 'Return to normal operations and file after-action reports.',
    confidence: 95,
    reasoning: ['Simulation complete', 'All incidents resolved'],
    priority: 'Low',
    status: 'Pending',
  },
};

export function AIDecisionProvider({ children }: { children: React.ReactNode }) {
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;

  // Local state for actions
  const [statuses, setStatuses] = useState<Record<string, 'Pending' | 'Approved' | 'Rejected'>>({});
  const [approvedFeedEntries, setApprovedFeedEntries] = useState<any[]>([]);
  const [extraDeployedUnits, setExtraDeployedUnits] = useState<number>(0);

  // Generate deterministic recommendation
  const currentRecommendation = useMemo(() => {
    // If we're past phase 5, but the system is idle or whatever, we just map phase to rule
    const base = PHASE_RECOMMENDATIONS[phase] || PHASE_RECOMMENDATIONS[0];
    
    // Inject dynamic details if needed (could read from dashboard data here if we want)
    
    // Override status with local state if user interacted
    const status = statuses[base.id] || 'Pending';
    
    return {
      ...base,
      status
    };
  }, [phase, statuses]);

  const approve = useCallback(() => {
    if (!currentRecommendation || currentRecommendation.status !== 'Pending') return;
    
    setStatuses((prev) => ({ ...prev, [currentRecommendation.id]: 'Approved' }));
    setExtraDeployedUnits((prev) => prev + 2); // Simulating unit deployment
    
    // Add to command feed
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setApprovedFeedEntries((prev) => [
      {
        id: `ai-app-${Date.now()}`,
        time: timeStr,
        text: `AI Recommendation Approved: ${currentRecommendation.recommendation}`,
        dotColor: '#A855F7', // Purple for AI actions
        category: 'dispatch'
      },
      ...prev
    ]);
  }, [currentRecommendation]);

  const reject = useCallback(() => {
    if (!currentRecommendation || currentRecommendation.status !== 'Pending') return;
    setStatuses((prev) => ({ ...prev, [currentRecommendation.id]: 'Rejected' }));
    
    // Log rejection to feed
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setApprovedFeedEntries((prev) => [
      {
        id: `ai-rej-${Date.now()}`,
        time: timeStr,
        text: `AI Recommendation Rejected: ${currentRecommendation.title}`,
        dotColor: '#6B7280', // Gray for rejections
        category: 'advisory'
      },
      ...prev
    ]);
  }, [currentRecommendation]);

  const value = {
    currentRecommendation,
    approvedFeedEntries,
    extraDeployedUnits,
    approve,
    reject,
  };

  return (
    <AIDecisionContext.Provider value={value}>
      {children}
    </AIDecisionContext.Provider>
  );
}

export function useAIDecisionContext() {
  const context = useContext(AIDecisionContext);
  if (!context) {
    throw new Error('useAIDecisionContext must be used within an AIDecisionProvider');
  }
  return context;
}
