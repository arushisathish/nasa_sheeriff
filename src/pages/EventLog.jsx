import React, { useState, useEffect } from 'react';
import TopHeader from '../components/hud/TopHeader';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Flame, 
  Wrench, 
  Wind, 
  Droplet, 
  Zap, 
  Filter, 
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export default function EventLog({ 
  gameState, 
  onTabChange, 
  activeTab, 
  onOpenIntro,
  onOpenEventModal,
  isMuted,
  onToggleMute,
}) {
  const { currentSol, totalSols, alerts = [], resolvedEvents = [], pendingDecisions = [] } = gameState;
  const [filter, setFilter] = useState('all');

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

  return (
    <div className="min-h-screen bg-space-950 flex flex-col font-sans select-none text-space-100">
      <TopHeader
        currentSol={currentSol}
        totalSols={totalSols}
        activeTab={activeTab}
        onTabChange={onTabChange}
        unreadAlertCount={pendingDecisions.length}
        onOpenIntro={onOpenIntro}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-space-800 gap-2">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <AlertCircle className="text-amber-400" size={20} />
              MISSION EVENT & DECISION ARCHIVE
            </h2>
            <p className="text-xs text-space-400 font-mono mt-1">
              Historical ledger of environmental hazards, subsystem alerts, and authorized command directives.
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
              TOTAL INCIDENTS: {resolvedEvents.length + pendingDecisions.length}
            </span>
          </div>
        </div>

        {/* Active Pending Decisions (High Priority) */}
        {pendingDecisions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              IMMEDIATE COMMAND DECISIONS REQUIRED ({pendingDecisions.length})
            </h3>
            {pendingDecisions.map((evt) => (
              <div 
                key={evt.id}
                className="p-4 rounded-xl bg-red-950/20 border border-red-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      SOL {evt.sol || currentSol}
                    </span>
                    <h4 className="font-mono font-bold text-white text-sm">{evt.title}</h4>
                  </div>
                  <p className="text-xs text-space-300 max-w-2xl">{evt.description}</p>
                </div>

                <button
                  onClick={() => onOpenEventModal && onOpenEventModal(evt)}
                  className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-red-900/40"
                >
                  <span>Resolve Alert</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resolved Event History */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-space-400 tracking-wider">
            Resolved Incident History
          </h3>

          {resolvedEvents.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-space-900 border border-space-850 space-y-2">
              <CheckCircle className="mx-auto text-emerald-400" size={32} />
              <h4 className="text-sm font-mono text-white font-bold">ALL HISTORICAL LOGS NOMINAL</h4>
              <p className="text-xs text-space-400 max-w-md mx-auto">
                No past incidents have required emergency intervention yet. As Sol days advance, core survival events will appear here with your command decisions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedEvents.map((evt, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-space-900 border border-space-700/80 space-y-2 shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold">
                        ✓
                      </span>
                      <h4 className="font-mono font-bold text-sm text-white">{evt.title}</h4>
                    </div>
                    <span className="text-xs font-mono text-space-400">Sol {evt.sol}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-space-850 border border-space-750 space-y-1.5 font-mono text-xs">
                    <div className="text-space-300">
                      <span className="text-space-400">Command Directive: </span>
                      <strong className="text-cyan-400">{evt.choiceLabel}</strong>
                    </div>
                    <div className="text-space-300">
                      <span className="text-space-400">Outcome: </span>
                      <span className="text-emerald-400">{evt.resolutionMessage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
