import React from 'react';
import { X, BookOpen, ShieldCheck, Sun, Wind, Droplet, Sprout, Wrench, ExternalLink } from 'lucide-react';

export default function ManualModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-space-700 flex items-center justify-between bg-space-850">
          <div className="flex items-center gap-2.5">
            <BookOpen className="text-mars-400" size={20} />
            <h3 className="font-mono font-bold text-white text-base uppercase tracking-wider">
              Outpost Zero • Operations Manual
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-space-400 hover:text-white hover:bg-space-750 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-space-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h4 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mars-500"></span>
              The 30-Sol Survival Directive
            </h4>
            <p>
              A Martian solar day (Sol) lasts 24 hours, 39 minutes, and 35 seconds. Your mission is to maintain life support and habitat systems for a 4-person astronaut crew across 30 Sols. Every Sol advance triggers resource consumption, recycling ticks, environmental wear, and space weather events.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              6 Core Outpost Systems
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-space-850 border border-space-750">
                <span className="font-mono font-bold text-cyan-400 block mb-1">1. O2 Bay</span>
                Electrolysis & MOXIE reactors generate 24 kg O2/Sol while scrubbing exhaled carbon dioxide.
              </div>
              <div className="p-3 rounded-lg bg-space-850 border border-space-750">
                <span className="font-mono font-bold text-sky-400 block mb-1">2. Water Recovery</span>
                Closed-loop ECLSS distillers recover 93% of habitat graywater and moisture.
              </div>
              <div className="p-3 rounded-lg bg-space-850 border border-space-750">
                <span className="font-mono font-bold text-amber-400 block mb-1">3. Power Grid & Solar</span>
                Photovoltaic panels supply energy; dust accumulation degrades electrical yields.
              </div>
              <div className="p-3 rounded-lg bg-space-850 border border-space-750">
                <span className="font-mono font-bold text-emerald-400 block mb-1">4. Hydroponics</span>
                Automated multi-tier crops produce calories to prevent crew malnutrition.
              </div>
              <div className="p-3 rounded-lg bg-space-850 border border-space-750">
                <span className="font-mono font-bold text-purple-400 block mb-1">5. Crew Quarters & Medbay</span>
                Ensures psychological resilience, sleep cycles, and medical intervention.
              </div>
              <div className="p-3 rounded-lg bg-space-850 border border-space-750">
                <span className="font-mono font-bold text-rose-400 block mb-1">6. Radiation Shelter</span>
                Sub-regolith bunker. Protects against deadly Solar Particle Events (SPEs).
              </div>
            </div>
          </section>

          <section className="space-y-2 p-3.5 rounded-lg bg-mars-950/30 border border-mars-800/40">
            <h4 className="font-mono text-sm font-bold text-mars-400 uppercase flex items-center gap-1.5">
              <ShieldCheck size={16} />
              NASA Scientific Honesty Principle
            </h4>
            <p>
              Radiation on Mars is an environmental hazard, not a consumable resource. This simulator benchmarks against real Curiosity RAD surface measurements (~210–240 μGy/day background GCR) and utilizes NASA DONKI space weather telemetry patterns.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-space-700 bg-space-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-mars-500 hover:bg-mars-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
