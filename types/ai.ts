export type ActionPriority = 'immediate' | 'urgent' | 'monitor';

export interface ActionRecommendation {
  id: string;
  priority: ActionPriority;
  action: string;
  rationale: string;
  confidence: number;
  relatedIncidentIds: string[];
}

export interface AIBriefing {
  id: string;
  generatedAt: string;
  overallThreatLevel: 'critical' | 'elevated' | 'guarded' | 'low';
  situationalSummary: string;
  keyRisks: string[];
  recommendations: ActionRecommendation[];
  predictedEscalations: string[];
  modelVersion: string;
}
