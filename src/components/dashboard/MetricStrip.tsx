import { BarChart3, Layers, GitMerge, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const metrics = [
  { icon: BarChart3, label: 'Block Utilization', value: '78%',   trend: '+6%', up: true,  color: 'text-blue-400',   note: 'Target 85%' },
  { icon: Layers,    label: 'Tasks Optimized',   value: '6',     trend: 'in RB-104',up:true,color:'text-cyan-400',   note: '3 departments' },
  { icon: GitMerge,  label: 'Avoided Requests',  value: '2',     trend: 'this week', up:true,color:'text-success-400',note: 'Via joint block' },
  { icon: Activity,  label: 'Corridor Capacity', value: '81%',   trend: '−3%',up: false, color: 'text-warning-400', note: 'Vs last week' },
];

export function MetricStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map(({ icon: Icon, label, value, trend, up, color, note }) => (
        <div key={label} className="panel px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
            style={{ background: 'rgba(59,157,255,0.08)', border: '1px solid rgba(59,157,255,0.12)' }}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="section-label truncate">{label}</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-[22px] font-bold leading-none ${color}`}>{value}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {up ? <TrendingUp className="w-3 h-3 text-success-400" /> : <TrendingDown className="w-3 h-3 text-critical-400" />}
              <span className="text-[10px] text-text-muted">{trend}</span>
              <span className="text-[10px] text-text-disabled hidden md:inline"> · {note}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
