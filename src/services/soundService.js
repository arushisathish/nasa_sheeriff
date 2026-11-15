/**
 * Outpost Zero - Synthesized NASA Mission Control Web Audio Engine
 * Uses browser Web Audio API for zero-dependency, ultra-crisp procedural sound effects.
 */

let audioCtx = null;
let isMuted = false;
let masterVolume = 0.8;

// Continuous Ambient Soundscape Web Audio Nodes
let ambientNoiseSource = null;
let windFilter = null;
let windGain = null;
let habFilter = null;
let habGain = null;
let habHumOsc = null;
let isAmbientActive = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundService = {
  isMuted() {
    return isMuted;
  },

  getVolume() {
    return masterVolume;
  },

  setVolume(vol) {
    masterVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('outpost_zero_audio_vol', masterVolume.toString());
    } catch (e) {}
  },

  setMuted(muted) {
    isMuted = muted;
    try {
      localStorage.setItem('outpost_zero_audio_muted', muted ? 'true' : 'false');
    } catch (e) {}
  },

  initMuteState() {
    try {
      const savedMute = localStorage.getItem('outpost_zero_audio_muted');
      if (savedMute !== null) {
        isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('outpost_zero_audio_vol');
      if (savedVol !== null) {
        masterVolume = parseFloat(savedVol);
      }
    } catch (e) {}
  },

  // Subtle terminal click / keypress blip
  playClick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04 * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  },

  // Sol Advance transition chime
  playAdvanceSol() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      osc2.frequency.setValueAtTime(554.37, now + 0.08); // C#5
      osc2.frequency.exponentialRampToValueAtTime(1108.73, now + 0.25);

      gain.gain.setValueAtTime(0.06 * masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);

      osc1.stop(now + 0.25);
      osc2.stop(now + 0.35);
    } catch (e) {}
  },

  // Jump sound (gentle air burst)
  playJump() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

      gain.gain.setValueAtTime(0.03 * masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  },

  // Low oxygen warning beep
  playLowO2Warning() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.setValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.05 * masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  },

  // Emergency incident / alert chime
  playAlert() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.15);
      osc.frequency.linearRampToValueAtTime(800, now + 0.30);
      osc.frequency.linearRampToValueAtTime(600, now + 0.45);

      gain.gain.setValueAtTime(0.05 * masterVolume, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  },

  // Pneumatic airlock pressurization & steam hiss
  playAirlockCycle() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Procedural white noise with exponential decay
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 1.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate high-pressure pneumatic gas hiss
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 2.0);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 * masterVolume, now);
      gain.gain.linearRampToValueAtTime(0.12 * masterVolume, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 2.2);
    } catch (e) {}
  },

  // Sci-fi holographic scanner ping
  playScannerToggle(active = true) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (active) {
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(1450, now + 0.14);
      } else {
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
      }

      gain.gain.setValueAtTime(0.06 * masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  },

  // Footstep crunch on Martian regolith or interior deck
  playFootstep(isOutdoors = false) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isOutdoors) {
        // Regolith sand crunch: filtered low thud
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.035 * masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      } else {
        // Metallic deck click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);
        gain.gain.setValueAtTime(0.02 * masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  },

  // Rover electric motor hum
  playRoverMount() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

      gain.gain.setValueAtTime(0.04 * masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  },

  // Mission victory fanfare chord
  playVictory() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.05 * masterVolume, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + 1.2);
      });
    } catch (e) {}
  },

  // -------------------------------------------------------------
  // CONTINUOUS ATMOSPHERIC WIND & HABITAT SOUNDSCAPES
  // -------------------------------------------------------------
  startAmbientLoop() {
    if (isAmbientActive) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // 1. Generate 5-second seamless looped noise buffer
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      ambientNoiseSource = ctx.createBufferSource();
      ambientNoiseSource.buffer = buffer;
      ambientNoiseSource.loop = true;

      // 2. Outdoor Martian Wind Filter & Gain (Bandpass wind howling)
      windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(360, ctx.currentTime);
      windFilter.Q.setValueAtTime(2.5, ctx.currentTime);

      windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.001, ctx.currentTime);

      ambientNoiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ctx.destination);

      // 3. Indoor Habitat Life Support Air Circulation (Deep Lowpass hum)
      habFilter = ctx.createBiquadFilter();
      habFilter.type = 'lowpass';
      habFilter.frequency.setValueAtTime(160, ctx.currentTime);

      habGain = ctx.createGain();
      habGain.gain.setValueAtTime(0.001, ctx.currentTime);

      ambientNoiseSource.connect(habFilter);
      habFilter.connect(habGain);
      habGain.connect(ctx.destination);

      // Subtle 60Hz AC coolant pump hum
      habHumOsc = ctx.createOscillator();
      habHumOsc.type = 'sine';
      habHumOsc.frequency.setValueAtTime(62, ctx.currentTime);
      habHumOsc.connect(habGain);

      ambientNoiseSource.start();
      habHumOsc.start();
      isAmbientActive = true;
    } catch (e) {
      console.warn('Audio: Ambient loop could not be started', e);
    }
  },

  updateAmbient(isOutdoors = false, dustTau = 0.45) {
    if (!isAmbientActive) {
      this.startAmbientLoop();
    }
    const ctx = getAudioContext();
    if (!ctx || !windGain || !habGain) return;

    try {
      const now = ctx.currentTime;
      if (isMuted) {
        windGain.gain.setTargetAtTime(0.0001, now, 0.1);
        habGain.gain.setTargetAtTime(0.0001, now, 0.1);
        return;
      }

      if (isOutdoors) {
        // Dynamic wind howling outside that scales with optical depth tau
        const windVolume = Math.min(0.12, (0.035 + (dustTau || 0.45) * 0.03)) * masterVolume;
        const windPitch = Math.min(850, 320 + (dustTau || 0.45) * 160);

        windGain.gain.setTargetAtTime(windVolume, now, 0.25);
        if (windFilter) windFilter.frequency.setTargetAtTime(windPitch, now, 0.3);
        habGain.gain.setTargetAtTime(0.0001, now, 0.25);
      } else {
        // Interior habitat: muffled wind outside, crisp ECLSS ventilation inside
        windGain.gain.setTargetAtTime(0.003 * masterVolume, now, 0.3);
        if (windFilter) windFilter.frequency.setTargetAtTime(240, now, 0.3);
        habGain.gain.setTargetAtTime(0.025 * masterVolume, now, 0.25);
      }
    } catch (e) {}
  },

  stopAmbientLoop() {
    if (!isAmbientActive) return;
    try {
      if (ambientNoiseSource) {
        ambientNoiseSource.stop();
        ambientNoiseSource.disconnect();
      }
      if (habHumOsc) {
        habHumOsc.stop();
        habHumOsc.disconnect();
      }
      isAmbientActive = false;
    } catch (e) {}
  },

  // Field Harvest sample / Ice drill sound effect
  playSampleHarvest() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Mechanical buzz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.linearRampToValueAtTime(280, now + 0.35);
      gain1.gain.setValueAtTime(0.04 * masterVolume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Success chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc2.frequency.setValueAtTime(880.00, now + 0.30); // A5
      gain2.gain.setValueAtTime(0.05 * masterVolume, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.65);
    } catch (e) {}
  },

  // Remote Weather Telemetry Beacon Deployment blip
  playBeaconDeploy() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [880, 1174.66, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.04 * masterVolume, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.18);
      });
    } catch (e) {}
  }
};
