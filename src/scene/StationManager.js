import * as THREE from 'three';
import { getMartianTerrainHeight } from './MarsEnvironment';

export const STATIONS = [
  {
    id: 'command_console',
    name: 'Command Console',
    actionLabel: 'Access Mission Terminal & Advance Sol',
    position: new THREE.Vector3(0, 0, 0),
    interactionRadius: 3.2,
    color: '#38bdf8',
  },
  {
    id: 'life_support',
    name: 'Life Support & O2 Bay',
    actionLabel: 'Inspect Oxygen Generation & Electrolysis',
    position: new THREE.Vector3(-12.5, 0, 0),
    interactionRadius: 3.6,
    color: '#06b6d4',
  },
  {
    id: 'water_recycler',
    name: 'Water Recycler Bay',
    actionLabel: 'Inspect ECLSS Distillation & Reservoirs',
    position: new THREE.Vector3(0, 0, -12.5),
    interactionRadius: 3.6,
    color: '#0ea5e9',
  },
  {
    id: 'hydroponics',
    name: 'Hydroponics & Greenhouse',
    actionLabel: 'Monitor Crop Tiers & Nutrient Delivery',
    position: new THREE.Vector3(0, 0, 12.5),
    interactionRadius: 3.8,
    color: '#10b981',
  },
  {
    id: 'rad_shelter',
    name: 'Radiation Shelter & RAD Terminal',
    actionLabel: 'Inspect Curiosity RAD & Space Weather',
    position: new THREE.Vector3(4.5, 0, 4.5),
    interactionRadius: 3.2,
    color: '#ef4444',
  },
  {
    id: 'repair_bench',
    name: 'Storage & Repair Workbench',
    actionLabel: 'Manage Spare Parts & Module Maintenance',
    position: new THREE.Vector3(-4.5, 0, 4.5),
    interactionRadius: 3.2,
    color: '#a855f7',
  },
  {
    id: 'airlock',
    name: 'Pressurized Airlock',
    actionLabel: 'Cycle Airlock Pressure (Hab <-> Surface)',
    position: new THREE.Vector3(10.5, 0, 0),
    interactionRadius: 3.4,
    color: '#10b981',
  },
  // Surface Transport Rover
  {
    id: 'mars_rover',
    name: 'Mars Exploration Rover',
    actionLabel: 'Mount / Drive Surface Rover across Dunes',
    position: new THREE.Vector3(18.0, 0, 4.0),
    interactionRadius: 5.2, // Generous proximity check
    color: '#f97316',
  },
  // Distant Sector POI Stations
  {
    id: 'solar_ridge',
    name: 'Solar Ridge Array',
    actionLabel: 'Inspect Primary Tracking Wings & Dust Cover',
    position: new THREE.Vector3(55, 4.0, 15),
    interactionRadius: 6.5,
    color: '#f59e0b',
  },
  {
    id: 'ice_drill',
    name: 'Ice Extraction Drill Rig',
    actionLabel: 'Harvest Subsurface Water Ice (+60L Water) [E]',
    position: new THREE.Vector3(-65, 0.5, -50),
    interactionRadius: 6.5,
    color: '#0ea5e9',
  },
  {
    id: 'comms_dish',
    name: 'Comms Relay Tower',
    actionLabel: 'Inspect Deep Space Network Alignment',
    position: new THREE.Vector3(35, 9.5, -75),
    interactionRadius: 6.5,
    color: '#10b981',
  },
  {
    id: 'scavenge_wreck',
    name: 'Crashed Supply Drop Cargo',
    actionLabel: 'Scavenge Emergency Spare Parts (+4 Parts)',
    position: new THREE.Vector3(-67, 3.0, 62.5),
    interactionRadius: 5.5,
    color: '#a855f7',
  },
  {
    id: 'geo_samples',
    name: 'Geological Core Outcrop',
    actionLabel: 'Extract Regolith Core Sample [E]',
    position: new THREE.Vector3(45, 2.5, 60),
    interactionRadius: 6.5,
    color: '#06b6d4',
  },
  {
    id: 'weather_beacon',
    name: 'Crater Rim Early-Warning Beacon',
    actionLabel: 'Calibrate Weather Telemetry Sensor [E]',
    position: new THREE.Vector3(-25, 6.2, -80),
    interactionRadius: 6.5,
    color: '#f43f5e',
  },
];

export function updateRoverStationPosition(newPos) {
  const roverStation = STATIONS.find(s => s.id === 'mars_rover');
  if (roverStation && newPos) {
    roverStation.position.set(newPos.x, newPos.y, newPos.z);
  }
}

/**
 * Creates visual console pedestals and floating beacon markers in the 3D scene.
 */
export function createStationBeacons(scene) {
  const group = new THREE.Group();
  group.name = 'station_beacons';

  STATIONS.forEach((station) => {
    // Only build interior pedestals for base stations (distant POIs & rover have custom 3D models)
    if (station.position.length() < 25 && station.id !== 'mars_rover') {
      const deskGeo = new THREE.CylinderGeometry(0.5, 0.65, 0.95, 8);
      const deskMat = new THREE.MeshStandardMaterial({ color: '#21262d', roughness: 0.5, metalness: 0.5 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.copy(station.position);
      desk.position.y = 0.475;
      group.add(desk);

      // Glowing top interactive screen angled at 45 degrees
      const screenGeo = new THREE.BoxGeometry(0.7, 0.05, 0.45);
      const screenMat = new THREE.MeshBasicMaterial({ color: station.color });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.copy(station.position);
      screen.position.y = 1.0;
      screen.rotation.x = -Math.PI * 0.15;
      group.add(screen);

      // Subtle floating pulsing beacon ring
      const beaconGeo = new THREE.RingGeometry(0.65, 0.75, 16);
      beaconGeo.rotateX(-Math.PI / 2);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: station.color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(station.position);
      beacon.position.y = 0.06;
      group.add(beacon);
    }
  });

  scene.add(group);
  return group;
}

/**
 * Finds the nearest interactive station to the player camera.
 * Uses horizontal 2D distance for surface rover & outdoor POIs to prevent vertical Y errors.
 * @param {THREE.Vector3} cameraPosition
 * @returns {Object|null} The nearby station or null
 */
export function checkNearbyStation(cameraPosition) {
  let closestStation = null;
  let minDistance = Infinity;

  for (const station of STATIONS) {
    let dist;
    // For outdoor objects (rover and distant POIs), use horizontal distance to ignore terrain elevation mismatch
    if (station.id === 'mars_rover' || station.position.length() > 20) {
      const dx = cameraPosition.x - station.position.x;
      const dz = cameraPosition.z - station.position.z;
      dist = Math.hypot(dx, dz);
    } else {
      dist = cameraPosition.distanceTo(station.position);
    }

    if (dist <= station.interactionRadius && dist < minDistance) {
      minDistance = dist;
      closestStation = { ...station, distance: dist };
    }
  }

  return closestStation;
}
