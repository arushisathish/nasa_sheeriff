import React, { useEffect } from 'react';
import { 
  X, 
  Wrench, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sprout, 
  Wind, 
  Droplet, 
  Zap, 
  Sun, 
  ShieldCheck, 
  HeartPulse 
} from 'lucide-react';
import { MODULES_CONFIG, MODULE_IDS } from '../../data/modulesConfig';
import { soundService } from '../../services/soundService';

const ICON_MAP = {
  [MODULE_IDS.GREENHOUSE]: Sprout,
  [MODULE_IDS.LIFE_SUPPORT]: Wind,
  [MODULE_IDS.WATER_RECYCLING]: Droplet,
  [MODULE_IDS.POWER_BAY]: Zap,
  [MODULE_IDS.SOLAR_ARRAY]: Sun,
  [MODULE_IDS.RAD_SHELTER]: ShieldCheck,
  [MODULE_IDS.CREW_QUARTERS]: HeartPulse,
};

export default function WorkbenchModal({
  isOpen,
  onClose,
  gameState,
  onRepairModule,
  onAnalyzeCore,
}) {
  // ESC shortcut to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { moduleHealth, resources } = gameState;
  const spareParts = resources.spareParts.current;

  const handleRepair = (id) => {
    soundService.playClick();
    onRepairModule(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-space-700 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Wrench size={22} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                HABITAT FABRICATION & REPAIR BENCH
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                SPARE PARTS & PREVENTIVE MAINTENANCE
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-space-800 border border-space-700 font-mono text-xs">
              <Wrench size={13} className="text-purple-400" />
              <span className="text-space-300">Available Spares:</span>
              <strong className="text-white">{spareParts} / {resources.spareParts.max}</strong>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-750 text-space-400 hover:text-white transition-colors border border-space-700"
              title="Close Workbench (ESC)"
            >
              <span className="text-[10px] font-mono font-bold">[ESC]</span>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Surface Core Sample Analysis Card */}
          {gameState?.exploration && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-space-850 to-space-800 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Wrench size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase">MARTIAN REGOLITH SPECTROMETER</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-800/60 px-2 py-0.5 rounded">
                      {(gameState.exploration.collectedGeoCores || 0) - (gameState.exploration.analyzedGeoCores || 0)} UNANALYZED
                    </span>
                  </div>
                  <p className="text-[11px] text-space-400 font-sans">
                    Refine harvested rock cores from Geological Ridge into mechanical spare parts.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundService.playClick();
                  if (onAnalyzeCore) onAnalyzeCore();
                }}
                disabled={(gameState.exploration.collectedGeoCores || 0) <= (gameState.exploration.analyzedGeoCores || 0)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 border border-cyan-400/40"
              >
                <span>REFINE (+2 PARTS)</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(MODULES_CONFIG).map((mod) => {
              const health = moduleHealth[mod.id] ?? 100;
              const canRepair = health < 95 && spareParts >= 1;
              const Icon = ICON_MAP[mod.id] || Wrench;

              return (
                <div 
                  key={mod.id}
                  className="p-4 rounded-xl bg-space-850 border border-space-750 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} color={mod.accentColor} />
                        <h4 className="font-mono font-bold text-xs text-white">
                          {mod.name}
                        </h4>
                      </div>
                      <span className={`text-xs font-mono font-bold ${
                        health > 80 ? 'text-emerald-400' : health > 45 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {health}%
                      </span>
                    </div>

                    <div className="w-full bg-space-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          health > 80 ? 'bg-emerald-400' : health > 45 ? 'bg-amber-400' : 'bg-red-500'
                        }`}
                        style={{ width: `${health}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-space-400">
                      {mod.category}
                    </span>

                    <button
                      onClick={() => handleRepair(mod.id)}
                      disabled={!canRepair}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                        canRepair 
                          ? 'bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700 shadow'
                          : 'bg-space-800 text-space-500 border border-space-750 cursor-not-allowed'
                      }`}
                    >
                      <Wrench size={12} />
                      <span>{health >= 95 ? 'Nominal' : 'Service (+20%)'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-space-700 bg-space-850 flex items-center justify-between text-[11px] font-mono text-space-400">
          <span>Spare parts are used to refurbish cracked seals, replace solar gears, and maintain life support loops.</span>
        </div>
      </div>
    </div>
  );
}
