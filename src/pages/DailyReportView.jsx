import React, { useState, useEffect } from 'react';
import TopHeader from '../components/hud/TopHeader';
import { 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wind, 
  Droplet, 
  Zap, 
  Apple, 
  Calendar,
  Heart,
  Smile,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';

export default function DailyReportView({ 
  gameState, 
  onTabChange, 
  activeTab, 
  onOpenIntro,
  isMuted,
  onToggleMute,
}) {
  const { currentSol, totalSols, alerts = [], dailyLogs = [] } = gameState;
  const [expandedSol, setExpandedSol] = useState(dailyLogs.length > 0 ? dailyLogs[0].sol : null);

  // Return to 3D Outpost on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onTabChange('dashboard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  const toggleExpand = (sol) => {
    setExpandedSol(prev => prev === sol ? null : sol);
  };

  return (
    <div className="min-h-screen bg-space-950 flex flex-col font-sans select-none text-space-100">
      <TopHeader
        currentSol={currentSol}
        totalSols={totalSols}
        activeTab={activeTab}
        onTabChange={onTabChange}
        unreadAlertCount={alerts.filter(a => !a.resolved).length}
        onOpenIntro={onOpenIntro}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-space-800 gap-2">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <FileText className="text-cyan-400" size={20} />
              DAILY MISSION TELEMETRY REPORTS
            </h2>
            <p className="text-xs text-space-400 font-mono mt-1">
              Archived historical debriefs tracking consumables deltas, crew bio-telemetry, and Martian insolation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 hover:text-white font-mono text-xs font-semibold shadow-lg transition-all"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO 3D OUTPOST [ESC]</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-mono px-3 py-1.5 rounded bg-space-850 border border-space-700 text-space-300">
              SOLS ARCHIVED: {dailyLogs.length}
            </span>
          </div>
        </div>

        {/* List of Archived Sol Reports */}
        <div className="space-y-4">
          {dailyLogs.map((report, idx) => {
            const isExpanded = expandedSol === report.sol;
            const deltas = report.deltas || {};
            const prod = report.production || {};
            const cons = report.consumption || {};

            return (
              <div 
                key={report.sol || idx}
                className="rounded-xl bg-space-900 border border-space-700/80 overflow-hidden shadow-lg transition-all"
              >
                {/* Sol Header Bar (Clickable) */}
                <button
                  onClick={() => toggleExpand(report.sol)}
                  className="w-full p-4 flex items-center justify-between bg-space-850 hover:bg-space-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-mars-500/15 border border-mars-500/30 flex items-center justify-center font-mono font-bold text-xs text-mars-400">
                      S{report.sol}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white flex items-center gap-2">
                        <span>SOL {report.sol} MISSION DEBRIEF</span>
                        {idx === 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-normal">
                            LATEST
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-space-400 truncate max-w-md mt-0.5">
                        {report.summary}
                      </div>
                    </div>
                  </div>

                  {/* Compact quick delta indicators */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className={`hidden sm:inline ${deltas.oxygen >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      O2 {deltas.oxygen >= 0 ? `+${deltas.oxygen}` : deltas.oxygen}
                    </span>
                    <span className={`hidden sm:inline ${deltas.energy >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      PWR {deltas.energy >= 0 ? `+${deltas.energy}` : deltas.energy}
                    </span>
                    <div className="p-1 text-space-400">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-space-700/60 space-y-4 animate-in fade-in duration-150">
                    {/* Consumables Net Delta Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* O2 */}
                      <div className="p-3 rounded-lg bg-space-850 border border-space-750 font-mono">
                        <div className="flex items-center justify-between text-xs text-space-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Wind size={12} className="text-cyan-400" />
                            OXYGEN
                          </span>
                          <span className={deltas.oxygen >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {deltas.oxygen >= 0 ? `+${deltas.oxygen}` : deltas.oxygen} kg
                          </span>
                        </div>
                        {prod.o2Produced !== undefined && (
                          <div className="text-[10px] text-space-400 flex justify-between">
                            <span>Prod: +{prod.o2Produced}</span>
                            <span>Cons: -{cons.crewO2}</span>
                          </div>
                        )}
                      </div>

                      {/* Water */}
                      <div className="p-3 rounded-lg bg-space-850 border border-space-750 font-mono">
                        <div className="flex items-center justify-between text-xs text-space-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Droplet size={12} className="text-sky-400" />
                            WATER
                          </span>
                          <span className={deltas.water >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {deltas.water >= 0 ? `+${deltas.water}` : deltas.water} L
                          </span>
                        </div>
                        {prod.waterRecycled !== undefined && (
                          <div className="text-[10px] text-space-400 flex justify-between">
                            <span>Recyc: +{prod.waterRecycled}</span>
                            <span>Cons: -{cons.totalWater}</span>
                          </div>
                        )}
                      </div>

                      {/* Power */}
                      <div className="p-3 rounded-lg bg-space-850 border border-space-750 font-mono">
                        <div className="flex items-center justify-between text-xs text-space-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Zap size={12} className="text-amber-400" />
                            POWER
                          </span>
                          <span className={deltas.energy >= 0 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                            {deltas.energy >= 0 ? `+${deltas.energy}` : deltas.energy} kWh
                          </span>
                        </div>
                        {prod.solarPowerGenerated !== undefined && (
                          <div className="text-[10px] text-space-400 flex justify-between">
                            <span>Solar: +{prod.solarPowerGenerated}</span>
                            <span>Draw: -{cons.habitatPower}</span>
                          </div>
                        )}
                      </div>

                      {/* Food */}
                      <div className="p-3 rounded-lg bg-space-850 border border-space-750 font-mono">
                        <div className="flex items-center justify-between text-xs text-space-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Apple size={12} className="text-emerald-400" />
                            FOOD
                          </span>
                          <span className={deltas.food >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {deltas.food >= 0 ? `+${deltas.food}` : deltas.food} kg
                          </span>
                        </div>
                        {prod.foodHarvested !== undefined && (
                          <div className="text-[10px] text-space-400 flex justify-between">
                            <span>Yield: +{prod.foodHarvested}</span>
                            <span>Rations: -{cons.crewFood}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio-telemetry & Environmental telemetry */}
                    {report.crewVitality && (
                      <div className="p-3.5 rounded-lg bg-space-850 border border-space-750 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-space-300">
                            <Heart size={14} className="text-rose-400" />
                            Crew Health: <strong className="text-white">{report.crewVitality.health}%</strong>
                          </span>
                          <span className="flex items-center gap-1.5 text-space-300">
                            <Smile size={14} className="text-amber-400" />
                            Morale: <strong className="text-white">{report.crewVitality.morale}%</strong>
                          </span>
                        </div>

                        {report.environment && (
                          <div className="flex items-center gap-4 text-space-400">
                            <span>Dust Tau: {report.environment.tau.toFixed(2)}</span>
                            <span>Insolation: {report.environment.solarInsolation}%</span>
                            <span>Dose Added: +{deltas.radiationCrewDose} mSv</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
