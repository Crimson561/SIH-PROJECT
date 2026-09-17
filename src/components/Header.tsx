import { useEffect, useState } from 'react';
import { Bell, ChevronRight, ShieldCheck, User, Download, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  breadcrumb: string;
  onIngestDefect?: () => void;
}

function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return time;
}

const PAGE_LABEL: Record<string, string> = {
  dashboard: 'Command Dashboard',
  map: 'Live Corridor Map',
  schedule: 'Train Schedule',
  tasks: 'Maintenance Tasks',
  planning: 'Block Planning',
  assets: 'Asset Health',
  alerts: 'Conflicts & Alerts',
  reports: 'Reports',
  settings: 'Settings',
};

export function Header({ pageTitle, breadcrumb, onIngestDefect }: HeaderProps) {
  const now = useClock();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const notifications = [
    { id: 1, title: 'Protected path conflict', detail: 'Train 12425 overlaps the RB-104 request at 14:30.', time: '2 min ago', tone: 'critical' as const, icon: AlertTriangle },
    { id: 2, title: 'Safe window available', detail: 'RB-104 can move to 17:30–20:00 with all constraints cleared.', time: '8 min ago', tone: 'success' as const, icon: CheckCircle2 },
    { id: 3, title: 'TMS feed synchronized', detail: 'Latest corridor defect feed received from the maintenance system.', time: '16 min ago', tone: 'info' as const, icon: Info },
  ];

  const unreadCount = notifications.filter((notification) => !readNotifications.includes(notification.id)).length;

  const markAllRead = () => setReadNotifications(notifications.map((notification) => notification.id));

  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <header
      className="h-[56px] shrink-0 flex items-center justify-between px-5 z-30 sticky top-0"
      style={{
        background: 'rgba(8,27,45,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(59,157,255,0.12)',
      }}
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px]">
        <span className="text-text-muted">{breadcrumb}</span>
        <ChevronRight className="w-3.5 h-3.5 text-text-disabled" />
        <span className="text-blue-400 font-semibold">{pageTitle}</span>
      </div>

      {/* Center: Clock */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 lg:left-[42%]">
        <div className="px-3 py-1 rounded-lg" style={{ background: 'rgba(59,157,255,0.08)', border: '1px solid rgba(59,157,255,0.15)' }}>
          <span className="text-[12px] font-bold font-mono text-blue-300 tracking-wider">
            {dateStr} • {timeStr} IST
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* System health */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(45,212,166,0.08)', border: '1px solid rgba(45,212,166,0.18)' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-success-400" />
          <span className="text-[11px] font-bold text-success-400">NOMINAL</span>
        </div>

        {/* Ingest TMS Defect */}
        <button
          onClick={onIngestDefect}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-cyan-400 transition-all hover:bg-surface-600"
          style={{ background: 'rgba(33,212,194,0.08)', border: '1px solid rgba(33,212,194,0.18)' }}
          title="Simulate TMS defect ingestion"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">INGEST TMS DEFECT</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative p-2 rounded-lg transition-colors hover:bg-surface-600"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-4 h-4 text-text-secondary" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 min-w-2 h-2 px-0.5 rounded-full bg-critical-400 ring-1 ring-surface-800" />}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 z-50 w-[340px] rounded-xl overflow-hidden" style={{ background: '#10263A', border: '1px solid rgba(59,157,255,0.22)', boxShadow: '0 16px 40px rgba(0,0,0,0.55)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
                <div>
                  <p className="text-[13px] font-bold text-text-primary">Operations Alerts</p>
                  <p className="text-[10px] text-text-muted">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={markAllRead} className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">MARK ALL READ</button>
                  <button onClick={() => setNotificationsOpen(false)} className="p-1 text-text-muted hover:text-text-primary" aria-label="Close notifications"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div>
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  const isRead = readNotifications.includes(notification.id);
                  const toneClass = notification.tone === 'critical' ? 'text-critical-400' : notification.tone === 'success' ? 'text-success-400' : 'text-blue-400';
                  return (
                    <button
                      key={notification.id}
                      onClick={() => setReadNotifications((current) => current.includes(notification.id) ? current : [...current, notification.id])}
                      className={`w-full text-left flex gap-3 px-4 py-3 transition-colors hover:bg-surface-600 ${isRead ? 'opacity-60' : ''}`}
                      style={{ borderBottom: '1px solid rgba(59,157,255,0.08)' }}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${toneClass}`} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-text-primary">{notification.title}</span>
                          {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-critical-400 shrink-0" />}
                        </span>
                        <span className="block mt-0.5 text-[10px] leading-relaxed text-text-secondary">{notification.detail}</span>
                        <span className="block mt-1 text-[9px] text-text-muted">{notification.time}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Officer */}
        <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'rgba(59,157,255,0.12)' }}>
          <div className="flex items-center justify-center w-7 h-7 rounded-full" style={{ background: 'rgba(59,157,255,0.15)', border: '1px solid rgba(59,157,255,0.25)' }}>
            <User className="w-4 h-4 text-blue-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-text-primary leading-tight">CDO</p>
            <p className="text-[10px] text-text-muted leading-tight">Control Desk Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
