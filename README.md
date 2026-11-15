# 🛰️ Outpost Zero — 3D First-Person Mars Survival Simulator

An educational 30-Sol Mars Outpost Resource Management and Survival Simulator built for the **NASA Space Apps Challenge**.

Outpost Zero combines **Astroneer & ARK-inspired stylized 3D first-person exploration** with authentic **NASA Mission Control** life support engineering and real-time **MSL Curiosity RAD** & **NASA DONKI** space weather telemetry.

---

## 🎮 First-Person 3D Gameplay & Controls

- **Move:** `W` `A` `S` `D` or `Arrow Keys` (delta-scaled physics with smooth wall-sliding collision against habitat walls and dunes).
- **Look:** Mouse look (click anywhere into the 3D viewport for **Pointer Lock**, press `P` or `ESC` to free your cursor for menus).
- **Sprint:** Hold `Left Shift` to run across the Martian landscape or interior corridors.
- **Low-G Jump:** Press `Spacebar` for responsive Martian gravity (~3.72 m/s²) floaty jumping.
- **Interact:** Press `E` near any station or point of interest.
- **Tactical Visor Scanner:** Press `F` to toggle the holographic scanner overlay.
- **Pause Menu:** Press `P` or `ESC` to adjust mouse sensitivity, graphics quality (Standard vs High PBR), audio volume/mute, or review controls.
- **Surface Rover:** Walk up to the rover outside the airlock and press `E` to drive across dunes at ~15–22 m/s! Press `E` again to dismount.

---

## 🧭 Points of Interest (250m × 250m Explorable Sector)

A top-center **Compass HUD** with cardinal headings (`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`) and 3D dynamic waypoints tracks your orientation and distance to all sector POIs:

1. **Outpost Zero Base (0, 0):** Central Hub, O2 Life Support Bay, ECLSS Water Recycler, Geodesic Greenhouse, Radiation Shelter, and Repair Workbench.
2. **Pressurized Airlock (10.5m E):** Automated 2.4s pressurization cycle with pneumatic steam hiss before transitioning between the habitat and Martian surface.
3. **Mars Exploration Rover (18m E, 4m N):** Rugged all-terrain 4-wheel rover with solar canopy, forward high-beam spotlights, and steering yoke.
4. **Solar Ridge Array (55m E, 15m N):** Primary photovoltaic solar farm; shows visual dust caking during storms.
5. **Ice Extraction Crater (65m W, 50m S):** Deep impact crater with subterranean permafrost drill rig.
6. **Comms Relay Hill (35m E, 75m S):** Elevated ridge with Deep Space Network tracking dish.
7. **Crashed Supply Cargo (70m W, 60m N):** Abandoned supply container wreckage; scavengeable for **+4 emergency Spare Parts**.

---

## 🥽 EVA Suit & Tactical Visor Scanner (`F`)

- **EVA Suit Oxygen:** Pressurized inside the habitat (100% capacity and rapid refills). Drains when venturing outside on Mars (slower when driving the rover). Visual and audible alarms sound when Suit O2 drops below 25%, with health penalties at 0%.
- **Holographic Scanner:** Press `F` to engage the tactical scanner:
  - Holographic reticles and sweeping radar beams.
  - Real-time comparison between **NASA Curiosity RAD** Gale Crater baseline (~0.67 mSv/sol), **Outpost Shielded** rate (~0.21 mSv/sol, -68% attenuation), and current EVA surface flux.
  - Dynamic radar range and distance telemetry to all sector POIs.

---

## 🌪️ Reactive Martian Environment & Dynamic 3D Events

- **Dynamic Dust Storms:** 2,000-particle simulated iron-oxide dust storm blowing across the Martian surface when optical depth tau surges (>1.8). The sky turns a dark swirling rust gloom and atmospheric fog thickens.
- **Solar Flare Auroras:** Charged ion violet/amber glow radiates across the Martian horizon during X-Class solar flare eruptions.
- **Malfunctioning Stations:** Emergency strobe alarms flash and electrical spark particles burst from damaged systems until serviced.
- **Solar Panel Dust Cake:** Photovoltaic wings visibly darken with reddish-brown dust accumulation during storms.

---

## 🧪 Simulation & Scientific Honesty

- **30 Martian Days (Sols):** Player-controlled `Advance Sol` with full `localStorage` persistence.
- **6 Core Management Areas:** Oxygen, Water, Energy, Food, Spare Parts, and Radiation Protection.
- **8 Core Survival Events:** Fully branching player choices with upfront costs, immediate effects, and multi-Sol repercussions.
- **NASA DONKI Space Weather API:** Live connection to `api.nasa.gov/DONKI` with graceful fallback to curated historical September 2017 super-storm data.
- **Curiosity RAD Observations:** Gale Crater background GCR measurements vs. habitat shielding vs. sub-regolith bunker attenuation.
- **Synthesized Web Audio:** Zero external audio assets! Built-in procedural Web Audio API footsteps, airlock pneumatic hissing, rover motor hum, terminal clicks, Sol advance chimes, and emergency klaxons with global mute and volume control.

---

## 🏃 Running Locally

```bash
# Clone the repository
git clone <repo-url>
cd outpost-zero

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
