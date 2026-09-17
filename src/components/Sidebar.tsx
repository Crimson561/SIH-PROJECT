import {
  LayoutDashboard, Map, TrainFront, ClipboardList, CalendarClock,
  Activity, AlertTriangle, FileBarChart, Settings,
  Cpu, Circle,
} from 'lucide-react';

const groups = [
  {
    label: 'Monitor',
    items: [
      { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
      { id: 'map', label: 'Live Corridor Map', icon: Map },
      { id: 'schedule', label: 'Train Schedule', icon: TrainFront },
    ],
  },
  {
    label: 'Plan',
    items: [
      { id: 'planning', label: 'Block Planning', icon: CalendarClock },
      { id: 'tasks', label: 'Maintenance Tasks', icon: ClipboardList },
      { id: 'assets', label: 'Asset Health', icon: Activity },
    ],
  },
  {
    label: 'Control',
    items: [
      { id: 'alerts', label: 'Conflicts & Alerts', icon: AlertTriangle },
      { id: 'reports', label: 'Reports', icon: FileBarChart },
    ],
  },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="w-[230px] shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden"
      style={{ background: '#081B2D', borderRight: '1px solid rgba(59,157,255,0.10)' }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(59,157,255,0.10)' }}>
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-[8px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#1A3A55 0%,#0B1B2E 100%)', border: '1px solid rgba(59,157,255,0.30)' }}>
            <Cpu className="w-4 h-4 text-blue-400 absolute" style={{ opacity: 0.3 }} />
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <div className="w-5 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#21D4C2,#3B9DFF)' }} />
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <div className="w-5 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#3B9DFF,#21D4C2)' }} />
            </div>
          </div>
          <div>
            <p className="text-[14px] font-bold text-text-primary leading-tight tracking-tight">RailBlock AI</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted leading-tight mt-0.5">Command Center</p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="section-label px-2 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const active = activePage === id;
                return (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 relative group ${
                      active
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                    style={active ? {
                      background: 'rgba(59,157,255,0.10)',
                      borderLeft: '2px solid #3B9DFF',
                    } : {
                      paddingLeft: '13px',
                    }}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-text-muted group-hover:text-text-secondary'}`} />
                    <span className={active ? 'font-semibold' : ''}>{label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-3 border-t pt-3" style={{ borderColor: 'rgba(59,157,255,0.08)' }}>
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 relative group mb-3 ${
            activePage === 'settings' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
          style={activePage === 'settings' ? {
            background: 'rgba(59,157,255,0.10)',
            borderLeft: '2px solid #3B9DFF',
          } : { paddingLeft: '13px' }}
        >
          <Settings className={`w-4 h-4 shrink-0 ${activePage === 'settings' ? 'text-blue-400' : 'text-text-muted group-hover:text-text-secondary'}`} />
          <span className={activePage === 'settings' ? 'font-semibold' : ''}>Settings</span>
        </button>

        {/* System status */}
        <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(45,212,166,0.06)', border: '1px solid rgba(45,212,166,0.15)' }}>
          <div className="flex items-center gap-2 mb-0.5">
            <Circle className="w-2 h-2 fill-success-400 text-success-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-success-400">System Nominal</span>
          </div>
          <p className="text-[10px] text-text-muted pl-4">Synthetic Demo Environment</p>
        </div>
      </div>
    </aside>
  );
}
