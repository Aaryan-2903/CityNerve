import { FLOOD_SCENARIO_DATA } from './simulationData';
import { FloodStage, FLOOD_STAGE_SEQUENCE } from './simulationStages';
import type { StagePayload, ScenarioType } from './simulationTypes';

/**
 * Validates whether a given index is within the bounds of the sequence.
 */
export function isValidStageIndex(index: number, sequenceLength: number): boolean {
  return index >= 0 && index < sequenceLength;
}

/**
 * Retrieves the mock payload for a specific scenario and stage.
 * Currently only supports FLOOD scenario.
 */
export function getStageData(scenario: ScenarioType, stageEnum: string): StagePayload {
  if (scenario === 'FLOOD') {
    return FLOOD_SCENARIO_DATA[stageEnum as FloodStage];
  }
  
  // Fallback for unimplemented scenarios
  throw new Error(`Scenario ${scenario} not yet implemented.`);
}

/**
 * Returns the sequence array for a given scenario.
 */
export function getScenarioSequence(scenario: ScenarioType): string[] {
  if (scenario === 'FLOOD') {
    return [...FLOOD_STAGE_SEQUENCE];
  }
  
  throw new Error(`Scenario ${scenario} not yet implemented.`);
}
