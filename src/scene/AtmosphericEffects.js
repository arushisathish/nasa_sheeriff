import * as THREE from 'three';
import { MODULE_IDS } from '../data/modulesConfig';

/**
 * Manages reactive atmospheric and in-world visual feedback:
 * - Dynamic dust storm particle systems & red atmospheric fog thickening
 * - Multi-Sol weather transitions (incoming haze -> peak storm -> clearing)
 * - Module emergency strobes & spark particles when systems drop below 50% health
 * - Solar flare auroral radiation sky glow (amber/violet charged ion shift)
 * - Visual dust accumulation darkening on exterior solar panels
 */
export class AtmosphericEffects {
  constructor(scene) {
    this.scene = scene;
    this.dustParticles = null;
    this.dustCount = 2000;
    this.alarmLights = [];

    // Malfunction spark particles
    this.sparks = null;
    this.sparkCount = 80;
    this.sparkVelocities = [];

    // Solar flare sky glow light
    this.flareLight = null;

    this.createDustParticles();
    this.setupModuleAlarmLights();
    this.createSparkParticles();
    this.setupSolarFlareAtmosphere();
  }

  createDustParticles() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: '#e27b58',
      size: 0.24,
      transparent: true,
      opacity: 0.25,
    });

    this.dustParticles = new THREE.Points(geo, mat);
    this.dustParticles.name = 'dust_particles';
    this.scene.add(this.dustParticles);
  }

  setupModuleAlarmLights() {
    // Alarm strobe in O2 Bay (-14, 2.5, 0)
    const o2Alarm = new THREE.PointLight('#ef4444', 0, 9);
    o2Alarm.position.set(-14, 2.5, 0);
    this.scene.add(o2Alarm);

    // Alarm strobe in Water Bay (0, 2.5, -14)
    const waterAlarm = new THREE.PointLight('#ef4444', 0, 9);
    waterAlarm.position.set(0, 2.5, -14);
    this.scene.add(waterAlarm);

    // Alarm strobe in Greenhouse (0, 2.5, 14)
    const ghAlarm = new THREE.PointLight('#f59e0b', 0, 9);
    ghAlarm.position.set(0, 2.5, 14);
    this.scene.add(ghAlarm);

    this.alarmLights = [
      { moduleId: MODULE_IDS.LIFE_SUPPORT, light: o2Alarm, pos: new THREE.Vector3(-14, 1.8, 0) },
      { moduleId: MODULE_IDS.WATER_RECYCLING, light: waterAlarm, pos: new THREE.Vector3(0, 1.8, -14) },
      { moduleId: MODULE_IDS.GREENHOUSE, light: ghAlarm, pos: new THREE.Vector3(0, 1.8, 14) },
    ];
  }

  createSparkParticles() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.sparkCount * 3);

    for (let i = 0; i < this.sparkCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100; // start hidden underground
      positions[i * 3 + 2] = 0;
      this.sparkVelocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 4
      ));
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: '#facc15',
      size: 0.16,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    this.sparks = new THREE.Points(geo, mat);
    this.sparks.name = 'malfunction_sparks';
    this.scene.add(this.sparks);
  }

  setupSolarFlareAtmosphere() {
    // High-energy atmospheric radiation light
    this.flareLight = new THREE.HemisphereLight('#c084fc', '#fb923c', 0);
    this.flareLight.position.set(0, 50, 0);
    this.scene.add(this.flareLight);
  }

  update(delta, time, environment, moduleHealth = {}) {
    const cycle = environment?.weatherCycle;
    const dustTau = environment?.atmosphericDustTau || 0.45;
    
    // Determine dynamic weather stage
    const isDustStorm = dustTau > 1.8 || (cycle?.activeType === 'dust_storm' && cycle?.phase === 'active');
    const isDustHaze = dustTau > 1.0 || (cycle?.activeType === 'dust_storm' && (cycle?.phase === 'incoming' || cycle?.phase === 'clearing'));
    const isSolarFlare = environment?.solarActivity === 'X-Class Flare' || (cycle?.activeType === 'solar_flare' && cycle?.phase === 'active');
    const isRadiationElevated = cycle?.activeType === 'elevated_radiation' || cycle?.phase === 'incoming';

    // 1. Fog & Sky Background adjustment based on Dust Storm, Haze & Solar Flare
    let targetBgColor = new THREE.Color('#381810');
    if (this.scene.fog) {
      let targetFogDensity = 0.007 + dustTau * 0.006;
      let targetFogColor = new THREE.Color('#4d2318');

      if (isDustStorm) {
        targetFogDensity = 0.038;
        targetFogColor = new THREE.Color('#782c16'); // Dark swirling rust gloom
        targetBgColor = new THREE.Color('#5c2415');
      } else if (isDustHaze) {
        targetFogDensity = 0.022;
        targetFogColor = new THREE.Color('#5c2b1a'); // Gathering Martian dust haze
        targetBgColor = new THREE.Color('#4a1d12');
      } else if (isSolarFlare) {
        targetFogDensity = 0.015;
        targetFogColor = new THREE.Color('#6b21a8'); // Charged ionizing purple/amber glow
        targetBgColor = new THREE.Color('#581c87');
      } else if (isRadiationElevated) {
        targetFogColor = new THREE.Color('#581c87'); // High-speed stream ambient violet
        targetBgColor = new THREE.Color('#4c1d95');
      }

      this.scene.fog.density = THREE.MathUtils.lerp(this.scene.fog.density, targetFogDensity, delta * 2);
      this.scene.fog.color.lerp(targetFogColor, delta * 2);
    }

    if (this.scene.background && this.scene.background.isColor) {
      this.scene.background.lerp(targetBgColor, delta * 1.8);
    }

    // 2. Solar Flare Ambient Radiation Glow
    if (this.flareLight) {
      const targetFlareIntensity = isSolarFlare ? (1.4 + Math.sin(time * 3) * 0.4) : isRadiationElevated ? 0.6 : 0;
      this.flareLight.intensity = THREE.MathUtils.lerp(this.flareLight.intensity, targetFlareIntensity, delta * 3);
    }

    // 3. Dust Particle motion & opacity
    if (this.dustParticles) {
      let targetOpacity = 0.25;
      let windSpeed = 8;

      if (isDustStorm) {
        targetOpacity = 0.90;
        windSpeed = 44;
      } else if (isDustHaze) {
        targetOpacity = 0.55;
        windSpeed = 22;
      }

      this.dustParticles.material.opacity = THREE.MathUtils.lerp(this.dustParticles.material.opacity, targetOpacity, delta * 2);

      const positions = this.dustParticles.geometry.attributes.position.array;

      for (let i = 0; i < this.dustCount; i++) {
        positions[i * 3] += windSpeed * delta;
        positions[i * 3 + 1] -= (Math.random() * 2.5) * delta;

        if (positions[i * 3] > 80) positions[i * 3] = -80;
        if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 28;
      }

      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Module Emergency Alarm Flashing Strobes & Spark Emitters
    let brokenStationPos = null;
    this.alarmLights.forEach(({ moduleId, light, pos }) => {
      const health = moduleHealth[moduleId] ?? 100;
      if (health < 50) {
        // Flash alarm light
        const strobe = Math.sin(time * 9) > 0 ? 2.0 : 0.1;
        light.intensity = strobe;
        if (!brokenStationPos) brokenStationPos = pos;
      } else {
        light.intensity = 0;
      }
    });

    // 5. Update Malfunction Sparks
    if (this.sparks) {
      const positions = this.sparks.geometry.attributes.position.array;
      if (brokenStationPos) {
        for (let i = 0; i < this.sparkCount; i++) {
          const vel = this.sparkVelocities[i];
          positions[i * 3] += vel.x * delta;
          positions[i * 3 + 1] += vel.y * delta;
          positions[i * 3 + 2] += vel.z * delta;
          vel.y -= 9.8 * delta; // gravity on sparks

          // Reset spark if hit ground or expired
          if (positions[i * 3 + 1] < 0.2) {
            positions[i * 3] = brokenStationPos.x + (Math.random() - 0.5) * 0.4;
            positions[i * 3 + 1] = brokenStationPos.y;
            positions[i * 3 + 2] = brokenStationPos.z + (Math.random() - 0.5) * 0.4;
            vel.set(
              (Math.random() - 0.5) * 3,
              Math.random() * 2.8 + 0.8,
              (Math.random() - 0.5) * 3
            );
          }
        }
        this.sparks.material.opacity = 0.9;
      } else {
        // Hide sparks underground when no malfunction
        for (let i = 0; i < this.sparkCount; i++) {
          positions[i * 3 + 1] = -100;
        }
        this.sparks.material.opacity = 0;
      }
      this.sparks.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Exterior Solar Panel Dust Visual Cake
    this.scene.traverse((obj) => {
      if (obj.name === 'solar_wing') {
        obj.traverse((child) => {
          if (child.isMesh && child.material) {
            if (isDustStorm || dustTau > 1.2) {
              child.material.color.lerp(new THREE.Color('#63311c'), delta * 1.5);
            } else {
              child.material.color.lerp(new THREE.Color('#1e3a5f'), delta * 1.5);
            }
          }
        });
      }
    });
  }
}
