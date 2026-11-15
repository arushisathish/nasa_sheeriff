/**
 * Outpost Zero - Habitat Module Definitions
 * Aligned with the 6 core management modules and isometric layout from the reference image.
 */

export const MODULE_IDS = {
  GREENHOUSE: 'greenhouse',
  LIFE_SUPPORT: 'life_support',
  WATER_RECYCLING: 'water_recycling',
  POWER_BAY: 'power_bay',
  CREW_QUARTERS: 'crew_quarters',
  RAD_SHELTER: 'rad_shelter',
  SOLAR_ARRAY: 'solar_array',
};

export const MODULES_CONFIG = {
  [MODULE_IDS.GREENHOUSE]: {
    id: MODULE_IDS.GREENHOUSE,
    name: 'Central Hydroponics & Greenhouse',
    shortName: 'Hydroponics',
    category: 'Production',
    primaryResource: 'Food',
    description: 'Central automated multi-tiered hydroponic agricultural dome. Uses LED grow-lights and nutrient baths to supply caloric and micro-nutrient sustenance for the 4-person crew.',
    nasaFact: 'NASA Veggie & Advanced Plant Habitat (APH) experiments on the ISS provide the biological baseline for Martian high-efficiency dwarf wheat and leafy greens.',
    baseOutput: '+14 kg Food / Sol',
    baseConsumption: '-18 kWh Energy / Sol, -8 L Water / Sol',
    defaultHealth: 100,
    position: {
      type: 'center',
      labelX: 500,
      labelY: 340,
    },
    accentColor: '#10b981', // Emerald
    overlayGlow: {
      normal: 'rgba(16, 185, 129, 0.25)',
      power: 'rgba(56, 189, 248, 0.3)',
      o2: 'rgba(56, 189, 248, 0.4)',
      radiation: 'rgba(239, 68, 68, 0.2)',
    }
  },

  [MODULE_IDS.LIFE_SUPPORT]: {
    id: MODULE_IDS.LIFE_SUPPORT,
    name: 'Life Support & O2 Generation Bay',
    shortName: 'O2 Bay',
    category: 'Life Support',
    primaryResource: 'Oxygen',
    description: 'Electrolysis and Sabatier reactor array. Cracks Martian water ice and atmospheric CO2 into breathable O2 at 21.3 kPa partial pressure while scrubbing exhaled carbon dioxide.',
    nasaFact: 'NASA MOXIE on the Perseverance rover demonstrated in-situ oxygen production from the Martian CO2 atmosphere at up to 12 grams of O2 per hour.',
    baseOutput: '+24 kg Oxygen / Sol',
    baseConsumption: '-22 kWh Energy / Sol',
    defaultHealth: 98,
    position: {
      type: 'west',
      labelX: 280,
      labelY: 320,
    },
    accentColor: '#38bdf8', // Cyan
    overlayGlow: {
      normal: 'rgba(56, 189, 248, 0.25)',
      power: 'rgba(56, 189, 248, 0.4)',
      o2: 'rgba(56, 189, 248, 0.6)',
      radiation: 'rgba(245, 158, 11, 0.3)',
    }
  },

  [MODULE_IDS.WATER_RECYCLING]: {
    id: MODULE_IDS.WATER_RECYCLING,
    name: 'Water Recovery & Storage Facility',
    shortName: 'Water Bay',
    category: 'Life Support',
    primaryResource: 'Water',
    description: 'Closed-loop multi-filtration distillation and sub-surface permafrost melter. Recovers 93% of habitat graywater, condensate, and urine into ultrapure potable reserves.',
    nasaFact: 'The ISS Environmental Control and Life Support System (ECLSS) achieves 98% water recovery, critical for missions where Earth resupply is unavailable for 26 months.',
    baseOutput: '+32 L Water / Sol (Recycled)',
    baseConsumption: '-16 kWh Energy / Sol',
    defaultHealth: 95,
    position: {
      type: 'south_west',
      labelX: 380,
      labelY: 470,
    },
    accentColor: '#0ea5e9', // Sky blue
    overlayGlow: {
      normal: 'rgba(14, 165, 233, 0.25)',
      power: 'rgba(56, 189, 248, 0.3)',
      o2: 'rgba(14, 165, 233, 0.3)',
      radiation: 'rgba(245, 158, 11, 0.2)',
    }
  },

  [MODULE_IDS.POWER_BAY]: {
    id: MODULE_IDS.POWER_BAY,
    name: 'Power Control & Lithium-Sulfur Battery Vault',
    shortName: 'Power Vault',
    category: 'Energy',
    primaryResource: 'Energy',
    description: 'High-density regenerative solid-state battery array paired with automated DC micro-grid switches, inverter banks, and Kilopower fission reserve interfaces.',
    nasaFact: 'Surface power systems on Mars must survive prolonged dust storm darkness; NASA Kilopower nuclear reactor concepts supplement photovoltaic solar farms.',
    baseOutput: 'Buffer: 350 kWh capacity',
    baseConsumption: '-4 kWh Idle Regulation / Sol',
    defaultHealth: 100,
    position: {
      type: 'south_east',
      labelX: 620,
      labelY: 470,
    },
    accentColor: '#f59e0b', // Amber
    overlayGlow: {
      normal: 'rgba(245, 158, 11, 0.25)',
      power: 'rgba(245, 158, 11, 0.7)',
      o2: 'rgba(56, 189, 248, 0.2)',
      radiation: 'rgba(245, 158, 11, 0.3)',
    }
  },

  [MODULE_IDS.CREW_QUARTERS]: {
    id: MODULE_IDS.CREW_QUARTERS,
    name: 'Crew Quarters & Diagnostic Medbay',
    shortName: 'Crew & Medbay',
    category: 'Crew',
    primaryResource: 'Wellbeing & Health',
    description: 'Four private sleep pods, microgravity exercise treadmills, psychological recovery lounge, and advanced telemedicine surgery & diagnostic bench.',
    nasaFact: 'NASA Human Research Program (HRP) studies isolation and sensory deprivation at analog habitats like HERA and CHAPEA to preserve cognitive function.',
    baseOutput: 'Sustains 4 Crew Members',
    baseConsumption: '-10 kWh Energy / Sol, -4 kg O2 / Sol',
    defaultHealth: 99,
    position: {
      type: 'north_west',
      labelX: 380,
      labelY: 200,
    },
    accentColor: '#a855f7', // Purple
    overlayGlow: {
      normal: 'rgba(168, 85, 247, 0.25)',
      power: 'rgba(56, 189, 248, 0.3)',
      o2: 'rgba(56, 189, 248, 0.4)',
      radiation: 'rgba(239, 68, 68, 0.3)',
    }
  },

  [MODULE_IDS.RAD_SHELTER]: {
    id: MODULE_IDS.RAD_SHELTER,
    name: 'Sub-Regolith Radiation Storm Shelter',
    shortName: 'Rad Shelter',
    category: 'Defense & Safety',
    primaryResource: 'Radiation Protection',
    description: 'Heavily fortified subterranean bunker buried under 2.5 meters of compacted Martian regolith with polyethylene hydrogen-rich lining. Used during SPEs and Solar Flares.',
    nasaFact: 'Regolith (Martian soil) provides effective shielding against Solar Particle Events (SPE). Curiosity RAD data proves regolith overburden cuts dose rates by >70%.',
    baseOutput: 'Shielding Factor: 88% Radiation Attenuation',
    baseConsumption: '-6 kWh Energy / Sol when occupied',
    defaultHealth: 100,
    position: {
      type: 'north_east',
      labelX: 620,
      labelY: 200,
    },
    accentColor: '#ef4444', // Red/Rose
    overlayGlow: {
      normal: 'rgba(239, 68, 68, 0.25)',
      power: 'rgba(56, 189, 248, 0.3)',
      o2: 'rgba(56, 189, 248, 0.3)',
      radiation: 'rgba(16, 185, 129, 0.6)', // Bright safe green in radiation overlay
    }
  },

  [MODULE_IDS.SOLAR_ARRAY]: {
    id: MODULE_IDS.SOLAR_ARRAY,
    name: 'Exterior Photovoltaic Solar Farm',
    shortName: 'Solar Array',
    category: 'Energy',
    primaryResource: 'Energy',
    description: 'Twin dual-axis tracking gallium-arsenide solar wings mounted on exterior masts. Subject to dust accumulation and insolation fluctuations.',
    nasaFact: 'Martian dust accumulation famously terminated the InSight lander and Opportunity rover missions, highlighting the vital need for dust-mitigation cycles.',
    baseOutput: '+85 kWh Energy / Sol (Clear Sky)',
    baseConsumption: '-0 kWh',
    defaultHealth: 92,
    position: {
      type: 'exterior_east',
      labelX: 790,
      labelY: 340,
    },
    accentColor: '#38bdf8',
    overlayGlow: {
      normal: 'rgba(56, 189, 248, 0.25)',
      power: 'rgba(245, 158, 11, 0.8)',
      o2: 'transparent',
      radiation: 'rgba(239, 68, 68, 0.5)',
    }
  }
};
