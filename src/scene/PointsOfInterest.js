import * as THREE from 'three';
import { createSolarGridTexture } from './ProceduralTextures';

export const POI_DEFINITIONS = [
  {
    id: 'poi_habitat',
    name: 'Outpost Zero Base',
    shortName: 'Habitat',
    icon: 'base',
    position: new THREE.Vector3(0, 1.7, 0),
    color: '#38bdf8',
  },
  {
    id: 'poi_solar_ridge',
    name: 'Solar Ridge Array',
    shortName: 'Solar Ridge',
    icon: 'solar',
    position: new THREE.Vector3(55, 4.5, 15),
    color: '#f59e0b',
  },
  {
    id: 'poi_ice_crater',
    name: 'Ice Extraction Crater',
    shortName: 'Ice Crater',
    icon: 'water',
    position: new THREE.Vector3(-65, 0.5, -50),
    color: '#0ea5e9',
  },
  {
    id: 'poi_comms_hill',
    name: 'Comms Relay Hill',
    shortName: 'Comms Dish',
    icon: 'radio',
    position: new THREE.Vector3(35, 9.5, -75),
    color: '#10b981',
  },
  {
    id: 'poi_supply_wreck',
    name: 'Supply Drop & Rover Wreck',
    shortName: 'Supply Wreck',
    icon: 'parts',
    position: new THREE.Vector3(-70, 3.2, 60),
    color: '#a855f7',
    isScavengeable: true,
  },
  {
    id: 'poi_geo_outcrop',
    name: 'Geological Core Outcrop',
    shortName: 'Regolith Cores',
    icon: 'sample',
    position: new THREE.Vector3(45, 2.5, 60),
    color: '#06b6d4',
  },
  {
    id: 'poi_weather_beacon',
    name: 'Crater Rim Early-Warning Beacon',
    shortName: 'Weather Sensor',
    icon: 'radar',
    position: new THREE.Vector3(-25, 6.2, -80),
    color: '#f43f5e',
  },
];

/**
 * Builds the 3D structures for the distant exploration Points of Interest.
 */
export function buildDistantPOIs(scene) {
  const group = new THREE.Group();
  group.name = 'distant_pois';

  const metalMat = new THREE.MeshStandardMaterial({ color: '#2d333b', roughness: 0.4, metalness: 0.6 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: '#dbe2ea', roughness: 0.3, metalness: 0.4 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#161b22', roughness: 0.7, metalness: 0.2 });
  const solarMat = new THREE.MeshStandardMaterial({
    map: createSolarGridTexture(),
    roughness: 0.2,
    metalness: 0.8,
  });

  // Glowing beacon materials
  const amberGlow = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
  const cyanGlow = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
  const emeraldGlow = new THREE.MeshBasicMaterial({ color: '#10b981' });
  const purpleGlow = new THREE.MeshBasicMaterial({ color: '#a855f7' });

  // -----------------------------------------------------------------
  // 1. POI: SOLAR RIDGE (55, 4.5, 15)
  // -----------------------------------------------------------------
  const solarRidgeGroup = new THREE.Group();
  solarRidgeGroup.position.set(55, 4.0, 15);

  // Rock base plateau
  const ridgeBase = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 4, 12), darkMat);
  ridgeBase.position.y = -2;
  ridgeBase.receiveShadow = true;
  solarRidgeGroup.add(ridgeBase);

  // Twin massive tracking wings
  for (let i = -1; i <= 1; i += 2) {
    const wingMast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 6, 8), metalMat);
    wingMast.position.set(i * 6, 3, 0);
    wingMast.castShadow = true;
    solarRidgeGroup.add(wingMast);

    const wingPanel = new THREE.Mesh(new THREE.BoxGeometry(9, 0.15, 3.2), solarMat);
    wingPanel.position.set(i * 6, 6, 0);
    wingPanel.rotation.z = i * 0.18;
    wingPanel.castShadow = true;
    solarRidgeGroup.add(wingPanel);
  }

  // Solar Ridge Beacon
  const solarBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), amberGlow);
  solarBeacon.position.set(0, 6.5, 0);
  solarRidgeGroup.add(solarBeacon);

  group.add(solarRidgeGroup);

  // -----------------------------------------------------------------
  // 2. POI: ICE EXTRACTION CRATER (-65, 0.5, -50)
  // -----------------------------------------------------------------
  const iceCraterGroup = new THREE.Group();
  iceCraterGroup.position.set(-65, -1.0, -50);

  // Drill Rig Derrick Tower
  const derrickGeo = new THREE.CylinderGeometry(1.2, 3.5, 9, 4);
  const derrick = new THREE.Mesh(derrickGeo, metalMat);
  derrick.position.y = 4.5;
  derrick.castShadow = true;
  iceCraterGroup.add(derrick);

  // Subterranean Drill Bit Rod
  const drillRod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 8), darkMat);
  drillRod.position.y = 2.0;
  iceCraterGroup.add(drillRod);

  // Heated Water Storage Spheres
  for (let s = -1; s <= 1; s += 2) {
    const tank = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12), whiteMat);
    tank.position.set(s * 5, 2.0, 0);
    tank.castShadow = true;
    iceCraterGroup.add(tank);

    // Glowing moisture indicator ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.08, 8, 16), cyanGlow);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(s * 5, 2.0, 0);
    iceCraterGroup.add(ring);
  }

  // Drill Light
  const iceBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), cyanGlow);
  iceBeacon.position.set(0, 9.2, 0);
  iceCraterGroup.add(iceBeacon);

  group.add(iceCraterGroup);

  // -----------------------------------------------------------------
  // 3. POI: COMMS RELAY HILL (35, 9.5, -75)
  // -----------------------------------------------------------------
  const commsGroup = new THREE.Group();
  commsGroup.position.set(35, 8.5, -75);

  // Antenna Lattice Tower
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 2.2, 14, 6), metalMat);
  tower.position.y = 7;
  tower.castShadow = true;
  commsGroup.add(tower);

  // Parabolic High-Gain Dish (facing Earth orbit)
  const dishGeo = new THREE.SphereGeometry(3.5, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4);
  const dish = new THREE.Mesh(dishGeo, whiteMat);
  dish.position.set(0, 13.5, 0);
  dish.rotation.x = Math.PI * 0.75;
  dish.rotation.z = Math.PI * 0.15;
  dish.material.side = THREE.DoubleSide;
  dish.castShadow = true;
  commsGroup.add(dish);

  // High-frequency transponder horn
  const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 2, 8), darkMat);
  horn.position.set(0, 14.5, 1.2);
  horn.rotation.x = Math.PI * 0.75;
  commsGroup.add(horn);

  // Green operational status beacon
  const commsBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), emeraldGlow);
  commsBeacon.position.set(0, 15.5, 0);
  commsGroup.add(commsBeacon);

  group.add(commsGroup);

  // -----------------------------------------------------------------
  // 4. POI: SUPPLY DROP / ROVER WRECKAGE (-70, 3.2, 60)
  // -----------------------------------------------------------------
  const supplyGroup = new THREE.Group();
  supplyGroup.name = 'supply_wreck_poi';
  supplyGroup.position.set(-70, 2.5, 60);

  // Crashed hexagonal Cargo Lander Capsule (tilted in crater)
  const capsule = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.8, 4.2, 6), whiteMat);
  capsule.position.set(0, 2, 0);
  capsule.rotation.z = Math.PI * 0.15;
  capsule.rotation.x = -Math.PI * 0.1;
  capsule.castShadow = true;
  supplyGroup.add(capsule);

  // Charred heat shield rim
  const heatShield = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 3.9, 0.6, 6), darkMat);
  heatShield.position.set(0, 0.2, 0);
  heatShield.rotation.z = Math.PI * 0.15;
  supplyGroup.add(heatShield);

  // Damaged 6-wheel rover chassis nearby
  const roverChassis = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.0, 2.0), metalMat);
  roverChassis.position.set(5, 0.8, -2);
  roverChassis.rotation.y = Math.PI * 0.25;
  supplyGroup.add(roverChassis);

  // Wheels
  for (let w = -1; w <= 1; w++) {
    const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12), darkMat);
    wheelL.rotation.z = Math.PI / 2;
    wheelL.position.set(5 + w * 1.1, 0.5, -3.2);
    supplyGroup.add(wheelL);

    const wheelR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12), darkMat);
    wheelR.rotation.z = Math.PI / 2;
    wheelR.position.set(5 + w * 1.1, 0.5, -0.8);
    supplyGroup.add(wheelR);
  }

  // Interactive glowing Scavenge Parts Crate!
  const crateGeo = new THREE.BoxGeometry(1.2, 1.0, 1.2);
  const crateMesh = new THREE.Mesh(crateGeo, purpleGlow);
  crateMesh.position.set(3, 0.6, 2.5);
  crateMesh.name = 'scavenge_parts_crate';
  supplyGroup.add(crateMesh);

  group.add(supplyGroup);

  // -----------------------------------------------------------------
  // 5. POI: GEOLOGICAL CORE OUTCROP (45, 2.5, 60)
  // -----------------------------------------------------------------
  const geoGroup = new THREE.Group();
  geoGroup.name = 'geo_outcrop_poi';
  geoGroup.position.set(45, 2.0, 60);

  // Tiered sedimentary bedrock layer
  const rockLayer1 = new THREE.Mesh(new THREE.BoxGeometry(7, 1.4, 5), darkMat);
  rockLayer1.rotation.y = 0.2;
  rockLayer1.castShadow = true;
  rockLayer1.receiveShadow = true;
  geoGroup.add(rockLayer1);

  const rockLayer2 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 3.5), metalMat);
  rockLayer2.position.set(0.5, 1.1, -0.3);
  rockLayer2.rotation.y = -0.15;
  rockLayer2.castShadow = true;
  geoGroup.add(rockLayer2);

  // Core Sampling Drill Rig Tripod
  const tripodLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6), metalMat);
  tripodLeg1.position.set(-0.8, 1.8, 0);
  tripodLeg1.rotation.z = 0.25;
  geoGroup.add(tripodLeg1);

  const tripodLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6), metalMat);
  tripodLeg2.position.set(0.8, 1.8, 0);
  tripodLeg2.rotation.z = -0.25;
  geoGroup.add(tripodLeg2);

  // Glowing Cylindrical Core Sample Canisters
  for (let c = -1; c <= 1; c++) {
    const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), cyanGlow);
    canister.position.set(c * 0.45, 2.0, 0.8);
    canister.castShadow = true;
    geoGroup.add(canister);
  }

  // Geological beacon light
  const geoBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), cyanGlow);
  geoBeacon.position.set(0, 3.2, 0);
  geoGroup.add(geoBeacon);

  group.add(geoGroup);

  // -----------------------------------------------------------------
  // 6. POI: CRATER RIM EARLY-WARNING WEATHER BEACON (-25, 6.2, -80)
  // -----------------------------------------------------------------
  const weatherGroup = new THREE.Group();
  weatherGroup.name = 'weather_beacon_poi';
  weatherGroup.position.set(-25, 6.0, -80);

  // Weather Sensor Mast Tower
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 8.5, 6), metalMat);
  mast.position.y = 4.25;
  mast.castShadow = true;
  weatherGroup.add(mast);

  // Solar Radiometer Dome
  const radDome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 8), whiteMat);
  radDome.position.set(0, 8.5, 0);
  radDome.castShadow = true;
  weatherGroup.add(radDome);

  // Pulsing Warning Beacon Ring (Red/Rose)
  const warningMat = new THREE.MeshBasicMaterial({ color: '#f43f5e' });
  const pulseBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), warningMat);
  pulseBeacon.position.set(0, 9.4, 0);
  weatherGroup.add(pulseBeacon);

  // Horizontal Anemometer Arms
  const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08), darkMat);
  arm.position.set(0, 7.8, 0);
  weatherGroup.add(arm);

  group.add(weatherGroup);

  scene.add(group);
  return group;
}
