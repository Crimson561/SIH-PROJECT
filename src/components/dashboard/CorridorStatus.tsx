import { Train, Shield, AlertTriangle, ClipboardList, Cpu, Map } from 'lucide-react';
import { ProgressBar, MiniTrend } from '@/components/ProgressBar';

interface CorridorStatusProps {
  onNavigate: (page: string) => void;
}

const statusRows = [
  { icon: Train,         label: 'Train movements',      value: '4 active',    color: 'text-blue-400',    pct: 100 },
  { icon: Shield,        label: 'Protected paths',       value: '1 active',    color: 'text-critical-400',pct: 25 },
  { icon: AlertTriangle, label: 'Delayed trains',        value: '1 train',     color: 'text-warning-400', pct: 25 },
  { icon: ClipboardList, label: 'Open maintenance tasks',value: '42 tasks',    color: 'text-text-secondary',pct: 55 },
  { icon: Cpu,           label: 'Critical assets',       value: '7 assets',    color: 'text-warning-400', pct: 35 },
];

const trendData = [74, 76, 75, 77, 78, 78, 78];

export function CorridorStatus({ onNavigate }: CorridorStatusProps) {
  return (
    <div className="panel p-0 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
        <span className="panel-title">CORRIDOR STATUS</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
          <span className="text-[10px] text-success-400 font-bold">LIVE</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 space-y-3">
        {statusRows.map(({ icon: Icon, label, value, color, pct }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-[12px] text-text-secondary">{label}</span>
              </div>
              <span className={`text-[12px] font-bold ${color}`}>{value}</span>
            </div>
            <ProgressBar value={pct} color={color.replace('text-', 'bg-')} height="h-1" />
          </div>
        ))}
      </div>

      {/* Block utilization */}
      <div className="mx-4 mb-3 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.12)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="section-label">Block Utilization</span>
          <div className="flex items-center gap-2">
            <MiniTrend data={trendData} color="text-blue-400" />
            <span className="text-[16px] font-bold text-blue-400">78%</span>
          </div>
        </div>
        <ProgressBar value={78} color="bg-blue-400" height="h-1.5" glow />
        <p className="text-[10px] text-text-muted mt-1">Target 85% • +6% this month</p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onNavigate('map')}
          className="btn btn-primary w-full"
          style={{ background: 'linear-gradient(90deg,#1A3A55,#1E4468)', border: '1px solid rgba(59,157,255,0.30)' }}
        >
          <Map className="w-4 h-4" />
          OPEN LIVE MAP
        </button>
      </div>
    </div>
  );
}
