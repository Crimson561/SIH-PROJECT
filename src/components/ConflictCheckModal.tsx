import { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Clock, Info, ArrowRight, CheckCircle2,
  Train, MapPin, Lock, Unlock, AlertCircle,
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { type MockTrain, aiRecommendation, checkBlockConflict } from '@/data/mockData';

interface ConflictCheckModalProps {
  open: boolean;
  onClose: () => void;
  train: MockTrain | null;
}

type CheckState = 'PASS' | 'WATCH' | 'FAIL';

interface ConstraintRow {
  label: string;
  state: CheckState;
  reason: string;
}

function buildConstraints(train: MockTrain | null): ConstraintRow[] {
  const base: ConstraintRow[] = [
    { label: 'Train-path protection', state: 'PASS', reason: 'No protected path in KM 103–105 zone.' },
    { label: 'Corridor occupancy', state: 'PASS', reason: 'Sufficient capacity in proposed window.' },
    { label: 'Train delay buffer', state: 'PASS', reason: 'No adjacent delays affecting buffer.' },
    { label: 'Engineering crew', state: 'PASS', reason: 'Eng Crew Alpha-3 available.' },
    { label: 'S&T crew', state: 'PASS', reason: 'S&T Team Beta-1 available.' },
    { label: 'OHE crew', state: 'PASS', reason: 'Traction Crew Gamma-2 available.' },
    { label: 'Block duration', state: 'PASS', reason: '180 min within 3-hour limit.' },
    { label: 'Department compatibility', state: 'PASS', reason: 'All 3 departments confirmed compatible.' },
  ];

  if (!train) return base;

  if (train.id === 'train-12425') {
    base[0] = { label: 'Train-path protection', state: 'FAIL', reason: 'Protected movement of T-12425 overlaps the requested window. Block cannot be granted.' };
    base[2] = { label: 'Train delay buffer', state: 'PASS', reason: 'No delay on protected train.' };
  }
  if (train.id === 'train-12903') {
    base[2] = { label: 'Train delay buffer', state: 'WATCH', reason: 'Delay of +18 min reduces buffer. Use recommended alternative window if delay persists.' };
  }
  return base;
}

const stateConfig: Record<CheckState, { icon: typeof CheckCircle2; color: string; bg: string; border: string; label: string }> = {
  PASS:  { icon: CheckCircle2, color: 'text-success-400', bg: 'rgba(45,212,166,0.08)', border: 'rgba(45,212,166,0.25)', label: 'PASS' },
  WATCH: { icon: Clock,         color: 'text-warning-400', bg: 'rgba(246,184,74,0.08)', border: 'rgba(246,184,74,0.25)', label: 'WATCH' },
  FAIL:  { icon: AlertCircle,   color: 'text-critical-400', bg: 'rgba(255,91,91,0.08)',  border: 'rgba(255,91,91,0.25)',  label: 'FAIL' },
};

function MiniTimeline() {
  const HOUR_W = 40;
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(7,21,34,0.60)', border: '1px solid rgba(59,157,255,0.10)' }}>
      <p className="section-label mb-2">Train Movement vs Maintenance Window</p>
      <div className="overflow-x-auto">
      <div className="relative" style={{ width: 14 * HOUR_W, height: 56, minWidth: 14 * HOUR_W }}>
        {/* Hour grid */}
        {[13,14,15,16,17,18,19,20,21,22,23].map((h) => (
          <div key={h} className="absolute top-0 bottom-0 flex items-start">
            <div className="absolute top-0 bottom-0" style={{ left: (h-13) * HOUR_W, width: 1, background: 'rgba(59,157,255,0.06)' }} />
            <span className="text-[8px] text-text-muted font-mono absolute" style={{ left: (h-13) * HOUR_W - 6, top: 0 }}>{h}:00</span>
          </div>
        ))}
        {/* RB-104 block */}
        <div className="absolute rounded flex items-center px-2"
          style={{ left: 1 * HOUR_W, width: 3 * HOUR_W, top: 8, height: 18, background: 'rgba(45,212,166,0.15)', border: '1px solid rgba(45,212,166,0.50)' }}>
          <span className="text-[9px] font-bold text-success-400">RB-104 BLOCK 14:00–17:00</span>
        </div>
        {/* Protected path */}
        <div className="absolute rounded flex items-center px-2"
          style={{ left: 1.5 * HOUR_W, width: 0.75 * HOUR_W, top: 30, height: 18, background: 'rgba(255,91,91,0.15)', border: '1px solid rgba(255,91,91,0.40)' }}>
          <span className="text-[8px] font-bold text-critical-400">T-12425 PROTECTED</span>
        </div>
        {/* Alternative window */}
        <div className="absolute rounded flex items-center px-2"
          style={{ left: 4.5 * HOUR_W, width: 2.5 * HOUR_W, top: 8, height: 18, background: 'rgba(45,212,166,0.06)', border: '1px dashed rgba(45,212,166,0.30)' }}>
          <span className="text-[9px] font-medium text-success-400">ALT WINDOW 17:30–20:00</span>
        </div>
        {/* T-12903 */}
        <div className="absolute rounded flex items-center px-2"
          style={{ left: 3.5 * HOUR_W, width: 1.5 * HOUR_W, top: 30, height: 18, background: 'rgba(246,184,74,0.12)', border: '1px solid rgba(246,184,74,0.40)' }}>
          <span className="text-[8px] font-bold text-warning-400">T-12903 +18m</span>
        </div>
      </div>
      </div>
    </div>
  );
}

export function ConflictCheckModal({ open, onClose, train }: ConflictCheckModalProps) {
  const [useAlternative, setUseAlternative] = useState(false);
  if (!train) return null;

  const conflict = checkBlockConflict(train);
  const constraints = buildConstraints(train);
  const hasFail = constraints.some((c) => c.state === 'FAIL');
  const hasWatch = constraints.some((c) => c.state === 'WATCH');
  const canAuthorize = !hasFail && (!hasWatch || useAlternative);

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setUseAlternative(false); }}
      title="SAFETY CROSS-CHECK • RB-104"
      subtitle="Decision support for maintenance block authorization"
      icon={<ShieldCheck className="w-5 h-5" />}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={() => { onClose(); setUseAlternative(false); }} className="btn btn-ghost">RETURN TO MAP</button>
          {hasWatch && !hasFail && (
            <button onClick={() => setUseAlternative(true)} className="btn btn-cyan">
              <ArrowRight className="w-4 h-4" />
              USE ALTERNATIVE WINDOW
            </button>
          )}
          <button
            disabled={!canAuthorize}
            onClick={() => { onClose(); setUseAlternative(false); }}
            className={`btn ${canAuthorize ? 'btn-success' : 'opacity-40 cursor-not-allowed bg-surface-600 text-text-muted border border-[rgba(59,157,255,0.10)]'}`}
          >
            {canAuthorize ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            AUTHORIZE BLOCK
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Header summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <SummaryItem label="Block" value="RB-104" mono />
          <SummaryItem label="Corridor" value="JUC → PGW" />
          <SummaryItem label="Window" value="17 Sep • 14:00–17:00" />
          <SummaryItem label="Decision State" value={hasFail ? 'FAIL — HOLD' : hasWatch ? 'REVIEW REQUIRED' : 'CLEAR'} highlight={hasFail ? 'critical' : hasWatch ? 'warning' : 'success'} />
        </div>

        {/* Train being checked */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
          <Train className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-text-primary">Train {train.number} — {train.name}</p>
            <p className="text-[10px] text-text-muted">Segment KM {train.segmentStart}–{train.segmentEnd} • {train.status}</p>
          </div>
          {train.delay > 0 && <span className="badge badge-warning">+{train.delay} MIN</span>}
          {train.status === 'Train-path protected' && <span className="badge badge-critical">PROTECTED</span>}
        </div>

        {/* Constraint matrix */}
        <div>
          <p className="panel-title mb-2">CONSTRAINT MATRIX</p>
          <div className="space-y-1.5">
            {constraints.map((c) => {
              const cfg = stateConfig[c.state];
              const Icon = cfg.icon;
              return (
                <div key={c.label} className="flex items-start gap-3 px-3 py-2 rounded-lg" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <Icon className={`w-4 h-4 ${cfg.color} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-text-primary">{c.label}</span>
                      <span className={`text-[9px] font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5">{c.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini timeline */}
        <MiniTimeline />

        {/* Recommended decision */}
        <div className="px-4 py-3 rounded-lg" style={{ background: hasFail ? 'rgba(255,91,91,0.08)' : hasWatch ? 'rgba(246,184,74,0.08)' : 'rgba(45,212,166,0.08)', border: `1px solid ${hasFail ? 'rgba(255,91,91,0.25)' : hasWatch ? 'rgba(246,184,74,0.25)' : 'rgba(45,212,166,0.25)'}` }}>
          <div className="flex items-start gap-2.5">
            {hasFail ? <AlertCircle className="w-4 h-4 text-critical-400 shrink-0 mt-0.5" /> : hasWatch ? <Clock className="w-4 h-4 text-warning-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />}
            <div>
              <p className="text-[12px] font-bold text-text-primary">Recommended Decision</p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {hasFail
                  ? 'Hold approval until live path status clears. Protected movement overlaps the requested window.'
                  : hasWatch
                  ? 'Use alternative window (17:30–20:00) if delay persists. Authorization permitted with adjusted timing.'
                  : 'All constraints pass. Block can be authorized safely.'}
              </p>
            </div>
          </div>
        </div>

        {/* Alternative window */}
        {(hasWatch || hasFail) && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ background: 'rgba(45,212,166,0.06)', border: '1px solid rgba(45,212,166,0.15)' }}>
            <Clock className="w-4 h-4 text-success-400 shrink-0" />
            <span className="text-[12px] text-text-primary">Alternative safe window: <span className="font-bold text-success-400 font-mono">17 Sep • 17:30–20:00</span></span>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
          <Info className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
          <p className="text-[10px] text-text-muted">
            Prototype decision support only. Final authority remains with the Control Desk Officer.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function SummaryItem({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: 'critical' | 'warning' | 'success' }) {
  const hColor = highlight === 'critical' ? 'text-critical-400' : highlight === 'warning' ? 'text-warning-400' : highlight === 'success' ? 'text-success-400' : 'text-text-primary';
  return (
    <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
      <p className="section-label mb-0.5">{label}</p>
      <p className={`text-[13px] font-bold ${hColor} ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
