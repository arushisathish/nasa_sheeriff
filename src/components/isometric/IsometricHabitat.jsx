import React, { useState } from 'react';
import TerrainBackground from './TerrainBackground';
import IsometricRoom from './IsometricRoom';
import SolarArray from './SolarArray';
import { MODULE_IDS, MODULES_CONFIG } from '../../data/modulesConfig';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Geometric room shapes matching the cutaway habitat layout
const ROOM_GEOMETRIES = {
  [MODULE_IDS.GREENHOUSE]: {
    floorPoints: "440,310 560,310 630,370 560,430 440,430 370,370",
    centerPos: { x: 500, y: 370 },
    gridLines: [
      { x1: 440, y1: 310, x2: 560, y2: 430 },
      { x1: 560, y1: 310, x2: 440, y2: 430 },
      { x1: 370, y1: 370, x2: 630, y2: 370 },
    ],
    equipmentItems: [
      { type: 'plant', bedPoints: "450,345 480,330 495,345 465,360", cx: 472, cy: 343, r: 6 },
      { type: 'plant', bedPoints: "505,345 535,330 550,345 520,360", cx: 528, cy: 343, r: 6 },
      { type: 'plant', bedPoints: "450,385 480,370 495,385 465,400", cx: 472, cy: 383, r: 6 },
      { type: 'plant', bedPoints: "505,385 535,370 550,385 520,400", cx: 528, cy: 383, r: 6 },
    ],
    walls: [
      { points: "370,370 440,310 440,295 370,355", isTop: false },
      { points: "440,310 560,310 560,295 440,295", isTop: true },
      { points: "560,310 630,370 630,355 560,295", isTop: false },
    ]
  },

  [MODULE_IDS.CREW_QUARTERS]: {
    floorPoints: "310,180 430,250 360,310 240,240",
    centerPos: { x: 335, y: 245 },
    gridLines: [
      { x1: 275, y1: 210, x2: 395, y2: 280 },
      { x1: 285, y1: 275, x2: 385, y2: 215 },
    ],
    equipmentItems: [
      // Bunk pods
      { type: 'rect', points: "260,230 290,215 310,230 280,245", fill: '#475569' },
      { type: 'rect', points: "285,250 315,235 335,250 305,265", fill: '#475569' },
      // Medical station bench
      { type: 'rect', points: "340,215 370,200 390,215 360,230", fill: '#9333ea' },
    ],
    walls: [
      { points: "240,240 310,180 310,165 240,225", isTop: false },
      { points: "310,180 430,250 430,235 310,165", isTop: true },
    ]
  },

  [MODULE_IDS.RAD_SHELTER]: {
    floorPoints: "570,250 690,180 760,240 640,310",
    centerPos: { x: 665, y: 245 },
    gridLines: [
      { x1: 605, y1: 280, x2: 725, y2: 210 },
      { x1: 615, y1: 215, x2: 715, y2: 275 },
    ],
    equipmentItems: [
      // Heavy blast hatch & radiation shielding bulkheads
      { type: 'rect', points: "660,200 700,180 720,200 680,220", fill: '#334155' },
      { type: 'cylinder', bodyPoints: "615,240 635,230 635,250 615,260", cx: 625, cy: 235, rx: 10, ry: 5, capFill: '#ef4444' },
      { type: 'cylinder', bodyPoints: "640,255 660,245 660,265 640,275", cx: 650, cy: 250, rx: 10, ry: 5, capFill: '#10b981' },
    ],
    walls: [
      // Thick reinforced lead shielding walls
      { points: "570,250 690,180 690,160 570,230", isTop: true },
      { points: "690,180 760,240 760,220 690,160", isTop: false },
    ]
  },

  [MODULE_IDS.LIFE_SUPPORT]: {
    floorPoints: "200,310 320,380 250,440 130,370",
    centerPos: { x: 225, y: 375 },
    gridLines: [
      { x1: 165, y1: 340, x2: 285, y2: 410 },
      { x1: 175, y1: 405, x2: 275, y2: 345 },
    ],
    equipmentItems: [
      // O2 Electrolysis reactor & high-pressure gas bottles
      { type: 'cylinder', bodyPoints: "160,350 180,340 180,365 160,375", cx: 170, cy: 345, rx: 10, ry: 5, capFill: '#38bdf8' },
      { type: 'cylinder', bodyPoints: "185,365 205,355 205,380 185,390", cx: 195, cy: 360, rx: 10, ry: 5, capFill: '#38bdf8' },
      { type: 'rect', points: "230,335 260,320 280,335 250,350", fill: '#0284c7' },
    ],
    walls: [
      { points: "130,370 200,310 200,295 130,355", isTop: false },
      { points: "200,310 320,380 320,365 200,295", isTop: true },
    ]
  },

  [MODULE_IDS.WATER_RECYCLING]: {
    floorPoints: "320,440 440,510 370,570 250,500",
    centerPos: { x: 345, y: 505 },
    gridLines: [
      { x1: 285, y1: 470, x2: 405, y2: 540 },
      { x1: 295, y1: 535, x2: 395, y2: 475 },
    ],
    equipmentItems: [
      // Water distillation tank & filter pumps
      { type: 'cylinder', bodyPoints: "330,470 360,455 360,485 330,500", cx: 345, cy: 462, rx: 15, ry: 7, capFill: '#0ea5e9' },
      { type: 'cylinder', bodyPoints: "370,490 400,475 400,505 370,520", cx: 385, cy: 482, rx: 15, ry: 7, capFill: '#0284c7' },
      { type: 'rect', points: "280,485 305,470 325,485 300,500", fill: '#334155' },
    ],
    walls: [
      { points: "250,500 320,440 320,425 250,485", isTop: false },
      { points: "370,570 250,500 250,485 370,555", isTop: false },
    ]
  },

  [MODULE_IDS.POWER_BAY]: {
    floorPoints: "560,510 680,440 750,500 630,570",
    centerPos: { x: 655, y: 505 },
    gridLines: [
      { x1: 615, y1: 540, x2: 735, y2: 470 },
      { x1: 625, y1: 475, x2: 725, y2: 535 },
    ],
    equipmentItems: [
      // Battery racks & power inverter stations
      { type: 'rect', points: "600,490 630,475 650,490 620,505", fill: '#f59e0b' },
      { type: 'rect', points: "635,510 665,495 685,510 655,525", fill: '#d97706' },
      { type: 'cylinder', bodyPoints: "675,470 695,460 695,480 675,490", cx: 685, cy: 465, rx: 10, ry: 5, capFill: '#b45309' },
    ],
    walls: [
      { points: "680,440 750,500 750,485 680,425", isTop: true },
      { points: "750,500 630,570 630,555 750,485", isTop: false },
    ]
  }
};

export default function IsometricHabitat({
  selectedModuleId,
  onSelectModule,
  overlayMode = 'normal',
  moduleHealth = {},
}) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.45));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-space-950 hud-grid-bg mars-vignette select-none">
      {/* Zoom / View Control Floater */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5 bg-space-900/90 backdrop-blur-md p-1.5 rounded-lg border border-space-700 shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded hover:bg-space-700 text-space-300 hover:text-white transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded hover:bg-space-700 text-space-300 hover:text-white transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="p-2 rounded hover:bg-space-700 text-space-300 hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* SVG Canvas for 2.5D Cutaway Habitat */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="40 40 920 840"
          className="w-full h-full max-h-[88vh] filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ground Regolith Plane */}
          <TerrainBackground />

          {/* Interconnecting Pressurized Corridors */}
          <g className="corridors pointer-events-none">
            {/* Corridor: Greenhouse to Crew Quarters */}
            <polygon points="360,310 440,310 440,335 360,335" fill="#1b222c" stroke="#30363d" strokeWidth="1" />
            {/* Corridor: Greenhouse to Rad Shelter */}
            <polygon points="560,310 640,310 640,335 560,335" fill="#1b222c" stroke="#30363d" strokeWidth="1" />
            {/* Corridor: Greenhouse to Life Support O2 Bay */}
            <polygon points="320,380 380,380 380,405 320,405" fill="#1b222c" stroke="#30363d" strokeWidth="1" />
            {/* Corridor: Greenhouse to Water Bay */}
            <polygon points="400,430 440,470 425,480 385,440" fill="#1b222c" stroke="#30363d" strokeWidth="1" />
            {/* Corridor: Greenhouse to Power Bay */}
            <polygon points="560,430 600,470 585,480 545,440" fill="#1b222c" stroke="#30363d" strokeWidth="1" />

            {/* Dynamic Conduit Overlay lines when in Power or O2 view */}
            {overlayMode === 'power' && (
              <g className="animate-pulse">
                <path d="M 655,505 L 500,370 L 335,245" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
                <path d="M 655,505 L 665,245" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
                <path d="M 655,505 L 225,375" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
                <path d="M 655,505 L 345,505" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
              </g>
            )}

            {overlayMode === 'o2' && (
              <g className="animate-pulse">
                <path d="M 225,375 L 500,370 L 335,245" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" fill="none" />
                <path d="M 500,370 L 665,245" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" fill="none" />
              </g>
            )}
          </g>

          {/* Render Cutaway Modules */}
          {Object.values(MODULES_CONFIG)
            .filter(m => m.id !== MODULE_IDS.SOLAR_ARRAY)
            .map(mod => {
              const geometry = ROOM_GEOMETRIES[mod.id];
              if (!geometry) return null;
              return (
                <IsometricRoom
                  key={mod.id}
                  module={mod}
                  isSelected={selectedModuleId === mod.id}
                  onSelect={onSelectModule}
                  overlayMode={overlayMode}
                  health={moduleHealth[mod.id] ?? mod.defaultHealth}
                  roomData={geometry}
                />
              );
            })}

          {/* Exterior Solar Farm Array */}
          <SolarArray
            isSelected={selectedModuleId === MODULE_IDS.SOLAR_ARRAY}
            onClick={() => onSelectModule(MODULE_IDS.SOLAR_ARRAY)}
            overlayMode={overlayMode}
            health={moduleHealth[MODULE_IDS.SOLAR_ARRAY] ?? 92}
          />
        </svg>
      </div>
    </div>
  );
}
