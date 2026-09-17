import { useState } from 'react';
import {
  Brain, ShieldCheck, CheckCircle2, AlertTriangle, MapPin, Clock, Users,
  FileSearch, ArrowRight, Lock, Unlock, Info, Zap, ArrowLeftRight,
} from 'lucide-react';
import { aiRecommendation, stations } from '@/data/mockData';

interface AIDecisionHeroProps {
  approved: boolean;
  onApprove: () => void;
  onOpenCrossCheck: () => void;
  onNavigate: (page: string) => void;
  onSafeWindow?: () => void;
}

const CORRIDOR_KM = 161;
const BLOCK_START = 103;
const BLOCK_END = 105;
const CONFLICT_START = 78;
const CONFLICT_END = 84;

function CorridorStrip() {
  const toP = (km: number) => `${(km / CORRIDOR_KM) * 100}%`;
  return (
    <div className="relative h-10 flex items-center">
      {/* Base line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: 'rgba(59,157,255,0.25)' }} />
      {/* Glow line */}
      <div className="absolute h-px rail-pulse"
        style={{ left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(90deg,transparent,#3B9DFF,#21D4C2,#3B9DFF,transparent)' }} />

      {/* Conflict zone */}
      <div className="absolute top-1/2 -translate-y-1/2 h-5 rounded"
        style={{ left: toP(CONFLICT_START), width: `calc(${toP(CONFLICT_END)} - ${toP(CONFLICT_START)})`, background: 'rgba(255,91,91,0.20)', border: '1px solid rgba(255,91,91,0.40)' }}>
        <span className="absolute -top-4 left-0 text-[8px] font-bold text-critical-400 whitespace-nowrap">PATH PROTECTED</span>
      </div>

      {/* Block zone */}
      <div className="absolute top-1/2 -translate-y-1/2 h-5 rounded"
        style={{ left: toP(BLOCK_START), width: `calc(${toP(BLOCK_END)} - ${toP(BLOCK_START)})`, background: 'rgba(45,212,166,0.20)', border: '1px solid rgba(45,212,166,0.50)' }}>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-success-400 whitespace-nowrap">RB-104</span>
      </div>

      {/* Station dots */}
      {stations.map((st) => (
        <div key={st.code} className="absolute flex flex-col items-center"
          style={{ left: toP(st.km), transform: 'translateX(-50%)' }}>
          <div className={`rounded-full border ${st.major ? 'w-3 h-3 border-blue-400 bg-surface-700' : 'w-2 h-2 border-surface-300 bg-surface-600'}`}
            style={{ borderColor: st.major ? '#3B9DFF' : 'rgba(59,157,255,0.30)' }} />
          {st.major && (
            <span className="absolute top-4 text-[8px] font-bold text-text-muted whitespace-nowrap">{st.code}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ConfidenceRing({ pct, safe }: { pct: number; safe?: boolean }) {
  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const gradId = safe ? 'confGradSafe' : 'confGrad';
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(59,157,255,0.12)" strokeWidth="6" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={`url(#${gradId})`} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          {safe ? (
            <><stop offset="0%" stopColor="#2DD4A6" /><stop offset="100%" stopColor="#21D4C2" /></>
          ) : (
            <><stop offset="0%" stopColor="#21D4C2" /><stop offset="100%" stopColor="#3B9DFF" /></>
          )}
        </linearGradient>
      </defs>
      <text x={cx} y={cy + 5} textAnchor="middle" style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 700, fill: '#EAF2F8' }}>{pct}%</text>
    </svg>
  );
}

export function AIDecisionHero({ approved, onApprove, onOpenCrossCheck, onNavigate, onSafeWindow }: AIDecisionHeroProps) {
  const [crossCheckDone, setCrossCheckDone] = useState(false);
  const [safeWindow, setSafeWindow] = useState(false);
  const rec = aiRecommendation;

  const handleCrossCheck = () => {
    onOpenCrossCheck();
    setCrossCheckDone(true);
  };

  const handleSwitchWindow = () => {
    setSafeWindow(true);
    onSafeWindow?.();
  };

  const confidence = safeWindow ? 98 : rec.confidence;
  const windowLabel = safeWindow ? '17 SEP • 17:30–20:00' : '17 SEP • 14:00–17:00';
  const durationLabel = safeWindow ? '150 MIN' : '180 MIN';

  return (
    <div className="panel p-0 overflow-hidden h-full">
      {/* Header bar */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
        <div className="flex items-center gap-2.5">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="panel-title">AI BLOCK DECISION</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-blue">RB-104</span>
          {approved
            ? <span className="badge badge-success">AUTHORIZED</span>
            : safeWindow
            ? <span className="badge badge-success">SAFE FOR APPROVAL • 98%</span>
            : <span className="badge badge-warning">READY FOR REVIEW</span>}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Conflict warning banner — shown when not yet switched to safe window */}
        {!safeWindow && !approved && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg" style={{ background: 'rgba(255,91,91,0.08)', border: '1px solid rgba(255,91,91,0.20)' }}>
            <AlertTriangle className="w-4 h-4 text-critical-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-critical-400">POTENTIAL TRAIN CONFLICT</p>
              <p className="text-[11px] text-text-secondary">Train 12425 protected path at 14:30 overlaps the requested window.</p>
            </div>
          </div>
        )}

        {/* Safe window confirmation banner */}
        {safeWindow && !approved && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg" style={{ background: 'rgba(45,212,166,0.08)', border: '1px solid rgba(45,212,166,0.20)' }}>
            <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-success-400">SAFE FOR APPROVAL • 98% Confidence</p>
              <p className="text-[11px] text-text-secondary">Window shifted to avoid protected path. No conflicts detected.</p>
            </div>
          </div>
        )}

        {/* Top row: Confidence + Core info */}
        <div className="flex items-start gap-5">
          <ConfidenceRing pct={confidence} safe={safeWindow} />

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
            <InfoField label="Block ID" value="RB-104" mono large />
            <InfoField label="Corridor" value="Jalandhar Cantt → Phagwara" />
            <InfoField label="Location" value="KM 103–105" mono />
            <InfoField label="Window" value={windowLabel} />
            <InfoField label="Duration" value={durationLabel} mono />
            <div>
              <p className="section-label mb-1.5">Departments</p>
              <div className="flex gap-1.5 flex-wrap">
                {[{c:'ENG',col:'bg-blue-400'},{c:'S&T',col:'bg-cyan-400'},{c:'OHE',col:'bg-warning-400'}].map(({c,col}) => (
                  <span key={c} className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold text-surface-900 ${col}`}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Constraint row */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-400" />
            <span className="text-[12px] text-text-primary font-medium">Constraints passed: <span className="font-bold text-success-400">{safeWindow ? '7/7' : '6/7'}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            {safeWindow ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-success-400" />
                <span className="text-[11px] text-success-400 font-medium">All constraints cleared with safe window</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-warning-400" />
                <span className="text-[11px] text-warning-300 font-medium">Timing watch: Train 12903 delayed +18 min</span>
              </>
            )}
          </div>
        </div>

        {/* Mini corridor strip */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="section-label">Corridor Overview — ASR → LDH</p>
            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-success-400 opacity-80 inline-block" />RB-104 Zone</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-critical-400 opacity-80 inline-block" />Path Protected</span>
            </div>
          </div>
          <div className="px-2 pt-5 pb-6">
            <CorridorStrip />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handleCrossCheck} className="btn btn-primary flex-1 min-w-[160px]">
            <ShieldCheck className="w-4 h-4" />
            OPEN SAFETY CROSS-CHECK
          </button>
          <button onClick={() => onNavigate('planning')} className="btn btn-outline flex-1 min-w-[140px]">
            <FileSearch className="w-4 h-4" />
            REVIEW BLOCK PLAN
          </button>
          {!safeWindow && !approved && (
            <button onClick={handleSwitchWindow} className="btn btn-cyan flex-1 min-w-[180px]" style={{ boxShadow: '0 0 12px rgba(33,212,194,0.30)' }}>
              <Zap className="w-4 h-4" />
              SWITCH TO SAFE WINDOW
            </button>
          )}
          <button
            onClick={onApprove}
            disabled={(!crossCheckDone && !safeWindow) || approved}
            className={`btn flex-1 min-w-[140px] ${
              approved ? 'btn-success cursor-default' :
              (crossCheckDone || safeWindow) ? 'btn-success' :
              'opacity-40 cursor-not-allowed bg-surface-600 text-text-muted border border-[rgba(59,157,255,0.10)]'
            }`}
          >
            {approved ? <CheckCircle2 className="w-4 h-4" /> : (crossCheckDone || safeWindow) ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {approved ? 'AUTHORIZED' : 'AUTHORIZE BLOCK'}
          </button>
        </div>

        {!crossCheckDone && !safeWindow && !approved && (
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <Info className="w-3.5 h-3.5" />
            Open Safety Cross-Check or switch to safe window to enable block authorization. Human authorization required.
          </div>
        )}
        {safeWindow && !approved && !crossCheckDone && (
          <div className="flex items-center gap-1.5 text-[11px] text-success-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Window shifted to 17:30–20:00. Ready for controller authorization.
          </div>
        )}
        {approved && (
          <div className="flex items-center gap-1.5 text-[11px] text-success-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Block RB-104 authorized and added to the active schedule.
          </div>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value, mono, large }: { label: string; value: string; mono?: boolean; large?: boolean }) {
  return (
    <div>
      <p className="section-label mb-1">{label}</p>
      <p className={`${large ? 'text-[20px] font-bold text-text-primary' : 'text-[13px] font-semibold text-text-primary'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  );
}
