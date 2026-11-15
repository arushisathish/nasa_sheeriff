import React from 'react';
import { 
  Orbit, 
  Sun, 
  Droplet, 
  Radio, 
  Wrench, 
  Navigation,
  Compass,
  Layers,
  Activity
} from 'lucide-react';
import { POI_DEFINITIONS } from '../../scene/PointsOfInterest';

const POI_ICON_MAP = {
  base: Orbit,
  solar: Sun,
  water: Droplet,
  radio: Radio,
  parts: Wrench,
  sample: Layers,
  radar: Activity,
};

export default function CompassHUD({ playerPosition, playerYaw = 0 }) {
  if (!playerPosition) return null;

  // Cardinal headings in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  const CARDINALS = [
    { label: 'N', deg: 0 },
    { label: 'NE', deg: 45 },
    { label: 'E', deg: 90 },
    { label: 'SE', deg: 135 },
    { label: 'S', deg: 180 },
    { label: 'SW', deg: 225 },
    { label: 'W', deg: 270 },
    { label: 'NW', deg: 315 },
  ];

  // Convert player yaw (radians) to degrees [0, 360)
  // Three.js: -Z is North, +X is East, +Z is South, -X is West
  let headingDeg = (-playerYaw * (180 / Math.PI)) % 360;
  if (headingDeg < 0) headingDeg += 360;

  // Horizontal strip spans 120 degrees (-60 to +60)
  const fov = 110;
  const stripWidthPx = 360; // width of the UI compass ribbon

  // Helper to calculate pixel position on the ribbon
  const getOffsetPx = (targetDeg) => {
    let diff = (targetDeg - headingDeg + 540) % 360 - 180;
    if (Math.abs(diff) > fov / 2) return null;
    return (diff / (fov / 2)) * (stripWidthPx / 2);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none flex flex-col items-center font-mono">
      {/* Sleek Dark Slate Compass Ribbon */}
      <div className="relative w-[380px] h-10 bg-space-900/90 backdrop-blur-md border border-space-700/80 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Center Heading Pointer Needle */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-mars-400 z-10 opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-mars-500 rounded-b z-10" />

        {/* Cardinal Heading Markers */}
        {CARDINALS.map((cardinal) => {
          const offset = getOffsetPx(cardinal.deg);
          if (offset === null) return null;

          const isMajor = cardinal.label.length === 1;

          return (
            <div
              key={cardinal.label}
              className="absolute flex flex-col items-center transition-transform"
              style={{ transform: `translateX(${offset}px)` }}
            >
              <span className={`text-[10px] font-bold ${
                cardinal.label === 'N' ? 'text-mars-400' : isMajor ? 'text-white' : 'text-space-400'
              }`}>
                {cardinal.label}
              </span>
              <div className={`w-0.5 ${isMajor ? 'h-2 bg-space-500' : 'h-1 bg-space-700'}`} />
            </div>
          );
        })}

        {/* POI Waypoint Markers on Ribbon */}
        {POI_DEFINITIONS.map((poi) => {
          // Compute angle from player to POI in degrees
          const dx = poi.position.x - playerPosition.x;
          const dz = poi.position.z - playerPosition.z;
          const dist = Math.round(Math.sqrt(dx * dx + dz * dz));

          // Angle in degrees where -Z is North (0 deg) and +X is East (90 deg)
          let angleDeg = (Math.atan2(dx, -dz) * (180 / Math.PI)) % 360;
          if (angleDeg < 0) angleDeg += 360;

          const offset = getOffsetPx(angleDeg);
          if (offset === null) return null;

          const Icon = POI_ICON_MAP[poi.icon] || Orbit;

          return (
            <div
              key={poi.id}
              className="absolute -top-1 flex flex-col items-center animate-in fade-in transition-transform duration-75"
              style={{ transform: `translateX(${offset}px)` }}
            >
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center border shadow-md"
                style={{ backgroundColor: `${poi.color}25`, borderColor: poi.color, color: poi.color }}
                title={`${poi.name} (${dist}m)`}
              >
                <Icon size={12} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Target POI Proximity Pill (Displays closest or highlighted POI) */}
      <div className="mt-1 flex items-center gap-2 text-[10px] text-space-400 font-mono bg-space-900/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-space-800">
        <Navigation size={11} className="text-mars-400" />
        <span>SECTOR: CHRYSE PLANITIA (250m)</span>
        <span>•</span>
        <span>HEADING: {Math.round(headingDeg)}°</span>
      </div>
    </div>
  );
}
