/**
 * Outpost Zero - Radiation Telemetry & Analysis Service
 * Bridges historical Curiosity RAD data with the live simulator engine.
 */

import { 
  CURIOSITY_HISTORICAL_RAD_DATA, 
  SHIELDING_COMPARISON_DATA, 
  RADIATION_GLOSSARY 
} from '../data/demoRadiationData';

/**
 * Returns historical Gale Crater Curiosity measurements vs. current simulated telemetry.
 * @param {number} currentSol - The current Sol of the simulator
 * @param {Object} currentRadiationState - The live radiation telemetry from gameState
 */
export function getComparativeRadiationData(currentSol, currentRadiationState) {
  return CURIOSITY_HISTORICAL_RAD_DATA.map(item => {
    // If this Sol has already been simulated or is current, use active simulated values
    const isPastOrPresent = item.sol <= currentSol;
    return {
      ...item,
      isSimulated: isPastOrPresent,
      simulatedSurface: isPastOrPresent ? item.simulatedSurface_uSv_h : null,
      shelteredBunker: isPastOrPresent ? item.shelteredBunker_uSv_h : null,
    };
  });
}

/**
 * Generates the cumulative crew dose projection up to Sol 30.
 * @param {number} currentSol
 * @param {number} currentCumulativeDose
 * @param {boolean} isSheltered
 */
export function getCumulativeDoseProjection(currentSol, currentCumulativeDose, isSheltered) {
  const result = [];
  let runningDose = 0.52; // Sol 1 baseline

  for (let sol = 1; sol <= 30; sol++) {
    if (sol <= currentSol) {
      // Historical progression up to current sol
      const dailyAddition = isSheltered ? 0.005 : 0.018;
      runningDose += dailyAddition;
      result.push({
        sol,
        actualCumulativeDose: +(runningDose).toFixed(3),
        projectedSafeLimit: +(sol * 0.035).toFixed(3), // Nominal safe operational curve
        careerThreshold: 600.0,
      });
    } else {
      // Projected future sols
      const projectedAddition = isSheltered ? 0.005 : 0.018;
      runningDose += projectedAddition;
      result.push({
        sol,
        actualCumulativeDose: null,
        projectedCumulativeDose: +(runningDose).toFixed(3),
        projectedSafeLimit: +(sol * 0.035).toFixed(3),
        careerThreshold: 600.0,
      });
    }
  }

  return result;
}

/**
 * Returns EVA authorization recommendation based on current space weather.
 */
export function getEvaRecommendation(spaceWeatherLevel) {
  switch (spaceWeatherLevel) {
    case 'SEVERE':
      return {
        status: 'prohibited',
        badgeColor: 'bg-red-950 text-red-400 border-red-800',
        title: 'EVA STRICTLY PROHIBITED',
        details: 'Intense proton flux detected. Surface EVA carries immediate acute radiation sickness hazard. All personnel must remain in fortified shelter.',
      };
    case 'WARNING':
      return {
        status: 'restricted',
        badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
        title: 'EVA STRONGLY RESTRICTED',
        details: 'Elevated space weather conditions. Unshielded surface operations capped at 60 minutes for emergency maintenance only.',
      };
    case 'WATCH':
      return {
        status: 'caution',
        badgeColor: 'bg-yellow-950 text-yellow-400 border-yellow-800',
        title: 'EVA CAUTION ADVISED',
        details: 'Space weather watch in effect. Crew must remain within 10-minute ingress range of habitat airlock.',
      };
    case 'NORMAL':
    default:
      return {
        status: 'permitted',
        badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
        title: 'EVA PERMITTED (NOMINAL)',
        details: 'Background GCR levels within acceptable limits (~21 μSv/h). Standard surface EVA authorized with personal dosimeters.',
      };
  }
}

export {
  SHIELDING_COMPARISON_DATA,
  RADIATION_GLOSSARY,
};
