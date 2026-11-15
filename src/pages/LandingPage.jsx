import React, { useState } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Radio, 
  Sprout, 
  Wind, 
  Droplet, 
  Zap, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Play,
  Heart,
  Wrench,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage({ 
  onStartMission, 
  onStartNewMission, 
  gameState 
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const hasSavedGame = gameState && gameState.currentSol > 1 && gameState.missionStatus === 'in_progress';

  return (
    <div className="min-h-screen bg-space-950 text-space-100 flex flex-col justify-between p-6 sm:p-12 hud-grid-bg relative overflow-y-auto animate-in fade-in duration-300">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-mars-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-space-800 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-mars-500/20 border border-mars-500/50 flex items-center justify-center text-mars-500 font-bold font-mono text-lg">
            O₀
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-widest text-white uppercase">
              OUTPOST ZERO
            </h1>
            <p className="text-xs text-space-400 font-mono">
              NASA SPACE APPS • 30-SOL MARS EXPEDITION SIMULATOR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-space-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>LOCATION: CHRYSE PLANITIA, MARS</span>
        </div>
      </header>

      {/* Hero / Main Briefing */}
      <main className="max-w-4xl mx-auto my-10 z-10 space-y-8">
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mars-500/10 border border-mars-500/30 text-mars-400 text-xs font-mono font-medium">
            <Radio size={13} className="animate-pulse" />
            <span>MISSION DIRECTIVE: 30 MARTIAN SOLS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Can your crew survive 30 Sols in the harshest environment known to humanity?
          </h2>

          <p className="text-base sm:text-lg text-space-300 leading-relaxed font-sans max-w-2xl">
            Take command of <strong className="text-white">Outpost Zero</strong>, humanity’s first permanent habitat on the red planet. 
            Balance closed-loop life support, deploy dust mitigation for solar grids, and navigate real space-weather threats using NASA Curiosity RAD and DONKI data.
          </p>
        </div>

        {/* Active Mission Telemetry Banner if Save Exists */}
        {hasSavedGame && (
          <div className="p-4 rounded-xl bg-space-900/90 border border-mars-500/40 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-mars-400 font-bold flex items-center gap-2">
                <Radio size={14} className="animate-pulse" />
                ACTIVE EXPEDITION TELEMETRY DETECTED
              </span>
              <span className="text-white font-bold bg-mars-950/60 border border-mars-800/60 px-2 py-0.5 rounded">
                SOL {gameState.currentSol} OF {gameState.totalSols}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-space-850 border border-space-750">
                <span className="text-space-400 text-[10px] block">CREW VITALITY</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Heart size={12} />
                  {gameState.resources?.crew?.health ?? 100}%
                </span>
              </div>
              <div className="p-2 rounded bg-space-850 border border-space-750">
                <span className="text-space-400 text-[10px] block">O2 PRESSURE</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Wind size={12} />
                  {(gameState.resources?.oxygen?.current ?? 0).toFixed(0)} kg
                </span>
              </div>
              <div className="p-2 rounded bg-space-850 border border-space-750">
                <span className="text-space-400 text-[10px] block">POTABLE WATER</span>
                <span className="text-sky-400 font-bold flex items-center gap-1">
                  <Droplet size={12} />
                  {(gameState.resources?.water?.current ?? 0).toFixed(0)} L
                </span>
              </div>
              <div className="p-2 rounded bg-space-850 border border-space-750">
                <span className="text-space-400 text-[10px] block">POWER RESERVES</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Zap size={12} />
                  {(gameState.resources?.energy?.current ?? 0).toFixed(0)} kWh
                </span>
              </div>
              <div className="p-2 rounded bg-space-850 border border-space-750">
                <span className="text-space-400 text-[10px] block">SPARE PARTS</span>
                <span className="text-purple-400 font-bold flex items-center gap-1">
                  <Wrench size={12} />
                  {gameState.resources?.spareParts?.current ?? 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6 Core Systems Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4">
          <div className="p-4 rounded-xl bg-space-900/80 border border-space-700 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
              <Wind size={16} />
              <span>O2 LIFE SUPPORT</span>
            </div>
            <p className="text-xs text-space-300">
              Electrolysis & MOXIE CO2 crackers produce breathable O2 at 21.3 kPa partial pressure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-space-700 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
              <Droplet size={16} />
              <span>WATER RECOVERY</span>
            </div>
            <p className="text-xs text-space-300">
              Closed-loop ECLSS distillation reclaims 93% of moisture, wastewater, and permafrost runoff.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-space-700 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
              <Zap size={16} />
              <span>POWER GRID</span>
            </div>
            <p className="text-xs text-space-300">
              Photovoltaic solar tracking wings and solid-state batteries power atmospheric scrubbing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-space-700 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
              <Sprout size={16} />
              <span>HYDROPONICS</span>
            </div>
            <p className="text-xs text-space-300">
              NASA Veggie LED arrays nurture high-calorie dwarf crops to maintain crew vitality.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-space-700 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
              <ShieldCheck size={16} />
              <span>RADIATION SHELTER</span>
            </div>
            <p className="text-xs text-space-300">
              Sub-regolith bunker protects against Galactic Cosmic Rays (GCR) and episodic Solar Particle Events.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-space-700 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold">
              <HelpCircle size={16} />
              <span>DECISION ENGINE</span>
            </div>
            <p className="text-xs text-space-300">
              Respond to Dust Storms, Equipment Failures, and Space Weather alerts with strategic trade-offs.
            </p>
          </div>
        </div>

        {/* Action Button Section: Continue vs Start New Mission */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {hasSavedGame ? (
              <>
                <button
                  onClick={onStartMission}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/50"
                >
                  <Play size={20} />
                  <span>CONTINUE EXPEDITION (SOL {gameState.currentSol})</span>
                  <ChevronRight size={18} />
                </button>

                {!showConfirmReset ? (
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-space-850 hover:bg-space-800 text-space-300 hover:text-white font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-space-750 transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>START NEW EXPEDITION (SOL 1)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 font-mono text-xs">
                    <AlertTriangle size={16} className="text-rose-400" />
                    <span className="text-rose-200">Reset Sol {gameState.currentSol} progress?</span>
                    <button
                      onClick={() => {
                        setShowConfirmReset(false);
                        if (onStartNewMission) onStartNewMission();
                      }}
                      className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-[11px]"
                    >
                      CONFIRM RESET
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="px-2 py-1.5 rounded bg-space-800 text-space-400 hover:text-white text-[11px]"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={onStartMission}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/50"
              >
                <Rocket size={20} />
                <span>START MISSION (SOL 1)</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-space-400 flex items-center gap-1.5">
            <span>Powered by genuine NASA Curiosity RAD baseline & DONKI API specs</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-6 border-t border-space-800 text-xs font-mono text-space-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <div>Developed for NASA Space Apps Challenge • Outpost Zero Project</div>
        <div className="flex items-center gap-4">
          <span>Turn-Based Survival Engine</span>
          <span>•</span>
          <span>Decoupled Architecture</span>
        </div>
      </footer>
    </div>
  );
}
