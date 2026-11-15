/**
 * Outpost Zero - Mission Evaluation & Score Engine
 * Determines victory conditions, failure states, and Sol 30 performance rating.
 */

export const MISSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  SUCCESS: 'victory',
  PARTIAL: 'partial',
  FAILURE: 'failure',
};

/**
 * Checks if a game-ending condition has been reached.
 * @param {Object} state - Current game state
 * @returns {Object|null} Failure details or null if survival continues
 */
export function checkFailureConditions(state) {
  const { resources, currentSol } = state;

  if (resources.oxygen.current <= 0) {
    return {
      status: MISSION_STATUS.FAILURE,
      title: 'Catastrophic Asphyxiation',
      reason: 'Atmospheric oxygen depleted to zero. Closed-loop life support failed to sustain crew respiration.',
      sol: currentSol,
    };
  }

  if (resources.water.current <= 0) {
    return {
      status: MISSION_STATUS.FAILURE,
      title: 'Water Reserves Exhausted',
      reason: 'Potable water stores reached zero. Dehydration and thermal loop shutdown occurred.',
      sol: currentSol,
    };
  }

  if (resources.food.current <= 0) {
    return {
      status: MISSION_STATUS.FAILURE,
      title: 'Severe Caloric Starvation',
      reason: 'Food rations depleted. Hydroponics was unable to meet emergency caloric requirements.',
      sol: currentSol,
    };
  }

  if (resources.energy.current <= 0) {
    return {
      status: MISSION_STATUS.FAILURE,
      title: 'Total Habitat Blackout',
      reason: 'Electrical storage fully drained. In freezing Martian temperatures (-78°C), life support stopped.',
      sol: currentSol,
    };
  }

  if (resources.radiation.cumulativeCrewDose >= resources.radiation.maxCareerLimit) {
    return {
      status: MISSION_STATUS.FAILURE,
      title: 'Lethal Radiation Exposure',
      reason: 'Cumulative crew radiation dosage exceeded the NASA 600 mSv career limit due to insufficient shelter utilization during solar particle events.',
      sol: currentSol,
    };
  }

  if (resources.crew.health <= 0) {
    return {
      status: MISSION_STATUS.FAILURE,
      title: 'Crew Incapacitation',
      reason: 'Crew physiological health dropped to zero under prolonged hazardous environmental stressors.',
      sol: currentSol,
    };
  }

  return null;
}

/**
 * Evaluates the final outcome when Sol 30 is completed.
 * @param {Object} state - Game state on Sol 30
 * @returns {Object} Mission debrief & score
 */
export function evaluateFinalMissionScore(state) {
  const failure = checkFailureConditions(state);
  if (failure) return failure;

  const { resources, moduleHealth } = state;
  const crewHealth = resources.crew.health;
  const crewMorale = resources.crew.morale;

  // Calculate average module health
  const healthValues = Object.values(moduleHealth);
  const avgModuleHealth = Math.round(healthValues.reduce((a, b) => a + b, 0) / healthValues.length);

  // Score calculation out of 100
  let score = 0;
  score += (crewHealth * 0.35); // 35 pts
  score += (crewMorale * 0.20); // 20 pts
  score += (avgModuleHealth * 0.25); // 25 pts
  score += Math.min(20, (resources.spareParts.current * 1.5) + 10); // 20 pts for resource reserves

  score = Math.min(100, Math.round(score));

  if (crewHealth >= 75 && avgModuleHealth >= 70 && score >= 75) {
    return {
      status: MISSION_STATUS.SUCCESS,
      title: 'Mission Success: First Permanent Martian Pioneers',
      reason: 'Outpost Zero completed its 30-Sol primary mission in exemplary operational condition. The habitat is validated for the incoming expedition crew.',
      score,
      grade: 'Distinguished Command',
    };
  } else {
    return {
      status: MISSION_STATUS.PARTIAL,
      title: 'Partial Success: Mission Survived With Compromised Systems',
      reason: 'The outpost endured 30 Sols, but experienced severe subsystem fatigue or crew health degradation. Immediate Earth supply resupply is required.',
      score,
      grade: 'Nominal Survival',
    };
  }
}
