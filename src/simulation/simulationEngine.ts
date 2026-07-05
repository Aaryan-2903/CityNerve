import { getScenarioSequence, getStageData } from './simulationUtils';
import type { ScenarioType, StagePayload } from './simulationTypes';

export class SimulationEngine {
  /**
   * Safely returns the next stage string enum given the current scenario and stage.
   */
  static getNextStage(scenario: ScenarioType, currentStage: string): string {
    const sequence = getScenarioSequence(scenario);
    const idx = sequence.indexOf(currentStage);
    
    if (idx >= 0 && idx < sequence.length - 1) {
      return sequence[idx + 1];
    }
    return currentStage;
  }

  /**
   * Safely returns the previous stage string enum.
   */
  static getPreviousStage(scenario: ScenarioType, currentStage: string): string {
    const sequence = getScenarioSequence(scenario);
    const idx = sequence.indexOf(currentStage);
    
    if (idx > 0) {
      return sequence[idx - 1];
    }
    return currentStage;
  }

  /**
   * Returns the duration for a specific stage.
   */
  static getStageDuration(scenario: ScenarioType, stage: string): number {
    const data = getStageData(scenario, stage);
    return data.durationMs;
  }

  /**
   * Returns the complete payload for a specific stage.
   */
  static getPayload(scenario: ScenarioType, stage: string): StagePayload {
    return getStageData(scenario, stage);
  }
}
