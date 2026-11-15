import React, { useEffect } from 'react';
import { 
  X, 
  Activity, 
  Wrench, 
  Zap, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Wind,
  Droplet,
  Gauge,
  Sliders
} from 'lucide-react';
import { MODULES_CONFIG, MODULE_IDS } from '../../data/modulesConfig';

export default function RoomDetailsPanel({
  selectedModuleId,
  onClose,
  moduleHealth = 100,
  sparePartsAvailable = 0,
  onRepairModule,
}) {
  // ESC shortcut to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!selectedModuleId) return null;

  const module = MODULES_CONFIG[selectedModuleId];
  if (!module) return null;

  const canRepair = moduleHealth < 95 && sparePartsAvailable >= 1;

  // NASA ECLSS calculated metrics based on current module health
  const healthMultiplier = moduleHealth / 100;
  const co2ScrubbingEff = Math.round(94 * healthMultiplier);
  const o2GenEff = Math.round(96 * healthMultiplier);
  const waterRecoveryEff = Math.round(93 * healthMultiplier);

  const isLifeSupport = selectedModuleId === MODULE_IDS.LIFE_SUPPORT;
  const isWaterRecycler = selectedModuleId === MODULE_IDS.WATER_RECYCLING;
  const isGreenhouse = selectedModuleId === MODULE_IDS.GREENHOUSE;

  return (
    <aside className="absolute top-16 right-0 bottom-20 w-80 sm:w-[420px] bg-space-900/95 backdrop-blur-xl border-l-2 border-space-700 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-30 animate-in slide-in-from-right duration-200 select-none">
      <div className="space-y-4">
        {/* Header & Explicit Close Button */}
        <div className="flex items-start justify-between pb-3 border-b border-space-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-mars-400 uppercase bg-mars-500/10 px-2 py-0.5 rounded border border-mars-500/20">
                {module.category}
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                STATION CONSOLE
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono mt-1">
              {module.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-space-800 hover:bg-red-950/80 border border-space-650 hover:border-red-600/80 text-space-300 hover:text-white transition-all group"
            title="Close Station Screen (ESC)"
          >
            <span className="text-[10px] font-mono font-bold group-hover:text-red-400">[ESC]</span>
            <X size={16} className="text-space-400 group-hover:text-red-400" />
          </button>
        </div>

        {/* System Health / Operational Integrity */}
        <div className="p-3.5 rounded-xl bg-space-850 border border-space-700/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-space-300 flex items-center gap-1.5 font-bold">
              <Activity size={14} className="text-cyan-400" />
              SYSTEM OPERATIONAL INTEGRITY
            </span>
            <span className={`font-bold ${
              moduleHealth > 80 ? 'text-emerald-400' : moduleHealth > 45 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {moduleHealth}% {moduleHealth < 75 ? '(DEGRADED)' : '(NOMINAL)'}
            </span>
          </div>
          <div className="w-full bg-space-950 h-2.5 rounded-full overflow-hidden border border-space-750">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                moduleHealth > 80 ? 'bg-emerald-400' : moduleHealth > 45 ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${moduleHealth}%` }}
            />
          </div>
        </div>

        {/* NASA ECLSS Subsystems Realism Panel */}
        {(isLifeSupport || isWaterRecycler || isGreenhouse) && (
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-xs text-cyan-300 font-bold border-b border-cyan-900/60 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" />
                NASA ECLSS LIFE SUPPORT METRICS
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-200">
                CLOSED-LOOP
              </span>
            </div>

            {isLifeSupport && (
              <div className="space-y-2 text-xs font-mono">
                {/* CO2 Scrubbing */}
                <div className="flex items-center justify-between bg-space-900/80 p-2 rounded border border-space-750">
                  <div>
                    <div className="text-space-300 font-bold flex items-center gap-1">
                      <Wind size={12} className="text-cyan-400" />
                      CO2 Scrubbing (CDRA Amine Beds)
                    </div>
                    <div className="text-[10px] text-space-500">
                      NASA Baseline: &lt;0.3% ambient CO2
                    </div>
                  </div>
                  <span className={`font-bold ${co2ScrubbingEff >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {co2ScrubbingEff}% Eff.
                  </span>
                </div>

                {/* O2 Generation */}
                <div className="flex items-center justify-between bg-space-900/80 p-2 rounded border border-space-750">
                  <div>
                    <div className="text-space-300 font-bold flex items-center gap-1">
                      <Gauge size={12} className="text-emerald-400" />
                      O2 Generation (Electrolysis / MOXIE)
                    </div>
                    <div className="text-[10px] text-space-500">
                      Target Cabin: 21.3 kPa partial pressure
                    </div>
                  </div>
                  <span className={`font-bold ${o2GenEff >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {o2GenEff}% Eff.
                  </span>
                </div>
              </div>
            )}

            {isWaterRecycler && (
              <div className="space-y-2 text-xs font-mono">
                {/* Water Recovery */}
                <div className="flex items-center justify-between bg-space-900/80 p-2 rounded border border-space-750">
                  <div>
                    <div className="text-space-300 font-bold flex items-center gap-1">
                      <Droplet size={12} className="text-sky-400" />
                      Water Loop Recovery (WPA/UPA)
                    </div>
                    <div className="text-[10px] text-space-500">
                      NASA ISS Benchmark: 93%–98% recovery
                    </div>
                  </div>
                  <span className={`font-bold ${waterRecoveryEff >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {waterRecoveryEff}% Recovery
                  </span>
                </div>
              </div>
            )}

            {isGreenhouse && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between bg-space-900/80 p-2 rounded border border-space-750">
                  <div>
                    <div className="text-space-300 font-bold">Bioregenerative Transpiration Recovery</div>
                    <div className="text-[10px] text-space-500">Vegetative atmospheric moisture recycling</div>
                  </div>
                  <span className="font-bold text-emerald-400">92% Recycled</span>
                </div>
              </div>
            )}

            {moduleHealth < 75 && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-amber-950/50 p-2 rounded border border-amber-800/60">
                <AlertTriangle size={13} className="shrink-0 text-amber-400" />
                <span>Malfunction detected: degraded ECLSS scrubbing. Service required (-1 Spare Part).</span>
              </div>
            )}
          </div>
        )}

        {/* Technical Description */}
        <div>
          <h4 className="text-xs font-mono uppercase text-space-400 mb-1 font-semibold">
            Telemetry & Module Directives
          </h4>
          <p className="text-xs text-space-200 leading-relaxed bg-space-850/60 p-3 rounded-lg border border-space-750 font-sans">
            {module.description}
          </p>
        </div>

        {/* Input / Output Specs */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-space-850 border border-space-750">
            <span className="text-space-400">Baseline Output:</span>
            <span className="text-emerald-400 font-medium">{module.baseOutput}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-space-850 border border-space-750">
            <span className="text-space-400">Baseline Demand:</span>
            <span className="text-amber-400 font-medium">{module.baseConsumption}</span>
          </div>
        </div>

        {/* NASA Educational Grounding Reference */}
        <div className="p-3 rounded-lg bg-mars-950/40 border border-mars-800/50 space-y-1">
          <div className="flex items-center gap-1.5 text-mars-400 text-xs font-mono font-bold">
            <Info size={13} />
            <span>REAL NASA REFERENCE DATA</span>
          </div>
          <p className="text-[11px] text-space-300 leading-normal">
            {module.nasaFact}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-space-700 flex flex-col gap-2 mt-4">
        <button
          onClick={() => onRepairModule && onRepairModule(module.id)}
          disabled={!canRepair}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            canRepair
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 hover:scale-[1.01]'
              : 'bg-space-800 text-space-500 border border-space-750 cursor-not-allowed'
          }`}
        >
          <Wrench size={14} className={canRepair ? 'text-white' : 'text-space-500'} />
          <span>
            {moduleHealth >= 95 
              ? 'SYSTEM NOMINAL' 
              : `SERVICE MODULE (-1 PART, +20% INTEGRITY)`}
          </span>
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 px-3 rounded-xl text-xs font-mono text-space-400 hover:text-white hover:bg-space-800 border border-space-750 transition-colors flex items-center justify-center gap-1.5"
        >
          <span>CLOSE STATION INSPECTOR</span>
          <span className="text-[10px] text-space-500">[ESC]</span>
        </button>

        <div className="text-[10px] text-center text-space-500 font-mono">
          Available Spare Parts: {sparePartsAvailable}
        </div>
      </div>
    </aside>
  );
}
