import React from 'react';
import { 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wind, 
  Droplet, 
  Zap, 
  Apple, 
  Radio, 
  Heart, 
  Smile, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

export default function DailyReportModal({ report, isOpen, onClose, nextSol }) {
  if (!isOpen || !report) return null;

  const { deltas, production, consumption, crewVitality, environment, sol } = report;

  const formatDelta = (val, unit) => {
    const isPositive = val >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {isPositive ? `+${val}` : val} {unit}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-space-700 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-mars-400">
                END-OF-SOL OPERATIONS LOG
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                SOL {sol} TRANSITION COMPLETE
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-space-750 text-space-300 border border-space-650">
            PROCEEDING TO SOL {nextSol}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-space-300">
          {/* Executive Summary */}
          <div className="p-3.5 rounded-lg bg-space-850 border border-space-750 text-space-200 leading-relaxed font-sans">
            {report.summary}
          </div>

          {/* 4 Core Consumables Net Yield Grid */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase text-space-400 mb-2.5 tracking-wider">
              Consumables & Closed-Loop Recycling Yields
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Oxygen */}
              <div className="p-3 rounded-lg bg-space-850/80 border border-space-750 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 text-space-300">
                    <Wind size={13} className="text-cyan-400" />
                    O2 NET
                  </span>
                  {formatDelta(deltas.oxygen, 'kg')}
                </div>
                <div className="text-[11px] text-space-400 mt-1 flex justify-between font-mono">
                  <span>+ {production.o2Produced} kg</span>
                  <span>- {consumption.crewO2} kg</span>
                </div>
              </div>

              {/* Water */}
              <div className="p-3 rounded-lg bg-space-850/80 border border-space-750 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 text-space-300">
                    <Droplet size={13} className="text-sky-400" />
                    H2O NET
                  </span>
                  {formatDelta(deltas.water, 'L')}
                </div>
                <div className="text-[11px] text-space-400 mt-1 flex justify-between font-mono">
                  <span>+ {production.waterRecycled} L</span>
                  <span>- {consumption.totalWater} L</span>
                </div>
              </div>

              {/* Energy */}
              <div className="p-3 rounded-lg bg-space-850/80 border border-space-750 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 text-space-300">
                    <Zap size={13} className="text-amber-400" />
                    POWER NET
                  </span>
                  {formatDelta(deltas.energy, 'kWh')}
                </div>
                <div className="text-[11px] text-space-400 mt-1 flex justify-between font-mono">
                  <span>+ {production.solarPowerGenerated} kWh</span>
                  <span>- {consumption.habitatPower} kWh</span>
                </div>
              </div>

              {/* Food */}
              <div className="p-3 rounded-lg bg-space-850/80 border border-space-750 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 text-space-300">
                    <Apple size={13} className="text-emerald-400" />
                    FOOD NET
                  </span>
                  {formatDelta(deltas.food, 'kg')}
                </div>
                <div className="text-[11px] text-space-400 mt-1 flex justify-between font-mono">
                  <span>+ {production.foodHarvested} kg</span>
                  <span>- {consumption.crewFood} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Crew Status & Environmental Conditions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Crew Vitality */}
            <div className="p-3.5 rounded-lg bg-space-850 border border-space-750 space-y-2">
              <h5 className="font-mono text-[11px] uppercase font-bold text-space-400 tracking-wider">
                Crew Bio-Telemetry
              </h5>
              <div className="flex items-center justify-between font-mono">
                <span className="flex items-center gap-1 text-space-300">
                  <Heart size={13} className="text-rose-400" />
                  Health
                </span>
                <span className="text-white font-bold">{crewVitality.health}%</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="flex items-center gap-1 text-space-300">
                  <Smile size={13} className="text-amber-400" />
                  Morale
                </span>
                <span className="text-white font-bold">{crewVitality.morale}%</span>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="p-3.5 rounded-lg bg-space-850 border border-space-750 space-y-2">
              <h5 className="font-mono text-[11px] uppercase font-bold text-space-400 tracking-wider">
                Surface Environment
              </h5>
              <div className="flex items-center justify-between font-mono">
                <span className="text-space-300">Dust Opacity (Tau)</span>
                <span className="text-white font-bold">{environment.tau.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-space-300">Insolation Efficiency</span>
                <span className="text-amber-400 font-bold">{environment.solarInsolation}%</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-space-300">Crew Dose Added</span>
                <span className="text-cyan-400 font-bold">+{deltas.radiationCrewDose} mSv</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-space-700 bg-space-850 flex items-center justify-between">
          <div className="text-[11px] font-mono text-space-400">
            All telemetry archived to Daily Reports log.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/40"
          >
            <span>START SOL {nextSol} OPERATIONS</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
