import React from 'react';
import { Sun, Zap } from 'lucide-react';

export default function SolarArray({ isSelected, onClick, overlayMode, health = 92 }) {
  // Determine overlay shading
  let panelFill = '#1e3a5f';
  let panelStroke = '#38bdf8';
  let glowOpacity = 0.2;

  if (overlayMode === 'power') {
    panelFill = '#3b2f0b';
    panelStroke = '#f59e0b';
    glowOpacity = 0.8;
  } else if (overlayMode === 'radiation') {
    panelFill = '#3b1212';
    panelStroke = '#ef4444';
    glowOpacity = 0.7;
  }

  return (
    <g
      className="cursor-pointer transition-all duration-200 group"
      onClick={onClick}
    >
      {/* Selection Glow / Pulse */}
      {isSelected && (
        <ellipse
          cx="810"
          cy="360"
          rx="75"
          ry="45"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      )}

      {/* Power Conduit Cable connecting Solar Farm to Habitat Base */}
      <path
        d="M 740,380 L 680,410 L 640,430"
        fill="none"
        stroke={overlayMode === 'power' ? '#f59e0b' : '#30363d'}
        strokeWidth={overlayMode === 'power' ? 3 : 2}
        strokeDasharray={overlayMode === 'power' ? '6 4' : 'none'}
        className={overlayMode === 'power' ? 'animate-pulse' : ''}
      />

      {/* Solar Mast 1 */}
      <line x1="770" y1="380" x2="770" y2="340" stroke="#484f58" strokeWidth="4" />
      <polygon
        points="720,330 770,305 820,330 770,355"
        fill={panelFill}
        stroke={panelStroke}
        strokeWidth="1.5"
        className="transition-colors duration-300 group-hover:brightness-125"
      />
      {/* Grid cells on Panel 1 */}
      <line x1="745" y1="317" x2="795" y2="342" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="745" y1="342" x2="795" y2="317" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

      {/* Solar Mast 2 (Lower Right) */}
      <line x1="840" y1="420" x2="840" y2="380" stroke="#484f58" strokeWidth="4" />
      <polygon
        points="790,370 840,345 890,370 840,395"
        fill={panelFill}
        stroke={panelStroke}
        strokeWidth="1.5"
        className="transition-colors duration-300 group-hover:brightness-125"
      />
      {/* Grid cells on Panel 2 */}
      <line x1="815" y1="357" x2="865" y2="382" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="815" y1="382" x2="865" y2="357" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

      {/* Module Marker Badge */}
      <g transform="translate(805, 330)">
        <circle
          cx="0"
          cy="0"
          r="13"
          fill="#161b22"
          stroke={isSelected ? '#38bdf8' : '#6e7681'}
          strokeWidth="1.5"
        />
        <Sun size={14} className="text-amber-400 -translate-x-[7px] -translate-y-[7px]" />
      </g>

      {/* Hover tooltip label */}
      <text
        x="805"
        y="425"
        textAnchor="middle"
        className="text-[11px] font-mono fill-space-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity font-semibold tracking-wider"
      >
        SOLAR ARRAY ({health}%)
      </text>
    </g>
  );
}
