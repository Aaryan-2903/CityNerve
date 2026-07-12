import { AIPriority, AIRecommendation } from '@/context/AIDecisionContext';
import { EmergencyResourcesData } from '@/context/ResourceContext';
import { AIStageConfig, AI_COMMANDER_CONFIG } from '@/data/aiCommanderConfig';
import { ThreatLevel } from '@/data/simulationScenario';

export interface SystemState {
  riskScore: number;
  activeIncidents: number;
  roadsClosed: number;
  hospitalCapacityPercent: number;
  shelterAvailabilityPercent: number;
  weatherLabel: string;
  rainfall: number;
  windSpeed: number;
  humidity: number;
  temperature: number;
  deployedUnits: number;
  resources: EmergencyResourcesData | null;
}

export interface Rule {
  id: string;
  evaluate: (state: SystemState) => AIRecommendation | null;
}

const PRIORITY_WEIGHT: Record<AIPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

export const defaultRules: Rule[] = [
  {
    id: 'rule-high-risk',
    evaluate: (state) => {
      if (state.riskScore > 80) {
        return {
          id: 'rec-high-risk',
          title: 'Immediate Evacuation Prep',
          recommendation: 'Alert emergency shelters and prepare primary evacuation routes.',
          confidence: 94,
          reasoning: [`Risk score critically high (${state.riskScore.toFixed(0)})`, `Multiple active incidents: ${state.activeIncidents}`],
          priority: 'Critical',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-storm',
    evaluate: (state) => {
      if (state.weatherLabel.toLowerCase().includes('storm') || state.weatherLabel.toLowerCase().includes('thunder')) {
        return {
          id: 'rec-weather-storm',
          title: 'Rescue Standby & Hospital Alert',
          recommendation: 'Severe thunderstorm warning. Dispatch units to standby and alert hospitals for potential lightning and wind injuries.',
          confidence: 88,
          reasoning: [`Weather conditions: ${state.weatherLabel}`, 'Risk of sudden severe incidents'],
          priority: 'High',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-rain-evac',
    evaluate: (state) => {
      if (state.rainfall > 40) {
        return {
          id: 'rec-weather-rain-evac',
          title: 'Recommend Evacuation Readiness',
          recommendation: 'Extreme rainfall detected. Issue evacuation standby orders for low-lying sectors.',
          confidence: 95,
          reasoning: [`Rainfall rate critical: ${state.rainfall} mm/hr`, 'Flood threshold exceeded'],
          priority: 'Critical',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-wind',
    evaluate: (state) => {
      if (state.windSpeed > 50) {
        return {
          id: 'rec-weather-wind',
          title: 'Utility & Tree Fall Warning',
          recommendation: 'High winds detected. Dispatch utility teams to monitor power lines and tree falls.',
          confidence: 88,
          reasoning: [`Wind speed hazardous: ${state.windSpeed} km/h`, 'Risk of power grid disruption'],
          priority: 'High',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-humidity',
    evaluate: (state) => {
      if (state.humidity > 90) {
        return {
          id: 'rec-weather-humidity',
          title: 'Drainage Overflow Warning',
          recommendation: 'Extremely high humidity and moisture saturation. Prepare for drainage overflow.',
          confidence: 80,
          reasoning: [`Humidity critically high: ${state.humidity}%`, 'Ground saturation likely'],
          priority: 'Medium',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-temp',
    evaluate: (state) => {
      if (state.temperature > 40) {
        return {
          id: 'rec-weather-temp',
          title: 'Heat Emergency Response',
          recommendation: 'Extreme heat detected. Open cooling centers and issue heat warnings.',
          confidence: 90,
          reasoning: [`Temperature dangerously high: ${state.temperature}°C`, 'Risk of heat stroke'],
          priority: 'High',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-norain-flood',
    evaluate: (state) => {
      if (state.rainfall < 1 && state.riskScore > 50 && !state.weatherLabel.toLowerCase().includes('storm')) {
        return {
          id: 'rec-weather-norain-flood',
          title: 'Downgrade Flood Priority',
          recommendation: 'No significant rainfall detected. Reallocate flood resources to other critical areas.',
          confidence: 75,
          reasoning: [`Rainfall minimal: ${state.rainfall} mm/hr`, 'Flood risk naturally receding'],
          priority: 'Low',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-hospitals',
    evaluate: (state) => {
      if (state.hospitalCapacityPercent < 30) {
        return {
          id: 'rec-hospitals',
          title: 'Activate Regional Medical Support',
          recommendation: 'Hospitals near capacity. Route new patients to neighboring districts.',
          confidence: 91,
          reasoning: [`Hospital capacity low (${state.hospitalCapacityPercent.toFixed(0)}% available)`, 'Surge protocols needed'],
          priority: 'High',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-roads',
    evaluate: (state) => {
      if (state.roadsClosed > 5) {
        return {
          id: 'rec-roads',
          title: 'Reroute Logistics',
          recommendation: 'Update emergency vehicle navigation systems to avoid compromised routes.',
          confidence: 85,
          reasoning: [`${state.roadsClosed} major roads closed`, 'Supply lines potentially affected'],
          priority: 'Medium',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-incidents',
    evaluate: (state) => {
      if (state.activeIncidents > 3 && state.deployedUnits < state.activeIncidents * 2) {
        return {
          id: 'rec-incidents',
          title: 'Mobilize Reserves',
          recommendation: 'Deploy reserve personnel to handle increasing incident volume.',
          confidence: 78,
          reasoning: [`High incident count (${state.activeIncidents}) vs active units (${state.deployedUnits})`],
          priority: 'Medium',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-shelters',
    evaluate: (state) => {
      if (state.shelterAvailabilityPercent < 20) {
        return {
          id: 'rec-shelters',
          title: 'Open Secondary Shelters',
          recommendation: 'Primary emergency shelters are nearing maximum capacity.',
          confidence: 82,
          reasoning: [`Shelter availability critically low (${state.shelterAvailabilityPercent.toFixed(0)}%)`],
          priority: 'High',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-low-ambulances',
    evaluate: (state) => {
      const ambulances = state.resources?.ambulance;
      if (ambulances && ambulances.available < 5) {
        return {
          id: 'rec-low-ambulances',
          title: 'Critical Ambulance Shortage',
          recommendation: 'Available ambulances critically low. Request private ambulance network support and increase ETA expectations.',
          confidence: 90,
          reasoning: [`Only ${ambulances.available} ambulances available`, 'Medical response capacity compromised'],
          priority: 'Critical',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-busy-rescue',
    evaluate: (state) => {
      const rescue = state.resources?.rescue;
      if (rescue && (rescue.busy > 8 || rescue.available === 0)) {
        return {
          id: 'rec-busy-rescue',
          title: 'Rescue Teams Exhausted',
          recommendation: 'Rescue teams are currently overwhelmed. Recommend requesting nearby city assistance (Mutual Aid).',
          confidence: 85,
          reasoning: [`${rescue.busy} rescue teams busy; ${rescue.available} available`, 'Severe lack of specialized rescue personnel'],
          priority: 'High',
          status: 'Pending'
        };
      }
      return null;
    }
  }
];

export function generateRecommendations(state: SystemState): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  for (const rule of defaultRules) {
    const result = rule.evaluate(state);
    if (result) {
      recommendations.push(result);
    }
  }
  
  // Sort by priority (Critical > High > Medium > Low)
  recommendations.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  
  // Ensure we always have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-default',
      title: 'Maintain Standard Operations',
      recommendation: 'Continue monitoring the situation as conditions evolve.',
      confidence: 70,
      reasoning: ['Conditions do not trigger specific alerts', 'Situation stable but developing'],
      priority: 'Low',
      status: 'Pending'
    });
  }
  
  return recommendations;
}

export function generateDynamicStageConfig(state: SystemState, phase: number): AIStageConfig {
  const baseConfig = AI_COMMANDER_CONFIG[phase] || AI_COMMANDER_CONFIG[0];
  
  // Risk calculation
  let weatherRisk = 0;
  
  if (state.rainfall > 40) weatherRisk += 30; // HIGH Flood Risk
  else if (state.rainfall > 10) weatherRisk += 10;
  
  if (state.windSpeed > 50) weatherRisk += 20; // HIGH Infrastructure / Power Risk
  
  if (state.temperature > 40) weatherRisk += 25; // Medical Risk
  
  if (state.humidity > 90) weatherRisk += 10;
  
  const labelLower = state.weatherLabel.toLowerCase();
  if (labelLower.includes('storm') || labelLower.includes('thunder')) weatherRisk += 25;

  const totalRiskScore = Math.min(100, baseConfig.riskScore + weatherRisk);
  
  // Threat Level Generation
  let dynamicThreatLevel: ThreatLevel = 'LOW';
  if (totalRiskScore > 90) dynamicThreatLevel = 'CRITICAL';
  else if (totalRiskScore > 70) dynamicThreatLevel = 'HIGH';
  else if (totalRiskScore > 40) dynamicThreatLevel = 'MODERATE';
  
  // Update state with dynamic risk score for rule evaluation
  const dynamicState = {
    ...state,
    riskScore: totalRiskScore
  };

  const dynamicRecs = generateRecommendations(dynamicState);
  
  // Filter out the default recommendation if we have other recommendations
  let finalRecs = [...baseConfig.recommendations, ...dynamicRecs];
  const hasSpecificRecs = finalRecs.some(r => r.id !== 'rec-default');
  if (hasSpecificRecs) {
    finalRecs = finalRecs.filter(r => r.id !== 'rec-default');
  }

  // Deduplicate recommendations by id
  const uniqueRecsMap = new Map();
  finalRecs.forEach(rec => uniqueRecsMap.set(rec.id, rec));
  const uniqueRecommendations = Array.from(uniqueRecsMap.values());
  
  // Convert AIRecommendation to StageRecommendation
  const stageRecommendations = uniqueRecommendations.map(r => ({
    id: r.id,
    title: r.title,
    recommendation: r.recommendation,
    reasoning: r.reasoning,
    priority: r.priority
  }));

  // Dynamic priority based on Threat Level
  let dynamicPriority: AIPriority = 'Low';
  if (dynamicThreatLevel === 'CRITICAL') dynamicPriority = 'Critical';
  else if (dynamicThreatLevel === 'HIGH') dynamicPriority = 'High';
  else if (dynamicThreatLevel === 'MODERATE') dynamicPriority = 'Medium';

  // Dynamic Situation Summary
  let dynamicSummary = baseConfig.situationSummary;
  if (weatherRisk > 20) {
    dynamicSummary = `Severe weather conditions detected (${state.weatherLabel}, ${state.temperature}°C). ${dynamicSummary}`;
  } else if (state.rainfall > 0) {
    dynamicSummary = `Ongoing precipitation (${state.rainfall}mm). ${dynamicSummary}`;
  }

  // Resource Allocation adjustments
  const resources = { ...baseConfig.resources };
  if (state.rainfall > 40) resources.Rescue += 10;
  if (state.windSpeed > 50) resources.Engineering += 15;
  if (labelLower.includes('storm')) {
    resources.Rescue += 5;
    resources.Medical += 10;
  }
  if (state.temperature > 40) resources.Medical += 15;

  let dynamicResponseTime = baseConfig.estimatedResponseTime;
  if (state.resources?.ambulance && state.resources.ambulance.available < 5) {
    dynamicResponseTime = '28m (Delayed)';
  }

  return {
    threatLevel: dynamicThreatLevel,
    situationSummary: dynamicSummary,
    riskScore: totalRiskScore,
    confidence: Math.max(70, baseConfig.confidence - (weatherRisk > 0 ? 5 : 0)),
    priority: dynamicPriority,
    recommendations: stageRecommendations,
    resources,
    estimatedResponseTime: dynamicResponseTime,
  };
}
