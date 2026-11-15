import * as THREE from 'three';

/**
 * Generates procedural canvas textures for ARK-inspired PBR rendering:
 * - Mars regolith color map with mineral variations
 * - Normal map with micro-bump grit
 * - Roughness & AO maps
 * - Photovoltaic cell grid texture
 */

export function createMarsTerrainTextures() {
  const width = 512;
  const height = 512;

  // 1. Diffuse / Color Map
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext('2d');

  // Base Mars rust gradient
  ctx.fillStyle = '#b84928';
  ctx.fillRect(0, 0, width, height);

  // Layered noise & mineral speckles
  for (let i = 0; i < 45000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2.2;
    const choice = Math.random();

    if (choice > 0.8) {
      ctx.fillStyle = 'rgba(74, 27, 15, 0.45)'; // dark basalt shadow
    } else if (choice > 0.5) {
      ctx.fillStyle = 'rgba(217, 93, 57, 0.4)';  // bright iron oxide
    } else if (choice > 0.2) {
      ctx.fillStyle = 'rgba(141, 61, 39, 0.35)'; // mid ochre
    } else {
      ctx.fillStyle = 'rgba(235, 138, 103, 0.25)'; // dusty highlight
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;
  colorTexture.repeat.set(16, 16);

  // 2. Normal Map (RGB surface angles)
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const nCtx = normalCanvas.getContext('2d');

  nCtx.fillStyle = 'rgb(128, 128, 255)'; // Flat normal vector (0, 0, 1)
  nCtx.fillRect(0, 0, width, height);

  const imgData = nCtx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const nx = 128 + (Math.random() - 0.5) * 45;
    const ny = 128 + (Math.random() - 0.5) * 45;
    data[i] = nx;     // R
    data[i + 1] = ny; // G
    data[i + 2] = 255;// B
  }
  nCtx.putImageData(imgData, 0, 0);

  const normalTexture = new THREE.CanvasTexture(normalCanvas);
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(16, 16);

  // 3. Roughness Map
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d');

  rCtx.fillStyle = '#d4d4d4'; // High roughness for dry Martian sand
  rCtx.fillRect(0, 0, width, height);

  for (let i = 0; i < 20000; i++) {
    rCtx.fillStyle = Math.random() > 0.5 ? '#b0b0b0' : '#f0f0f0';
    rCtx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  const roughnessTexture = new THREE.CanvasTexture(roughCanvas);
  roughnessTexture.wrapS = THREE.RepeatWrapping;
  roughnessTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.repeat.set(16, 16);

  return { colorTexture, normalTexture, roughnessTexture };
}

/**
 * Creates high-tech photovoltaic solar cell grid texture
 */
export function createSolarGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep metallic blue silicon
  ctx.fillStyle = '#0f2744';
  ctx.fillRect(0, 0, 256, 256);

  // Grid lines
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;

  const step = 32;
  for (let x = 0; x <= 256; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}
