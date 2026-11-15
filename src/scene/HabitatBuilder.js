import * as THREE from 'three';

/**
 * Creates a high-resolution, crisp sci-fi backlit doorway signage placard texture.
 * Features beveled borders, technical corner brackets, LED status pip, and dual-tier typography.
 */
function createSignageTexture(text, subtitle = '', accentColor = '#38bdf8') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark slate brushed metal background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 1024, 256);

  // Subtle interior grid / scanline pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 2;
  for (let y = 16; y < 256; y += 16) {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(1008, y);
    ctx.stroke();
  }

  // Glowing Outer Beveled Border
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(14, 14, 996, 228);
  ctx.shadowBlur = 0; // reset

  // High-tech Corner Brackets
  ctx.fillStyle = accentColor;
  const bracketW = 48;
  const bracketH = 14;
  // Top-left
  ctx.fillRect(14, 14, bracketW, bracketH);
  ctx.fillRect(14, 14, bracketH, bracketW);
  // Top-right
  ctx.fillRect(1010 - bracketW, 14, bracketW, bracketH);
  ctx.fillRect(1010 - bracketH, 14, bracketH, bracketW);
  // Bottom-left
  ctx.fillRect(14, 242 - bracketH, bracketW, bracketH);
  ctx.fillRect(14, 242 - bracketW, bracketH, bracketW);
  // Bottom-right
  ctx.fillRect(1010 - bracketW, 242 - bracketH, bracketW, bracketH);
  ctx.fillRect(1010 - bracketH, 242 - bracketW, bracketH, bracketW);

  // Status LED Pip + Indicator
  ctx.fillStyle = '#10b981'; // Green online
  ctx.beginPath();
  ctx.arc(60, subtitle ? 72 : 128, 12, 0, Math.PI * 2);
  ctx.fill();

  // Primary Title Text (Bold crisp monospace)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 512, subtitle ? 96 : 128);

  // Subtitle / Directional Tag
  if (subtitle) {
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 30px "Courier New", monospace';
    ctx.fillText(subtitle, 512, 175);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Builds the Astroneer/ARK-style stylized low-poly 3D Mars Outpost Habitat:
 * - Animated sliding bulkhead doors with status LEDs
 * - Crisp backlit doorway signage tags
 * - Structural corridor wall ribs, ceiling pipes/conduits, LED light fixtures
 * - Central Command Hub with observation windows overlooking Martian terrain
 */
export function buildHabitat(scene) {
  const habitat = new THREE.Group();
  habitat.name = 'outpost_habitat';

  // Shared Materials
  const floorMat = new THREE.MeshLambertMaterial({ color: '#161b22', flatShading: true });
  const wallMat = new THREE.MeshLambertMaterial({ color: '#dbe2ea', flatShading: true });
  const darkWallMat = new THREE.MeshLambertMaterial({ color: '#21262d', flatShading: true });
  const metalTrimMat = new THREE.MeshLambertMaterial({ color: '#30363d' });
  const pipeMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.7, roughness: 0.3 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#88ccff',
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 0.5,
  });

  // Glowing accents
  const cyanGlowMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
  const orangeGlowMat = new THREE.MeshBasicMaterial({ color: '#d95d39' });
  const emeraldGlowMat = new THREE.MeshBasicMaterial({ color: '#10b981' });
  const amberGlowMat = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
  const redGlowMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });

  // Door animation registry: holds doors that slide open on player approach
  const animatedDoors = [];

  // -------------------------------------------------------------
  // HELPER: CREATE FRAMED BULKHEAD DOORWAY WITH SIGNAGE & SLIDING LEAVES
  // -------------------------------------------------------------
  const createDoorway = ({
    x,
    z,
    rotationY = 0,
    signText = '',
    signSub = '',
    backSignText = 'COMMAND HUB',
    backSignSub = 'CENTRAL HABITAT CORE',
    accentColor = '#38bdf8',
    doorWidth = 2.0,
    doorHeight = 2.4,
  }) => {
    const doorGroup = new THREE.Group();
    doorGroup.position.set(x, 0, z);
    doorGroup.rotation.y = rotationY;

    // 1. Heavy Reinforced Outer Door Frame (slate metal with beveled jambs)
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.35, doorHeight + 0.35, 0.45), darkWallMat);
    frameLeft.position.set(-(doorWidth / 2 + 0.175), (doorHeight + 0.35) / 2, 0);
    doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.35, doorHeight + 0.35, 0.45), darkWallMat);
    frameRight.position.set(doorWidth / 2 + 0.175, (doorHeight + 0.35) / 2, 0);
    doorGroup.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + 0.7, 0.35, 0.45), darkWallMat);
    frameTop.position.set(0, doorHeight + 0.175, 0);
    doorGroup.add(frameTop);

    // Hazard warning kickplates at base of jambs
    const kickGeo = new THREE.BoxGeometry(0.36, 0.25, 0.46);
    const kickMat = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
    const kickLeft = new THREE.Mesh(kickGeo, kickMat);
    kickLeft.position.set(-(doorWidth / 2 + 0.175), 0.125, 0);
    doorGroup.add(kickLeft);
    const kickRight = new THREE.Mesh(kickGeo, kickMat);
    kickRight.position.set(doorWidth / 2 + 0.175, 0.125, 0);
    doorGroup.add(kickRight);

    // Dynamic Status LED Light Bars over door lintel
    const ledMat = new THREE.MeshBasicMaterial({ color: '#10b981' }); // Green nominal
    const statusLed = new THREE.Mesh(new THREE.BoxGeometry(doorWidth * 0.85, 0.08, 0.48), ledMat);
    statusLed.position.set(0, doorHeight + 0.04, 0);
    doorGroup.add(statusLed);

    // Vertical status pips on left/right frame
    const pipGeo = new THREE.BoxGeometry(0.06, 0.4, 0.46);
    const pipLeft = new THREE.Mesh(pipGeo, ledMat);
    pipLeft.position.set(-(doorWidth / 2 + 0.175), doorHeight * 0.6, 0);
    doorGroup.add(pipLeft);
    const pipRight = new THREE.Mesh(pipGeo, ledMat);
    pipRight.position.set(doorWidth / 2 + 0.175, doorHeight * 0.6, 0);
    doorGroup.add(pipRight);

    // 2. Sliding Sci-Fi Bulkhead Door Leaves (Left and Right)
    const leafGeo = new THREE.BoxGeometry(doorWidth / 2, doorHeight - 0.05, 0.14);
    const leafMat = new THREE.MeshStandardMaterial({
      color: '#2d3748',
      metalness: 0.6,
      roughness: 0.35,
    });

    const leftLeaf = new THREE.Group();
    const leftMesh = new THREE.Mesh(leafGeo, leafMat);
    leftLeaf.add(leftMesh);
    // Tech horizontal groove on left leaf
    const grooveLeft = new THREE.Mesh(new THREE.BoxGeometry(doorWidth * 0.4, 0.04, 0.15), cyanGlowMat);
    grooveLeft.position.set(0, 0, 0);
    leftLeaf.add(grooveLeft);
    leftLeaf.position.set(-doorWidth / 4, doorHeight / 2, 0);
    doorGroup.add(leftLeaf);

    const rightLeaf = new THREE.Group();
    const rightMesh = new THREE.Mesh(leafGeo, leafMat);
    rightLeaf.add(rightMesh);
    // Tech horizontal groove on right leaf
    const grooveRight = new THREE.Mesh(new THREE.BoxGeometry(doorWidth * 0.4, 0.04, 0.15), cyanGlowMat);
    grooveRight.position.set(0, 0, 0);
    rightLeaf.add(grooveRight);
    rightLeaf.position.set(doorWidth / 4, doorHeight / 2, 0);
    doorGroup.add(rightLeaf);

    // 3. Crisp Backlit Doorway Signage Tag (Front Face)
    if (signText) {
      const signTexture = createSignageTexture(signText, signSub, accentColor);
      const signMat = new THREE.MeshBasicMaterial({
        map: signTexture,
        transparent: true,
      });

      const signGeo = new THREE.PlaneGeometry(2.1, 0.52);
      const frontSign = new THREE.Mesh(signGeo, signMat);
      frontSign.position.set(0, doorHeight + 0.52, 0.24);
      doorGroup.add(frontSign);

      // Back Face (shows target when viewing from the other side, e.g. COMMAND HUB)
      const backTexture = createSignageTexture(backSignText, backSignSub, '#38bdf8');
      const backMat = new THREE.MeshBasicMaterial({
        map: backTexture,
        transparent: true,
      });
      const backSign = new THREE.Mesh(signGeo, backMat);
      backSign.rotation.y = Math.PI;
      backSign.position.set(0, doorHeight + 0.52, -0.24);
      doorGroup.add(backSign);
    }

    habitat.add(doorGroup);

    // Register door animation object
    animatedDoors.push({
      group: doorGroup,
      worldPos: new THREE.Vector3(x, 1.2, z),
      leftLeaf,
      rightLeaf,
      statusLedMat: ledMat,
      doorWidth,
      currentOpenPct: 0, // 0 = closed, 1 = fully open
      triggerDistance: 3.8,
    });
  };

  // -------------------------------------------------------------
  // 1. CENTRAL COMMAND HUB (0, 0, 0) - ENHANCED SCI-FI INTERIOR
  // -------------------------------------------------------------
  const hubFloor = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.2, 24), floorMat);
  hubFloor.position.set(0, 0, 0);
  hubFloor.receiveShadow = true;
  habitat.add(hubFloor);

  // Hub Outer Wall Shell (4 Segmented Wall Arcs leaving open doorways for North, South, East, West corridors)
  const doorwayHalfAngle = 0.20; // ~2.8m open doorway clearance at radius 7.0m
  const quadrantSpan = (Math.PI / 2) - (doorwayHalfAngle * 2);
  for (let q = 0; q < 4; q++) {
    const startAngle = (q * Math.PI / 2) + doorwayHalfAngle;
    const wallSegment = new THREE.Mesh(
      new THREE.CylinderGeometry(7, 7, 3.6, 12, 1, true, startAngle, quadrantSpan),
      wallMat
    );
    wallSegment.position.set(0, 1.8, 0);
    wallSegment.material.side = THREE.DoubleSide;
    wallSegment.castShadow = true;
    wallSegment.receiveShadow = true;
    habitat.add(wallSegment);
  }

  // Hub Structural Perimeter Columns & Wall Panels (8 modular vertical ribs)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    // Skip doorways along primary cardinal axes
    if (Math.abs(Math.sin(angle)) < 0.15 || Math.abs(Math.cos(angle)) < 0.15) continue;

    const colX = Math.cos(angle) * 6.85;
    const colZ = Math.sin(angle) * 6.85;

    // Structural support column
    const colMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.6, 0.45), darkWallMat);
    colMesh.position.set(colX, 1.8, colZ);
    colMesh.rotation.y = -angle + Math.PI / 2;
    habitat.add(colMesh);

    // Inset Sci-Fi Tech Wall Telemetry Panel
    const panelMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.08), metalTrimMat);
    panelMesh.position.set(colX * 0.96, 1.8, colZ * 0.96);
    panelMesh.rotation.y = -angle + Math.PI / 2;
    habitat.add(panelMesh);

    // Glowing telemetry line
    const glowLine = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.09), cyanGlowMat);
    glowLine.position.set(colX * 0.955, 2.2, colZ * 0.955);
    glowLine.rotation.y = -angle + Math.PI / 2;
    habitat.add(glowLine);
  }

  // Hub Ceiling Dome
  const hubCeiling = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.35), wallMat);
  hubCeiling.position.set(0, 3.6, 0);
  hubCeiling.material.side = THREE.DoubleSide;
  habitat.add(hubCeiling);

  // Hub Center Ceiling Skylight Window
  const skylight = new THREE.Mesh(new THREE.CircleGeometry(2.2, 16), glassMat);
  skylight.position.set(0, 5.2, 0);
  skylight.rotation.x = -Math.PI / 2;
  habitat.add(skylight);

  // Overhead Flush LED Ceiling Panels (4 circular quadrant lights)
  const ceilingLightMat = new THREE.MeshBasicMaterial({ color: '#fef9c3' });
  [
    [2.8, 3.5, 2.8],
    [-2.8, 3.5, 2.8],
    [-2.8, 3.5, -2.8],
    [2.8, 3.5, -2.8],
  ].forEach(([lx, ly, lz]) => {
    const lightPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 1.2), ceilingLightMat);
    lightPlate.position.set(lx, ly, lz);
    habitat.add(lightPlate);
  });

  // Hub Interior Warm Illumination
  const hubLight = new THREE.PointLight('#fef08a', 1.6, 18);
  hubLight.position.set(0, 3.8, 0);
  habitat.add(hubLight);

  // Floor Illuminated Navigation Ring
  const floorRingGeo = new THREE.RingGeometry(2.5, 2.65, 32);
  floorRingGeo.rotateX(-Math.PI / 2);
  const floorRing = new THREE.Mesh(floorRingGeo, cyanGlowMat);
  floorRing.position.set(0, 0.11, 0);
  habitat.add(floorRing);

  // Overhead Conduit Junction Ring radiating to the 4 corridors
  const conduitRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.05, 8, 32), pipeMat);
  conduitRing.rotation.x = Math.PI / 2;
  conduitRing.position.set(0, 3.3, 0);
  habitat.add(conduitRing);

  // Hub Observation Windows overlooking Martian landscape (South-East & North-West)
  const createObservationWindow = (x, z, rotY, viewLabel = 'CHRYSE SECTOR') => {
    const winGroup = new THREE.Group();
    winGroup.position.set(x, 1.8, z);
    winGroup.rotation.y = rotY;

    // Heavy reinforced outer window frame
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 0.35), darkWallMat);
    winGroup.add(winFrame);

    // Beveled Sill Plate
    const sill = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 0.45), metalTrimMat);
    sill.position.set(0, -0.9, 0.05);
    winGroup.add(sill);

    // Glass Panes (Double insulated Martian tinted glass)
    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), glassMat);
    winGlass.position.z = 0.08;
    winGroup.add(winGlass);

    // Interior Warning Border at Base of Window
    const winStripe = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.08), new THREE.MeshBasicMaterial({ color: '#f59e0b' }));
    winStripe.position.set(0, -0.78, 0.09);
    winGroup.add(winStripe);

    habitat.add(winGroup);
  };

  createObservationWindow(4.6, 4.6, -Math.PI / 4, 'SOLAR RIDGE VISTA'); // Looking toward Solar Ridge
  createObservationWindow(-4.6, 4.6, Math.PI / 4, 'WEST BASIN VISTA');  // Looking toward Crash Basin

  // -------------------------------------------------------------
  // 2. CORRIDOR TUBES WITH PIPES, CONDUITS & STRUCTURAL BULKHEADS
  // -------------------------------------------------------------
  const createCorridor = (x, z, length, rotationY) => {
    const corridorGroup = new THREE.Group();
    corridorGroup.position.set(x, 1.4, z);
    corridorGroup.rotation.y = rotationY;

    // Flush Metallic Anti-Slip Floor (top surface precisely aligned with Hub floor at Y = +0.1)
    const cFloor = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.2, length), floorMat);
    cFloor.position.set(0, -1.4, 0);
    cFloor.receiveShadow = true;
    corridorGroup.add(cFloor);

    // Dark steel floor grating center tread
    const grateMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.6,
      metalness: 0.7,
    });
    const cGrate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, length * 0.98), grateMat);
    cGrate.position.set(0, -1.29, 0);
    corridorGroup.add(cGrate);

    // Left and Right safety curbs
    const curbMat = new THREE.MeshLambertMaterial({ color: '#334155' });
    const leftCurb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, length), curbMat);
    leftCurb.position.set(-1.3, -1.32, 0);
    corridorGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, length), curbMat);
    rightCurb.position.set(1.3, -1.32, 0);
    corridorGroup.add(rightCurb);

    // Recessed floor edge guide strip LEDs
    const leftGuide = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, length * 0.96), cyanGlowMat);
    leftGuide.position.set(-1.2, -1.29, 0);
    corridorGroup.add(leftGuide);
    const rightGuide = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, length * 0.96), cyanGlowMat);
    rightGuide.position.set(1.2, -1.29, 0);
    corridorGroup.add(rightGuide);

    // Pressurized Arch Ceiling & Walls
    const cArch = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, length, 16, 1, true, 0, Math.PI), wallMat);
    cArch.rotation.x = Math.PI / 2;
    cArch.position.set(0, 0.0, 0);
    cArch.material.side = THREE.DoubleSide;
    corridorGroup.add(cArch);

    // End Transition Collars (prevents gaps and z-fighting at hub & room junctions)
    const collarGeo = new THREE.TorusGeometry(1.52, 0.1, 8, 20, Math.PI);
    const collarStart = new THREE.Mesh(collarGeo, darkWallMat);
    collarStart.position.set(0, 0.0, -length / 2 + 0.05);
    corridorGroup.add(collarStart);

    const collarEnd = new THREE.Mesh(collarGeo, darkWallMat);
    collarEnd.position.set(0, 0.0, length / 2 - 0.05);
    corridorGroup.add(collarEnd);

    // Dual overhead daylight-balanced LED diffuser strips
    const cLightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, length * 0.94), new THREE.MeshBasicMaterial({ color: '#f8fafc' }));
    cLightStrip.position.set(0, 1.46, 0);
    corridorGroup.add(cLightStrip);

    // Utility Conduits & Pipes along walls (Oxygen Cyan, Water Blue, Power Yellow)
    const o2Pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, length, 8), cyanGlowMat);
    o2Pipe.rotation.x = Math.PI / 2;
    o2Pipe.position.set(1.35, 0.85, 0);
    corridorGroup.add(o2Pipe);

    const waterPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, length, 8), pipeMat);
    waterPipe.rotation.x = Math.PI / 2;
    waterPipe.position.set(-1.35, 0.85, 0);
    corridorGroup.add(waterPipe);

    const powerConduit = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 8), new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.4 }));
    powerConduit.rotation.x = Math.PI / 2;
    powerConduit.position.set(-1.35, 0.55, 0);
    corridorGroup.add(powerConduit);

    // Structural Wall Ribs with junction brackets
    for (let r = -length / 2 + 1.2; r <= length / 2 - 1.2; r += 1.4) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.065, 6, 16, Math.PI), metalTrimMat);
      rib.position.set(0, 0.0, r);
      corridorGroup.add(rib);

      // Junction box on rib
      const jBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.12), darkWallMat);
      jBox.position.set(1.38, 0.85, r);
      corridorGroup.add(jBox);
    }

    habitat.add(corridorGroup);
  };

  // Corridors connecting Hub to outer wings
  createCorridor(0, 8.5, 5, 0);           // North Corridor to Greenhouse
  createCorridor(-8.5, 0, 5, Math.PI / 2); // West Corridor to Life Support
  createCorridor(0, -8.5, 5, 0);          // South Corridor to Water/Power
  createCorridor(8.5, 0, 5, Math.PI / 2);  // East Corridor to Airlock

  // -------------------------------------------------------------
  // 3. BULKHEAD DOORS WITH CRISP SCI-FI SIGNAGE TAGS
  // -------------------------------------------------------------
  // North Doorway -> Greenhouse / Hydroponics
  createDoorway({
    x: 0,
    z: 6.2,
    rotationY: 0,
    signText: 'GREENHOUSE / HYDROPONICS',
    signSub: 'BIO-DOME & FOOD PRODUCTION [NORTH]',
    backSignText: 'COMMAND HUB',
    backSignSub: 'CENTRAL HABITAT CORE',
    accentColor: '#10b981',
  });

  // West Doorway -> Life Support / O2
  createDoorway({
    x: -6.2,
    z: 0,
    rotationY: Math.PI / 2,
    signText: 'LIFE SUPPORT / O2',
    signSub: 'SABATIER & O2 GENERATION [WEST]',
    backSignText: 'COMMAND HUB',
    backSignSub: 'CENTRAL HABITAT CORE',
    accentColor: '#06b6d4',
  });

  // South Doorway -> Water Recycler
  createDoorway({
    x: 0,
    z: -6.2,
    rotationY: 0,
    signText: 'WATER RECYCLER',
    signSub: 'ECLSS RECOVERY & STORAGE [SOUTH]',
    backSignText: 'COMMAND HUB',
    backSignSub: 'CENTRAL HABITAT CORE',
    accentColor: '#0ea5e9',
  });

  // East Doorway -> Airlock & Mars Surface
  createDoorway({
    x: 6.2,
    z: 0,
    rotationY: Math.PI / 2,
    signText: 'AIRLOCK → MARS SURFACE',
    signSub: 'SURFACE EVA TRANSITION [EAST]',
    backSignText: 'COMMAND HUB',
    backSignSub: 'CENTRAL HABITAT CORE',
    accentColor: '#f97316',
  });

  // Sub-Regolith Radiation Shelter Vault Doorway
  createDoorway({
    x: 4.2,
    z: 4.2,
    rotationY: -Math.PI / 4,
    signText: 'RADIATION SHELTER',
    signSub: 'STORM VAULT & CURIOSITY RAD',
    backSignText: 'COMMAND HUB',
    backSignSub: 'CENTRAL HABITAT CORE',
    accentColor: '#ef4444',
    doorWidth: 1.6,
  });

  // Storage & Repair Workbench Area Sign
  const benchSignTexture = createSignageTexture('REPAIR BENCH', 'PARTS & MAINTENANCE', '#a855f7');
  const benchSign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.42), new THREE.MeshBasicMaterial({ map: benchSignTexture }));
  benchSign.position.set(-4.2, 2.6, 4.2);
  benchSign.rotation.y = Math.PI / 4;
  habitat.add(benchSign);

  // -------------------------------------------------------------
  // 4. HYDROPONICS GREENHOUSE (North: 0, 0, 14)
  // -------------------------------------------------------------
  const ghFloor = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.2, 20), floorMat);
  ghFloor.position.set(0, 0, 14);
  ghFloor.receiveShadow = true;
  habitat.add(ghFloor);

  // Greenhouse Glass Geodesic Dome
  const ghDome = new THREE.Mesh(new THREE.SphereGeometry(5.5, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), glassMat);
  ghDome.position.set(0, 0.1, 14);
  ghDome.material.side = THREE.DoubleSide;
  habitat.add(ghDome);

  // Hydroponic Crop Racks
  const rackGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.4, 16, 1, true);
  const rack = new THREE.Mesh(rackGeo, darkWallMat);
  rack.position.set(0, 0.8, 14);
  habitat.add(rack);

  // Green plant clusters
  const plantGeo = new THREE.DodecahedronGeometry(0.35, 1);
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const px = Math.cos(angle) * 3.6;
    const pz = 14 + Math.sin(angle) * 3.6;
    const plant = new THREE.Mesh(plantGeo, emeraldGlowMat);
    plant.position.set(px, 1.1, pz);
    habitat.add(plant);
  }

  // Pink/Purple Grow Lamp Light
  const ghLight = new THREE.PointLight('#ec4899', 1.4, 12);
  ghLight.position.set(0, 3.2, 14);
  habitat.add(ghLight);

  // -------------------------------------------------------------
  // 5. LIFE SUPPORT & O2 BAY (West: -14, 0, 0)
  // -------------------------------------------------------------
  const o2Floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.2, 20), floorMat);
  o2Floor.position.set(-14, 0, 0);
  o2Floor.receiveShadow = true;
  habitat.add(o2Floor);

  const o2Dome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), wallMat);
  o2Dome.position.set(-14, 0.1, 0);
  o2Dome.material.side = THREE.DoubleSide;
  habitat.add(o2Dome);

  // Electrolysis Tanks
  const tankGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.4, 12);
  const o2Tank1 = new THREE.Mesh(tankGeo, metalTrimMat);
  o2Tank1.position.set(-15.5, 1.3, -1.5);
  habitat.add(o2Tank1);

  const o2Tank2 = new THREE.Mesh(tankGeo, metalTrimMat);
  o2Tank2.position.set(-15.5, 1.3, 1.5);
  habitat.add(o2Tank2);

  const o2Ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.06, 8, 16), cyanGlowMat);
  o2Ring.rotation.x = Math.PI / 2;
  o2Ring.position.set(-15.5, 1.8, -1.5);
  habitat.add(o2Ring);

  const o2Light = new THREE.PointLight('#38bdf8', 1.3, 11);
  o2Light.position.set(-14, 2.8, 0);
  habitat.add(o2Light);

  // -------------------------------------------------------------
  // 6. WATER RECYCLER BAY (South: 0, 0, -14)
  // -------------------------------------------------------------
  const waterFloor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.2, 20), floorMat);
  waterFloor.position.set(0, 0, -14);
  waterFloor.receiveShadow = true;
  habitat.add(waterFloor);

  const waterDome = new THREE.Mesh(new THREE.SphereGeometry(5.2, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), wallMat);
  waterDome.position.set(0, 0.1, -14);
  waterDome.material.side = THREE.DoubleSide;
  habitat.add(waterDome);

  const distillGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.8, 12);
  const distillTank = new THREE.Mesh(distillGeo, darkWallMat);
  distillTank.position.set(0, 1.4, -15.5);
  habitat.add(distillTank);

  const waterLight = new THREE.PointLight('#0284c7', 1.3, 11);
  waterLight.position.set(0, 2.8, -14);
  habitat.add(waterLight);

  // -------------------------------------------------------------
  // 7. SUB-REGOLITH RADIATION STORM SHELTER (North-East: 5, 0, 5)
  // -------------------------------------------------------------
  const shelterGroup = new THREE.Group();
  shelterGroup.position.set(5, 0, 5);

  const vaultFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.5), darkWallMat);
  vaultFrame.position.set(0, 1.3, 0);
  vaultFrame.rotation.y = -Math.PI / 4;
  shelterGroup.add(vaultFrame);

  const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.25, 16), metalTrimMat);
  hatch.position.set(0, 1.3, 0.15);
  hatch.rotation.x = Math.PI / 2;
  hatch.rotation.z = Math.PI / 4;
  shelterGroup.add(hatch);

  const shelterLight = new THREE.PointLight('#ef4444', 1.0, 7);
  shelterLight.position.set(0, 2.4, 0);
  shelterGroup.add(shelterLight);

  habitat.add(shelterGroup);

  // -------------------------------------------------------------
  // 8. STORAGE & REPAIR WORKBENCH (North-West: -5, 0, 5)
  // -------------------------------------------------------------
  const benchGroup = new THREE.Group();
  benchGroup.position.set(-5, 0, 5);

  const table = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 1.0), metalTrimMat);
  table.position.set(0, 0.45, 0);
  table.rotation.y = Math.PI / 4;
  benchGroup.add(table);

  const crateGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const crate1 = new THREE.Mesh(crateGeo, orangeGlowMat);
  crate1.position.set(-0.3, 1.0, 0);
  benchGroup.add(crate1);

  const crate2 = new THREE.Mesh(crateGeo, darkWallMat);
  crate2.position.set(0.3, 1.0, 0.1);
  benchGroup.add(crate2);

  habitat.add(benchGroup);

  // -------------------------------------------------------------
  // 9. PRESSURIZED AIRLOCK (East: 11, 0, 0)
  // -------------------------------------------------------------
  const airlockGroup = new THREE.Group();
  airlockGroup.position.set(11, 0, 0);

  // Hollow Pressurized Airlock Walls & Open Interior
  const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.2, 0.2), wallMat);
  wallNorth.position.set(0, 1.6, 1.6);
  wallNorth.castShadow = true;
  wallNorth.receiveShadow = true;
  airlockGroup.add(wallNorth);

  const wallSouth = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.2, 0.2), wallMat);
  wallSouth.position.set(0, 1.6, -1.6);
  wallSouth.castShadow = true;
  wallSouth.receiveShadow = true;
  airlockGroup.add(wallSouth);

  const airlockCeiling = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 3.4), wallMat);
  airlockCeiling.position.set(0, 3.2, 0);
  airlockGroup.add(airlockCeiling);

  // Interior chamber floor (flush at Y = 0.0 with 0.2 thickness, top surface at exact Y = +0.1)
  const airlockFloor = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 3.0), floorMat);
  airlockFloor.position.set(0, 0.0, 0);
  airlockFloor.receiveShadow = true;
  airlockGroup.add(airlockFloor);

  // Wall-mounted EVA Suit Lockers
  const lockerGeo = new THREE.BoxGeometry(0.5, 2.0, 0.8);
  const locker1 = new THREE.Mesh(lockerGeo, darkWallMat);
  locker1.position.set(0, 1.2, 1.4);
  airlockGroup.add(locker1);
  const locker2 = new THREE.Mesh(lockerGeo, darkWallMat);
  locker2.position.set(0, 1.2, -1.4);
  airlockGroup.add(locker2);

  // Oxygen recharge manifold on airlock wall
  const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), pipeMat);
  manifold.position.set(-0.8, 1.4, 1.55);
  manifold.rotation.z = Math.PI / 2;
  airlockGroup.add(manifold);

  const airlockLight = new THREE.PointLight('#10b981', 1.2, 9);
  airlockLight.position.set(0, 2.5, 0);
  airlockGroup.add(airlockLight);

  // Exterior Landing Pad at surface egress (flush at Y = 0.0, top surface at Y = +0.1)
  const padGeo = new THREE.BoxGeometry(3.5, 0.2, 3.5);
  const padMat = new THREE.MeshLambertMaterial({ color: '#334155' });
  const landingPad = new THREE.Mesh(padGeo, padMat);
  landingPad.position.set(3.8, 0.0, 0);
  landingPad.receiveShadow = true;
  airlockGroup.add(landingPad);

  habitat.add(airlockGroup);

  // Outer Bulkhead Door leading onto Mars Surface (x = 13.3)
  createDoorway({
    x: 13.3,
    z: 0,
    rotationY: Math.PI / 2,
    signText: 'AIRLOCK → MARS SURFACE',
    signSub: 'SURFACE EVA EGRESS // Chryse Planitia',
    backSignText: 'AIRLOCK INTERIOR',
    backSignSub: 'PRESSURIZED CYCLE CHAMBER',
    accentColor: '#f97316',
    doorWidth: 1.8,
  });

  // -------------------------------------------------------------
  // 10. EXTERIOR SOLAR FARM
  // -------------------------------------------------------------
  const createSolarWing = (x, z) => {
    const wingGroup = new THREE.Group();
    wingGroup.name = 'solar_wing';
    wingGroup.position.set(x, 0, z);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 5, 8), darkWallMat);
    mast.position.y = 2.5;
    wingGroup.add(mast);

    const panelGeo = new THREE.BoxGeometry(6, 0.12, 2.5);
    const panelMat = new THREE.MeshLambertMaterial({ color: '#1e3a5f' });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 4.8, 0);
    panel.rotation.z = Math.PI * 0.15;
    panel.castShadow = true;
    wingGroup.add(panel);

    const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 11, 6), metalTrimMat);
    conduit.position.set(-5.5, 0.1, 0);
    conduit.rotation.z = Math.PI / 2;
    wingGroup.add(conduit);

    habitat.add(wingGroup);
  };

  createSolarWing(24, 6);
  createSolarWing(24, -6);

  scene.add(habitat);

  // Function to animate sliding doors when player approaches
  const updateDoors = (cameraPos, delta) => {
    animatedDoors.forEach((door) => {
      const dist = Math.hypot(cameraPos.x - door.worldPos.x, cameraPos.z - door.worldPos.z);
      const isNearby = dist <= door.triggerDistance;
      const targetPct = isNearby ? 1.0 : 0.0;

      // Smooth lerp
      door.currentOpenPct = THREE.MathUtils.lerp(door.currentOpenPct, targetPct, delta * 5.0);

      const slideDist = (door.doorWidth / 2) * 0.88 * door.currentOpenPct;
      door.leftLeaf.position.x = -door.doorWidth / 4 - slideDist;
      door.rightLeaf.position.x = door.doorWidth / 4 + slideDist;

      // Update LED status color when opening/closing
      if (door.statusLedMat) {
        if (door.currentOpenPct > 0.05) {
          door.statusLedMat.color.set('#38bdf8'); // Cyan active opening/transit
        } else {
          door.statusLedMat.color.set('#10b981'); // Green locked & nominal
        }
      }
    });
  };

  return {
    group: habitat,
    updateDoors,
  };
}
