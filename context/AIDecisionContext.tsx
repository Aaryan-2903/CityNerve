'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

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

export interface AIDecisionHistoryEntry {
  id: string;
  recId: string;
  timestamp: string;
  title: string;
  recommendation: string;
  reasoning: string[];
  priority: AIPriority;
  confidence: number;
  status: 'Approved' | 'Rejected';
}

export interface AIDecisionState {
  statuses: Record<string, 'Pending' | 'Approved' | 'Rejected'>;
  approvedFeedEntries: any[];
  extraDeployedUnits: number;
  decisionHistory: AIDecisionHistoryEntry[];
  approve: (rec: AIRecommendation) => void;
  reject: (rec: AIRecommendation) => void;
}

const AIDecisionContext = createContext<AIDecisionState | null>(null);

export function AIDecisionProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, 'Pending' | 'Approved' | 'Rejected'>>({});
  const [approvedFeedEntries, setApprovedFeedEntries] = useState<any[]>([]);
  const [extraDeployedUnits, setExtraDeployedUnits] = useState<number>(0);
  const [decisionHistory, setDecisionHistory] = useState<AIDecisionHistoryEntry[]>([]);

  const approve = useCallback((rec: AIRecommendation) => {
    setStatuses((prev) => ({ ...prev, [rec.id]: 'Approved' }));
    setExtraDeployedUnits((prev) => prev + 2); // Simulating unit deployment
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setApprovedFeedEntries((prev) => [
      {
        id: `ai-app-${Date.now()}`,
        time: timeStr,
        text: `AI Recommendation Approved: ${rec.recommendation}`,
        dotColor: '#A855F7',
        category: 'dispatch'
      },
      ...prev
    ]);

    setDecisionHistory((prev) => {
      const entry: AIDecisionHistoryEntry = {
        id: `hist-app-${Date.now()}`,
        recId: rec.id,
        timestamp: timeStr,
        title: rec.title,
        recommendation: rec.recommendation,
        reasoning: rec.reasoning,
        priority: rec.priority,
        confidence: rec.confidence,
        status: 'Approved',
      };
      return [entry, ...prev].slice(0, 20);
    });
  }, []);

  const reject = useCallback((rec: AIRecommendation) => {
    setStatuses((prev) => ({ ...prev, [rec.id]: 'Rejected' }));
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setApprovedFeedEntries((prev) => [
      {
        id: `ai-rej-${Date.now()}`,
        time: timeStr,
        text: `AI Recommendation Rejected: ${rec.title}`,
        dotColor: '#6B7280',
        category: 'advisory'
      },
      ...prev
    ]);

    setDecisionHistory((prev) => {
      const entry: AIDecisionHistoryEntry = {
        id: `hist-rej-${Date.now()}`,
        recId: rec.id,
        timestamp: timeStr,
        title: rec.title,
        recommendation: rec.recommendation,
        reasoning: rec.reasoning,
        priority: rec.priority,
        confidence: rec.confidence,
        status: 'Rejected',
      };
      return [entry, ...prev].slice(0, 20);
    });
  }, []);

  const value = {
    statuses,
    approvedFeedEntries,
    extraDeployedUnits,
    decisionHistory,
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
