import type { AIBriefing } from '@/src/types/ai';

export const MOCK_AI_BRIEFING: AIBriefing = {
  id: 'AIB-2024-001',
  generatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  overallThreatLevel: 'critical',
  situationalSummary:
    'The New York City metropolitan area is experiencing a compound disaster event of unprecedented operational complexity. Three simultaneous critical incidents — a five-alarm fire in Midtown, a mass casualty event at Grand Central Terminal, and a chemical hazmat spill in Red Hook — are straining emergency response capacity to critical thresholds. Compounding factors include an incoming severe storm system tracking toward Staten Island and structural deterioration on the Queensboro Bridge. AI risk modeling indicates a 73% probability of resource saturation within the next 90 minutes if current deployment patterns are maintained.',
  keyRisks: [
    'Resource depletion: Fire and EMS units at 87% deployment — reserve capacity critically low',
    'Compound incident cascade: Grand Central collapse may trigger secondary structural failures in adjacent Chrysler Building annex',
    'Storm amplification: Tornado warning for Staten Island will redirect 30% of available air assets',
    'Hospital surge: NYU Langone and Bellevue are approaching trauma capacity with 34 confirmed casualties from INC-005',
    'Bridge closure traffic impact: Queensboro Bridge closure has created secondary emergency access routes compromised in 4 districts',
  ],
  recommendations: [
    {
      id: 'REC-001',
      priority: 'immediate',
      action: 'Request mutual aid activation from Nassau and Westchester counties',
      rationale:
        'Current incident load exceeds NYC standalone capacity by 22%. Mutual aid can deliver 40+ additional units within 35 minutes.',
      confidence: 0.94,
      relatedIncidentIds: ['INC-001', 'INC-005'],
    },
    {
      id: 'REC-002',
      priority: 'immediate',
      action: 'Elevate INC-005 (Grand Central) to Level 4 Mass Casualty Incident',
      rationale:
        'Casualty count trajectory and structural instability warrant Level 4 MCI declaration, unlocking federal FEMA Urban Search and Rescue teams.',
      confidence: 0.91,
      relatedIncidentIds: ['INC-005'],
    },
    {
      id: 'REC-003',
      priority: 'urgent',
      action: 'Pre-position water rescue assets along FDR Drive for flood scenario expansion',
      rationale:
        'Storm surge models project water levels exceeding 4ft in Lower Manhattan within 3 hours. Early positioning reduces response time by 18 minutes.',
      confidence: 0.87,
      relatedIncidentIds: ['INC-002', 'INC-007'],
    },
    {
      id: 'REC-004',
      priority: 'urgent',
      action: 'Issue Wireless Emergency Alert for Staten Island tornado shelter-in-place',
      rationale:
        'NWS rotation signature indicates 85% probability of touchdown within 40 minutes. Population density in affected zone: 76,000.',
      confidence: 0.85,
      relatedIncidentIds: ['INC-007'],
    },
    {
      id: 'REC-005',
      priority: 'monitor',
      action: 'Establish secondary EOC at Brooklyn Navy Yard to manage borough surge',
      rationale:
        'Three concurrent Brooklyn incidents may require localized command structure to reduce communication latency.',
      confidence: 0.72,
      relatedIncidentIds: ['INC-003', 'INC-006'],
    },
  ],
  predictedEscalations: [
    'INC-001: Fire likely to spread to 1251 6th Ave (currently unoccupied) within 45 minutes',
    'INC-002: Flooding will reach Zone C residential area in approximately 2.5 hours',
    'INC-007: Tornado touch-down probability increases to 92% after 22:30 local time',
  ],
  modelVersion: 'CityNerve-AI v3.7.2',
};
