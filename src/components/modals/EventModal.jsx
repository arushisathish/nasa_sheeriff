import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Info, 
  CheckCircle2, 
  Wrench, 
  Droplet, 
  Apple, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { canAffordChoice } from '../../game/decisionEngine';

export default function EventModal({ 
  event, 
  isOpen, 
  onSelectChoice, 
  gameState 
}) {
  if (!isOpen || !event) return null;

  const { title, category, severity, description, nasaFact, choices = [], sol } = event;

  const isCritical = severity === 'critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className={`bg-space-900 border rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl ${
        isCritical ? 'border-red-600/80 shadow-red-950/60' : 'border-amber-600/80 shadow-amber-950/60'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isCritical ? 'bg-red-950/30 border-red-800/60' : 'bg-amber-950/30 border-amber-800/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner ${
              isCritical 
                ? 'bg-red-600/20 border-red-500/50 text-red-400 animate-pulse' 
                : 'bg-amber-600/20 border-amber-500/50 text-amber-400'
            }`}>
              {category === 'space_weather' ? <Flame size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isCritical 
                    ? 'bg-red-950 text-red-300 border-red-800' 
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  PRIORITY ALERT • {severity.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-space-400">SOL {sol} INCIDENT</span>
              </div>
              <h3 className="font-mono font-bold text-white text-lg mt-0.5">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-space-300 font-sans">
          {/* Scientific Incident Description */}
          <div className="p-4 rounded-xl bg-space-850 border border-space-750 text-space-100 leading-relaxed text-sm">
            {description}
          </div>

          {/* NASA Technical Reference */}
          {nasaFact && (
            <div className="p-3.5 rounded-lg bg-mars-950/40 border border-mars-800/40 flex items-start gap-2.5">
              <Info size={16} className="text-mars-400 shrink-0 mt-0.5" />
              <div className="text-xs text-space-300 leading-relaxed">
                <strong className="text-mars-400 font-mono">NASA ENGINEERING PERSPECTIVE: </strong>
                {nasaFact}
              </div>
            </div>
          )}

          {/* Decision Choices */}
          <div className="space-y-3 pt-1">
            <h4 className="font-mono text-xs font-bold uppercase text-space-300 tracking-wider flex items-center gap-2">
              <span>Required Command Decision:</span>
              <span className="text-[10px] text-space-400 font-normal">(Evaluate resource costs vs consequences)</span>
            </h4>

            <div className="space-y-3">
              {choices.map((choice) => {
                const canAfford = canAffordChoice(choice, gameState);

                return (
                  <div
                    key={choice.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      canAfford
                        ? 'bg-space-850 hover:bg-space-800 border-space-700 hover:border-space-550'
                        : 'bg-space-900/60 border-space-800 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono font-bold text-sm text-white">
                          {choice.label}
                        </span>

                        {/* Cost Badges */}
                        <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
                          {choice.cost?.spareParts > 0 && (
                            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                              <Wrench size={11} />
                              -{choice.cost.spareParts} Parts
                            </span>
                          )}
                          {choice.cost?.energy > 0 && (
                            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                              <Zap size={11} />
                              -{choice.cost.energy} kWh
                            </span>
                          )}
                          {choice.cost?.water > 0 && (
                            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1">
                              <Droplet size={11} />
                              -{choice.cost.water} L
                            </span>
                          )}
                          {choice.cost?.food > 0 && (
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                              <Apple size={11} />
                              -{choice.cost.food} kg
                            </span>
                          )}
                          {(!choice.cost || Object.keys(choice.cost).length === 0 || Object.values(choice.cost).every(v => v === 0)) && (
                            <span className="px-2 py-0.5 rounded bg-space-750 text-space-300 border border-space-650">
                              No Upfront Cost
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Trade-off Explanation */}
                      <p className="text-xs text-space-300 mt-2 leading-relaxed">
                        {choice.tradeOffText}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-space-750/70">
                      <span className="text-[11px] font-mono text-space-400">
                        {canAfford ? 'Resources verified in storage' : 'Insufficient resources to execute'}
                      </span>

                      <button
                        onClick={() => onSelectChoice(choice.id)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white shadow-md active:scale-95'
                            : 'bg-space-800 text-space-500 border border-space-750 cursor-not-allowed'
                        }`}
                      >
                        <span>Authorize Decision</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
