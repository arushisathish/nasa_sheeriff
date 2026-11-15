import React from 'react';
import { Eye, Zap, Wind, Radio } from 'lucide-react';

export default function OverlayBar({ activeOverlay = 'normal', onChangeOverlay }) {
  const overlays = [
    { id: 'normal', label: 'Standard', icon: Eye, color: 'text-space-200' },
    { id: 'power', label: 'Power Grid', icon: Zap, color: 'text-amber-400' },
    { id: 'o2', label: 'O2 & Life Support', icon: Wind, color: 'text-cyan-400' },
    { id: 'radiation', label: 'Radiation / X-Ray', icon: Radio, color: 'text-rose-400' },
  ];

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center bg-space-900/90 backdrop-blur-md p-1 rounded-lg border border-space-700 shadow-xl select-none">
      <span className="text-[10px] uppercase font-mono text-space-400 px-2 font-semibold tracking-wider">
        Overlays
      </span>
      <div className="flex items-center gap-1 border-l border-space-700 pl-1.5">
        {overlays.map((ov) => {
          const Icon = ov.icon;
          const isActive = activeOverlay === ov.id;
          return (
            <button
              key={ov.id}
              onClick={() => onChangeOverlay(ov.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono transition-all ${
                isActive
                  ? 'bg-space-750 text-white border border-space-600 shadow'
                  : 'text-space-400 hover:text-white hover:bg-space-800'
              }`}
              title={`Switch to ${ov.label} overlay view`}
            >
              <Icon size={13} className={isActive ? ov.color : 'text-space-400'} />
              <span className="hidden sm:inline font-medium">{ov.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
