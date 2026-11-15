import React from 'react';

/**
 * Renders the Martian terrain ground plane with crater contours,
 * laser boundary guides, and dust ground texture matching the reference screenshot.
 */
export default function TerrainBackground() {
  return (
    <g className="terrain-layer pointer-events-none select-none">
      <defs>
        {/* Martian Soil Gradient */}
        <radialGradient id="marsSoilGrad" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#8d3d27" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#682a1a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3d140a" stopOpacity="0.95" />
        </radialGradient>

        {/* Crater Depth Gradient */}
        <radialGradient id="craterGrad1" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#2a0d06" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#4e1b0f" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7a2e1c" stopOpacity="0.3" />
        </radialGradient>

        {/* Ground grid pattern */}
        <pattern id="isometricGroundGrid" width="60" height="34.64" patternUnits="userSpaceOnUse">
          <path
            d="M 30,0 L 60,17.32 L 30,34.64 L 0,17.32 Z"
            fill="none"
            stroke="rgba(217, 93, 57, 0.08)"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      {/* Main Ground Polygon (Isometric Diamond base) */}
      <polygon
        points="500,60 940,314 940,640 500,890 60,640 60,314"
        fill="url(#marsSoilGrad)"
        stroke="rgba(217, 93, 57, 0.25)"
        strokeWidth="1.5"
      />

      {/* Ground Grid Texture */}
      <polygon
        points="500,60 940,314 940,640 500,890 60,640 60,314"
        fill="url(#isometricGroundGrid)"
      />

      {/* Surface Laser Perimeter Markings (matches white boundary lines in reference image) */}
      <polyline
        points="140,330 380,190 740,190 880,270"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <polyline
        points="100,560 320,690 700,690 890,580"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />

      {/* Martian Crater 1 (Top Right) */}
      <ellipse cx="820" cy="160" rx="45" ry="24" fill="url(#craterGrad1)" stroke="rgba(217, 93, 57, 0.3)" strokeWidth="1" />
      <ellipse cx="818" cy="158" rx="28" ry="14" fill="#1b0804" />

      {/* Martian Crater 2 (Bottom Left) */}
      <ellipse cx="140" cy="620" rx="55" ry="30" fill="url(#craterGrad1)" stroke="rgba(217, 93, 57, 0.3)" strokeWidth="1" />
      <ellipse cx="138" cy="618" rx="35" ry="18" fill="#1b0804" />

      {/* Rover Tracks */}
      <path
        d="M 120,580 Q 220,540 300,560 T 420,620"
        fill="none"
        stroke="rgba(40, 15, 8, 0.6)"
        strokeWidth="3"
        strokeDasharray="2 3"
      />
    </g>
  );
}
