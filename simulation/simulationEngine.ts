import { SimulationStage, STAGE_SEQUENCE } from './simulationStages';
import { STAGE_CONFIG } from './simulationData';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';

export class SimulationEngine {
  /**
   * Retrieves the next stage in the sequence.
   * If the current stage is the last one, it returns the current stage.
   */
  static getNextStage(current: SimulationStage): SimulationStage {
    const idx = STAGE_SEQUENCE.indexOf(current);
    if (idx >= 0 && idx < STAGE_SEQUENCE.length - 1) {
      return STAGE_SEQUENCE[idx + 1];
    }
    return current;
  }

  /**
   * Retrieves the previous stage in the sequence.
   * If the current stage is the first one, it returns the current stage.
   */
  static getPreviousStage(current: SimulationStage): SimulationStage {
    const idx = STAGE_SEQUENCE.indexOf(current);
    if (idx > 0) {
      return STAGE_SEQUENCE[idx - 1];
    }
    return current;
  }

  /**
   * Returns the simulated duration for a given stage in milliseconds.
   */
  static getStageDuration(stage: SimulationStage): number {
    return STAGE_CONFIG[stage].durationMs;
  }
}
