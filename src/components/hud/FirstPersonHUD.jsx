import React from 'react';
import { 
  Wind, 
  Droplet, 
  Zap, 
  Apple, 
  Wrench, 
  Radio, 
  ChevronRight, 
  AlertCircle, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Orbit, 
  Pause,
  ShieldAlert, 
  Sparkles,
  Gauge,
  Scan,
  Car
} from 'lucide-react';
import { soundService } from '../../services/soundService';
import CompassHUD from './CompassHUD';

export default function FirstPersonHUD({
  gameState,
  nearbyStation,
  onInteract,
  onAdvanceSol,
  onTabChange,
  activeTab,
  onOpenIntro,
  onOpenPause,
  isMuted,
  onToggleMute,
  isPointerLocked,
  isOutdoors = false,
  suitO2 = 100,
  isSprinting = false,
  isDrivingRover = false,
  isScannerActive = false,
  onToggleScanner,
  playerPosition,
  playerYaw = 0,
}) {
  const { currentSol, totalSols, resources, pendingDecisions = [] } = gameState;
  const { oxygen, water, energy, food, spareParts, radiation } = resources;

  const getPercent = (curr, max) => Math.min(100, Math.max(0, Math.round((curr / max) * 100)));
  const isHighRadiationOutdoors = isOutdoors && radiation.spaceWeatherLevel !== 'NORMAL';
  const isLowO2 = isOutdoors && suitO2 < 25;
  const isO2Depleted = isOutdoors && suitO2 <= 0;

  return (
    <div className={`absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 z-20 font-sans transition-all duration-300 ${
      isO2Depleted
        ? 'bg-red-950/40 shadow-[inset_0_0_120px_rgba(239,68,68,0.8)] animate-pulse'
        : isOutdoors
        ? 'bg-gradient-to-t from-black/20 via-transparent to-mars-900/10 shadow-[inset_0_0_90px_rgba(217,93,57,0.15)]'
        : ''
    }`}>
      {/* 1. Visor Top Header */}
      <header className="flex items-start justify-between w-full pointer-events-auto relative">
        {/* Top-Center Horizontal Compass Ribbon */}
        <CompassHUD playerPosition={playerPosition} playerYaw={playerYaw} />

        {/* Top-Left Sol & Outpost Badge */}
        <div className="flex items-center gap-3 bg-space-900/85 backdrop-blur-md p-2 rounded-xl border border-space-700/80 shadow-2xl">
          <div className="w-8 h-8 rounded-lg bg-mars-500/15 border border-mars-500/40 flex items-center justify-center text-mars-400">
            <Orbit size={18} className="animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                OUTPOST ZERO
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                isDrivingRover
                  ? 'bg-orange-950 text-orange-300 border-orange-700'
                  : isOutdoors 
                  ? 'bg-amber-950 text-amber-300 border-amber-800' 
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {isDrivingRover ? 'ROVER TRANSPORT' : isOutdoors ? 'EVA SUIT ACTIVE' : 'HABITAT PRESSURIZED'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-space-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SOL {currentSol} / {totalSols}</span>
              <span className="text-space-600">|</span>
              <span className={`font-bold ${isOutdoors ? 'text-purple-400 font-mono tracking-wider' : 'text-cyan-300'}`}>
                GRAVITY: {isOutdoors ? '0.38g' : '1.00g'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Warnings (Low O2, Surface Radiation, or Active Weather Cycle) */}
        <div className="flex flex-col items-center gap-1">
          {gameState?.environment?.weatherCycle && gameState.environment.weatherCycle.phase !== 'nominal' && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-xl border backdrop-blur-md ${
              gameState.environment.weatherCycle.activeType === 'dust_storm'
                ? 'bg-amber-950/85 text-amber-200 border-amber-600/70'
                : 'bg-purple-950/85 text-purple-200 border-purple-600/70'
            }`}>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                gameState.environment.weatherCycle.phase === 'active'
                  ? 'bg-red-600 text-white animate-pulse'
                  : gameState.environment.weatherCycle.phase === 'incoming'
                  ? 'bg-amber-500 text-space-950'
                  : 'bg-emerald-600 text-white'
              }`}>
                {gameState.environment.weatherCycle.phase}
              </span>
              <span>{gameState.environment.weatherCycle.headline}</span>
            </div>
          )}
          {isLowO2 && (
            <div className="px-4 py-1.5 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono font-bold flex items-center gap-2 animate-bounce shadow-2xl">
              <Wind size={15} className="animate-spin" />
              <span>WARNING: SUIT O2 LOW ({Math.round(suitO2)}%) — RETURN TO AIRLOCK!</span>
            </div>
          )}
          {isHighRadiationOutdoors && (
            <div className="px-4 py-1.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-mono font-bold flex items-center gap-2 animate-pulse shadow-2xl">
              <ShieldAlert size={15} />
              <span>ELEVATED SOLAR RADIATION ({radiation.surfaceDoseRate.toFixed(1)} μSv/h)</span>
            </div>
          )}
        </div>

        {/* Top-Right Navigation, Scanner Toggle, Pause & Sound */}
        <div className="flex items-center gap-2 bg-space-900/85 backdrop-blur-md p-1.5 rounded-xl border border-space-700/80 shadow-2xl">
          {pendingDecisions.length > 0 && (
            <button
              onClick={() => onTabChange('events')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 text-red-300 border border-red-800 text-xs font-mono animate-pulse"
            >
              <AlertCircle size={13} />
              <span>{pendingDecisions.length} ALERT</span>
            </button>
          )}

          {/* Tactical Scanner Toggle Button */}
          <button
            onClick={() => {
              if (onToggleScanner) onToggleScanner();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
              isScannerActive
                ? 'bg-cyan-500 text-space-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-space-800 hover:bg-space-750 text-cyan-300 border-cyan-900 hover:border-cyan-500/50'
            }`}
            title="Toggle Tactical Visor Scanner (F)"
          >
            <Scan size={13} />
            <span>[F] SCANNER</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onTabChange('radiation');
            }}
            className="px-2.5 py-1 rounded hover:bg-space-800 text-space-300 hover:text-white text-xs font-mono transition-colors"
          >
            RAD Terminal
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onTabChange('report');
            }}
            className="px-2.5 py-1 rounded hover:bg-space-800 text-space-300 hover:text-white text-xs font-mono transition-colors"
          >
            Daily Log
          </button>

          <button
            onClick={onToggleMute}
            className="p-1.5 rounded hover:bg-space-800 text-space-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} className="text-space-500" /> : <Volume2 size={15} className="text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onOpenIntro();
            }}
            className="p-1.5 rounded hover:bg-space-800 text-space-300 hover:text-white transition-colors"
            title="Mission Manual"
          >
            <HelpCircle size={15} className="text-mars-400" />
          </button>

          {/* Pause Menu Button */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenPause();
            }}
            className="px-2 py-1 rounded bg-space-800 hover:bg-space-750 text-white border border-space-650 text-xs font-mono flex items-center gap-1"
            title="Pause Mission (P or ESC)"
          >
            <Pause size={13} />
            <span className="hidden sm:inline">PAUSE</span>
          </button>
        </div>
      </header>

      {/* 2. Center Reticle & Floating Interaction Prompt */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-8 h-8 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          <div className="absolute w-6 h-6 rounded-full border border-white/20" />
        </div>

        {/* Floating [E] Prompt for Nearby Station OR Rover Dismount */}
        {isDrivingRover ? (
          <div className="mt-4 pointer-events-auto animate-in zoom-in-95 duration-150">
            <button
              onClick={() => onInteract('mars_rover')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-950 to-amber-950 backdrop-blur-md border-2 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-left group"
            >
              <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-mono font-bold text-sm flex items-center justify-center shadow-lg group-hover:bg-orange-400">
                E
              </span>
              <div>
                <div className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>[E] Exit Rover</span>
                  <span className="text-[10px] text-orange-400 font-normal">/ Dismount</span>
                </div>
                <div className="text-[10px] text-orange-300/90 font-mono">
                  Step safely onto Martian surface (offset 2.5m)
                </div>
              </div>
            </button>
          </div>
        ) : nearbyStation ? (
          <div className="mt-4 pointer-events-auto animate-in zoom-in-95 duration-150">
            <button
              onClick={() => onInteract(nearbyStation.id)}
              className="px-4 py-2 rounded-xl bg-space-900/95 backdrop-blur-md border border-mars-500/70 shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all text-left"
            >
              <span className="w-6 h-6 rounded-lg bg-mars-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                E
              </span>
              <div>
                <div className="font-mono font-bold text-xs text-white">
                  {nearbyStation.name}
                </div>
                <div className="text-[10px] text-space-400 font-mono">
                  {nearbyStation.actionLabel}
                </div>
              </div>
            </button>
          </div>
        ) : null}

        {/* Controls Reminder when not locked */}
        {!isPointerLocked && !nearbyStation && !isDrivingRover && (
          <div className="mt-6 px-4 py-2 rounded-full bg-space-900/85 backdrop-blur-md border border-space-700 text-xs font-mono text-space-300 pointer-events-none shadow-xl">
            🖱️ <strong className="text-white">Click to look</strong> • <span className="text-mars-400">WASD</span> move • <span className="text-purple-400">Shift</span> sprint • <span className="text-emerald-400">Space</span> jump • <span className="text-cyan-400">[E]</span> interact • <span className="text-cyan-300">[F]</span> scanner • <span className="text-amber-400">P / ESC</span> pause
          </div>
        )}
      </div>

      {/* 3. Bottom Telemetry Dock + Suit O2 / Rover Gauge */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
        {/* EVA Suit Oxygen / Rover Dashboard Gauge */}
        {isDrivingRover ? (
          <div className="flex items-center gap-2.5 bg-orange-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-orange-500/70 shadow-2xl font-mono text-xs w-full sm:w-auto">
            <Car size={16} className="text-orange-400 animate-pulse" />
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="text-orange-300 font-bold">ROVER LIFE SUPPORT</span>
                <strong className="text-emerald-400 font-bold flex items-center gap-1">
                  <Wind size={10} className="text-cyan-400 animate-spin" />
                  SUIT O2: {Math.round(suitO2)}% (RECHARGING)
                </strong>
              </div>
              <div className="w-40 bg-space-950 h-1.5 rounded-full overflow-hidden border border-orange-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-150"
                  style={{ width: `${Math.round(suitO2)}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => onInteract('mars_rover')}
              className="text-[10px] font-mono font-bold bg-orange-600 hover:bg-orange-500 text-white px-2 py-1 rounded ml-1 transition-colors pointer-events-auto"
            >
              [E] EXIT
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-space-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-space-700/80 shadow-2xl font-mono text-xs w-full sm:w-auto">
            <Wind size={15} className={isLowO2 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="text-space-300">SUIT O2</span>
                <strong className={isLowO2 ? 'text-red-400 font-bold' : 'text-cyan-300'}>
                  {Math.round(suitO2)}% {isSprinting && isOutdoors ? '(SPRINTING)' : ''}
                </strong>
              </div>
              <div className="w-32 bg-space-800 h-1.5 rounded-full overflow-hidden border border-space-700">
                <div 
                  className={`h-full rounded-full transition-all duration-200 ${
                    suitO2 < 25 ? 'bg-red-500 animate-pulse' : suitO2 < 50 ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.round(suitO2)}%` }}
                />
              </div>
            </div>
            <span className="text-[9px] text-space-500 pl-1">
              {isOutdoors ? 'DRAINING' : 'PRESSURIZED'}
            </span>
            {isOutdoors && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-purple-300 font-mono font-bold tracking-wider shrink-0">
                GRAVITY: 0.38g
              </span>
            )}
          </div>
        )}

        {/* 6 Core Habitat Resources Dock */}
        <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-2 bg-space-900/85 backdrop-blur-md p-2 rounded-xl border border-space-700/80 shadow-2xl">
          {/* Oxygen */}
          <div className="p-1.5 rounded bg-space-850/80 border border-space-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-space-300">
              <span className="flex items-center gap-1">
                <Wind size={11} className="text-cyan-400" />
                HAB O2
              </span>
              <span className="text-white font-bold">{Math.round(oxygen.current)} {oxygen.unit}</span>
            </div>
            <div className="w-full bg-space-700 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${getPercent(oxygen.current, oxygen.max) < 25 ? 'bg-red-500' : 'bg-cyan-400'}`}
                style={{ width: `${getPercent(oxygen.current, oxygen.max)}%` }}
              />
            </div>
          </div>

          {/* Water */}
          <div className="p-1.5 rounded bg-space-850/80 border border-space-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-space-300">
              <span className="flex items-center gap-1">
                <Droplet size={11} className="text-sky-400" />
                H2O
              </span>
              <span className="text-white font-bold">{Math.round(water.current)} {water.unit}</span>
            </div>
            <div className="w-full bg-space-700 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${getPercent(water.current, water.max) < 25 ? 'bg-red-500' : 'bg-sky-400'}`}
                style={{ width: `${getPercent(water.current, water.max)}%` }}
              />
            </div>
          </div>

          {/* Power */}
          <div className="p-1.5 rounded bg-space-850/80 border border-space-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-space-300">
              <span className="flex items-center gap-1">
                <Zap size={11} className="text-amber-400" />
                PWR
              </span>
              <span className="text-white font-bold">{Math.round(energy.current)} {energy.unit}</span>
            </div>
            <div className="w-full bg-space-700 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${getPercent(energy.current, energy.max) < 25 ? 'bg-red-500' : 'bg-amber-400'}`}
                style={{ width: `${getPercent(energy.current, energy.max)}%` }}
              />
            </div>
          </div>

          {/* Food */}
          <div className="p-1.5 rounded bg-space-850/80 border border-space-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-space-300">
              <span className="flex items-center gap-1">
                <Apple size={11} className="text-emerald-400" />
                FOOD
              </span>
              <span className="text-white font-bold">{Math.round(food.current)} {food.unit}</span>
            </div>
            <div className="w-full bg-space-700 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${getPercent(food.current, food.max) < 25 ? 'bg-red-500' : 'bg-emerald-400'}`}
                style={{ width: `${getPercent(food.current, food.max)}%` }}
              />
            </div>
          </div>

          {/* Parts */}
          <div className="p-1.5 rounded bg-space-850/80 border border-space-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-space-300">
              <span className="flex items-center gap-1">
                <Wrench size={11} className="text-purple-400" />
                PARTS
              </span>
              <span className="text-white font-bold">{spareParts.current}</span>
            </div>
            <div className="w-full bg-space-700 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${spareParts.current <= 3 ? 'bg-red-500' : 'bg-purple-400'}`}
                style={{ width: `${getPercent(spareParts.current, spareParts.max)}%` }}
              />
            </div>
          </div>

          {/* Radiation */}
          <div className="p-1.5 rounded bg-space-850/80 border border-space-750 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-space-300">
              <span className="flex items-center gap-1">
                <Radio size={11} className="text-rose-400" />
                RAD
              </span>
              <span className="text-white font-bold text-[9px]">{radiation.surfaceDoseRate.toFixed(1)} μSv/h</span>
            </div>
            <div className="text-[9px] font-mono text-space-400 flex justify-between mt-1">
              <span>{radiation.cumulativeCrewDose.toFixed(2)} mSv</span>
              <span className={radiation.spaceWeatherLevel === 'NORMAL' ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                {radiation.spaceWeatherLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Advance Sol Button */}
        <button
          onClick={onAdvanceSol}
          disabled={currentSol >= totalSols}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/40 shrink-0"
        >
          <span>ADVANCE SOL {currentSol + 1}</span>
          <ChevronRight size={15} />
        </button>
      </footer>
    </div>
  );
}
