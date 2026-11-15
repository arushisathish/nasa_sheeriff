import * as THREE from 'three';
import { createMarsTerrainTextures } from './ProceduralTextures';
import { buildDistantPOIs } from './PointsOfInterest';

/**
 * Mathematical heightmap function used by both terrain mesh & player physics
 */
export function getMartianTerrainHeight(x, z) {
  const distFromCenter = Math.sqrt(x * x + z * z);
  if (distFromCenter <= 16) {
    return 0; // Flat habitat footprint
  }

  // Natural rolling dunes
  let height = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.5;
  height += Math.sin(x * 0.02 + z * 0.02) * 3.5;

  // POI 1: Solar Ridge Plateau (55, 15)
  const distSolar = Math.sqrt((x - 55) ** 2 + (z - 15) ** 2);
  if (distSolar < 22) {
    height += Math.cos((distSolar / 22) * (Math.PI / 2)) * 4.5;
  }

  // POI 2: Ice Extraction Crater (-65, -50)
  const distIce = Math.sqrt((x + 65) ** 2 + (z + 50) ** 2);
  if (distIce < 25) {
    height -= Math.cos((distIce / 25) * (Math.PI / 2)) * 4.0;
  }

  // POI 3: Comms Relay Hill (35, -75)
  const distComms = Math.sqrt((x - 35) ** 2 + (z + 75) ** 2);
  if (distComms < 28) {
    height += Math.cos((distComms / 28) * (Math.PI / 2)) * 8.5;
  }

  // POI 4: Supply Drop Crash Basin (-70, 60)
  const distSupply = Math.sqrt((x + 70) ** 2 + (z - 60) ** 2);
  if (distSupply < 20) {
    height += Math.sin((distSupply / 20) * Math.PI) * 1.5;
  }

  // POI 5: Geological Core Ridge (45, 60)
  const distGeo = Math.sqrt((x - 45) ** 2 + (z - 60) ** 2);
  if (distGeo < 22) {
    height += Math.cos((distGeo / 22) * (Math.PI / 2)) * 2.5;
  }

  // POI 6: Crater Rim Weather Hill (-25, -80)
  const distBeacon = Math.sqrt((x + 25) ** 2 + (z + 80) ** 2);
  if (distBeacon < 24) {
    height += Math.cos((distBeacon / 24) * (Math.PI / 2)) * 6.0;
  }

  return height;
}

/**
 * ARK-Inspired Open-World Mars Sector (250m x 250m):
 * - Procedural 3D heightmap terrain with craters, ridges, and valleys
 * - Procedural PBR normal & roughness maps
 * - 5 Major Points of Interest (POIs) across Chryse Planitia
 * - Realistic Martian atmospheric dust fog (FogExp2)
 */
export function createMarsEnvironment(scene) {
  const group = new THREE.Group();
  group.name = 'mars_environment';

  // 1. Martian Atmospheric Fog & Sky Color
  scene.background = new THREE.Color('#381810');
  scene.fog = new THREE.FogExp2('#4d2116', 0.009);

  // 2. Sunlight (Warm low-angle Martian Sun with soft shadows)
  const sunLight = new THREE.DirectionalLight('#ffe8d6', 2.0);
  sunLight.position.set(70, 50, -55);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 280;
  const d = 90;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Soft ambient fill light (Mars orange bounce)
  const ambientLight = new THREE.AmbientLight('#a2482c', 0.65);
  scene.add(ambientLight);

  // Sky hemisphere light
  const hemiLight = new THREE.HemisphereLight('#f5a57a', '#240d07', 0.55);
  scene.add(hemiLight);

  // 3. Procedural PBR Textures
  const { colorTexture, normalTexture, roughnessTexture } = createMarsTerrainTextures();

  // 4. Large 250m x 250m Procedural Heightmap Terrain
  const terrainGeo = new THREE.PlaneGeometry(250, 250, 96, 96);
  terrainGeo.rotateX(-Math.PI / 2);

  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    const distFromCenter = Math.sqrt(x * x + z * z);
    if (distFromCenter > 16) {
      // Natural rolling dunes
      let height = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.5;
      height += Math.sin(x * 0.02 + z * 0.02) * 3.5;

      // POI 1: Solar Ridge Plateau (55, 15)
      const distSolar = Math.sqrt((x - 55) ** 2 + (z - 15) ** 2);
      if (distSolar < 22) {
        height += Math.cos((distSolar / 22) * (Math.PI / 2)) * 4.5;
      }

      // POI 2: Ice Extraction Crater (-65, -50)
      const distIce = Math.sqrt((x + 65) ** 2 + (z + 50) ** 2);
      if (distIce < 25) {
        height -= Math.cos((distIce / 25) * (Math.PI / 2)) * 4.0;
      }

      // POI 3: Comms Relay Hill (35, -75)
      const distComms = Math.sqrt((x - 35) ** 2 + (z + 75) ** 2);
      if (distComms < 28) {
        height += Math.cos((distComms / 28) * (Math.PI / 2)) * 8.5;
      }

      // POI 4: Supply Drop Crash Basin (-70, 60)
      const distSupply = Math.sqrt((x + 70) ** 2 + (z - 60) ** 2);
      if (distSupply < 20) {
        height += Math.sin((distSupply / 20) * Math.PI) * 1.5;
      }

      // POI 5: Geological Core Ridge (45, 60)
      const distGeo = Math.sqrt((x - 45) ** 2 + (z - 60) ** 2);
      if (distGeo < 22) {
        height += Math.cos((distGeo / 22) * (Math.PI / 2)) * 2.5;
      }

      // POI 6: Crater Rim Weather Hill (-25, -80)
      const distBeacon = Math.sqrt((x + 25) ** 2 + (z + 80) ** 2);
      if (distBeacon < 24) {
        height += Math.cos((distBeacon / 24) * (Math.PI / 2)) * 6.0;
      }

      pos.setY(i, height);
    } else {
      // Habitat base foundation remains flat
      pos.setY(i, -0.05);
    }
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.85, 0.85),
    roughnessMap: roughnessTexture,
    roughness: 0.88,
    metalness: 0.1,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  group.add(terrainMesh);

  // 5. Distant Mountain Ring (Perimeter barrier)
  const mountainGeo = new THREE.CylinderGeometry(125, 140, 38, 48, 2, true);
  const mountainPos = mountainGeo.attributes.position;
  for (let i = 0; i < mountainPos.count; i++) {
    const y = mountainPos.getY(i);
    if (y > 0) {
      const x = mountainPos.getX(i);
      const z = mountainPos.getZ(i);
      mountainPos.setY(i, y + Math.sin(x * 0.1) * Math.cos(z * 0.1) * 14);
    }
  }
  mountainGeo.computeVertexNormals();
  const mountainMat = new THREE.MeshStandardMaterial({
    color: '#4e1b0f',
    roughness: 0.95,
    metalness: 0.1,
    side: THREE.BackSide,
    flatShading: true,
  });
  const mountainMesh = new THREE.Mesh(mountainGeo, mountainMat);
  mountainMesh.position.y = 12;
  group.add(mountainMesh);

  // 6. Scattered Martian Boulders & Rock Clusters
  const rockGeo = new THREE.DodecahedronGeometry(1.2, 1);
  const rockMat = new THREE.MeshStandardMaterial({
    color: '#6e2715',
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true,
  });

  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 95;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const rock = new THREE.Mesh(rockGeo, rockMat);
    const scale = 0.8 + Math.random() * 2.4;
    rock.scale.set(scale, scale * 0.75, scale);
    rock.position.set(x, scale * 0.4, z);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  // 7. Build the 5 Major POIs
  buildDistantPOIs(scene);

  scene.add(group);
  return group;
}
