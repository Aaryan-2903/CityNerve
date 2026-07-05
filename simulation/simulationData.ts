import { SimulationStage } from './simulationStages';

export interface StageData {
  id: SimulationStage;
  name: string;
  durationMs: number;
  description: string;
}

export const STAGE_CONFIG: Record<SimulationStage, StageData> = {
  [SimulationStage.NORMAL]: { 
    id: SimulationStage.NORMAL, 
    name: 'Normal', 
    durationMs: 3000, 
    description: 'Systems nominal. No active threats.' 
  },
  [SimulationStage.RAIN_BEGINS]: { 
    id: SimulationStage.RAIN_BEGINS, 
    name: 'Rain Begins', 
    durationMs: 4000, 
    description: 'Heavy rainfall detected across the region.' 
  },
  [SimulationStage.CITIZEN_REPORTS]: { 
    id: SimulationStage.CITIZEN_REPORTS, 
    name: 'Citizen Reports', 
    durationMs: 4000, 
    description: 'Incoming reports of localized flooding from civilians.' 
  },
  [SimulationStage.FLOOD_WARNING]: { 
    id: SimulationStage.FLOOD_WARNING, 
    name: 'Flood Warning', 
    durationMs: 4000, 
    description: 'Official flood warning issued by meteorology department.' 
  },
  [SimulationStage.ROAD_CLOSURE]: { 
    id: SimulationStage.ROAD_CLOSURE, 
    name: 'Road Closure', 
    durationMs: 4000, 
    description: 'Major arterial routes closed due to dangerous water levels.' 
  },
  [SimulationStage.SHELTER_ACTIVATED]: { 
    id: SimulationStage.SHELTER_ACTIVATED, 
    name: 'Shelter Activated', 
    durationMs: 4000, 
    description: 'Emergency shelters opened for evacuation.' 
  },
  [SimulationStage.RESCUE_DEPLOYMENT]: { 
    id: SimulationStage.RESCUE_DEPLOYMENT, 
    name: 'Rescue Deployment', 
    durationMs: 5000, 
    description: 'First responders and rescue teams deployed to critical zones.' 
  },
  [SimulationStage.RECOVERY]: { 
    id: SimulationStage.RECOVERY, 
    name: 'Recovery', 
    durationMs: 4000, 
    description: 'Water receding, recovery and cleanup phase initiated.' 
  },
  [SimulationStage.COMPLETED]: { 
    id: SimulationStage.COMPLETED, 
    name: 'Completed', 
    durationMs: 0, 
    description: 'Simulation finished.' 
  }
};
