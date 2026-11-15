import React from 'react';
import { 
  Trophy, 
  AlertTriangle, 
  RotateCcw, 
  Heart, 
  Smile, 
  Activity, 
  Radio, 
  Calendar,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function MissionResults({ missionResult, gameState, onRestart }) {
  if (!missionResult) return null;

  const { status, title, reason, score, grade } = missionResult;
  const isVictory = status === 'victory';
  const isPartial = status === 'partial';
  const isFailure = status === 'failure';

  const { currentSol, resources, moduleHealth } = gameState;

  return (
    <div className="min-h-screen bg-space-950 flex flex-col items-center justify-center p-6 text-space-100 hud-grid-bg relative select-none">
      <div className="max-w-2xl w-full bg-space-900 border border-space-700 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        {/* Status Badge & Icon */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border">
            {isVictory && (
              <div className="w-full h-full bg-emerald-500/15 border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Trophy size={36} />
              </div>
            )}
            {isPartial && (
              <div className="w-full h-full bg-amber-500/15 border-amber-500/40 text-amber-400 rounded-2xl flex items-center justify-center">
                <Award size={36} />
              </div>
            )}
            {isFailure && (
              <div className="w-full h-full bg-red-500/15 border-red-500/40 text-rose-500 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={36} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className={`text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
              isVictory ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
              isPartial ? 'bg-amber-950 text-amber-400 border-amber-800' :
              'bg-red-950 text-red-400 border-red-800'
            }`}>
              {isVictory ? 'MISSION ACCOMPLISHED' : isPartial ? 'PARTIAL EXPEDITION SUCCESS' : 'CRITICAL MISSION FAILURE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white pt-2">
              {title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-space-300 font-sans leading-relaxed max-w-lg mx-auto">
            {reason}
          </p>
        </div>

        {/* Score Card if Completed 30 Sols */}
        {(isVictory || isPartial) && (
          <div className="p-4 rounded-xl bg-space-850 border border-space-750 flex items-center justify-around font-mono">
            <div className="text-center">
              <span className="text-[10px] text-space-400 block uppercase">Outpost Survival Score</span>
              <span className="text-3xl font-extrabold text-white">{score} <span className="text-xs text-space-400">/ 100</span></span>
            </div>
            <div className="h-10 w-px bg-space-700" />
            <div className="text-center">
              <span className="text-[10px] text-space-400 block uppercase">Mission Citation</span>
              <span className="text-sm font-bold text-mars-400">{grade}</span>
            </div>
          </div>
        )}

        {/* End-State Telemetry Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          <div className="p-3 rounded-lg bg-space-850/80 border border-space-750">
            <span className="text-space-400 text-[10px] block">SOLS COMPLETED</span>
            <span className="text-white font-bold text-sm">{currentSol} / 30</span>
          </div>
          <div className="p-3 rounded-lg bg-space-850/80 border border-space-750">
            <span className="text-space-400 text-[10px] block">CREW HEALTH</span>
            <span className="text-rose-400 font-bold text-sm">{resources.crew.health}%</span>
          </div>
          <div className="p-3 rounded-lg bg-space-850/80 border border-space-750">
            <span className="text-space-400 text-[10px] block">CREW MORALE</span>
            <span className="text-amber-400 font-bold text-sm">{resources.crew.morale}%</span>
          </div>
          <div className="p-3 rounded-lg bg-space-850/80 border border-space-750">
            <span className="text-space-400 text-[10px] block">CUMULATIVE DOSE</span>
            <span className="text-cyan-400 font-bold text-sm">{resources.radiation.cumulativeCrewDose.toFixed(2)} mSv</span>
          </div>
        </div>

        {/* Restart / Replay Button */}
        <div className="pt-2">
          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/40"
          >
            <RotateCcw size={16} />
            <span>INITIALIZE NEW 30-SOL EXPEDITION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
