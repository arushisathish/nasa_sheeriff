import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Activity, 
  Orbit, 
  Radio, 
  TrendingUp,
  Users,
  Shield,
  Zap,
  Sprout,
  Wind,
  Droplet,
  Award
} from 'lucide-react';
import { soundService } from '../../services/soundService';

const AVAILABLE_STATIONS = [
  { id: 'command_console', label: 'Command Hub' },
  { id: 'life_support', label: 'Life Support O2' },
  { id: 'solar_array', label: 'Solar Ridge Array' },
  { id: 'hydroponics', label: 'Hydroponics Bay' },
  { id: 'water_recycler', label: 'Water Recycler' },
];

export default function CommandConsoleModal({
  isOpen,
  onClose,
  gameState,
  onAdvanceSol,
  onOpenRadiation,
  onOpenEventLog,
  onAssignCrew,
}) {
  const [activeSubTab, setActiveSubTab] = useState('directives'); // 'directives' | 'crew'

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

  const { currentSol, totalSols, resources, pendingDecisions = [], dailyLogs = [], crewMembers = [] } = gameState;
  const latestLog = dailyLogs[0];

  const handleStationChange = (memberId, newStation) => {
    soundService.playClick();
    if (onAssignCrew) {
      onAssignCrew(memberId, newStation);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Terminal Header */}
        <div className="p-5 border-b border-space-700 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal size={22} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-mars-400">
                CENTRAL COMMAND HUB TERMINAL
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                OUTPOST ZERO MISSION DIRECTIVE
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-750 text-space-400 hover:text-white transition-colors border border-space-700"
            title="Close Terminal (ESC)"
          >
            <span className="text-[10px] font-mono font-bold">[ESC]</span>
            <X size={16} />
          </button>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex border-b border-space-700 bg-space-850 px-6 font-mono text-xs">
          <button
            onClick={() => {
              soundService.playClick();
              setActiveSubTab('directives');
            }}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors ${
              activeSubTab === 'directives'
                ? 'border-mars-500 text-white'
                : 'border-transparent text-space-400 hover:text-white'
            }`}
          >
            <Activity size={14} className={activeSubTab === 'directives' ? 'text-mars-400' : ''} />
            <span>DIRECTIVES & TIMELINE</span>
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              setActiveSubTab('crew');
            }}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors ${
              activeSubTab === 'crew'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-space-400 hover:text-white'
            }`}
          >
            <Users size={14} className={activeSubTab === 'crew' ? 'text-cyan-400' : ''} />
            <span>CREW ROSTER & NASA PERKS ({crewMembers.length || 4})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-space-300 font-sans">
          {activeSubTab === 'crew' ? (
            /* Crew Roster & Station Assignment Section */
            <div className="space-y-4 font-mono">
              <div className="p-3 rounded-xl bg-space-850 border border-space-750 flex items-center justify-between text-xs">
                <span className="text-space-300">
                  Assign NASA specialists to habitat bays to unlock subsystem yield bonuses each Sol.
                </span>
                <span className="text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded text-[10px]">
                  4 / 4 ACTIVE
                </span>
              </div>

              <div className="space-y-3">
                {crewMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="p-4 rounded-xl bg-space-850/80 border border-space-750 space-y-3 hover:border-space-650 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-mars-500/15 border border-mars-500/40 flex items-center justify-center text-mars-400 font-bold text-xs">
                          {member.name.split(' ')[0][0]}{member.name.split(' ')[1]?.[0] || '1'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{member.name}</span>
                            <span className="text-[10px] text-space-400 px-1.5 py-0.2 rounded bg-space-800 border border-space-700">
                              {member.callsign}
                            </span>
                          </div>
                          <span className="text-xs text-space-400 font-sans block">{member.role}</span>
                        </div>
                      </div>

                      {/* Station Selector Dropdown */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-space-400 text-[11px]">Station:</span>
                        <select
                          value={member.assignment}
                          onChange={(e) => handleStationChange(member.id, e.target.value)}
                          className="bg-space-800 border border-space-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                        >
                          {AVAILABLE_STATIONS.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Active NASA Perk Badge */}
                    <div className="p-2.5 rounded-lg bg-space-900 border border-space-800 flex items-start gap-2 text-[11px]">
                      <Award size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-amber-300 font-bold">NASA Specialty: </span>
                        <span className="text-space-300 font-sans">{member.specialty} — </span>
                        <span className="text-emerald-400 font-mono font-bold">{member.perkDescription}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Directives & Timeline Section */
            <>
              {/* Sol Timeline Progress Gauge */}
              <div className="p-4 rounded-xl bg-space-850 border border-space-750 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-space-300 flex items-center gap-1.5">
                    <Calendar size={14} className="text-mars-400" />
                    EXPEDITION SOL PROGRESSION
                  </span>
                  <span className="text-white font-bold">
                    SOL {currentSol} <span className="text-space-400">/ {totalSols}</span>
                  </span>
                </div>
                <div className="w-full bg-space-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-mars-600 to-mars-400 transition-all duration-300"
                    style={{ width: `${Math.round((currentSol / totalSols) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-space-400 pt-1">
                  <span>Landing: Chryse Planitia</span>
                  <span>{totalSols - currentSol} Sols Remaining Until Resupply</span>
                </div>
              </div>

              {/* Active Emergencies or Nominal Status */}
              {pendingDecisions.length > 0 ? (
                <div className="p-4 rounded-xl bg-red-950/25 border border-red-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-red-400 flex items-center gap-1.5 text-xs">
                      <AlertCircle size={15} />
                      ACTIVE INCIDENTS AWAITING COMMAND AUTHORIZATION
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900 text-white font-bold animate-pulse">
                      {pendingDecisions.length} PENDING
                    </span>
                  </div>
                  <p className="text-xs text-space-300">
                    {pendingDecisions[0].title} — {pendingDecisions[0].description}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenEventLog();
                    }}
                    className="mt-1 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors"
                  >
                    Open Incident Resolution Screen
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-space-850/80 border border-space-750 flex items-center gap-3 font-mono text-xs">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span className="text-space-300">
                    All core life support, power distribution, and pressurization loops are operating within nominal NASA thresholds.
                  </span>
                </div>
              )}

              {/* Latest Sol Telemetry Debrief */}
              {latestLog && (
                <div className="p-4 rounded-xl bg-space-850 border border-space-750 space-y-2 font-mono text-xs">
                  <div className="text-mars-400 font-bold uppercase tracking-wider text-[11px]">
                    SOL {latestLog.sol} OPERATIONAL SUMMARY
                  </div>
                  <p className="text-space-200 font-sans leading-relaxed">
                    {latestLog.summary}
                  </p>
                  {latestLog.deltas && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-space-750 text-[11px]">
                      <span>O2: {latestLog.deltas.oxygen >= 0 ? `+${latestLog.deltas.oxygen}` : latestLog.deltas.oxygen} kg</span>
                      <span>Water: {latestLog.deltas.water >= 0 ? `+${latestLog.deltas.water}` : latestLog.deltas.water} L</span>
                      <span>Power: {latestLog.deltas.energy >= 0 ? `+${latestLog.deltas.energy}` : latestLog.deltas.energy} kWh</span>
                      <span>Food: {latestLog.deltas.food >= 0 ? `+${latestLog.deltas.food}` : latestLog.deltas.food} kg</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-space-700 bg-space-850 flex items-center justify-between">
          <div className="text-[11px] font-mono text-space-400">
            Crew: 4 Astronauts • Morale: {resources.crew.morale}% • Health: {resources.crew.health}%
          </div>
          <button
            onClick={() => {
              onClose();
              onAdvanceSol();
            }}
            disabled={currentSol >= totalSols}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-mars-600/30 transition-all active:scale-95 border border-mars-400/40"
          >
            <span>ADVANCE SOL {currentSol + 1}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
