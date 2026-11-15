import React from 'react';
import { 
  Wind, 
  Droplet, 
  Zap, 
  Apple, 
  Wrench, 
  Radio, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function ResourceBottomBar({ 
  resources, 
  onAdvanceSol, 
  isAdvancing = false,
  sol = 1,
  totalSols = 30
}) {
  if (!resources) return null;

  const { oxygen, water, energy, food, spareParts, radiation } = resources;

  // Format percentage helper
  const getPercent = (curr, max) => Math.min(100, Math.max(0, Math.round((curr / max) * 100)));

  return (
    <footer className="h-20 bg-space-900/95 backdrop-blur-md border-t border-space-700 px-4 py-2 flex items-center justify-between gap-4 select-none z-30">
      {/* 5 Core Consumables + 1 Radiation Protection System */}
      <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {/* 1. Oxygen */}
        <div className="bg-space-850 p-2 rounded border border-space-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-space-300">
            <span className="flex items-center gap-1">
              <Wind size={12} className="text-cyan-400" />
              O2
            </span>
            <span className="text-white font-bold">{Math.round(oxygen.current)} {oxygen.unit}</span>
          </div>
          <div className="w-full bg-space-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                getPercent(oxygen.current, oxygen.max) < 25 ? 'bg-red-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${getPercent(oxygen.current, oxygen.max)}%` }}
            />
          </div>
        </div>

        {/* 2. Water */}
        <div className="bg-space-850 p-2 rounded border border-space-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-space-300">
            <span className="flex items-center gap-1">
              <Droplet size={12} className="text-sky-400" />
              H2O
            </span>
            <span className="text-white font-bold">{Math.round(water.current)} {water.unit}</span>
          </div>
          <div className="w-full bg-space-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                getPercent(water.current, water.max) < 25 ? 'bg-red-500' : 'bg-sky-400'
              }`}
              style={{ width: `${getPercent(water.current, water.max)}%` }}
            />
          </div>
        </div>

        {/* 3. Energy */}
        <div className="bg-space-850 p-2 rounded border border-space-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-space-300">
            <span className="flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              POWER
            </span>
            <span className="text-white font-bold">{Math.round(energy.current)} {energy.unit}</span>
          </div>
          <div className="w-full bg-space-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                getPercent(energy.current, energy.max) < 25 ? 'bg-red-500' : 'bg-amber-400'
              }`}
              style={{ width: `${getPercent(energy.current, energy.max)}%` }}
            />
          </div>
        </div>

        {/* 4. Food */}
        <div className="bg-space-850 p-2 rounded border border-space-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-space-300">
            <span className="flex items-center gap-1">
              <Apple size={12} className="text-emerald-400" />
              FOOD
            </span>
            <span className="text-white font-bold">{Math.round(food.current)} {food.unit}</span>
          </div>
          <div className="w-full bg-space-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                getPercent(food.current, food.max) < 25 ? 'bg-red-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${getPercent(food.current, food.max)}%` }}
            />
          </div>
        </div>

        {/* 5. Spare Parts */}
        <div className="bg-space-850 p-2 rounded border border-space-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-space-300">
            <span className="flex items-center gap-1">
              <Wrench size={12} className="text-purple-400" />
              PARTS
            </span>
            <span className="text-white font-bold">{spareParts.current} <span className="text-[10px] text-space-400">/ {spareParts.max}</span></span>
          </div>
          <div className="w-full bg-space-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                spareParts.current <= 3 ? 'bg-red-500' : 'bg-purple-400'
              }`}
              style={{ width: `${getPercent(spareParts.current, spareParts.max)}%` }}
            />
          </div>
        </div>

        {/* 6. Radiation Protection (Environmental hazard - NOT a consumable) */}
        <div className="bg-space-850 p-2 rounded border border-space-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-space-300">
            <span className="flex items-center gap-1">
              {radiation.spaceWeatherLevel === 'NORMAL' ? (
                <ShieldCheck size={12} className="text-emerald-400" />
              ) : (
                <ShieldAlert size={12} className="text-rose-400 animate-pulse" />
              )}
              RAD
            </span>
            <span className="text-white font-bold text-[10px]">
              {radiation.surfaceDoseRate.toFixed(1)} <span className="text-space-400">μSv/h</span>
            </span>
          </div>
          <div className="text-[10px] font-mono flex items-center justify-between text-space-400 mt-1">
            <span>Dose: {radiation.cumulativeCrewDose.toFixed(2)} mSv</span>
            <span className={`px-1 rounded text-[9px] font-semibold ${
              radiation.spaceWeatherLevel === 'NORMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
            }`}>
              {radiation.spaceWeatherLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Advance Sol Trigger Button */}
      <div className="flex items-center pl-2 border-l border-space-700">
        <button
          onClick={onAdvanceSol}
          disabled={isAdvancing || sol >= totalSols}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
            sol >= totalSols
              ? 'bg-space-800 text-space-500 border border-space-700 cursor-not-allowed'
              : isAdvancing
              ? 'bg-mars-600/50 text-white cursor-wait animate-pulse'
              : 'bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white shadow-mars-600/30 active:scale-95 border border-mars-400/40'
          }`}
          title="Progress to next Martian Sol (Advances simulation turn)"
        >
          <span>{isAdvancing ? 'ADVANCING...' : `ADVANCE SOL ${sol + 1}`}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </footer>
  );
}
