import * as THREE from 'three';
import { getMartianTerrainHeight } from './MarsEnvironment';

/**
 * Procedural 3D Stylized Mars Exploration Rover (Astroneer / ARK style).
 * Features:
 * - Rugged slate & safety-orange all-terrain chassis
 * - 4 large rover wheels with tread spokes
 * - Roll-cage cockpit with seat and steering yoke
 * - Forward high-beam spotlights
 * - Communications antenna and rooftop solar panel
 */
export function createRoverModel(initialPos = new THREE.Vector3(18, 0, 4)) {
  const roverGroup = new THREE.Group();
  roverGroup.name = 'mars_rover_group';

  const groundY = getMartianTerrainHeight(initialPos.x, initialPos.z);
  roverGroup.position.set(initialPos.x, groundY + 0.6, initialPos.z);

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.6,
    roughness: 0.35,
  });

  const orangeAccentMat = new THREE.MeshStandardMaterial({
    color: '#ea580c',
    metalness: 0.4,
    roughness: 0.4,
  });

  const wheelMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.85,
    metalness: 0.1,
  });

  const hubcapMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    metalness: 0.7,
    roughness: 0.3,
  });

  const glowLightMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
  });

  // 1. Lower Main Chassis
  const chassisGeo = new THREE.BoxGeometry(2.4, 0.5, 3.6);
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.y = 0.3;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  roverGroup.add(chassis);

  // Chassis Orange Accent Rails
  const railGeo = new THREE.BoxGeometry(2.5, 0.15, 3.7);
  const rail = new THREE.Mesh(railGeo, orangeAccentMat);
  rail.position.y = 0.55;
  roverGroup.add(rail);

  // 2. Cockpit Roll Cage
  const cageGeo = new THREE.BoxGeometry(2.0, 1.2, 2.2);
  const cageEdges = new THREE.EdgesGeometry(cageGeo);
  const cageLineMat = new THREE.LineBasicMaterial({ color: '#f97316', linewidth: 3 });
  const rollCage = new THREE.LineSegments(cageEdges, cageLineMat);
  rollCage.position.set(0, 1.2, -0.2);
  roverGroup.add(rollCage);

  // Cockpit Seat
  const seatGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const seat = new THREE.Mesh(seatGeo, chassisMat);
  seat.position.set(0, 0.8, -0.2);
  roverGroup.add(seat);

  // Steering Yoke
  const yokeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6);
  const yoke = new THREE.Mesh(yokeGeo, hubcapMat);
  yoke.rotation.x = Math.PI / 4;
  yoke.position.set(0, 1.0, 0.6);
  roverGroup.add(yoke);

  // 3. 4 Chunky All-Terrain Wheels
  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.4, 0.0, 1.3],   // Front Left
    [1.4, 0.0, 1.3],    // Front Right
    [-1.4, 0.0, -1.3],  // Rear Left
    [1.4, 0.0, -1.3],   // Rear Right
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheelAssembly = new THREE.Group();
    wheelAssembly.position.set(wx, wy, wz);

    const tire = new THREE.Mesh(wheelGeo, wheelMat);
    tire.castShadow = true;
    wheelAssembly.add(tire);

    // Hubcap
    const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.48, 8);
    capGeo.rotateZ(Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, hubcapMat);
    wheelAssembly.add(cap);

    roverGroup.add(wheelAssembly);
    wheels.push(wheelAssembly);
  });

  // 4. Rooftop Solar Panel Canopy
  const canopyGeo = new THREE.BoxGeometry(1.8, 0.08, 1.8);
  const canopyMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    metalness: 0.8,
    roughness: 0.2,
  });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 1.85, -0.2);
  canopy.castShadow = true;
  roverGroup.add(canopy);

  // 5. Dual Forward Headlights & Spotlights
  const leftLightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), glowLightMat);
  leftLightMesh.position.set(-0.7, 0.5, 1.85);
  roverGroup.add(leftLightMesh);

  const rightLightMesh = leftLightMesh.clone();
  rightLightMesh.position.x = 0.7;
  roverGroup.add(rightLightMesh);

  const headSpotlight = new THREE.SpotLight('#bae6fd', 3.0, 45, Math.PI / 4, 0.3);
  headSpotlight.position.set(0, 0.8, 1.85);
  headSpotlight.target.position.set(0, 0, 15);
  roverGroup.add(headSpotlight);
  roverGroup.add(headSpotlight.target);

  // 6. Rear High-Gain Antenna
  const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6);
  const mast = new THREE.Mesh(mastGeo, chassisMat);
  mast.position.set(-0.8, 1.4, -1.6);
  roverGroup.add(mast);

  const dishGeo = new THREE.ConeGeometry(0.35, 0.25, 8);
  dishGeo.rotateX(Math.PI / 2);
  const dish = new THREE.Mesh(dishGeo, hubcapMat);
  dish.position.set(-0.8, 2.2, -1.6);
  roverGroup.add(dish);

  return {
    group: roverGroup,
    wheels,
    headSpotlight,
    setPosition: (pos, yaw) => {
      const gY = getMartianTerrainHeight(pos.x, pos.z);
      roverGroup.position.set(pos.x, gY + 0.6, pos.z);
      roverGroup.rotation.y = yaw;
    },
    rotateWheels: (speedDelta) => {
      wheels.forEach((w) => {
        w.children[0].rotation.x += speedDelta;
      });
    }
  };
}
