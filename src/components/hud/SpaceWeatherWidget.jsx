import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Sun, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Info 
} from 'lucide-react';
import { fetchNasaSpaceWeather } from '../../services/nasaService';

export default function SpaceWeatherWidget() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchNasaSpaceWeather(30);
    setData(result);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="rounded-xl bg-space-900 border border-space-700 shadow-xl overflow-hidden select-none">
      {/* Header Bar */}
      <div className="p-4 bg-space-850 border-b border-space-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun size={18} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <span>NASA DONKI SPACE WEATHER TELEMETRY</span>
              {data && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  data.isLive 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {data.isLive ? 'LIVE NASA DONKI API' : 'HISTORICAL / DEMO DATA'}
                </span>
              )}
            </h3>
            <p className="text-xs text-space-400 font-mono">
              Space Weather Database Of Notifications, Knowledge, Augmentations
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-space-800 hover:bg-space-750 text-xs font-mono text-space-300 hover:text-white border border-space-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin text-mars-400' : 'text-space-400'} />
          <span>{isLoading ? 'QUERYING NASA...' : 'REFRESH API'}</span>
        </button>
      </div>

      {/* Connection & Scientific Honesty Status Banner */}
      {data && (
        <div className={`px-4 py-2 text-xs font-mono flex items-center gap-2 border-b ${
          data.isLive 
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50' 
            : 'bg-amber-950/30 text-amber-300 border-amber-900/40'
        }`}>
          <Info size={14} className="shrink-0" />
          <span className="truncate">{data.statusMessage}</span>
          <span className="ml-auto text-[10px] text-space-400 shrink-0">Updated: {data.lastUpdated}</span>
        </div>
      )}

      {/* Events Feed */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="py-12 text-center font-mono text-xs text-space-400 flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-mars-500" />
            <span>Establishing connection to api.nasa.gov/DONKI/FLR...</span>
          </div>
        ) : data?.events?.length > 0 ? (
          data.events.map((evt, idx) => {
            const isXClass = evt.classType?.startsWith('X');
            const isMClass = evt.classType?.startsWith('M');

            return (
              <div 
                key={evt.flrID || idx}
                className="p-3.5 rounded-lg bg-space-850/80 border border-space-750 space-y-2 hover:border-space-650 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                      isXClass ? 'bg-red-950 text-red-400 border-red-800' :
                      isMClass ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-sky-950 text-sky-400 border-sky-800'
                    }`}>
                      CLASS {evt.classType}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      Solar Flare {evt.activeRegionNum ? `(AR ${evt.activeRegionNum})` : ''}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-space-400">
                    Peak: {evt.peakTime ? new Date(evt.peakTime).toLocaleString() : evt.beginTime}
                  </span>
                </div>

                <p className="text-xs text-space-300 leading-relaxed font-sans">
                  {evt.note}
                </p>

                {/* Martian Surface Impact Telemetry */}
                <div className="pt-2 border-t border-space-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-space-300">
                    <Radio size={12} className="text-rose-400" />
                    <span>Est. Surface Flux:</span>
                    <strong className="text-rose-400">{evt.martianEquivalentDoseRate_uSv_h} μSv/h</strong>
                  </div>

                  {evt.linkedSep && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Zap size={12} />
                      <span>Linked SEP: {evt.linkedSep.protonFlux}</span>
                    </div>
                  )}

                  <span className="text-space-500">
                    Sensor: {evt.instruments?.[0]?.displayName || 'GOES Primary'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center font-mono text-xs text-space-400">
            No active space-weather disturbances reported.
          </div>
        )}
      </div>
    </div>
  );
}
