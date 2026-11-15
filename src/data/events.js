/**
 * Outpost Zero - 8 Core Emergency Events & Interactive Decision System
 * 
 * Every event requires a strategic player choice with explicit trade-offs
 * (resource costs, immediate effects, and multi-Sol consequences).
 */

import { MODULE_IDS } from './modulesConfig.js';

export const EVENT_IDS = {
  DUST_STORM: 'dust_storm',
  EQUIPMENT_MALFUNCTION: 'equipment_malfunction',
  GREENHOUSE_PROBLEM: 'greenhouse_problem',
  SPACE_WEATHER_ALERT: 'space_weather_alert',
  SOLAR_FLARE: 'solar_flare',
  ELEVATED_RADIATION: 'elevated_radiation',
  WATER_SHORTAGE: 'water_shortage',
  ENERGY_SHORTAGE: 'energy_shortage',
};

export const CORE_EVENTS_CATALOG = {
  // 1. Dust Storm
  [EVENT_IDS.DUST_STORM]: {
    id: EVENT_IDS.DUST_STORM,
    title: 'Regional Mars Dust Storm (Tau > 2.8)',
    category: 'environmental',
    severity: 'critical',
    affectedModuleId: MODULE_IDS.SOLAR_ARRAY,
    description: 'Martian atmospheric optical depth (tau) has surged to 2.8. Airborne iron-oxide particulate is obscuring solar insolation by 75% and depositing abrasive grit over photovoltaic tracking wings.',
    nasaFact: 'Global dust storms on Mars can envelop the entire planet for months. InSight and Opportunity rovers both succumbed to solar panel dust starvation.',
    choices: [
      {
        id: 'stow_and_burn_reserves',
        label: 'Stow Solar Wings & Switch to Battery Vault',
        tradeOffText: 'Stows panels flat against grit erosion. Preserves module health (+0% wear), but cuts daily energy generation by 60% for 3 Sols.',
        cost: { spareParts: 0, energy: 0 },
        apply: (state) => {
          state.environment.atmosphericDustTau = 2.8;
          state.moduleHealth[MODULE_IDS.SOLAR_ARRAY] = Math.max(0, state.moduleHealth[MODULE_IDS.SOLAR_ARRAY] - 2);
          state.resources.crew.morale = Math.max(0, state.resources.crew.morale - 4);
          return 'Solar array stowed in safety mode. Battery vault supplying essential baseline load.';
        }
      },
      {
        id: 'active_cleaning_eva',
        label: 'High-Current Electrostatic Repulsion & Air Jet Cleaning',
        tradeOffText: 'Consumes 1 Spare Part and 35 kWh energy buffer to purge grit, maintaining 70% solar generation efficiency.',
        cost: { spareParts: 1, energy: 35 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 1);
          state.resources.energy.current = Math.max(0, state.resources.energy.current - 35);
          state.environment.atmosphericDustTau = 1.2;
          return 'Electrostatic pulse cleared 65% of surface dust. Electrical yield stabilized.';
        }
      },
      {
        id: 'weather_the_storm',
        label: 'Maintain Standard Tracking (Accept Wear)',
        tradeOffText: 'Zero resource expenditure, but severe dust buildup damages solar mechanics (-18% health) and heavily impairs power.',
        cost: { spareParts: 0, energy: 0 },
        apply: (state) => {
          state.moduleHealth[MODULE_IDS.SOLAR_ARRAY] = Math.max(0, state.moduleHealth[MODULE_IDS.SOLAR_ARRAY] - 18);
          state.environment.atmosphericDustTau = 2.8;
          return 'Dust accumulation coated tracking wings. Array efficiency severely compromised.';
        }
      }
    ]
  },

  // 2. Equipment Malfunction
  [EVENT_IDS.EQUIPMENT_MALFUNCTION]: {
    id: EVENT_IDS.EQUIPMENT_MALFUNCTION,
    title: 'Life Support Electrolysis Cell Seal Failure',
    category: 'subsystem',
    severity: 'critical',
    affectedModuleId: MODULE_IDS.LIFE_SUPPORT,
    description: 'High-pressure seals in the Sabatier and water electrolysis loop have fractured under thermal cycling stress. Oxygen production is leaking into external venting.',
    nasaFact: 'NASA ISS Sabatier reactors convert carbon dioxide and hydrogen into water and methane, requiring periodic high-reliability mechanical valve refurbishment.',
    choices: [
      {
        id: 'replace_with_spares',
        label: 'Deploy Modular Replacement Kit (-2 Parts)',
        tradeOffText: 'Consumes 2 Spare Parts. Restores O2 Bay to 98% health with zero oxygen reserve loss.',
        cost: { spareParts: 2, energy: 10 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 2);
          state.resources.energy.current = Math.max(0, state.resources.energy.current - 10);
          state.moduleHealth[MODULE_IDS.LIFE_SUPPORT] = 98;
          return 'Seals replaced with certified flight spares. Oxygen generation restored to full capacity.';
        }
      },
      {
        id: 'emergency_patch',
        label: 'Field Epoxy & Compression Clamp (-1 Part)',
        tradeOffText: 'Consumes 1 Spare Part. Recovers O2 Bay to 75% health, but causes an immediate loss of 15 kg O2.',
        cost: { spareParts: 1, energy: 0 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 1);
          state.resources.oxygen.current = Math.max(0, state.resources.oxygen.current - 15);
          state.moduleHealth[MODULE_IDS.LIFE_SUPPORT] = 75;
          return 'Epoxy clamp holds at lower pressure. O2 output stabilized at reduced flow rate.';
        }
      },
      {
        id: 'depressurize_and_throttle',
        label: 'Throttle to 40% & Vent Sub-Loop',
        tradeOffText: 'No spare parts used. O2 Bay health falls to 45%. Crew must endure rationed oxygen (-10% Morale).',
        cost: { spareParts: 0, energy: 0 },
        apply: (state) => {
          state.moduleHealth[MODULE_IDS.LIFE_SUPPORT] = 45;
          state.resources.oxygen.current = Math.max(0, state.resources.oxygen.current - 25);
          state.resources.crew.morale = Math.max(0, state.resources.crew.morale - 10);
          return 'Loop throttled. Hypoxic symptoms reported by crew during heavy exercise.';
        }
      }
    ]
  },

  // 3. Greenhouse Problem
  [EVENT_IDS.GREENHOUSE_PROBLEM]: {
    id: EVENT_IDS.GREENHOUSE_PROBLEM,
    title: 'Hydroponic Nutrient Solution Root Rot & Blight',
    category: 'subsystem',
    severity: 'high',
    affectedModuleId: MODULE_IDS.GREENHOUSE,
    description: 'Bacterial fungal bloom detected in the closed-loop aeroponic nutrient reservoir. Dwarf wheat crop in tier 2 and tier 3 is withering.',
    nasaFact: 'Microgravity and confined Martian greenhouse biospheres are prone to rapid pathogen amplification if bacterial sterilization loops fail.',
    choices: [
      {
        id: 'flush_and_reseed',
        label: 'Full Chemical Flush & Reseed (-1 Part, -25 L Water)',
        tradeOffText: 'Flushes system with sterile water and replaces nutrient filters. Eliminates blight and preserves future yields.',
        cost: { spareParts: 1, water: 25 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 1);
          state.resources.water.current = Math.max(0, state.resources.water.current - 25);
          state.moduleHealth[MODULE_IDS.GREENHOUSE] = 95;
          return 'Hydroponic trays sanitized and reseeded with backup germplasm.';
        }
      },
      {
        id: 'cull_infected_tier',
        label: 'Cull Infected Trays Only (-20 kg Food Rations)',
        tradeOffText: 'Zero parts or water spent, but infected crop yield is lost immediately (-20 kg Food). Greenhouse health at 70%.',
        cost: { spareParts: 0, food: 20 },
        apply: (state) => {
          state.resources.food.current = Math.max(0, state.resources.food.current - 20);
          state.moduleHealth[MODULE_IDS.GREENHOUSE] = 70;
          return 'Infected biomass excised. Remaining crop tiers preserved.';
        }
      }
    ]
  },

  // 4. Space-Weather Alert
  [EVENT_IDS.SPACE_WEATHER_ALERT]: {
    id: EVENT_IDS.SPACE_WEATHER_ALERT,
    title: 'NASA DONKI Alert: Fast Coronal Mass Ejection Inbound',
    category: 'space_weather',
    severity: 'critical',
    affectedModuleId: MODULE_IDS.RAD_SHELTER,
    description: 'Goddard Space Flight Center DONKI detects a halo CME directed along the Sun-Mars orbital line. Shock front transit speed is 1,240 km/s. Mars arrival estimated within 24 hours.',
    nasaFact: 'Without a global intrinsic magnetic dipole field like Earth’s, Mars has no magnetosphere to deflect coronal mass ejections; only the thin atmosphere and regolith provide shielding.',
    choices: [
      {
        id: 'full_shelter_lockdown',
        label: 'Full Crew Sub-Regolith Lockdown (Active 48 hrs)',
        tradeOffText: 'Orders all 4 astronauts into the subterranean bunker. Reduces radiation dose uptake by 88%, but suspends outdoor maintenance and reduces morale by -6.',
        cost: { spareParts: 0, energy: 12 },
        apply: (state) => {
          state.resources.radiation.crewInShelter = true;
          state.resources.radiation.spaceWeatherLevel = 'WARNING';
          state.resources.radiation.evaStatus = 'prohibited';
          state.resources.crew.morale = Math.max(0, state.resources.crew.morale - 6);
          return 'Crew safely sealed inside the underground radiation storm shelter.';
        }
      },
      {
        id: 'surface_preparations',
        label: 'Emergency Outdoor Securing Run Before Lockdown',
        tradeOffText: 'Astronauts rush outdoors to secure exterior solar panel actuators (-1 Part, +0.06 mSv individual exposure), but saves power equipment.',
        cost: { spareParts: 1 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 1);
          state.resources.radiation.cumulativeCrewDose += 0.06;
          state.resources.radiation.crewInShelter = true;
          state.resources.radiation.spaceWeatherLevel = 'WARNING';
          state.resources.radiation.evaStatus = 'prohibited';
          return 'Solar array secured against electromagnetic transients. Crew evacuated to bunker.';
        }
      }
    ]
  },

  // 5. Solar Flare
  [EVENT_IDS.SOLAR_FLARE]: {
    id: EVENT_IDS.SOLAR_FLARE,
    title: 'Class X-Ray Super Flare Eruption (X8.2)',
    category: 'space_weather',
    severity: 'critical',
    affectedModuleId: MODULE_IDS.RAD_SHELTER,
    description: 'Solar Active Region has erupted with an extreme X8.2 flare. High-energy gamma and hard X-ray radiation is bathing Chryse Planitia with immediate ionization.',
    nasaFact: 'Curiosity RAD recorded its largest proton storm on Mars on September 10, 2017 during an X8.2 flare, causing sensor saturation and high surface dosimeter spikes.',
    choices: [
      {
        id: 'emergency_shelter_scramble',
        label: 'Immediate Shelter Klaxon & Medical Radioprotectants',
        tradeOffText: 'Crew scrambles to bunker and takes antioxidant radioprotectant supplements. Minimizes cellular damage to +0.02 mSv.',
        cost: { energy: 5 },
        apply: (state) => {
          state.resources.radiation.crewInShelter = true;
          state.resources.radiation.spaceWeatherLevel = 'SEVERE';
          state.resources.radiation.surfaceDoseRate = 64.7;
          state.resources.radiation.cumulativeCrewDose += 0.02;
          return 'Klaxon sounded. Crew secured in shelter as ionizing wave front passes.';
        }
      },
      {
        id: 'shelter_in_place_modules',
        label: 'Shelter in Place Inside Central Hab (Unfortified)',
        tradeOffText: 'Avoids bunker morale decay, but crew takes significant radiation dosage (+0.18 mSv cumulative dose) and suffers minor radiation nausea.',
        cost: { spareParts: 0 },
        apply: (state) => {
          state.resources.radiation.crewInShelter = false;
          state.resources.radiation.spaceWeatherLevel = 'SEVERE';
          state.resources.radiation.surfaceDoseRate = 64.7;
          state.resources.radiation.cumulativeCrewDose += 0.18;
          state.resources.crew.health = Math.max(0, state.resources.crew.health - 6);
          return 'Central module hull provided only partial shielding. Crew received elevated radiation dose.';
        }
      }
    ]
  },

  // 6. Elevated Radiation Conditions
  [EVENT_IDS.ELEVATED_RADIATION]: {
    id: EVENT_IDS.ELEVATED_RADIATION,
    title: 'Solar Wind High-Speed Stream & Geomagnetic Compression',
    category: 'space_weather',
    severity: 'high',
    affectedModuleId: MODULE_IDS.RAD_SHELTER,
    description: 'Coronal hole solar wind streams (speed > 750 km/s) have compressed Mars’ thin induced ionosphere, elevating secondary neutron scatter on the ground.',
    nasaFact: 'When cosmic rays strike the Martian regolith, they knock out secondary neutrons, creating an upward albedo radiation flux that accounts for ~30% of total biological dose.',
    choices: [
      {
        id: 'restrict_eva_and_shift_schedule',
        label: 'Restrict Surface EVAs & Shift Work to Night Sols',
        tradeOffText: 'Halts outdoor operations. Eliminates excessive crew exposure with zero resource cost.',
        cost: { spareParts: 0 },
        apply: (state) => {
          state.resources.radiation.evaStatus = 'restricted';
          state.resources.radiation.spaceWeatherLevel = 'WATCH';
          state.resources.radiation.surfaceDoseRate = 28.5;
          return 'Surface operations restricted to pressurized modules. Exposure rates monitored.';
        }
      },
      {
        id: 'increase_shelter_insulation',
        label: 'Pump Hydrogen-Rich Water Layer to Ceiling Liners (-15 kWh)',
        tradeOffText: 'Uses 15 kWh electrical pumping to cycle water into habitat roof tanks, boosting module shielding by 15%.',
        cost: { energy: 15 },
        apply: (state) => {
          state.resources.energy.current = Math.max(0, state.resources.energy.current - 15);
          state.resources.radiation.shieldingIntegrity = 100;
          state.resources.radiation.habitatDoseRate = 6.5;
          return 'Water blanket configuration deployed overhead. Habitat biological shielding enhanced.';
        }
      }
    ]
  },

  // 7. Water Shortage
  [EVENT_IDS.WATER_SHORTAGE]: {
    id: EVENT_IDS.WATER_SHORTAGE,
    title: 'Closed-Loop ECLSS Distillation Micro-Leak',
    category: 'subsystem',
    severity: 'critical',
    affectedModuleId: MODULE_IDS.WATER_RECYCLING,
    description: 'Vibration in the vacuum distillation assembly has fractured a high-efficiency recovery manifold. Graywater recovery rate has dropped from 93% to 42%.',
    nasaFact: 'The ISS water processor relies on a spinning vacuum distillation drum to separate clean vapor from concentrated brine in microgravity and planetary environments.',
    choices: [
      {
        id: 'rebuild_manifold_spares',
        label: 'Rebuild Recovery Manifold with Spare Parts (-2 Parts)',
        tradeOffText: 'Consumes 2 Spare Parts. Fully restores closed-loop distillation to 95% efficiency.',
        cost: { spareParts: 2, energy: 12 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 2);
          state.resources.energy.current = Math.max(0, state.resources.energy.current - 12);
          state.moduleHealth[MODULE_IDS.WATER_RECYCLING] = 95;
          return 'Distillation manifold rebuilt. Closed-loop recovery restored to 93% efficiency.';
        }
      },
      {
        id: 'drill_permafrost_ice',
        label: 'Auxiliary Permafrost Sub-Surface Melter (-40 kWh Energy)',
        tradeOffText: 'Drives thermal melting rod into ground permafrost. Replenishes +45 L of water, but demands heavy power draw (-40 kWh).',
        cost: { energy: 40 },
        apply: (state) => {
          state.resources.energy.current = Math.max(0, state.resources.energy.current - 40);
          state.resources.water.current = Math.min(state.resources.water.max, state.resources.water.current + 45);
          state.moduleHealth[MODULE_IDS.WATER_RECYCLING] = 70;
          return 'Extracted 45 liters of Martian subterranean ice melt. Reservoirs bolstered.';
        }
      },
      {
        id: 'strict_water_rationing',
        label: 'Enforce Severe Crew Rationing (-12 Morale)',
        tradeOffText: 'Zero parts or power used. Cuts daily crew water consumption in half, but hygiene cuts and dehydration risk lower Morale by -12.',
        cost: { spareParts: 0 },
        apply: (state) => {
          state.resources.crew.morale = Math.max(0, state.resources.crew.morale - 12);
          state.moduleHealth[MODULE_IDS.WATER_RECYCLING] = 55;
          return 'Water rationing enacted. Crew hygiene and sponge baths suspended.';
        }
      }
    ]
  },

  // 8. Energy Shortage
  [EVENT_IDS.ENERGY_SHORTAGE]: {
    id: EVENT_IDS.ENERGY_SHORTAGE,
    title: 'Solid-State Battery Vault Inverter Overload',
    category: 'subsystem',
    severity: 'critical',
    affectedModuleId: MODULE_IDS.POWER_BAY,
    description: 'A thermal runaway surge in Power Rack #3 has tripped main circuit breakers. Battery storage capacity is locked down at 50% buffer capacity.',
    nasaFact: 'Planetary outpost battery systems require rigorous thermal regulation to prevent cryogenic freeze-up during Martian nights (-78°C) while preventing overheating during daytime recharge.',
    choices: [
      {
        id: 'replace_inverter_bus',
        label: 'Replace Inverter Bus & Re-balance Cells (-2 Parts)',
        tradeOffText: 'Consumes 2 Spare Parts. Restores Power Bay to 100% capacity and eliminates blackout risk.',
        cost: { spareParts: 2 },
        apply: (state) => {
          state.resources.spareParts.current = Math.max(0, state.resources.spareParts.current - 2);
          state.moduleHealth[MODULE_IDS.POWER_BAY] = 100;
          return 'Inverter bus replaced. Solid-state battery bank balanced and fully energized.';
        }
      },
      {
        id: 'blackout_non_essential',
        label: 'Brownout Non-Essential Systems (Dim Greenhouse & Medbay)',
        tradeOffText: 'No spare parts used. Conserves battery reserves, but dims greenhouse grow lamps (-8 kg Food yield next Sol).',
        cost: { spareParts: 0 },
        apply: (state) => {
          state.resources.food.current = Math.max(0, state.resources.food.current - 8);
          state.moduleHealth[MODULE_IDS.POWER_BAY] = 65;
          state.resources.crew.morale = Math.max(0, state.resources.crew.morale - 5);
          return 'Non-essential sectors placed on brownout. Essential life support maintained.';
        }
      }
    ]
  }
};
