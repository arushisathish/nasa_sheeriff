/**
 * Outpost Zero - Event Generation & Multi-Sol Weather Engine
 * Evaluates Sol timeline, module vulnerability, and dynamic weather cycles.
 */

import { CORE_EVENTS_CATALOG, EVENT_IDS } from '../data/events.js';
import { MODULE_IDS } from '../data/modulesConfig.js';

// Planned event roadmap ensuring all 8 core events are encountered realistically
const SOL_SCHEDULED_EVENTS = {
  4: EVENT_IDS.EQUIPMENT_MALFUNCTION,
  7: EVENT_IDS.GREENHOUSE_PROBLEM,
  10: EVENT_IDS.SPACE_WEATHER_ALERT,
  11: EVENT_IDS.SOLAR_FLARE,
  15: EVENT_IDS.DUST_STORM,
  19: EVENT_IDS.WATER_SHORTAGE,
  23: EVENT_IDS.ENERGY_SHORTAGE,
  26: EVENT_IDS.ELEVATED_RADIATION,
};

/**
 * Updates dynamic Martian weather & space-weather cycles as Sols progress (1 to 30).
 * Stages: incoming -> active -> clearing -> nominal.
 * Ensures Dust Storms, Solar Flares, and Elevated Radiation come and go with
 * authentic multi-sol durations (1–3 Sols) and scientific telemetry values.
 */
export function updateSolWeatherCycle(state) {
  const sol = state.currentSol;
  if (!state.environment) return;

  // Initialize weatherCycle structure if not present
  if (!state.environment.weatherCycle) {
    state.environment.weatherCycle = {
      activeType: null,
      phase: 'nominal',
      solsRemaining: 0,
      headline: 'Nominal Clear Skies (Tau 0.45)',
    };
  }

  const cycle = state.environment.weatherCycle;

  // 1. Sol 10 - 13: Solar Super-Flare Cycle (DONKI Alert -> X8.2 Flare -> Dissipation)
  if (sol === 10) {
    cycle.activeType = 'solar_flare';
    cycle.phase = 'incoming';
    cycle.solsRemaining = 1;
    cycle.headline = 'NASA DONKI Alert: Fast Coronal Mass Ejection Inbound';
    state.environment.solarActivity = 'M-Class Active';
    state.resources.radiation.spaceWeatherLevel = 'WATCH';
    state.resources.radiation.surfaceDoseRate = 28.5;
    state.resources.radiation.evaStatus = 'permitted';
  } else if (sol === 11 || sol === 12) {
    cycle.activeType = 'solar_flare';
    cycle.phase = 'active';
    cycle.solsRemaining = 13 - sol;
    cycle.headline = 'Class X-Ray Super Flare (X8.2) Active // Extreme Ionizing Flux';
    state.environment.solarActivity = 'X-Class Flare';
    state.resources.radiation.surfaceDoseRate = 185.0; // uSv/h surge
    state.resources.radiation.spaceWeatherLevel = 'SEVERE';
    state.resources.radiation.evaStatus = 'restricted';
  } else if (sol === 13) {
    cycle.activeType = 'solar_flare';
    cycle.phase = 'clearing';
    cycle.solsRemaining = 1;
    cycle.headline = 'Solar Particle Storm Dissipating // Auroral Sky Shimmer Fading';
    state.environment.solarActivity = 'M-Class Active';
    state.resources.radiation.surfaceDoseRate = 35.0;
    state.resources.radiation.spaceWeatherLevel = 'WATCH';
    state.resources.radiation.evaStatus = 'permitted';
  } else if (sol === 14) {
    // 2. Sol 14 - 17: Regional Dust Storm Cycle (Incoming -> Peak Storm -> Settling)
    cycle.activeType = 'dust_storm';
    cycle.phase = 'incoming';
    cycle.solsRemaining = 1;
    cycle.headline = 'Surface Barometer Falling // Regional Dust Haze Approaching (Tau 1.35)';
    state.environment.atmosphericDustTau = 1.35;
    state.environment.solarActivity = 'Quiet';
    state.resources.radiation.spaceWeatherLevel = 'NORMAL';
    state.resources.radiation.surfaceDoseRate = 21.4;
    state.resources.radiation.evaStatus = 'permitted';
  } else if (sol === 15 || sol === 16) {
    cycle.activeType = 'dust_storm';
    cycle.phase = 'active';
    cycle.solsRemaining = 17 - sol;
    cycle.headline = 'Peak Mars Dust Storm (Tau > 2.85) // High Abrasive Winds & Low Insolation';
    state.environment.atmosphericDustTau = 2.85;
    state.environment.solarInsolation = 25;
    state.resources.radiation.evaStatus = 'restricted';
  } else if (sol === 17) {
    cycle.activeType = 'dust_storm';
    cycle.phase = 'clearing';
    cycle.solsRemaining = 1;
    cycle.headline = 'Dust Storm Subsiding // Particulate Settling (Tau 1.15)';
    state.environment.atmosphericDustTau = 1.15;
    state.environment.solarInsolation = 75;
    state.resources.radiation.evaStatus = 'permitted';
  } else if (sol === 25) {
    // 3. Sol 25 - 28: Solar Wind High-Speed Stream & Elevated Radiation
    cycle.activeType = 'elevated_radiation';
    cycle.phase = 'incoming';
    cycle.solsRemaining = 1;
    cycle.headline = 'Geomagnetic Compression Detected // High-Speed Solar Wind Inbound';
    state.resources.radiation.spaceWeatherLevel = 'WATCH';
    state.resources.radiation.surfaceDoseRate = 32.0;
    state.resources.radiation.evaStatus = 'permitted';
  } else if (sol === 26 || sol === 27) {
    cycle.activeType = 'elevated_radiation';
    cycle.phase = 'active';
    cycle.solsRemaining = 28 - sol;
    cycle.headline = 'Elevated Surface Radiation Stream Active (82 μSv/h)';
    state.resources.radiation.surfaceDoseRate = 82.0;
    state.resources.radiation.spaceWeatherLevel = 'WARNING';
    state.resources.radiation.evaStatus = 'restricted';
  } else if (sol === 28) {
    cycle.activeType = 'elevated_radiation';
    cycle.phase = 'clearing';
    cycle.solsRemaining = 1;
    cycle.headline = 'Radiation Flux Decaying Back to Gale Baseline';
    state.resources.radiation.surfaceDoseRate = 25.5;
    state.resources.radiation.spaceWeatherLevel = 'WATCH';
    state.resources.radiation.evaStatus = 'permitted';
  } else {
    // Nominal baseline for all other Sols (e.g., Sols 1-9, 18-24, 29-30)
    cycle.activeType = null;
    cycle.phase = 'nominal';
    cycle.solsRemaining = 0;
    cycle.headline = 'Nominal Martian Atmosphere (Tau 0.45)';
    state.environment.atmosphericDustTau = 0.45;
    state.environment.solarInsolation = 100;
    state.environment.solarActivity = 'Quiet';
    state.resources.radiation.spaceWeatherLevel = 'NORMAL';
    state.resources.radiation.surfaceDoseRate = 21.4;
    state.resources.radiation.evaStatus = 'permitted';
  }
}

/**
 * Checks for scheduled or emergent survival events for the upcoming Sol.
 * @param {Object} state - Current game state
 * @returns {Object|null} Triggered event definition or null
 */
export function checkForSolEvents(state) {
  // First update the background dynamic weather lifecycle
  updateSolWeatherCycle(state);

  const sol = state.currentSol;

  // 1. Check Sol Scheduled Core Events
  const scheduledEventId = SOL_SCHEDULED_EVENTS[sol];
  if (scheduledEventId && CORE_EVENTS_CATALOG[scheduledEventId]) {
    // Check if not already triggered this Sol
    const alreadyTriggered = state.resolvedEvents?.some(e => e.eventId === scheduledEventId && e.sol === sol);
    if (!alreadyTriggered) {
      return {
        ...CORE_EVENTS_CATALOG[scheduledEventId],
        sol,
        instanceId: `${scheduledEventId}_sol_${sol}`,
      };
    }
  }

  // 2. Emergent Health-Based Triggers
  if (state.moduleHealth[MODULE_IDS.WATER_RECYCLING] < 45 && sol > 5) {
    if (!state.resolvedEvents?.some(e => e.eventId === EVENT_IDS.WATER_SHORTAGE && (sol - e.sol < 5))) {
      return {
        ...CORE_EVENTS_CATALOG[EVENT_IDS.WATER_SHORTAGE],
        sol,
        instanceId: `${EVENT_IDS.WATER_SHORTAGE}_sol_${sol}`,
      };
    }
  }

  if (state.moduleHealth[MODULE_IDS.LIFE_SUPPORT] < 45 && sol > 5) {
    if (!state.resolvedEvents?.some(e => e.eventId === EVENT_IDS.EQUIPMENT_MALFUNCTION && (sol - e.sol < 5))) {
      return {
        ...CORE_EVENTS_CATALOG[EVENT_IDS.EQUIPMENT_MALFUNCTION],
        sol,
        instanceId: `${EVENT_IDS.EQUIPMENT_MALFUNCTION}_sol_${sol}`,
      };
    }
  }

  return null;
}
