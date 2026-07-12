import { AIPriority } from '@/context/AIDecisionContext';
import { ThreatLevel } from '@/data/simulationScenario';

export interface StageResources {
  Police: number;
  Fire: number;
  Medical: number;
  Rescue: number;
  Engineering: number;
}

export interface StageRecommendation {
  id: string;
  title: string;
  recommendation: string;
  reasoning: string[];
  priority: AIPriority;
}

export interface AIStageConfig {
  threatLevel: ThreatLevel;
  situationSummary: string;
  riskScore: number;
  confidence: number;
  priority: AIPriority;
  recommendations: StageRecommendation[];
  resources: StageResources;
  estimatedResponseTime: string;
}

export const AI_COMMANDER_CONFIG: Record<number, AIStageConfig> = {
  0: {
    threatLevel: 'LOW',
    situationSummary: 'All systems nominal. Standard monitoring protocols active.',
    riskScore: 12,
    confidence: 98,
    priority: 'Low',
    estimatedResponseTime: 'N/A',
    resources: { Police: 10, Fire: 5, Medical: 5, Rescue: 0, Engineering: 2 },
    recommendations: [
      {
        id: 'rec-0-1',
        title: 'Maintain Standard Operations',
        recommendation: 'Continue monitoring the situation as conditions evolve.',
        reasoning: ['Conditions do not trigger specific alerts', 'Situation stable'],
        priority: 'Low'
      }
    ]
  },
  1: {
    threatLevel: 'LOW',
    situationSummary: 'Heavy rainfall detected across the region. Monitoring low-lying areas.',
    riskScore: 35,
    confidence: 94,
    priority: 'Medium',
    estimatedResponseTime: '15 mins',
    resources: { Police: 15, Fire: 8, Medical: 6, Rescue: 2, Engineering: 5 },
    recommendations: [
      {
        id: 'rec-1-1',
        title: 'Deploy Flood Barriers',
        recommendation: 'Dispatch units to setup temporary flood barriers in low-lying zones.',
        reasoning: ['Rainfall rate increasing', 'Expected drainage system overflow'],
        priority: 'Medium'
      }
    ]
  },
  2: {
    threatLevel: 'MODERATE',
    situationSummary: 'Incoming reports of localized flooding from civilians.',
    riskScore: 55,
    confidence: 89,
    priority: 'Medium',
    estimatedResponseTime: '12 mins',
    resources: { Police: 20, Fire: 12, Medical: 8, Rescue: 5, Engineering: 10 },
    recommendations: [
      {
        id: 'rec-2-1',
        title: 'Alert Utility Services',
        recommendation: 'Dispatch utility teams to secure power lines and infrastructure.',
        reasoning: ['Risk of power grid disruption', 'Water accumulation near substations'],
        priority: 'High'
      }
    ]
  },
  3: {
    threatLevel: 'HIGH',
    situationSummary: 'Official flood warning issued. Water levels rising rapidly.',
    riskScore: 78,
    confidence: 92,
    priority: 'High',
    estimatedResponseTime: '8 mins',
    resources: { Police: 35, Fire: 25, Medical: 15, Rescue: 12, Engineering: 15 },
    recommendations: [
      {
        id: 'rec-3-1',
        title: 'Recommend Evacuation Readiness',
        recommendation: 'Issue evacuation standby orders for coastal and low-lying sectors.',
        reasoning: ['Flood threshold exceeded', 'Rapid water level rise detected'],
        priority: 'Critical'
      },
      {
        id: 'rec-3-2',
        title: 'Activate Regional Medical Support',
        recommendation: 'Hospitals nearing capacity. Route new patients to neighboring districts.',
        reasoning: ['Hospital capacity low', 'Surge protocols needed'],
        priority: 'High'
      }
    ]
  },
  4: {
    threatLevel: 'HIGH',
    situationSummary: 'Major arterial routes closed due to dangerous water levels.',
    riskScore: 85,
    confidence: 96,
    priority: 'High',
    estimatedResponseTime: '5 mins',
    resources: { Police: 45, Fire: 30, Medical: 20, Rescue: 18, Engineering: 25 },
    recommendations: [
      {
        id: 'rec-4-1',
        title: 'Reroute Logistics',
        recommendation: 'Update emergency vehicle navigation systems to avoid compromised routes.',
        reasoning: ['Multiple major roads closed', 'Supply lines potentially affected'],
        priority: 'Critical'
      }
    ]
  },
  5: {
    threatLevel: 'CRITICAL',
    situationSummary: 'Emergency shelters opened for evacuation.',
    riskScore: 92,
    confidence: 91,
    priority: 'Critical',
    estimatedResponseTime: '3 mins',
    resources: { Police: 60, Fire: 45, Medical: 35, Rescue: 30, Engineering: 35 },
    recommendations: [
      {
        id: 'rec-5-1',
        title: 'Open Secondary Shelters',
        recommendation: 'Primary emergency shelters are nearing maximum capacity.',
        reasoning: ['Shelter availability critically low', 'Evacuation volume high'],
        priority: 'Critical'
      }
    ]
  },
  6: {
    threatLevel: 'CRITICAL',
    situationSummary: 'First responders and rescue teams deployed to critical zones.',
    riskScore: 98,
    confidence: 88,
    priority: 'Critical',
    estimatedResponseTime: '2 mins',
    resources: { Police: 80, Fire: 70, Medical: 60, Rescue: 65, Engineering: 50 },
    recommendations: [
      {
        id: 'rec-6-1',
        title: 'Mobilize Reserves',
        recommendation: 'Deploy reserve personnel to handle increasing incident volume.',
        reasoning: ['High incident count vs active units', 'Rescue operations widespread'],
        priority: 'Critical'
      }
    ]
  },
  7: {
    threatLevel: 'MODERATE',
    situationSummary: 'Water receding, recovery and cleanup phase initiated.',
    riskScore: 45,
    confidence: 95,
    priority: 'Medium',
    estimatedResponseTime: '20 mins',
    resources: { Police: 30, Fire: 20, Medical: 15, Rescue: 5, Engineering: 60 },
    recommendations: [
      {
        id: 'rec-7-1',
        title: 'Downgrade Flood Priority',
        recommendation: 'Reallocate flood resources to cleanup and infrastructure repair.',
        reasoning: ['Flood risk naturally receding', 'Cleanup operations require engineering support'],
        priority: 'Medium'
      }
    ]
  },
  8: {
    threatLevel: 'LOW',
    situationSummary: 'Simulation finished. Systems returning to normal.',
    riskScore: 10,
    confidence: 99,
    priority: 'Low',
    estimatedResponseTime: 'N/A',
    resources: { Police: 10, Fire: 5, Medical: 5, Rescue: 0, Engineering: 10 },
    recommendations: [
      {
        id: 'rec-8-1',
        title: 'End Emergency Protocols',
        recommendation: 'Stand down emergency response units and resume standard operations.',
        reasoning: ['Simulation complete', 'No active threats detected'],
        priority: 'Low'
      }
    ]
  }
};
