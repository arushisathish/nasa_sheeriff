import React, { useState, useEffect, useRef } from 'react';
import { 
  Orbit, 
  Radio, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  RotateCw, 
  Cpu, 
  Layers, 
  Globe, 
  Compass,
  Zap,
  ShieldCheck,
  Wind
} from 'lucide-react';
import { soundService } from '../services/soundService';

const BOOT_STEPS = [
  { 
    id: 'tunnels', 
    label: 'PRESSURIZING HABITAT TUNNELS', 
    doneTag: '[OK]', 
    threshold: 20, 
    detail: 'Hermetic bulkhead seals engaged at 101.3 kPa cabin pressure' 
  },
  { 
    id: 'eclss', 
    label: 'CALIBRATING ECLSS O2 & WATER RECYCLERS', 
    doneTag: '[OK]', 
    threshold: 42, 
    detail: 'CDRA amine scrubbing online • OGA electrolysis nominal' 
  },
  { 
    id: 'rad', 
    label: 'LOADING CURIOSITY RAD REFERENCE DATA', 
    doneTag: '[OK]', 
    threshold: 65, 
    detail: 'Gale Crater baseline calibrated at 0.67 mSv/day surface flux' 
  },
  { 
    id: 'donki', 
    label: 'SYNCING NASA DONKI SPACE-WEATHER FEED', 
    doneTag: '[OK]', 
    threshold: 85, 
    detail: 'Heliophysics active region monitor synced with Chryse sector' 
  },
  { 
    id: 'terrain', 
    label: 'INITIALIZING 3D JEZERO SECTOR TERRAIN', 
    doneTag: '[READY]', 
    threshold: 100, 
    detail: 'PBR regolith shaders & atmospheric dust scatter compiled' 
  },
];

const MARS_FACTS = [
  "Mars surface pressure averages ~6.1–6.36 mbar—less than 1% of Earth's mean sea level pressure (1013.25 mbar).",
  "NASA Curiosity RAD measured ~0.64–0.67 mSv/day baseline cosmic radiation on the Martian surface at Gale Crater.",
  "NASA MOXIE onboard Perseverance successfully produced breathable O2 from atmospheric CO2 at up to 12g per hour.",
  "Martian surface gravity is ~0.38g (3.72 m/s²)—an 80 kg astronaut weighs only ~30.4 kg on the surface.",
  "Chryse Planitia surface temperatures fluctuate diurnally from -15°C at midday down to -90°C during polar night.",
  "Martian dust storms can reach optical depth tau > 4.0, reducing solar array insolation by over 95%."
];

export default function LoadingScreen({
  onComplete,
  minimumDuration = 1800,
  mode = 'boot', // 'boot' or 'outpost'
  isReady = true,
}) {
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [telemetryTime, setTelemetryTime] = useState('00:00:00 UTC');
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);

  // Update real-time clock indicator
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTelemetryTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fact ticker cycler
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % MARS_FACTS.length);
    }, 3800);
    return () => clearInterval(factInterval);
  }, []);

  // Smooth progress sequence
  useEffect(() => {
    const stepDuration = Math.max(minimumDuration, 1800);
    const intervalTime = 30; // 33 ticks/sec
    const increment = 100 / (stepDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + increment + (Math.random() * 0.4 - 0.2));
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minimumDuration]);

  // Check completion: when progress hits 100% and isReady is satisfied
  useEffect(() => {
    if (progress >= 100 && isReady && !completedRef.current) {
      completedRef.current = true;
      const elapsed = Date.now() - startTimeRef.current;
      const remainingWait = Math.max(0, minimumDuration - elapsed);

      const finishTimer = setTimeout(() => {
        setIsFadingOut(true);
        try {
          soundService.playClick();
        } catch (e) {}
        const fadeTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 350); // Duration of fade-out animation
        return () => clearTimeout(fadeTimer);
      }, remainingWait + 200);

      return () => clearTimeout(finishTimer);
    }
  }, [progress, isReady, minimumDuration, onComplete]);

  // Emergency safety fallback: ensure loading screen NEVER gets stuck
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    }, Math.max(minimumDuration + 2500, 4500));

    return () => clearTimeout(safetyTimeout);
  }, [minimumDuration, onComplete]);

  const activeStep = BOOT_STEPS.find((s) => progress < s.threshold) || BOOT_STEPS[BOOT_STEPS.length - 1];
  const roundedProgress = Math.min(100, Math.floor(progress));

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-10 select-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0b0f14' }}
    >
      {/* Background Ambient Glow & Tactical Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38bdf8 1px, transparent 1px),
              linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Center Mars Rust Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-mars-600/10 via-cyan-500/5 to-mars-500/10 blur-[130px] rounded-full" />
      </div>

      {/* 1. Header: Outpost Zero Mars Habitat Telemetry */}
      <header className="relative z-10 flex items-center justify-between pb-5 border-b border-space-700/60 font-mono">
        <div className="flex items-center gap-3.5">
          {/* Animated Mission Patch / Orbital Ring Icon */}
          <div className="relative w-11 h-11 rounded-xl bg-space-900 border border-space-700 flex items-center justify-center overflow-hidden shadow-lg shadow-black/40">
            {/* Outer Rotating Dashed Ring */}
            <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400/40 animate-[spin_16s_linear_infinite]" />
            {/* Inner Counter-Rotating Ring */}
            <div className="absolute inset-2 rounded-full border border-mars-500/50 animate-[spin_10s_linear_infinite_reverse]" />
            {/* Core Mars Glyph */}
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-mars-600 to-mars-400 shadow-[0_0_10px_#d95d39]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h1 className="text-sm sm:text-base font-bold tracking-widest text-white uppercase">
                OUTPOST ZERO // MARS HABITAT TELEMETRY
              </h1>
            </div>
            <p className="text-[11px] text-space-400 tracking-wider">
              {mode === 'outpost' 
                ? 'INITIALIZING CHRYSE SECTOR 3D SIMULATION' 
                : 'MISSION ARCHITECTURE • PRE-FLIGHT TELEMETRY BOOT'}
            </p>
          </div>
        </div>

        {/* Live Telemetry Metadata */}
        <div className="hidden sm:flex flex-col items-end text-xs text-space-400 font-mono space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-space-500">DEEP SPACE NETWORK:</span>
            <span className="text-emerald-400 font-bold">DSN GOLDSTONE (ACTIVE)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-space-500">
            <span>CHRYSE 22.4°N 49.9°W</span>
            <span>•</span>
            <span className="text-cyan-400">{telemetryTime}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Boot Sequence & Telemetry Status Box */}
      <main className="relative z-10 max-w-2xl w-full mx-auto my-auto space-y-6 font-mono">
        {/* Central Orbital Radar Graphic */}
        <div className="flex justify-center my-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Pulse wave ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
            {/* Outer orbital circle */}
            <div className="absolute inset-2 rounded-full border border-space-700 border-dashed animate-[spin_25s_linear_infinite]" />
            {/* Compass ticks */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass size={88} className="text-space-700/60" />
            </div>
            {/* Center Planet Ring Icon */}
            <div className="relative w-14 h-14 rounded-full bg-space-900 border border-mars-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(217,93,57,0.25)]">
              <Orbit size={28} className="text-mars-400 animate-[spin_8s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Progress Bar & Numerical Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-space-300 font-bold flex items-center gap-2">
              <Radio size={14} className="text-cyan-400 animate-pulse" />
              <span>SYSTEM BOOT INITIALIZATION</span>
            </span>
            <span className="text-white font-bold text-sm tracking-widest">
              {roundedProgress}%
            </span>
          </div>

          {/* Glowing Multi-Stage Progress Track */}
          <div className="h-2.5 w-full bg-space-900 rounded-full p-0.5 border border-space-700 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-cyan-500 via-mars-500 to-emerald-400 shadow-[0_0_12px_rgba(217,93,57,0.6)]"
              style={{ width: `${roundedProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-space-500">
            <span>ALLOC: 1024 MB REGOLITH PBR CACHE</span>
            <span>UPLINK: 48.2 MB/S (X-BAND)</span>
            <span>LIGHT DELAY: 14.2 MIN</span>
          </div>
        </div>

        {/* Rotating Live Checklist */}
        <div className="bg-space-900/90 border border-space-750 rounded-xl p-4 sm:p-5 space-y-3 shadow-2xl backdrop-blur-md">
          <div className="text-[11px] text-space-400 font-bold pb-2 border-b border-space-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-space-300">
              <Terminal size={13} className="text-cyan-400" />
              <span>SUBSYSTEM PRE-FLIGHT VERIFICATION MATRIX</span>
            </span>
            <span className="text-space-500 text-[10px]">ECLSS / DONKI PROTOCOL</span>
          </div>

          <div className="space-y-2 text-xs">
            {BOOT_STEPS.map((step) => {
              const isPassed = progress >= step.threshold;
              const isCurrent = !isPassed && (progress >= (step.threshold - 25));

              return (
                <div 
                  key={step.id}
                  className={`flex items-start justify-between p-2 rounded-lg transition-colors ${
                    isPassed 
                      ? 'bg-space-850/60 text-space-200' 
                      : isCurrent 
                        ? 'bg-mars-500/10 border border-mars-500/30 text-white' 
                        : 'text-space-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isPassed ? (
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RotateCw size={15} className="text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-space-700 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-[11px] tracking-wide">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-space-400 font-sans hidden sm:block">
                        {step.detail}
                      </div>
                    </div>
                  </div>

                  <div className="font-bold shrink-0 text-right">
                    {isPassed ? (
                      <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                        {step.doneTag}
                      </span>
                    ) : isCurrent ? (
                      <span className="text-cyan-400 text-[11px] animate-pulse">
                        [SYNCING...]
                      </span>
                    ) : (
                      <span className="text-space-600 text-[11px]">
                        [QUEUED]
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. Footer: Educational Real Mars Fact Ticker */}
      <footer className="relative z-10 pt-4 border-t border-space-700/60 font-mono">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-mars-400 shrink-0 font-bold uppercase tracking-wider text-[11px]">
            <Globe size={15} className="text-mars-500 shrink-0" />
            <span>NASA MARS FACT //</span>
          </div>

          <div className="text-space-300 text-xs sm:text-[11px] text-center sm:text-left leading-relaxed font-sans italic animate-in fade-in duration-300">
            "{MARS_FACTS[factIndex]}"
          </div>

          <div className="text-[10px] text-space-500 shrink-0 font-mono hidden md:block">
            CURIOSITY • PERSEVERANCE • DONKI
          </div>
        </div>
      </footer>
    </div>
  );
}
