import React, { useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Layers, 
  Keyboard, 
  X,
  Compass
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export default function PauseMenuModal({
  isOpen,
  onResume,
  onRestart,
  mouseSensitivity = 1.0,
  onChangeSensitivity,
  graphicsQuality = 'high',
  onChangeGraphicsQuality,
  isMuted = false,
  onToggleMute,
  volume = 0.7,
  onChangeVolume,
  showDebugColliders = false,
  onToggleDebugColliders,
}) {
  // ESC shortcut to resume
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-space-700 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mars-500/15 border border-mars-500/40 flex items-center justify-center text-mars-400">
              <Settings size={22} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-mars-400">
                SYSTEM PAUSED
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                OUTPOST COMMAND CONFIGURATION
              </h3>
            </div>
          </div>
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-750 text-space-400 hover:text-white transition-colors border border-space-700"
            title="Resume Mission (ESC)"
          >
            <span className="text-[10px] font-mono font-bold">[ESC]</span>
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-space-300 font-sans">
          {/* Quick Resume Button */}
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/40"
          >
            <Play size={18} />
            <span>RESUME MISSION</span>
          </button>

          {/* Settings Section */}
          <div className="space-y-4 pt-2">
            <h4 className="font-mono text-xs font-bold uppercase text-space-300 tracking-wider flex items-center gap-2 pb-1 border-b border-space-800">
              <Sliders size={14} className="text-cyan-400" />
              <span>Control & Audio Settings</span>
            </h4>

            {/* Mouse Sensitivity Slider */}
            <div className="p-3.5 rounded-xl bg-space-850 border border-space-750 space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-space-300">Mouse Sensitivity</span>
                <span className="text-white font-bold">{(mouseSensitivity ?? 1.0).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={mouseSensitivity ?? 1.0}
                onChange={(e) => onChangeSensitivity && onChangeSensitivity(parseFloat(e.target.value))}
                className="w-full accent-mars-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-space-500">
                <span>0.4x (Smooth)</span>
                <span>1.0x (Default)</span>
                <span>2.5x (Fast)</span>
              </div>
            </div>

            {/* Graphics Quality Setting */}
            <div className="p-3.5 rounded-xl bg-space-850 border border-space-750 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-white block">Graphics Fidelity</span>
                <span className="text-[10px] text-space-400">PBR Textures & Soft Shadow Maps</span>
              </div>
              <div className="flex items-center gap-1 bg-space-800 p-1 rounded-lg border border-space-700 font-mono text-xs">
                <button
                  onClick={() => onChangeGraphicsQuality('standard')}
                  className={`px-3 py-1 rounded transition-colors ${
                    graphicsQuality === 'standard' 
                      ? 'bg-space-700 text-white font-bold' 
                      : 'text-space-400 hover:text-white'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => onChangeGraphicsQuality('high')}
                  className={`px-3 py-1 rounded transition-colors ${
                    graphicsQuality === 'high' 
                      ? 'bg-mars-600 text-white font-bold shadow' 
                      : 'text-space-400 hover:text-white'
                  }`}
                >
                  High (PBR)
                </button>
              </div>
            </div>

            {/* Audio Volume & Mute */}
            <div className="p-3.5 rounded-xl bg-space-850 border border-space-750 space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-space-300 flex items-center gap-1.5">
                  {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                  Sound FX Volume
                </span>
                <button
                  onClick={onToggleMute}
                  className="text-xs px-2 py-0.5 rounded bg-space-800 text-space-300 hover:text-white border border-space-700"
                >
                  {isMuted ? 'UNMUTE' : 'MUTE'}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={isMuted}
                value={volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-mars-500 cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* Collision Wireframe Debugger Toggle */}
            <div className="p-3.5 rounded-xl bg-space-850 border border-space-750 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-white block">Collider Wireframes</span>
                <span className="text-[10px] text-space-400">Render Red Boxes on Solid Wall Segments [B]</span>
              </div>
              <button
                onClick={onToggleDebugColliders}
                className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all border ${
                  showDebugColliders
                    ? 'bg-red-950/80 text-red-300 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'bg-space-800 text-space-400 border-space-700 hover:text-white'
                }`}
              >
                {showDebugColliders ? 'ACTIVE [ON]' : 'DISABLED [OFF]'}
              </button>
            </div>
          </div>

          {/* Controls Quick Reference Card */}
          <div className="space-y-3 pt-2">
            <h4 className="font-mono text-xs font-bold uppercase text-space-300 tracking-wider flex items-center gap-2 pb-1 border-b border-space-800">
              <Keyboard size={14} className="text-amber-400" />
              <span>Keyboard & Interaction Guide</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Walk:</span>
                <strong className="text-white">W A S D / Arrows</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Sprint:</span>
                <strong className="text-white">Left Shift</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Low-G Jump:</span>
                <strong className="text-white">Spacebar</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Interact:</span>
                <strong className="text-mars-400">E Key</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Visor Scanner:</span>
                <strong className="text-cyan-400">F Key</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Mars Rover:</span>
                <strong className="text-orange-400">E to Drive/Exit</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Debug Colliders:</span>
                <strong className="text-red-400">B Key</strong>
              </div>
              <div className="p-2.5 rounded bg-space-850 border border-space-750 flex items-center justify-between">
                <span className="text-space-400">Pause Menu:</span>
                <strong className="text-white">P / ESC</strong>
              </div>
            </div>
          </div>

          {/* Restart Expedition */}
          <div className="pt-2">
            <button
              onClick={onRestart}
              className="w-full py-2.5 rounded-lg bg-space-850 hover:bg-red-950/40 text-space-400 hover:text-red-300 font-mono text-xs font-bold border border-space-750 hover:border-red-800 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw size={14} />
              <span>ABORT & RESTART 30-SOL EXPEDITION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
