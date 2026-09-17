import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Bell, CheckCircle2, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { alerts as initialAlerts, type Alert } from '@/data/mockData';
import { Modal } from '@/components/Modal';

const sevConfig: Record<Alert['severity'], { icon: typeof AlertTriangle; color: string; bar: string; bg: string; border: string; label: string }> = {
  critical: { icon: AlertCircle,   color: 'text-critical-400', bar: '#FF5B5B', bg: 'rgba(255,91,91,0.06)',  border: 'rgba(255,91,91,0.15)',  label: 'CRITICAL' },
  warning:  { icon: AlertTriangle,  color: 'text-warning-400', bar: '#F6B84A', bg: 'rgba(246,184,74,0.05)', border: 'rgba(246,184,74,0.12)', label: 'WARNING' },
  info:     { icon: Info,           color: 'text-blue-400',     bar: '#3B9DFF', bg: 'rgba(59,157,255,0.05)', border: 'rgba(59,157,255,0.10)', label: 'INFO' },
};

const times: Record<string, string> = { 'alert-1': '20:42', 'alert-2': '20:38', 'alert-3': '20:15', 'alert-4': '19:55' };

interface Props { onNavigate?: (page: string, trainId?: string) => void; }

export function ConflictsAlertsPage({ onNavigate }: Props) {
  const [alertList, setAlertList] = useState(initialAlerts.map((a) => ({ ...a, acknowledged: false })));
  const [tab, setTab] = useState<'Active' | 'Acknowledged' | 'Resolved'>('Active');
  const [selectedAlert, setSelectedAlert] = useState<(typeof initialAlerts[0] & { acknowledged: boolean }) | null>(null);

  const filtered = alertList.filter((a) => {
    if (tab === 'Active') return !a.acknowledged;
    if (tab === 'Acknowledged') return a.acknowledged;
    return false;
  });

  const handleAck = (id: string) => {
    setAlertList((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
    setSelectedAlert(null);
  };

  return (
    <>
      <div className="panel p-0 overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
          <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-critical-400" /><span className="panel-title">INCIDENT QUEUE</span></div>
          <div className="flex gap-1.5">
            {(['Active', 'Acknowledged', 'Resolved'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${tab === t ? 'bg-blue-400 text-surface-900' : 'text-text-secondary hover:bg-surface-600'}`} style={tab === t ? {} : { border: '1px solid rgba(59,157,255,0.10)' }}>{t}</button>
            ))}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'rgba(59,157,255,0.06)' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-8 h-8 text-success-400 mb-2" />
              <p className="text-[13px] font-semibold text-text-secondary">No {tab.toLowerCase()} incidents</p>
            </div>
          ) : (
            filtered.map((alert) => {
              const cfg = sevConfig[alert.severity];
              const Icon = cfg.icon;
              return (
                <div key={alert.id} className={`flex items-start gap-3 px-5 py-3 transition-colors hover:bg-surface-600 relative ${alert.acknowledged ? 'opacity-50' : ''}`}>
                  <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ background: cfg.bar }} />
                  <Icon className={`w-4 h-4 ${cfg.color} shrink-0 mt-1`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-[10px] text-text-muted font-mono">{times[alert.id] ?? '--:--'}</span>
                      <span className="text-[12px] font-semibold text-text-primary">{alert.title}</span>
                      {alert.acknowledged && <span className="badge badge-success">ACK</span>}
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button onClick={() => setSelectedAlert(alert as typeof initialAlerts[0] & { acknowledged: boolean })} className={`flex items-center gap-1 text-[10px] font-semibold ${cfg.color} hover:underline`}>Details <ChevronRight className="w-3 h-3" /></button>
                      {alert.trainId && <button onClick={() => onNavigate?.('map', alert.trainId)} className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:underline"><MapPin className="w-3 h-3" /> LOCATE</button>}
                      {alert.trainId && <button onClick={() => onNavigate?.('map', alert.trainId)} className="flex items-center gap-1 text-[10px] font-semibold text-text-secondary hover:underline"><ShieldCheck className="w-3 h-3" /> CROSS-CHECK</button>}
                      {!alert.acknowledged && <button onClick={() => handleAck(alert.id)} className="flex items-center gap-1 text-[10px] font-semibold text-success-400 hover:underline"><CheckCircle2 className="w-3 h-3" /> ACKNOWLEDGE</button>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Modal open={!!selectedAlert} onClose={() => setSelectedAlert(null)} title={selectedAlert?.title ?? ''} subtitle="Alert details and recommended action" icon={selectedAlert ? (() => { const Icon = sevConfig[selectedAlert.severity].icon; return <Icon className="w-5 h-5" />; })() : null} maxWidth="max-w-lg"
        footer={<>
          {selectedAlert?.trainId && <button onClick={() => onNavigate?.('map', selectedAlert.trainId)} className="btn btn-primary"><MapPin className="w-4 h-4" /> Locate on Map</button>}
          {!selectedAlert?.acknowledged && selectedAlert && <button onClick={() => handleAck(selectedAlert.id)} className="btn btn-success"><CheckCircle2 className="w-4 h-4" /> Acknowledge</button>}
          <button onClick={() => setSelectedAlert(null)} className="btn btn-ghost">Close</button>
        </>}>
        {selectedAlert && (
          <div className="space-y-4">
            <div className="rounded-lg p-4" style={{ background: sevConfig[selectedAlert.severity].bg, border: `1px solid ${sevConfig[selectedAlert.severity].border}` }}>
              <p className="text-[12px] text-text-primary">{selectedAlert.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}><p className="section-label mb-0.5">Alert ID</p><p className="text-[12px] font-mono font-semibold text-text-primary">{selectedAlert.id}</p></div>
              <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}><p className="section-label mb-0.5">Status</p><p className="text-[12px] font-semibold text-text-primary">{selectedAlert.acknowledged ? 'Acknowledged' : 'Active'}</p></div>
            </div>
            <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
              <p className="section-label mb-1">Recommended Action</p>
              <p className="text-[12px] text-text-secondary">{selectedAlert.severity === 'critical' ? 'Immediate attention required. Verify train-path protection and coordinate with CDO.' : selectedAlert.severity === 'warning' ? 'Monitor and plan corrective action within next maintenance cycle.' : 'Review data and incorporate into next planning cycle.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
