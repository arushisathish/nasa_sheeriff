import React from 'react';
import { 
  Activity, 
  Radio, 
  FileText, 
  Calendar, 
  AlertCircle,
  HelpCircle,
  Orbit,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export default function TopHeader({ 
  currentSol = 1, 
  totalSols = 30, 
  activeTab = 'dashboard', 
  onTabChange,
  unreadAlertCount = 0,
  onOpenIntro,
  isMuted = false,
  onToggleMute,
}) {
  const tabs = [
    { id: 'dashboard', label: 'Mission Control', icon: Activity },
    { id: 'radiation', label: 'Radiation Monitor', icon: Radio },
    { id: 'events', label: 'Event Log', icon: AlertCircle, badge: unreadAlertCount },
    { id: 'report', label: 'Daily Report', icon: FileText },
  ];

  const handleTabClick = (id) => {
    soundService.playClick();
    onTabChange(id);
  };

  return (
    <header className="h-16 bg-space-900/90 backdrop-blur-md border-b border-space-700 px-4 flex items-center justify-between select-none z-30">
      {/* Top Left: Sol Counter Badge & Brand */}
      <div className="flex items-center gap-4">
        {/* Outpost Brand / Logo */}
        <div className="flex items-center gap-2.5 pr-3 border-r border-space-700">
          <div className="w-9 h-9 rounded-lg bg-mars-500/10 border border-mars-500/40 flex items-center justify-center text-mars-500 shadow-inner">
            <Orbit size={20} className="animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-widest text-white uppercase font-mono">
                OUTPOST ZERO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-mars-500/20 text-mars-400 font-mono font-medium border border-mars-500/30">
                NASA SIM
              </span>
            </div>
            <div className="text-[11px] text-space-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SURVIVAL STATUS: NOMINAL
            </div>
          </div>
        </div>

        {/* Circular Sol Counter Badge */}
        <div className="flex items-center gap-2 bg-space-850 px-3 py-1.5 rounded-md border border-space-700 shadow-sm">
          <Calendar size={15} className="text-mars-400" />
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xs text-space-400">SOL</span>
            <span className="text-base font-bold text-white tracking-wider">{currentSol}</span>
            <span className="text-xs text-space-400">/ {totalSols}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-space-950/60 p-1 rounded-lg border border-space-700/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-space-750 text-white shadow border border-space-600'
                    : 'text-space-300 hover:text-white hover:bg-space-800'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-mars-400' : 'text-space-400'} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Top Right: Audio Toggle & Mission Manual */}
      <div className="flex items-center gap-2">
        {/* Audio Mute / Unmute Button */}
        <button
          onClick={onToggleMute}
          className="p-2 rounded-md bg-space-800 hover:bg-space-750 border border-space-700 text-space-300 hover:text-white transition-colors"
          title={isMuted ? 'Unmute synthesized terminal audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX size={15} className="text-space-500" />
          ) : (
            <Volume2 size={15} className="text-emerald-400" />
          )}
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            onOpenIntro();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-space-800 hover:bg-space-750 border border-space-700 text-xs text-space-300 hover:text-white transition-colors font-mono"
          title="Mission Manual & NASA Reference"
        >
          <HelpCircle size={14} className="text-mars-400" />
          <span className="hidden sm:inline">Mission Manual</span>
        </button>
      </div>
    </header>
  );
}
