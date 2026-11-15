import React from 'react';
import { 
  Sprout, 
  Wind, 
  Droplet, 
  Zap, 
  HeartPulse, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

const ICON_MAP = {
  greenhouse: Sprout,
  life_support: Wind,
  water_recycling: Droplet,
  power_bay: Zap,
  crew_quarters: HeartPulse,
  rad_shelter: ShieldAlert,
};

export default function IsometricRoom({
  module,
  isSelected,
  onSelect,
  overlayMode = 'normal',
  health = 100,
  roomData,
}) {
  const IconComponent = ICON_MAP[module.id] || Sprout;

  // Determine styling based on active overlay
  let floorFill = '#1c232d';
  let floorStroke = '#30363d';
  let wallFill = '#161b22';
  let wallTopFill = '#21262d';
  let equipmentTint = module.accentColor;

  if (overlayMode === 'power') {
    if (module.id === 'power_bay' || module.id === 'solar_array') {
      floorFill = 'rgba(245, 158, 11, 0.35)';
      floorStroke = '#f59e0b';
      equipmentTint = '#fbbf24';
    } else {
      floorFill = 'rgba(22, 27, 34, 0.7)';
      floorStroke = 'rgba(245, 158, 11, 0.3)';
    }
  } else if (overlayMode === 'o2') {
    if (module.id === 'life_support') {
      floorFill = 'rgba(56, 189, 248, 0.4)';
      floorStroke = '#38bdf8';
      equipmentTint = '#38bdf8';
    } else if (module.id === 'crew_quarters' || module.id === 'greenhouse') {
      floorFill = 'rgba(56, 189, 248, 0.2)';
      floorStroke = 'rgba(56, 189, 248, 0.5)';
    } else {
      floorFill = 'rgba(22, 27, 34, 0.7)';
      floorStroke = 'rgba(48, 54, 61, 0.5)';
    }
  } else if (overlayMode === 'radiation') {
    if (module.id === 'rad_shelter') {
      // Safe zone in radiation overlay!
      floorFill = 'rgba(16, 185, 129, 0.45)';
      floorStroke = '#10b981';
      equipmentTint = '#34d399';
    } else {
      // Exposed rooms show radiation penetration
      floorFill = 'rgba(239, 68, 68, 0.25)';
      floorStroke = 'rgba(239, 68, 68, 0.6)';
      equipmentTint = '#f87171';
    }
  }

  // Room geometry specific coordinates
  const { floorPoints, walls, equipmentItems, centerPos } = roomData;

  return (
    <g
      id={`room-${module.id}`}
      className="cursor-pointer group transition-all duration-200"
      onClick={() => onSelect(module.id)}
    >
      {/* Selection Glow filter */}
      {isSelected && (
        <polygon
          points={floorPoints}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3.5"
          filter="drop-shadow(0 0 8px #38bdf8)"
          className="animate-pulse"
        />
      )}

      {/* 2.5D Cutaway Outer Walls */}
      {walls && walls.map((wall, idx) => (
        <polygon
          key={`wall-${idx}`}
          points={wall.points}
          fill={wall.isTop ? wallTopFill : wallFill}
          stroke="#30363d"
          strokeWidth="1"
          className="transition-colors duration-200"
        />
      ))}

      {/* Room Floor Polygon */}
      <polygon
        points={floorPoints}
        fill={floorFill}
        stroke={isSelected ? '#38bdf8' : floorStroke}
        strokeWidth={isSelected ? 2 : 1.2}
        className="transition-colors duration-300 group-hover:brightness-125"
      />

      {/* Isometric Floor Grid Lines for realistic tile pattern */}
      {roomData.gridLines && roomData.gridLines.map((line, idx) => (
        <line
          key={`grid-${idx}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="0.8"
        />
      ))}

      {/* Render Room Specialized Interior Equipment */}
      {equipmentItems && equipmentItems.map((item, idx) => {
        if (item.type === 'rect') {
          return (
            <polygon
              key={`eq-${idx}`}
              points={item.points}
              fill={item.fill || equipmentTint}
              stroke="#0d1117"
              strokeWidth="0.8"
              opacity={item.opacity || 0.85}
            />
          );
        } else if (item.type === 'cylinder') {
          return (
            <g key={`eq-${idx}`}>
              <polygon points={item.bodyPoints} fill="#21262d" stroke="#30363d" strokeWidth="0.5" />
              <ellipse cx={item.cx} cy={item.cy} rx={item.rx} ry={item.ry} fill={item.capFill || equipmentTint} />
            </g>
          );
        } else if (item.type === 'plant') {
          return (
            <g key={`eq-${idx}`}>
              <polygon points={item.bedPoints} fill="#271d18" stroke="#3d281f" strokeWidth="0.8" />
              {/* Hydroponic plants */}
              <circle cx={item.cx} cy={item.cy} r={item.r || 5} fill="#10b981" opacity="0.9" />
              <circle cx={item.cx + 6} cy={item.cy - 3} r={(item.r || 5) * 0.8} fill="#34d399" opacity="0.95" />
            </g>
          );
        }
        return null;
      })}

      {/* Center Module Indicator & Badge */}
      <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
        {/* Module Icon Capsule */}
        <circle
          cx="0"
          cy="0"
          r="14"
          fill="#161b22"
          stroke={isSelected ? '#38bdf8' : module.accentColor}
          strokeWidth={isSelected ? 2 : 1.5}
          className="transition-transform group-hover:scale-110"
        />
        <foreignObject x="-9" y="-9" width="18" height="18" className="pointer-events-none">
          <div className="flex items-center justify-center w-full h-full text-white">
            <IconComponent size={12} color={module.accentColor} />
          </div>
        </foreignObject>

        {/* Condition mini dot */}
        <circle
          cx="10"
          cy="-10"
          r="4"
          fill={health > 75 ? '#10b981' : health > 40 ? '#f59e0b' : '#ef4444'}
          stroke="#0d1117"
          strokeWidth="1"
        />

        {/* Module Label (visible on hover or when selected) */}
        <g className={`transition-opacity duration-200 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <rect
            x="-60"
            y="18"
            width="120"
            height="20"
            rx="4"
            fill="#0d1117"
            stroke="#30363d"
            strokeWidth="1"
            opacity="0.9"
          />
          <text
            x="0"
            y="32"
            textAnchor="middle"
            className="text-[10px] font-mono fill-space-200 font-semibold uppercase tracking-wider"
          >
            {module.shortName} • {health}%
          </text>
        </g>
      </g>
    </g>
  );
}
