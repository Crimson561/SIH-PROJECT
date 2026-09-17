import { useState } from 'react';
import { Map as MapIcon, ArrowRight, Train } from 'lucide-react';
import { stations, trains, type MockTrain } from '@/data/mockData';

const CORRIDOR_KM = 161;
const BLOCK_START = 103, BLOCK_END = 105;
const CONFLICT_START = 78, CONFLICT_END = 84;

const trainColors: Record<string, string> = {
  blue: '#3B9DFF', red: '#FF5B5B', orange: '#F6B84A',
};

interface MiniCorridorMapProps {
  onNavigate: (page: string, trainId?: string) => void;
}

export function MiniCorridorMap({ onNavigate }: MiniCorridorMapProps) {
  const [hoverTrain, setHoverTrain] = useState<MockTrain | null>(null);
  const toX = (km: number) => 40 + (km / CORRIDOR_KM) * 520;

  return (
    <div className="panel p-0 overflow-hidden h-full">
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-blue-400" />
          <span className="panel-title">LIVE CORRIDOR OVERVIEW</span>
        </div>
        <button onClick={() => onNavigate('map')} className="btn btn-ghost btn-sm">
          EXPAND TO LIVE MAP <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="p-4">
        <svg viewBox="0 0 600 180" className="w-full" style={{ maxHeight: 180 }}>
          <defs>
            <linearGradient id="miniRail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B9DFF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#21D4C2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B9DFF" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Conflict zone */}
          <rect x={toX(CONFLICT_START)} y="65" width={toX(CONFLICT_END) - toX(CONFLICT_START)} height="30"
            fill="rgba(255,91,91,0.15)" stroke="rgba(255,91,91,0.40)" strokeWidth="1" strokeDasharray="3 2" rx="3" />
          <text x={(toX(CONFLICT_START) + toX(CONFLICT_END)) / 2} y="60" textAnchor="middle"
            style={{ fontSize: '7px', fill: '#FF5B5B', fontWeight: 700 }}>PROTECTED</text>

          {/* Block zone */}
          <rect x={toX(BLOCK_START)} y="65" width={toX(BLOCK_END) - toX(BLOCK_START)} height="30"
            fill="rgba(45,212,166,0.15)" stroke="rgba(45,212,166,0.50)" strokeWidth="1" strokeDasharray="3 2" rx="3" />
          <text x={(toX(BLOCK_START) + toX(BLOCK_END)) / 2} y="105" textAnchor="middle"
            style={{ fontSize: '7px', fill: '#2DD4A6', fontWeight: 700 }}>RB-104</text>

          {/* Rail line */}
          <line x1={toX(0)} y1="80" x2={toX(CORRIDOR_KM)} y2="80" stroke="url(#miniRail)" strokeWidth="2.5" className="rail-pulse" />

          {/* Stations */}
          {stations.map((st) => {
            const x = toX(st.km);
            return (
              <g key={st.code}>
                <circle cx={x} cy="80" r={st.major ? 5 : 3} fill="#0B1B2E" stroke={st.major ? '#3B9DFF' : 'rgba(59,157,255,0.40)'} strokeWidth={st.major ? 2 : 1} />
                <text x={x} y={st.major ? "72" : "74"} textAnchor="middle"
                  style={{ fontSize: st.major ? '8px' : '7px', fill: st.major ? '#EAF2F8' : '#93A8BA', fontWeight: st.major ? 700 : 400 }}>{st.name}</text>
                <text x={x} y="95" textAnchor="middle" style={{ fontSize: '6px', fill: '#5E7A91' }}>KM{st.km}</text>
              </g>
            );
          })}

          {/* Trains */}
          {trains.map((train) => {
            const x = toX(train.positionKm);
            const c = trainColors[train.color];
            return (
              <g key={train.id} className="cursor-pointer"
                onMouseEnter={() => setHoverTrain(train)}
                onMouseLeave={() => setHoverTrain(null)}
                onClick={() => onNavigate('map', train.id)}>
                <circle cx={x} cy="55" r="6" fill={c} className="train-blip" />
                <text x={x} y="58" textAnchor="middle" style={{ fontSize: '6px', fill: '#fff', fontWeight: 700 }}>{train.number}</text>
                {hoverTrain?.id === train.id && (
                  <text x={x} y="42" textAnchor="middle" style={{ fontSize: '7px', fill: '#EAF2F8' }}>
                    {train.speed > 0 ? `${train.speed} km/h` : 'HELD'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Train chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {trains.map((t) => (
            <button key={t.id} onClick={() => onNavigate('map', t.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors hover:bg-surface-600"
              style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
              <Train className="w-3 h-3" style={{ color: trainColors[t.color] }} />
              <span className="text-[10px] font-mono font-bold text-text-primary">{t.number}</span>
              <span className={`text-[9px] ${t.status === 'Running on time' ? 'text-success-400' : t.status === 'Train-path protected' ? 'text-critical-400' : 'text-warning-400'}`}>
                {t.delay > 0 ? `+${t.delay}m` : t.status === 'Train-path protected' ? 'PROT' : 'ONTIME'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
