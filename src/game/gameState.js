/**
 * Outpost Zero - Pure Game State Management
 * Completely decoupled from React UI.
 */

import { INITIAL_RESOURCES } from '../data/initialResources.js';
import { MODULE_IDS, MODULES_CONFIG } from '../data/modulesConfig.js';

export const STORAGE_KEY = 'outpost_zero_nasa_save_v2';

/**
 * Creates a fresh, deep-cloned initial game state for Sol 1.
 */
export function createInitialGameState() {
  const initialModuleHealth = {};
  Object.values(MODULES_CONFIG).forEach(mod => {
    initialModuleHealth[mod.id] = mod.defaultHealth;
  });

  return {
    version: 2,
    currentSol: 1,
    totalSols: 30,
    missionStatus: 'in_progress', // 'in_progress' | 'victory' | 'partial' | 'failure'
    failureReason: null,
    
    // Environmental Conditions
    environment: {
      solarInsolation: 100, // % clear Martian sky
      atmosphericDustTau: 0.45, // Optical depth (tau) - 0.45 is clear, >2 is dust storm
      surfacePressure: 610, // Pa (Martian average ~610 Pa)
      temperatureHigh: -18, // °C
      temperatureLow: -78, // °C
    },

    // Resources & Radiation Profile
    resources: JSON.parse(JSON.stringify(INITIAL_RESOURCES)),

    // Habitat Module Condition (0 to 100%)
    moduleHealth: initialModuleHealth,

    // Subsystem toggles & operational states
    moduleSettings: {
      [MODULE_IDS.GREENHOUSE]: { mode: 'nominal', powerPriority: 'high' },
      [MODULE_IDS.LIFE_SUPPORT]: { mode: 'nominal', powerPriority: 'critical' },
      [MODULE_IDS.WATER_RECYCLING]: { mode: 'nominal', powerPriority: 'high' },
      [MODULE_IDS.POWER_BAY]: { mode: 'nominal', powerPriority: 'critical' },
      [MODULE_IDS.CREW_QUARTERS]: { mode: 'nominal', powerPriority: 'high' },
      [MODULE_IDS.RAD_SHELTER]: { mode: 'standby', powerPriority: 'critical' },
      [MODULE_IDS.SOLAR_ARRAY]: { mode: 'tracking', dustLevel: 8 }, // % dust cover
    },

    // Event & Decision Queue
    activeEvents: [],
    resolvedEvents: [],
    pendingDecisions: [],

    // 4 Named Crew Specialists with dynamic station assignment & NASA perks
    crewMembers: [
      {
        id: 'cmdr',
        name: 'Cmdr. Elena Vance',
        callsign: 'ARES-1',
        role: 'Mission Commander',
        specialty: 'Habitation Operations & Morale',
        assignment: 'command_console',
        perkDescription: '+10% Outpost production & +2 Sol morale stability',
        morale: 98,
        fatigue: 12,
      },
      {
        id: 'medic',
        name: 'Dr. Tariq Al-Mansoor',
        callsign: 'ECLSS-LEAD',
        role: 'Chief Medical & Life Support',
        specialty: 'CO2 Scrubbing & Bio-Medicine',
        assignment: 'life_support',
        perkDescription: '+20% O2 generation & restores +4% crew health/Sol',
        morale: 95,
        fatigue: 15,
      },
      {
        id: 'engineer',
        name: 'Eng. Maya Lin',
        callsign: 'ROVER-TECH',
        role: 'Power & Robotics Specialist',
        specialty: 'Photovoltaics & Mechanical Wear',
        assignment: 'solar_array',
        perkDescription: '-50% dust accumulation rate & +15% solar wattage',
        morale: 96,
        fatigue: 18,
      },
      {
        id: 'botanist',
        name: 'Spec. Marcus Brody',
        callsign: 'VEGGIE-BOT',
        role: 'Hydroponics Botanist',
        specialty: 'Closed-Loop Agriculture',
        assignment: 'hydroponics',
        perkDescription: '+30% crop yield & reduces greenhouse water use by 20%',
        morale: 94,
        fatigue: 14,
      },
    ],

    // Planetary Surface Exploration & Science Catalog
    exploration: {
      iceHarvestCount: 0,
      lastIceHarvestSol: 0,
      collectedGeoCores: 0,
      analyzedGeoCores: 0,
      weatherBeaconsActive: 1, // Start with 1, can deploy 2nd at crater rim
      scavengedWreck: false,
    },

    // Historical Logs per Sol for Daily Reports
    dailyLogs: [
      {
        sol: 1,
        summary: 'Mission initiated at Chryse Planitia landing site. All primary modules pressurized and life support nominal.',
        deltas: {
          oxygen: +4.2,
          water: +6.0,
          energy: +15.5,
          food: +2.1,
          spareParts: 0,
          radiationCrewDose: 0.018,
        },
        crewStatus: 'Crew morale high. Initial habitation protocols underway.',
        environmentalNotes: 'Clear skies. Optical depth tau = 0.45. Radiation background stable.',
      }
    ],

    // Notification Alerts for UI Banner
    alerts: [
      {
        id: 'initial_briefing',
        sol: 1,
        type: 'info',
        title: 'Outpost Zero Operational',
        description: 'Habitat systems energized. 30-Sol survival directive commenced.',
        resolved: true,
      }
    ],
  };
}

/**
 * Loads saved state from localStorage or falls back to a fresh state.
 * Safely merges defaults to ensure missing/corrupted fields never cause NaN or crashes.
 */
export function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialGameState();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 2 && parsed.currentSol >= 1) {
      const initial = createInitialGameState();
      return {
        ...initial,
        ...parsed,
        environment: {
          ...initial.environment,
          ...(parsed.environment || {}),
        },
        resources: {
          ...initial.resources,
          ...(parsed.resources || {}),
          oxygen: { ...initial.resources.oxygen, ...(parsed.resources?.oxygen || {}) },
          water: { ...initial.resources.water, ...(parsed.resources?.water || {}) },
          energy: { ...initial.resources.energy, ...(parsed.resources?.energy || {}) },
          food: { ...initial.resources.food, ...(parsed.resources?.food || {}) },
          spareParts: { ...initial.resources.spareParts, ...(parsed.resources?.spareParts || {}) },
          crew: { ...initial.resources.crew, ...(parsed.resources?.crew || {}) },
          radiation: { ...initial.resources.radiation, ...(parsed.resources?.radiation || {}) },
        },
        moduleHealth: {
          ...initial.moduleHealth,
          ...(parsed.moduleHealth || {}),
        },
        moduleSettings: {
          ...initial.moduleSettings,
          ...(parsed.moduleSettings || {}),
        },
        crewMembers: (parsed.crewMembers && Array.isArray(parsed.crewMembers) && parsed.crewMembers.length === 4)
          ? parsed.crewMembers
          : initial.crewMembers,
        exploration: {
          ...initial.exploration,
          ...(parsed.exploration || {}),
        },
      };
    }
  } catch (err) {
    console.warn('Outpost Zero: Could not restore saved game state. Initializing clean Sol 1 state.', err);
  }
  return createInitialGameState();
}

/**
 * Saves current state into localStorage.
 */
export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Outpost Zero: Failed to save game state', err);
    return false;
  }
}

/**
 * Clears saved game state to allow restarting.
 */
export function clearSavedGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Outpost Zero: Failed to clear game state', err);
    return false;
  }
}
