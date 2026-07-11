import { AIPriority, AIRecommendation } from '@/context/AIDecisionContext';

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
  deployedUnits: number;
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
      if (state.weatherLabel.toLowerCase().includes('storm') || state.weatherLabel.toLowerCase().includes('rain')) {
        return {
          id: 'rec-weather-storm',
          title: 'Deploy Flood Barriers',
          recommendation: 'Dispatch units to setup temporary flood barriers in low-lying zones.',
          confidence: 88,
          reasoning: [`Weather conditions: ${state.weatherLabel}`, 'Expected drainage system overflow'],
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
      if (state.windSpeed > 60) {
        return {
          id: 'rec-weather-wind',
          title: 'Alert Utility Services',
          recommendation: 'High winds detected. Dispatch utility teams to secure power lines and infrastructure.',
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
      if (state.humidity > 85) {
        return {
          id: 'rec-weather-humidity',
          title: 'Increase Medical Preparedness',
          recommendation: 'Very high humidity detected. Prepare for increased heat-related and respiratory emergencies.',
          confidence: 80,
          reasoning: [`Humidity extremely high: ${state.humidity}%`, 'Aggravates heat and respiratory conditions'],
          priority: 'Medium',
          status: 'Pending'
        };
      }
      return null;
    }
  },
  {
    id: 'rule-weather-norain-flood',
    evaluate: (state) => {
      if (state.rainfall < 1 && state.riskScore > 50) {
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
