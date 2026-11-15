import React, { useEffect, useState } from 'react';
import { DoorClosed, Wind, Gauge, ShieldCheck } from 'lucide-react';
import { soundService } from '../../services/soundService';

/**
 * Procedural Airlock Pressurization Cycle Modal Overlay
 * Plays pneumatic sound, shows pressure equalization bar, then moves player.
 */
export default function AirlockCycleOverlay({
  isGoingOutdoors,
  onComplete,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    soundService.playAirlockCycle();

    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          soundService.playAdvanceSol();
          if (onComplete) onComplete();
        }, 150);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none font-mono">
      <div className="w-full max-w-md bg-space-900 border-2 border-emerald-500/60 rounded-xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-space-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <DoorClosed className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-space-100 tracking-wide uppercase">
              Airlock Pressure Cycle
            </h2>
            <p className="text-xs text-space-400">
              {isGoingOutdoors
                ? 'Depressurizing chamber for Martian surface EVA...'
                : 'Equalizing pressure for Habitat interior ingress...'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-space-300 font-bold">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isGoingOutdoors ? 'ECLSS Venting (101.3 kPa -> 0.6 kPa)' : 'Sabatier O2 Repressurizing (0.6 kPa -> 101.3 kPa)'}</span>
            </span>
            <span className="text-emerald-400">{progress}%</span>
          </div>

          <div className="w-full bg-space-950 h-3 rounded-full overflow-hidden p-0.5 border border-space-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tactical Status Checklist */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-space-950/70 p-3 rounded-lg border border-space-800">
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="text-space-300">Inner Hatch:</span>
            <span className={progress > 15 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {progress > 15 ? 'SEALED' : 'CLOSING'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-space-300">Suit Seal:</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-amber-400" />
            <span className="text-space-300">Pressure:</span>
            <span className="text-amber-400 font-bold">
              {isGoingOutdoors
                ? `${Math.max(1, Math.round(101.3 * (1 - progress / 100)))} kPa`
                : `${Math.min(101, Math.round(101.3 * (progress / 100)))} kPa`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <DoorClosed className="w-4 h-4 text-emerald-400" />
            <span className="text-space-300">Outer Hatch:</span>
            <span className={progress >= 95 ? 'text-emerald-400 font-bold' : 'text-space-500'}>
              {progress >= 95 ? 'OPEN' : 'LOCKED'}
            </span>
          </div>
        </div>

        {/* NASA Mars Atmospheric & Airlock Scientific Context */}
        <div className="mt-4 p-3 rounded-lg bg-mars-950/40 border border-mars-800/60 text-[10px] space-y-1.5">
          <div className="flex items-center justify-between text-mars-400 font-bold uppercase tracking-wider">
            <span>NASA MARS ATMOSPHERIC REFERENCE</span>
            <span className="text-space-400">CHRYSE PLANITIA</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-space-300 border-t border-mars-900/60 pt-1.5">
            <div>
              <span className="text-space-500">Surface Pressure:</span>{' '}
              <strong className="text-white">~6.1 mbar (0.61 kPa)</strong>
            </div>
            <div>
              <span className="text-space-500">Composition:</span>{' '}
              <strong className="text-white">95.3% CO2, 2.6% N2</strong>
            </div>
            <div>
              <span className="text-space-500">Average Temp:</span>{' '}
              <strong className="text-white">-63°C (-81°F)</strong>
            </div>
            <div>
              <span className="text-space-500">Habitat Internal:</span>{' '}
              <strong className="text-emerald-400">101.3 kPa (1.0 ATM)</strong>
            </div>
          </div>
          <p className="text-[9px] text-space-400 leading-normal pt-1 border-t border-mars-900/40">
            *Near-vacuum Martian surface pressure (~0.6% Earth sea-level) will cause rapid hypoxia and bodily fluid ebullism within seconds without a pressurized EVA suit or hermetically sealed habitat tunnels.
          </p>
        </div>
      </div>
    </div>
  );
}
