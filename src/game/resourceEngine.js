/**
 * Outpost Zero - Turn-Based Resource & Environmental Engine
 * Pure scientific simulation for a 4-person crew on Mars across a 24.65 hr Sol.
 */

import { MODULE_IDS } from '../data/modulesConfig.js';
import { updateSolWeatherCycle } from './eventEngine.js';

/**
 * Executes a 1-Sol simulation tick.
 * @param {Object} currentState - The existing immutable game state
 * @returns {Object} { nextState, dailyReport }
 */
export function simulateSolTick(currentState) {
  // Deep clone to guarantee immutability
  const next = JSON.parse(JSON.stringify(currentState));
  const sol = next.currentSol;
  const crewCount = next.resources.crew?.count || 4;

  const res = next.resources;
  const health = next.moduleHealth;
  const env = next.environment;

  // 1. Crew Baseline Metabolic Demand (NASA Human Mission to Mars standards)
  // ~0.84 kg O2/crew/sol => ~3.36 kg base demand
  const crewO2Demand = crewCount * 0.84;
  // ~2.5 L potable water/crew/sol drinking + hygiene => 10.0 L base demand
  const crewWaterDemand = crewCount * 2.5;
  // ~1.5 kg food rations/crew/sol => 6.0 kg base food demand
  const crewFoodDemand = crewCount * 1.5;

  // 1b. Crew Specialist Assignments & NASA Station Perks
  const crewList = next.crewMembers || [];
  const findStation = (memberId) => crewList.find(c => c.id === memberId)?.assignment;
  
  const cmdrAtHub = findStation('cmdr') === 'command_console';
  const medicAtLss = findStation('medic') === 'life_support' || findStation('medic') === 'water_recycler';
  const engAtPower = findStation('engineer') === 'solar_array' || findStation('engineer') === 'power_bay';
  const botanistAtGreenhouse = findStation('botanist') === 'hydroponics';

  const commandEfficiency = cmdrAtHub ? 1.10 : 1.0;
  const o2MedicBoost = medicAtLss ? 1.20 : 1.0;
  const engPowerBoost = engAtPower ? 1.15 : 1.0;
  const botanistYieldBoost = botanistAtGreenhouse ? 1.30 : 1.0;
  const greenhouseWaterMultiplier = botanistAtGreenhouse ? 0.80 : 1.0;

  // 2. Production & Subsystem Rates
  // O2 Bay (Electrolysis & Sabatier): Produces up to 24 kg O2 / Sol at 100% health & full power
  const o2BayEfficiency = (health[MODULE_IDS.LIFE_SUPPORT] / 100);
  const o2Generated = 24.0 * o2BayEfficiency * o2MedicBoost * commandEfficiency;
  const o2Net = +(o2Generated - crewO2Demand).toFixed(2);

  // Water Recovery (ECLSS): Recovers up to 93% of moisture & graywater
  const waterBayEfficiency = (health[MODULE_IDS.WATER_RECYCLING] / 100);
  const baseGreenhouseWater = (health[MODULE_IDS.GREENHOUSE] > 30) ? 6.0 : 2.0;
  const greenhouseWaterDemand = baseGreenhouseWater * greenhouseWaterMultiplier;
  const totalWaterDemand = crewWaterDemand + greenhouseWaterDemand;
  const waterRecycled = totalWaterDemand * 0.93 * waterBayEfficiency * commandEfficiency;
  const waterNet = +(waterRecycled - totalWaterDemand).toFixed(2);

  // Power & Solar Array
  // Insolation factor reduced by dust coverage and atmospheric optical depth (tau)
  const dustFactor = Math.max(0.2, 1 - (env.atmosphericDustTau * 0.25));
  const solarHealthFactor = (health[MODULE_IDS.SOLAR_ARRAY] / 100);
  const powerGenerated = +(85.0 * solarHealthFactor * dustFactor * engPowerBoost * commandEfficiency).toFixed(2);
  
  // Power Draw: Habitat base life support + subsystems
  // If battery is low (< 50 kWh), habitat enters automated power conservation mode
  const isConservationMode = res.energy.current < 50;
  const baseHabitatPowerDemand = isConservationMode ? 14.0 : 20.0;
  const o2PowerDemand = 14.0 * o2BayEfficiency;
  const waterPowerDemand = 10.0 * waterBayEfficiency;
  const greenhousePowerDemand = isConservationMode ? 6.0 : (12.0 * (health[MODULE_IDS.GREENHOUSE] / 100));
  const totalPowerDemand = +(baseHabitatPowerDemand + o2PowerDemand + waterPowerDemand + greenhousePowerDemand).toFixed(2);
  const powerNet = +(powerGenerated - totalPowerDemand).toFixed(2);

  // 2b. Synchronize with multi-Sol weather cycle (dynamic tau & space weather levels)
  updateSolWeatherCycle(next);

  // Greenhouse Food Growth
  // Hydroponics harvests continuous micro-greens and caloric crops
  const greenhouseEfficiency = (health[MODULE_IDS.GREENHOUSE] / 100);
  const foodGenerated = +(7.5 * greenhouseEfficiency * botanistYieldBoost * commandEfficiency).toFixed(2);
  const foodNet = +(foodGenerated - crewFoodDemand).toFixed(2);

  // 3. Radiation Dosimetry Tick (Curiosity RAD baseline: ~210-240 uGy/day surface)
  const surfaceHourlyRate = res.radiation.surfaceDoseRate; // uSv/hr
  // Daily surface dose in mSv (24.65 hours/Sol)
  const surfaceSolDose_mSv = (surfaceHourlyRate * 24.65) / 1000.0;
  
  // Habitat attenuation: Regular modules reduce dose by ~62% (0.38 multiplier)
  // Sub-regolith storm shelter reduces dose by ~88% (0.12 multiplier)
  const isSheltered = res.radiation.crewInShelter;
  const doseFactor = isSheltered ? 0.12 : 0.38;
  const dailyCrewDose_mSv = +(surfaceSolDose_mSv * doseFactor).toFixed(4);
  const cumulativeDose_mSv = +(res.radiation.cumulativeCrewDose + dailyCrewDose_mSv).toFixed(3);

  // 4. Update and Clamp Consumable Quantities (Guaranteed NaN and negative immunity)
  const safeClamp = (val, max) => Math.min(max, Math.max(0, isNaN(val) ? 0 : +val.toFixed(1)));
  const newO2 = safeClamp(res.oxygen.current + o2Net, res.oxygen.max);
  const newWater = safeClamp(res.water.current + waterNet, res.water.max);
  const newEnergy = safeClamp(res.energy.current + powerNet, res.energy.max);
  const newFood = safeClamp(res.food.current + foodNet, res.food.max);

  // Update Status Categorization
  const getResourceStatus = (curr, max, crit) => {
    if (curr <= crit) return 'critical';
    if (curr <= crit * 2.2) return 'warning';
    return 'nominal';
  };

  res.oxygen.current = newO2;
  res.oxygen.dailyNet = o2Net;
  res.oxygen.status = getResourceStatus(newO2, res.oxygen.max, res.oxygen.criticalThreshold);

  res.water.current = newWater;
  res.water.dailyNet = waterNet;
  res.water.status = getResourceStatus(newWater, res.water.max, res.water.criticalThreshold);

  res.energy.current = newEnergy;
  res.energy.dailyNet = powerNet;
  res.energy.status = getResourceStatus(newEnergy, res.energy.max, res.energy.criticalThreshold);

  res.food.current = newFood;
  res.food.dailyNet = foodNet;
  res.food.status = getResourceStatus(newFood, res.food.max, res.food.criticalThreshold);

  res.radiation.cumulativeCrewDose = cumulativeDose_mSv;
  res.radiation.habitatDoseRate = +(surfaceHourlyRate * 0.38).toFixed(1);
  res.radiation.shelterDoseRate = +(surfaceHourlyRate * 0.12).toFixed(1);

  // 5. Natural Mechanical Wear on Habitat Modules (mitigated by Engineer assignment)
  // Each module experiences 0.5% - 2.5% wear per Sol
  const wearRates = {
    [MODULE_IDS.SOLAR_ARRAY]: +(1.2 + (env.atmosphericDustTau * 0.8)).toFixed(1), // Dust increases solar wear
    [MODULE_IDS.LIFE_SUPPORT]: 1.0,
    [MODULE_IDS.WATER_RECYCLING]: 1.2,
    [MODULE_IDS.GREENHOUSE]: 0.8,
    [MODULE_IDS.POWER_BAY]: 0.5,
    [MODULE_IDS.CREW_QUARTERS]: 0.4,
    [MODULE_IDS.RAD_SHELTER]: 0.2,
  };

  // Engineer assignment perk: -50% wear rate on assigned sector
  if (engAtPower) {
    wearRates[MODULE_IDS.SOLAR_ARRAY] = +(wearRates[MODULE_IDS.SOLAR_ARRAY] * 0.5).toFixed(1);
    wearRates[MODULE_IDS.POWER_BAY] = +(wearRates[MODULE_IDS.POWER_BAY] * 0.5).toFixed(1);
  }

  Object.keys(wearRates).forEach(id => {
    if (health[id] !== undefined) {
      health[id] = Math.max(0, Math.round(health[id] - wearRates[id]));
    }
  });

  // 6. Crew Vitality Evaluation
  let crewMoraleDelta = 0;
  let crewHealthDelta = 0;

  // NASA Specialist Perks
  if (medicAtLss) crewHealthDelta += 4; // Medic restores vitality
  if (cmdrAtHub) crewMoraleDelta += 2;   // Commander boosts crew cohesion

  if (res.oxygen.status === 'critical') crewHealthDelta -= 12;
  if (res.water.status === 'critical') crewHealthDelta -= 10;
  if (res.food.status === 'critical') crewHealthDelta -= 8;
  if (res.energy.status === 'critical') crewMoraleDelta -= 15;

  if (isSheltered) {
    // Staying cooped up inside the radiation bunker decreases morale slightly
    crewMoraleDelta -= 4;
  } else if (res.radiation.spaceWeatherLevel !== 'NORMAL') {
    // Unprotected crew during elevated radiation suffers radiation sickness risk
    crewHealthDelta -= 8;
  } else {
    // Nominal conditions allow gradual morale stabilization
    crewMoraleDelta += 1;
  }

  res.crew.health = Math.min(100, Math.max(0, res.crew.health + crewHealthDelta));
  res.crew.morale = Math.min(100, Math.max(0, res.crew.morale + crewMoraleDelta));

  // Advance Sol Counter & Update Dynamic Weather Phase
  next.currentSol = sol + 1;
  updateSolWeatherCycle(next);

  // 7. Compile Detailed Daily Report
  const dailyReport = {
    sol: sol,
    summary: `Sol ${sol} operations debrief concluded. Net O2: ${o2Net > 0 ? '+' : ''}${o2Net} kg, Water: ${waterNet > 0 ? '+' : ''}${waterNet} L, Energy: ${powerNet > 0 ? '+' : ''}${powerNet} kWh.`,
    deltas: {
      oxygen: o2Net,
      water: waterNet,
      energy: powerNet,
      food: foodNet,
      spareParts: 0,
      radiationCrewDose: dailyCrewDose_mSv,
    },
    production: {
      o2Produced: +o2Generated.toFixed(1),
      waterRecycled: +waterRecycled.toFixed(1),
      solarPowerGenerated: +powerGenerated.toFixed(1),
      foodHarvested: +foodGenerated.toFixed(1),
    },
    consumption: {
      crewO2: +crewO2Demand.toFixed(1),
      totalWater: +totalWaterDemand.toFixed(1),
      habitatPower: +totalPowerDemand.toFixed(1),
      crewFood: +crewFoodDemand.toFixed(1),
    },
    crewVitality: {
      health: res.crew.health,
      morale: res.crew.morale,
    },
    environment: {
      tau: env.atmosphericDustTau,
      solarInsolation: Math.round(dustFactor * 100),
      surfaceDoseRate: surfaceHourlyRate,
    }
  };

  // Add report to chronological archive
  next.dailyLogs.unshift(dailyReport);

  return {
    nextState: next,
    dailyReport,
  };
}
