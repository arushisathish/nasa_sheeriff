/**
 * Initial Resource State for Sol 1 of Outpost Zero
 * Based on realistic NASA Human Mission to Mars 4-crew baselines.
 */

export const INITIAL_RESOURCES = {
  // Consumables / Reserves
  oxygen: {
    current: 420,       // kg
    max: 600,           // kg capacity
    unit: 'kg',
    dailyNet: +4.2,     // Net change last Sol
    status: 'nominal',  // nominal | warning | critical
    criticalThreshold: 90,
  },
  water: {
    current: 680,       // Liters
    max: 1000,          // Liters
    unit: 'L',
    dailyNet: +6.0,
    status: 'nominal',
    criticalThreshold: 120,
  },
  energy: {
    current: 280,       // kWh
    max: 350,           // kWh battery storage
    unit: 'kWh',
    dailyNet: +15.5,
    status: 'nominal',
    criticalThreshold: 45,
  },
  food: {
    current: 310,       // kg
    max: 450,           // kg
    unit: 'kg',
    dailyNet: +2.1,
    status: 'nominal',
    criticalThreshold: 60,
  },
  spareParts: {
    current: 18,        // mechanical & electrical components
    max: 30,
    unit: 'units',
    dailyNet: 0,
    status: 'nominal',
    criticalThreshold: 3,
  },

  // Environmental Hazard & Shielding (NOT a consumable)
  radiation: {
    surfaceDoseRate: 21.4,       // uSv/hr (Curiosity RAD baseline ~21 uSv/hr on quiet sol)
    habitatDoseRate: 8.2,        // uSv/hr inside pressurized modules
    shelterDoseRate: 2.1,        // uSv/hr inside underground storm shelter
    cumulativeCrewDose: 0.52,    // mSv accumulated since landing
    maxCareerLimit: 600.0,       // mSv (NASA career astronaut radiation limit)
    shieldingIntegrity: 100,     // %
    crewInShelter: false,        // If true, crew relocates to bunker during alerts
    evaStatus: 'permitted',      // permitted | restricted | prohibited
    spaceWeatherLevel: 'NORMAL', // NORMAL | WATCH | WARNING | SEVERE
  },

  // Crew Vitality
  crew: {
    count: 4,
    names: ['Cmdr. Elena Vance', 'Dr. Tariq Al-Mansoor', 'Eng. Maya Lin', 'Spec. Marcus Brody'],
    health: 100, // %
    morale: 96,  // %
    activeInjuries: 0,
  }
};
