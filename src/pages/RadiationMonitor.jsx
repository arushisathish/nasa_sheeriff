import React, { useState, useEffect } from 'react';
import TopHeader from '../components/hud/TopHeader';
import { 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Sun, 
  Info, 
  AlertTriangle,
  Lock,
  Unlock,
  BookOpen,
  TrendingUp,
  BarChart2,
  Activity,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { 
  getComparativeRadiationData, 
  getCumulativeDoseProjection, 
  getEvaRecommendation,
  SHIELDING_COMPARISON_DATA,
  RADIATION_GLOSSARY 
} from '../services/radiationDataService';
import SpaceWeatherWidget from '../components/hud/SpaceWeatherWidget';

export default function RadiationMonitor({ 
  gameState, 
  onTabChange, 
  activeTab, 
  onOpenIntro,
  onToggleShelter 
}) {
  const { currentSol, totalSols, resources, alerts = [] } = gameState;
  const radiation = resources.radiation;
  const [activeChartTab, setActiveChartTab] = useState('curiosity'); // 'curiosity' | 'attenuation' | 'projection'

  const comparativeData = getComparativeRadiationData(currentSol, radiation);
  const projectionData = getCumulativeDoseProjection(currentSol, radiation.cumulativeCrewDose, radiation.crewInShelter);
  const eva = getEvaRecommendation(radiation.spaceWeatherLevel);

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

  // Custom Dark Tooltip for Recharts
  const CustomRechartsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-space-900 border border-space-700 p-3 rounded-lg shadow-xl font-mono text-xs">
          <div className="font-bold text-white mb-1.5 pb-1 border-b border-space-800">
            SOL {label} TELEMETRY
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px] my-0.5">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.value !== null ? `${entry.value} ${entry.unit || 'μSv/h'}` : 'Projected'}
              </span>
            </div>
          ))}
          {payload[0]?.payload?.event && (
            <div className="text-[10px] text-mars-400 mt-1.5 pt-1 border-t border-space-800">
              Space Weather: {payload[0].payload.event}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-space-950 flex flex-col font-sans select-none text-space-100">
      {/* HUD Header */}
      <TopHeader
        currentSol={currentSol}
        totalSols={totalSols}
        activeTab={activeTab}
        onTabChange={onTabChange}
        unreadAlertCount={alerts.filter(a => !a.resolved).length}
        onOpenIntro={onOpenIntro}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* Title & Scientific Honesty Disclaimer Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-space-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Radio size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono text-white">
                  RADIATION MONITORING & CURIOSITY RAD BENCHMARK
                </h2>
                <p className="text-xs text-space-400 font-mono">
                  Gale Crater Curiosity In-Situ Measurements vs. Outpost Zero Sub-Regolith Attenuation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 hover:text-white font-mono text-xs font-semibold shadow-lg transition-all"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO 3D OUTPOST [ESC]</span>
            </button>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-mars-500/10 text-mars-400 border border-mars-500/30 font-mono text-xs font-semibold">
              SCIENTIFIC HONESTY: RAD ARCHIVE
            </span>
          </div>
        </div>

        {/* 5 Core Radiation Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* 1. Surface Dose Rate */}
          <div className="p-3.5 rounded-xl bg-space-900 border border-space-700 space-y-1">
            <span className="text-[10px] font-mono text-space-400 uppercase tracking-wider block">
              Surface Flux
            </span>
            <div className="text-xl font-extrabold font-mono text-rose-400">
              {radiation.surfaceDoseRate.toFixed(1)} <span className="text-xs font-normal text-space-400">μSv/h</span>
            </div>
            <span className="text-[10px] text-space-400 block font-mono">
              Unshielded GCR Baseline
            </span>
          </div>

          {/* 2. Habitat Indoor Rate */}
          <div className="p-3.5 rounded-xl bg-space-900 border border-space-700 space-y-1">
            <span className="text-[10px] font-mono text-space-400 uppercase tracking-wider block">
              Habitat Module
            </span>
            <div className="text-xl font-extrabold font-mono text-amber-400">
              {radiation.habitatDoseRate.toFixed(1)} <span className="text-xs font-normal text-space-400">μSv/h</span>
            </div>
            <span className="text-[10px] text-space-400 block font-mono">
              62% Al/Poly Shielding
            </span>
          </div>

          {/* 3. Underground Bunker Rate */}
          <div className="p-3.5 rounded-xl bg-space-900 border border-space-700 space-y-1">
            <span className="text-[10px] font-mono text-space-400 uppercase tracking-wider block">
              Storm Shelter
            </span>
            <div className="text-xl font-extrabold font-mono text-emerald-400">
              {radiation.shelterDoseRate.toFixed(1)} <span className="text-xs font-normal text-space-400">μSv/h</span>
            </div>
            <span className="text-[10px] text-space-400 block font-mono">
              88% Regolith Attenuation
            </span>
          </div>

          {/* 4. Cumulative Crew Dose */}
          <div className="p-3.5 rounded-xl bg-space-900 border border-space-700 space-y-1">
            <span className="text-[10px] font-mono text-space-400 uppercase tracking-wider block">
              Crew Dose Uptake
            </span>
            <div className="text-xl font-extrabold font-mono text-cyan-400">
              {radiation.cumulativeCrewDose.toFixed(2)} <span className="text-xs font-normal text-space-400">mSv</span>
            </div>
            <span className="text-[10px] text-space-400 block font-mono">
              Limit: 600 mSv (NASA 3001)
            </span>
          </div>

          {/* 5. Space Weather Alert Level */}
          <div className="p-3.5 rounded-xl bg-space-900 border border-space-700 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-space-400 uppercase tracking-wider block">
              Space Weather
            </span>
            <div className="text-base font-bold font-mono">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                radiation.spaceWeatherLevel === 'NORMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                radiation.spaceWeatherLevel === 'WATCH' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                'bg-red-950 text-red-400 border border-red-800 animate-pulse'
              }`}>
                {radiation.spaceWeatherLevel}
              </span>
            </div>
            <span className="text-[10px] text-space-400 block font-mono">
              DONKI CME/SEP Watch
            </span>
          </div>
        </div>

        {/* Operational Commands & EVA Directive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sub-Regolith Storm Shelter Command */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-700 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                  <Layers size={15} className="text-rose-400" />
                  Storm Shelter Lockdown Protocol
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  radiation.crewInShelter 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                    : 'bg-space-850 text-space-400 border-space-750'
                }`}>
                  {radiation.crewInShelter ? 'CREW IN SHELTER' : 'STANDARD HABITAT'}
                </span>
              </div>
              <p className="text-xs text-space-300 leading-relaxed font-sans">
                {radiation.crewInShelter
                  ? 'Crew is currently locked down inside the sub-regolith bunker under 2.5 meters of compacted soil (88% attenuation). Confinement reduces morale by -4/Sol.'
                  : 'Crew is conducting normal operations inside main modules. Relocate crew to the bunker whenever elevated solar particle events (SPE) or solar flares are detected.'}
              </p>
            </div>

            <button
              onClick={onToggleShelter}
              className={`w-full py-2.5 px-4 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                radiation.crewInShelter
                  ? 'bg-space-800 hover:bg-space-750 text-space-200 border border-space-650'
                  : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700 shadow-lg shadow-rose-950/40'
              }`}
            >
              {radiation.crewInShelter ? (
                <>
                  <Unlock size={14} />
                  <span>RETURN CREW TO MAIN HABITAT</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>ORDER CREW INTO RADIATION SHELTER</span>
                </>
              )}
            </button>
          </div>

          {/* EVA Operations Authorization */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-700 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                  <Sun size={15} className="text-amber-400" />
                  Surface EVA Authorization
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${eva.badgeColor}`}>
                  {eva.title}
                </span>
              </div>
              <p className="text-xs text-space-300 leading-relaxed font-sans">
                {eva.details}
              </p>
            </div>

            <div className="p-2.5 rounded bg-space-850 border border-space-750 text-[11px] font-mono text-space-400 flex items-center justify-between">
              <span>Airlock Depressurization: Nominal</span>
              <span>Suit Dosimeters: Active</span>
            </div>
          </div>
        </div>

        {/* Interactive Recharts Telemetry Section */}
        <div className="p-5 rounded-2xl bg-space-900 border border-space-700 shadow-xl space-y-4">
          {/* Chart View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-space-800">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                Telemetry Analytics
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-space-850 p-1 rounded-lg border border-space-750 font-mono text-xs">
              <button
                onClick={() => setActiveChartTab('curiosity')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeChartTab === 'curiosity' 
                    ? 'bg-space-750 text-white font-bold border border-space-650' 
                    : 'text-space-400 hover:text-white'
                }`}
              >
                Curiosity RAD vs. Outpost
              </button>
              <button
                onClick={() => setActiveChartTab('attenuation')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeChartTab === 'attenuation' 
                    ? 'bg-space-750 text-white font-bold border border-space-650' 
                    : 'text-space-400 hover:text-white'
                }`}
              >
                Shielding Attenuation
              </button>
              <button
                onClick={() => setActiveChartTab('projection')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeChartTab === 'projection' 
                    ? 'bg-space-750 text-white font-bold border border-space-650' 
                    : 'text-space-400 hover:text-white'
                }`}
              >
                30-Sol Career Limit
              </button>
            </div>
          </div>

          {/* Chart 1: Curiosity RAD Comparison */}
          {activeChartTab === 'curiosity' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-space-400">
                <span>Dose Rate Across 30 Sols (μSv/h)</span>
                <span className="text-mars-400">Notice Sol 10–12 Solar Particle Event (SPE) Spike</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparativeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                    <XAxis dataKey="sol" stroke="#6e7681" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis stroke="#6e7681" tick={{ fontSize: 11, fontFamily: 'monospace' }} domain={[0, 75]} />
                    <Tooltip content={<CustomRechartsTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 10 }} />
                    <ReferenceLine x={11} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Peak SPE', fill: '#ef4444', fontSize: 10, fontFamily: 'monospace' }} />
                    <Line 
                      type="monotone" 
                      dataKey="curiosityHistorical_uSv_h" 
                      name="NASA Curiosity RAD Historical (Gale Crater)" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="simulatedSurface" 
                      name="Outpost Zero Simulated Surface" 
                      stroke="#f59e0b" 
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#f59e0b' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="shelteredBunker" 
                      name="Sub-Regolith Storm Shelter (Attenuated)" 
                      stroke="#38bdf8" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Chart 2: Attenuation Bar Chart */}
          {activeChartTab === 'attenuation' && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-space-400">
                Martian Environment vs. Shielding Regimes (μSv/h)
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SHIELDING_COMPARISON_DATA} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                    <XAxis dataKey="environment" stroke="#6e7681" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke="#6e7681" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', fontSize: '12px', fontFamily: 'monospace' }}
                      formatter={(val) => [`${val} μSv/h`, 'Dose Rate']}
                    />
                    <Bar dataKey="doseRate" radius={[6, 6, 0, 0]}>
                      {SHIELDING_COMPARISON_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Chart 3: Cumulative Projection */}
          {activeChartTab === 'projection' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-space-400">
                <span>Crew Accumulated Dose vs. Career Limit (mSv)</span>
                <span className="text-cyan-400">Max Limit: 600 mSv</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="doseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                    <XAxis dataKey="sol" stroke="#6e7681" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis stroke="#6e7681" tick={{ fontSize: 11, fontFamily: 'monospace' }} domain={[0, 1.6]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', fontSize: '12px', fontFamily: 'monospace' }} />
                    <Area 
                      type="monotone" 
                      dataKey="actualCumulativeDose" 
                      name="Accumulated Crew Dose (mSv)" 
                      stroke="#38bdf8" 
                      fillOpacity={1} 
                      fill="url(#doseGrad)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projectedSafeLimit" 
                      name="Nominal Safe Operational Curve" 
                      stroke="#10b981" 
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Live NASA DONKI Space Weather Feed */}
        <SpaceWeatherWidget />

        {/* Scientific Glossary Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-space-800">
            <BookOpen size={16} className="text-mars-400" />
            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              Space Radiation Knowledge Base & Glossary
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {RADIATION_GLOSSARY.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-space-900 border border-space-700/80 space-y-2">
                <h4 className="font-mono text-xs font-bold text-mars-400 uppercase tracking-wide">
                  {item.term}
                </h4>
                <p className="text-xs text-space-300 leading-relaxed font-sans">
                  {item.definition}
                </p>
                <div className="text-[11px] font-mono text-cyan-400 pt-1 border-t border-space-800">
                  <span className="text-space-400">Engineering Mitigation: </span>
                  {item.countermeasure}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
