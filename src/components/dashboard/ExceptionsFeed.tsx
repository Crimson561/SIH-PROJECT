import { AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { alerts } from '@/data/mockData';

interface ExceptionsFeedProps {
  onNavigate: (page: string, trainId?: string) => void;
}

const sevConfig = {
  critical: { icon: AlertCircle, color: 'text-critical-400', bar: '#FF5B5B', bg: 'rgba(255,91,91,0.06)', border: 'rgba(255,91,91,0.15)' },
  warning:  { icon: AlertTriangle, color: 'text-warning-400', bar: '#F6B84A', bg: 'rgba(246,184,74,0.05)', border: 'rgba(246,184,74,0.12)' },
  info:     { icon: Info, color: 'text-blue-400', bar: '#3B9DFF', bg: 'rgba(59,157,255,0.05)', border: 'rgba(59,157,255,0.10)' },
};

const times: Record<string, string> = {
  'alert-1': '20:42', 'alert-2': '20:38', 'alert-3': '20:15', 'alert-4': '19:55',
};

export function ExceptionsFeed({ onNavigate }: ExceptionsFeedProps) {
  return (
    <div className="panel p-0 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
        <span className="panel-title">ACTIVE EXCEPTIONS</span>
        <span className="text-[10px] text-text-muted font-mono">{alerts.length} ITEMS</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'rgba(59,157,255,0.06)' }}>
        {alerts.map((alert) => {
          const cfg = sevConfig[alert.severity];
          const Icon = cfg.icon;
          return (
            <button
              key={alert.id}
              onClick={() => alert.trainId ? onNavigate('map', alert.trainId) : onNavigate('alerts')}
              className="w-full flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-600 text-left relative"
              style={{ background: alert.severity === 'critical' ? cfg.bg : undefined }}
            >
              {/* Severity bar */}
              <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: cfg.bar }} />

              <Icon className={`w-4 h-4 ${cfg.color} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${cfg.color}`}>{alert.severity}</span>
                  <span className="text-[10px] text-text-muted font-mono">{times[alert.id] ?? '--:--'}</span>
                </div>
                <p className="text-[12px] font-semibold text-text-primary leading-tight">{alert.title}</p>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-snug line-clamp-2">{alert.message}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
