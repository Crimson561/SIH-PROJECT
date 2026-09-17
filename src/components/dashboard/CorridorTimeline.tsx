import { useState } from 'react';
import { Clock, ArrowRight, Train, Shield, Wrench, CalendarClock } from 'lucide-react';

interface CorridorTimelineProps {
  onNavigate: (page: string) => void;
}

// Timeline events: hour (0-24), type, label, startKm, endKm
type TLEvent = {
  start: number; end: number; type: 'train' | 'protected' | 'block' | 'alt-block'; label: string; color: string;
};

const events: TLEvent[] = [
  { start: 0.5, end: 3.5, type: 'block', label: 'Sleeper Replacement (B-105)', color: '#3B9DFF' },
  { start: 1.0, end: 4.0, type: 'block', label: 'Track Inspection (B-101)', color: '#3B9DFF' },
  { start: 13.0, end: 15.0, type: 'block', label: 'S&T Relay Testing (B-102)', color: '#21D4C2' },
  { start: 14.0, end: 17.0, type: 'block', label: 'RB-104 AI Joint Block', color: '#2DD4A6' },
  { start: 14.5, end: 15.25, type: 'protected', label: 'Train 12425 Protected Path', color: '#FF5B5B' },
  { start: 17.5, end: 20.0, type: 'alt-block', label: 'Alternative Safe Window', color: 'rgba(45,212,166,0.50)' },
  { start: 2.0, end: 5.0, type: 'block', label: 'OHE Inspection (B-103)', color: '#F6B84A' },
];

const trainMovements = [
  { start: 18.5, end: 20.5, label: 'T-14681', color: '#3B9DFF' },
  { start: 20.0, end: 21.5, label: 'T-12425', color: '#FF5B5B' },
  { start: 20.5, end: 22.2, label: 'T-12903', color: '#F6B84A' },
  { start: 21.5, end: 22.25, label: 'T-04592', color: '#3B9DFF' },
];

const HOUR_W = 48;
const TIMELINE_W = 24 * HOUR_W;

const legendItems = [
  { icon: Wrench, label: 'Maintenance Block', color: '#3B9DFF' },
  { icon: Shield, label: 'Protected Train Path', color: '#FF5B5B' },
  { icon: Train, label: 'Train Movement', color: '#93A8BA' },
  { icon: CalendarClock, label: 'AI Joint Block', color: '#2DD4A6' },
];

export function CorridorTimeline({ onNavigate }: CorridorTimelineProps) {
  const [hoverHour, setHoverHour] = useState<number | null>(null);
  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="panel p-0 overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="panel-title">24-HOUR CORRIDOR TIMELINE</span>
        </div>
        <div className="flex items-center gap-3">
          {legendItems.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-3 h-3" style={{ color }} />
              <span className="text-[10px] text-text-muted">{label}</span>
            </div>
          ))}
          <button onClick={() => onNavigate('planning')} className="btn btn-ghost btn-sm">
            VIEW FULL PLAN <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <div style={{ minWidth: TIMELINE_W + 40 }}>
          {/* Hour labels */}
          <div className="relative h-5 mb-1" style={{ width: TIMELINE_W }}>
            {hours.filter((h) => h % 2 === 0).map((h) => (
              <span key={h} className="absolute text-[9px] text-text-muted font-mono" style={{ left: h * HOUR_W - 6 }}>
                {String(h).padStart(2, '0')}:00
              </span>
            ))}
          </div>

          {/* Train movements layer */}
          <div className="relative mb-1" style={{ height: 28, width: TIMELINE_W }}>
            <div className="absolute inset-0" style={{ background: 'rgba(59,157,255,0.03)', borderRadius: 4 }} />
            {trainMovements.map((tm) => (
              <div key={tm.label} className="absolute rounded flex items-center px-2"
                style={{
                  left: tm.start * HOUR_W, width: (tm.end - tm.start) * HOUR_W, top: 4, height: 20,
                  background: `${tm.color}22`, border: `1px solid ${tm.color}66`,
                }}>
                <Train className="w-3 h-3 shrink-0" style={{ color: tm.color }} />
                <span className="text-[9px] font-mono font-bold ml-1 truncate" style={{ color: tm.color }}>{tm.label}</span>
              </div>
            ))}
          </div>

          {/* Blocks & protected paths layer */}
          <div className="relative" style={{ height: 64, width: TIMELINE_W }}
            onMouseLeave={() => setHoverHour(null)}>
            {/* Grid lines */}
            {hours.map((h) => (
              <div key={h} className="absolute top-0 bottom-0"
                style={{ left: h * HOUR_W, width: 1, background: 'rgba(59,157,255,0.06)' }} />
            ))}

            {events.map((ev, i) => {
              const isAI = ev.label.includes('RB-104');
              const isAlt = ev.type === 'alt-block';
              const isProt = ev.type === 'protected';
              return (
                <div key={i}
                  className="absolute rounded flex items-center px-2 transition-all hover:z-10 cursor-default"
                  style={{
                    left: ev.start * HOUR_W,
                    width: Math.max((ev.end - ev.start) * HOUR_W, 40),
                    top: isProt ? 0 : isAlt ? 22 : isAI ? 22 : (i % 2) * 22,
                    height: 20,
                    background: isAI ? 'rgba(45,212,166,0.15)' : isAlt ? 'rgba(45,212,166,0.06)' : isProt ? 'rgba(255,91,91,0.15)' : `${ev.color}22`,
                    border: `1px solid ${isAI ? 'rgba(45,212,166,0.50)' : isAlt ? 'rgba(45,212,166,0.30)' : isProt ? 'rgba(255,91,91,0.40)' : `${ev.color}66`}`,
                    ...(isAI ? { boxShadow: '0 0 8px rgba(45,212,166,0.20)' } : {}),
                  }}
                >
                  {isAI && <span className="text-[8px] font-bold text-success-400 mr-1">AI</span>}
                  {isProt && <Shield className="w-3 h-3 shrink-0 text-critical-400" />}
                  <span className={`text-[9px] font-medium truncate ${isProt ? 'text-critical-400' : isAI ? 'text-success-400' : isAlt ? 'text-success-400' : 'text-text-secondary'}`}>
                    {ev.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hover indicator */}
          {hoverHour !== null && (
            <div className="absolute pointer-events-none" style={{ left: hoverHour * HOUR_W }}>
              <div className="w-px h-full" style={{ background: 'rgba(59,157,255,0.30)' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
