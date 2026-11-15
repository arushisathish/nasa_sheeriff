import React from 'react';
import { Radio, ShieldAlert, Cpu, Compass, Activity, Zap } from 'lucide-react';
import { POI_DEFINITIONS } from '../../scene/PointsOfInterest';
import { STATIONS } from '../../scene/StationManager';

/**
 * EVA Tactical Visor Scanner Overlay (Toggled with [F])
 * - Holographic HUD reticles & scan sweep
 * - Real-time NASA Curiosity RAD Gale Crater baseline vs Outpost Shielded Telemetry
 * - Station & POI scanner telemetry readout
 */
export default function VisorScannerOverlay({
  gameState,
  playerPose,
  isOutdoors,
  isDrivingRover,
  onClose,
}) {
  const currentPos = playerPose?.position || { x: 0, y: 0, z: 0 };
  const radAccum = gameState?.resources?.radiation?.accumulatedMsv || 0;
  const radDaily = gameState?.resources?.radiation?.currentRateMsvPerSol || 0.67;
  const isSolarFlare = gameState?.environment?.solarActivity === 'X-Class Flare';

  // Compute POI distance telemetry
  const poiReadouts = POI_DEFINITIONS.map((poi) => {
    const dx = poi.position.x - currentPos.x;
    const dz = poi.position.z - currentPos.z;
    const dist = Math.round(Math.hypot(dx, dz));
    return {
      ...poi,
      distance: dist,
    };
  }).sort((a, b) => a.distance - b.distance);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 select-none">
      {/* 1. Tactical Holographic Scanlines & Vignette */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-cyan-950/20 opacity-70"
        style={{
          backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* 2. Top Scanner Status Bar */}
      <div className="relative flex items-center justify-between border-b border-cyan-500/40 bg-space-950/80 backdrop-blur-md px-5 py-2.5 rounded-t-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
            EVA TACTICAL SCANNER // ACTIVE
          </span>
          <span className="font-mono text-[11px] text-space-400">
            [FREQ: 1420.4 MHz // LIDAR RANGE: 250m]
          </span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-space-300">
          <div className="flex items-center space-x-1.5 text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>POS: {Math.round(currentPos.x)}m E, {Math.round(-currentPos.z)}m N</span>
          </div>
          <span className="text-space-500">|</span>
          <span className="text-amber-400 font-bold">PRESS [F] TO EXIT SCANNER</span>
        </div>
      </div>

      {/* 3. Center Screen Targeting Reticle & Scan Sweep */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/30 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-3 h-3 border-t-2 border-l-2 border-cyan-400 absolute top-0 left-0" />
        <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-400 absolute top-0 right-0" />
        <div className="w-3 h-3 border-b-2 border-l-2 border-cyan-400 absolute bottom-0 left-0" />
        <div className="w-3 h-3 border-b-2 border-r-2 border-cyan-400 absolute bottom-0 right-0" />
        
        {/* Central Crosshair */}
        <div className="w-8 h-8 border border-cyan-400/50 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        </div>
        
        {/* Pulsing Scan Sweep */}
        <div className="absolute inset-2 rounded-full border border-cyan-500/20 animate-ping" />
      </div>

      {/* 4. Left Telemetry Column: Curiosity RAD vs Outpost Shielding */}
      <div className="relative w-80 bg-space-950/85 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3.5 shadow-xl font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 border-b border-space-800 pb-2 mb-2 font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Curiosity RAD Telemetry</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between items-center bg-space-900/60 px-2 py-1.5 rounded">
            <span className="text-space-300">Gale Crater Baseline:</span>
            <span className="text-amber-400 font-bold">~0.67 mSv / sol</span>
          </div>

          <div className="flex justify-between items-center bg-space-900/60 px-2 py-1.5 rounded">
            <span className="text-space-300">Hab Shielded Rate:</span>
            <span className="text-emerald-400 font-bold">~0.21 mSv / sol (-68%)</span>
          </div>

          <div className="flex justify-between items-center bg-space-900/60 px-2 py-1.5 rounded">
            <span className="text-space-300">Current Environment:</span>
            <span className={isSolarFlare ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-300'}>
              {isSolarFlare ? 'HIGH FLUX SOLAR FLARE' : isOutdoors ? 'EXTERIOR SURFACE EVA' : 'PRESSURIZED HABITAT'}
            </span>
          </div>

          <div className="flex justify-between items-center bg-space-900/60 px-2 py-1.5 rounded">
            <span className="text-space-300">Mission Cumulative:</span>
            <span className="text-cyan-400 font-bold">{Math.round(radAccum)} / 600 mSv</span>
          </div>
        </div>

        {/* Radiation Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-space-400 mb-1">
            <span>NASA Permissible Limit</span>
            <span>{Math.round((radAccum / 600) * 100)}%</span>
          </div>
          <div className="w-full bg-space-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                radAccum > 450 ? 'bg-red-500' : radAccum > 250 ? 'bg-amber-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (radAccum / 600) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. Right Telemetry Column: Points of Interest Telemetry */}
      <div className="relative self-end w-80 bg-space-950/85 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3.5 shadow-xl font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 border-b border-space-800 pb-2 mb-2 font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Sector POI Telemetry (250m Sector)</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-[11px]">
          {poiReadouts.map((poi) => (
            <div 
              key={poi.id}
              className="flex items-center justify-between bg-space-900/60 px-2.5 py-1.5 rounded border border-space-800 hover:border-cyan-500/50"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: poi.color }} />
                <span className="text-space-200 font-medium">{poi.name}</span>
              </div>
              <span className="text-cyan-400 font-bold">{poi.distance}m</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-space-800 flex justify-between text-[10px] text-space-400">
          <span>TRAVERSAL: {isDrivingRover ? 'ROVER TRANSPORT' : 'ASTRONAUT EVA SUIT'}</span>
          <span className="text-cyan-400">{isDrivingRover ? 'SPEED: ~18 m/s' : 'SPEED: ~5-8 m/s'}</span>
        </div>
      </div>
    </div>
  );
}
