import { useState } from 'react';
import { CalendarClock, Sparkles, Plus, ShieldCheck, Train, Loader2, CheckCircle2, ArrowRight, Info, Map } from 'lucide-react';
import { weeklyBlocks as initialBlocks, weekDays, corridors, departments, trains, aiRecommendation, type BlockEntry } from '@/data/mockData';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';

interface BlockPlanningPageProps {
  onNavigate?: (page: string) => void;
}

const deptColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Engineering: { bg: 'rgba(59,157,255,0.12)', border: 'rgba(59,157,255,0.40)', text: 'text-blue-400', dot: '#3B9DFF' },
  'S&T': { bg: 'rgba(33,212,194,0.12)', border: 'rgba(33,212,194,0.40)', text: 'text-cyan-400', dot: '#21D4C2' },
  'Traction/OHE': { bg: 'rgba(246,184,74,0.12)', border: 'rgba(246,184,74,0.40)', text: 'text-warning-400', dot: '#F6B84A' },
  'AI Joint': { bg: 'rgba(45,212,166,0.12)', border: 'rgba(45,212,166,0.40)', text: 'text-success-400', dot: '#2DD4A6' },
};

const HOUR_WIDTH = 52;
const HOURS_START = 0, HOURS_END = 24;
const formatHour = (d: number) => { const h = Math.floor(d); const m = Math.round((d - h) * 60); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; };

export function BlockPlanningPage({ onNavigate }: BlockPlanningPageProps) {
  const [blocks, setBlocks] = useState<BlockEntry[]>(initialBlocks);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [crossCheckOpen, setCrossCheckOpen] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<BlockEntry | null>(null);

  const handleGenerate = () => {
    setGenerating(true); setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); setToastMsg('AI Recommendation RB-104 generated.'); setToastShow(true); }, 1500);
  };
  const handleManualBlock = (block: BlockEntry) => {
    setBlocks((prev) => [...prev, block]); setManualOpen(false);
    setToastMsg(`Block ${block.id} added.`); setToastShow(true);
  };

  const hours = Array.from({ length: HOURS_END - HOURS_START + 1 }, (_, i) => i);

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        {/* Main Gantt */}
        <div className="col-span-12 xl:col-span-9 space-y-3">
          {/* Action bar */}
          <div className="panel px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-blue-400" />
              <span className="panel-title">BLOCK PLANNING WORKSTATION</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCrossCheckOpen(true)} className="btn btn-outline btn-sm"><Train className="w-3.5 h-3.5" /> CROSS-CHECK TRAINS</button>
              <button onClick={() => setManualOpen(true)} className="btn btn-outline btn-sm"><Plus className="w-3.5 h-3.5" /> MANUAL BLOCK</button>
              <button onClick={handleGenerate} disabled={generating || generated} className="btn btn-primary btn-sm">
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {generating ? 'GENERATING...' : generated ? 'RB-104 READY' : 'GENERATE AI'}
              </button>
            </div>
          </div>

          {generating && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.12)' }}>
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <p className="text-[12px] text-text-secondary">Analyzing corridor constraints, train paths, and task compatibility...</p>
            </div>
          )}
          {generated && !generating && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(45,212,166,0.08)', border: '1px solid rgba(45,212,166,0.20)' }}>
              <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-success-400">AI Recommendation RB-104 Generated</p>
                <p className="text-[11px] text-text-secondary mt-0.5">JUC–PGW, KM 103–105, 17 Sep 14:00–17:00. 92% confidence.</p>
                <button onClick={() => onNavigate?.('dashboard')} className="text-[10px] text-blue-400 font-medium mt-1 flex items-center gap-1 hover:underline">View on Dashboard <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>
          )}

          {/* Gantt */}
          <div className="panel p-0 overflow-hidden">
            <div className="px-5 py-3" style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
              <span className="panel-title">WEEKLY GANTT — 14 SEP – 20 SEP</span>
            </div>
            <div className="overflow-x-auto p-4">
              <div style={{ minWidth: 800 }}>
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {[
                    { l: 'Engineering', c: '#3B9DFF' }, { l: 'S&T', c: '#21D4C2' }, { l: 'Traction/OHE', c: '#F6B84A' },
                    { l: 'AI Joint Block', c: '#2DD4A6' }, { l: 'Restricted Window', c: '#FF5B5B' },
                  ].map(({ l, c }) => (
                    <div key={l} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} /><span className="text-[10px] text-text-muted">{l}</span></div>
                  ))}
                </div>

                {/* Header row */}
                <div className="flex border-b" style={{ borderColor: 'rgba(59,157,255,0.10)' }}>
                  <div className="w-20 shrink-0 py-2 px-2 text-[10px] font-bold uppercase text-text-muted">Day</div>
                  <div className="flex-1 relative" style={{ width: (HOURS_END - HOURS_START) * HOUR_WIDTH }}>
                    {hours.filter((h) => h % 2 === 0).map((h) => (
                      <span key={h} className="absolute text-[9px] text-text-muted font-mono" style={{ left: h * HOUR_WIDTH - 8 }}>{String(h).padStart(2,'0')}</span>
                    ))}
                    <div className="h-5" />
                  </div>
                </div>

                {/* Day rows */}
                {weekDays.map((day) => {
                  const dayBlocks = blocks.filter((b) => b.day === day.short);
                  return (
                    <div key={day.short} className="flex border-b transition-colors hover:bg-surface-600" style={{ borderColor: 'rgba(59,157,255,0.04)' }}>
                      <div className="w-20 shrink-0 py-2 px-2"><p className="text-[12px] font-semibold text-text-primary">{day.short}</p><p className="text-[10px] text-text-muted">{day.date} Sep</p></div>
                      <div className="flex-1 relative py-1.5" style={{ width: (HOURS_END - HOURS_START) * HOUR_WIDTH, minHeight: 48 }}>
                        {hours.map((h) => <div key={h} className="absolute top-0 bottom-0" style={{ left: h * HOUR_WIDTH, width: 1, background: 'rgba(59,157,255,0.04)' }} />)}
                        {dayBlocks.map((block) => {
                          const left = (block.startHour - HOURS_START) * HOUR_WIDTH;
                          const width = Math.max((block.endHour - block.startHour) * HOUR_WIDTH, 50);
                          const colors = deptColors[block.department] ?? deptColors.Engineering;
                          if (block.isConflict) {
                            return (
                              <div key={block.id} onClick={() => setSelectedBlock(block)} className="absolute rounded-md px-2 py-1 cursor-pointer transition-all hover:z-10" style={{ left, width, top: 2, height: 20, background: 'rgba(255,91,91,0.12)', border: '1px dashed rgba(255,91,91,0.40)' }}>
                                <p className="text-[9px] font-bold text-critical-400 truncate">{block.title}</p>
                              </div>
                            );
                          }
                          return (
                            <div key={block.id} onClick={() => setSelectedBlock(block)} className={`absolute rounded-md px-2 py-1 cursor-pointer transition-all hover:z-10 hover:shadow-glow-sm ${block.isAI ? 'ring-1 ring-success-400/40' : ''}`} style={{ left, width, top: 2, height: 20, background: colors.bg, border: `1px solid ${colors.border}` }}>
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full" style={{ background: colors.dot }} />
                                <span className="text-[9px] font-mono font-bold text-text-primary truncate">{block.id}</span>
                                {block.isAI && <span className="text-[7px] font-bold text-success-400">AI</span>}
                              </div>
                              <p className={`text-[8px] truncate ${colors.text}`}>{block.title}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="col-span-12 xl:col-span-3 space-y-3">
          {/* AI Recommendations */}
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-success-400" /><span className="panel-title">AI RECOMMENDATIONS</span></div>
            <div className="rounded-lg p-3" style={{ background: 'rgba(45,212,166,0.08)', border: '1px solid rgba(45,212,166,0.20)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-text-primary">RB-104</span>
                <span className="text-[11px] font-bold text-success-400">92%</span>
              </div>
              <p className="text-[10px] text-text-secondary mb-2">JUC → PGW • KM 103–105 • 17 Sep 14:00–17:00</p>
              <div className="flex gap-1 mb-2">
                {aiRecommendation.departments.map((d) => <span key={d} className="badge badge-muted text-[9px]">{d.split('/')[0]}</span>)}
              </div>
              <button onClick={() => onNavigate?.('dashboard')} className="text-[10px] text-blue-400 font-medium hover:underline">View on Dashboard →</button>
            </div>
          </div>

          {/* Constraint summary */}
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4 text-blue-400" /><span className="panel-title">CONSTRAINT SUMMARY</span></div>
            <div className="space-y-1.5">
              {aiRecommendation.constraints.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-success-400 shrink-0" />
                  <span className="text-text-secondary">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="panel p-4">
            <span className="panel-title mb-3 block">QUICK STATS</span>
            <div className="space-y-2">
              <StatRow label="Total blocks" value={String(blocks.filter((b) => !b.isConflict).length)} />
              <StatRow label="AI optimized" value={String(blocks.filter((b) => b.isAI).length)} />
              <StatRow label="Restricted windows" value={String(blocks.filter((b) => b.isConflict).length)} />
              <StatRow label="Departments" value="3" />
            </div>
          </div>
        </div>
      </div>

      {/* Block detail modal */}
      <Modal open={!!selectedBlock} onClose={() => setSelectedBlock(null)} title={selectedBlock?.title ?? ''} subtitle={selectedBlock?.id} icon={<CalendarClock className="w-5 h-5" />} maxWidth="max-w-md"
        footer={<><button onClick={() => setSelectedBlock(null)} className="btn btn-ghost">Close</button><button onClick={() => { onNavigate?.('map'); setSelectedBlock(null); }} className="btn btn-primary"><Map className="w-4 h-4" /> CROSS-CHECK MAP</button></>}>
        {selectedBlock && (
          <div className="space-y-3">
            {selectedBlock.isConflict && <div className="px-3 py-2 rounded-lg text-[12px] text-critical-400" style={{ background: 'rgba(255,91,91,0.08)', border: '1px solid rgba(255,91,91,0.20)' }}>Protected train-path window. No block can be scheduled.</div>}
            {selectedBlock.isAI && <div className="px-3 py-2 rounded-lg text-[12px] text-success-400" style={{ background: 'rgba(45,212,166,0.08)', border: '1px solid rgba(45,212,166,0.20)' }}>AI Optimized Joint Block — 6 work packages across 3 departments.</div>}
            <div className="grid grid-cols-2 gap-2">
              <DetailField label="Block ID" value={selectedBlock.id} mono />
              <DetailField label="Department" value={selectedBlock.department} />
              <DetailField label="Start" value={formatHour(selectedBlock.startHour)} mono />
              <DetailField label="End" value={formatHour(selectedBlock.endHour)} mono />
              {selectedBlock.corridor && <DetailField label="Corridor" value={selectedBlock.corridor} />}
            </div>
            {selectedBlock.description && <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}><p className="section-label mb-1">Description</p><p className="text-[12px] text-text-secondary">{selectedBlock.description}</p></div>}
          </div>
        )}
      </Modal>

      <ManualBlockModal open={manualOpen} onClose={() => setManualOpen(false)} onCreate={handleManualBlock} existingCount={blocks.length} />
      <CrossCheckModal open={crossCheckOpen} onClose={() => setCrossCheckOpen(false)} onNavigate={onNavigate} />
      <Toast message={toastMsg} show={toastShow} onClose={() => setToastShow(false)} variant="success" />
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-[11px] text-text-muted">{label}</span><span className="text-[12px] font-bold text-text-primary">{value}</span></div>;
}
function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}><p className="section-label mb-0.5">{label}</p><p className={`text-[12px] font-semibold text-text-primary ${mono ? 'font-mono' : ''}`}>{value}</p></div>;
}

function ManualBlockModal({ open, onClose, onCreate, existingCount }: { open: boolean; onClose: () => void; onCreate: (b: BlockEntry) => void; existingCount: number }) {
  const [title, setTitle] = useState(''); const [corridor, setCorridor] = useState('Jalandhar Cantt–Phagwara'); const [day, setDay] = useState('Thu'); const [startTime, setStartTime] = useState('14:00'); const [endTime, setEndTime] = useState('17:00'); const [department, setDepartment] = useState('Engineering');
  const handleSubmit = () => { const toD = (t: string) => { const [h,m] = t.split(':').map(Number); return h + m/60; }; onCreate({ id: `B-${200+existingCount}`, title: title || 'Manual Block', department: department as BlockEntry['department'], day, startHour: toD(startTime), endHour: toD(endTime), description: `Manual block for ${corridor}.`, corridor }); setTitle(''); };
  return (
    <Modal open={open} onClose={onClose} title="Manual Block Request" subtitle="Create a new maintenance block" icon={<Plus className="w-5 h-5" />} maxWidth="max-w-lg"
      footer={<><button onClick={onClose} className="btn btn-ghost">Cancel</button><button onClick={handleSubmit} className="btn btn-success"><CheckCircle2 className="w-4 h-4" /> Submit</button></>}>
      <div className="space-y-3">
        <div><label className="section-label mb-1 block">Block Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Track Inspection Block" className="cmd-input w-full" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="section-label mb-1 block">Corridor</label><select value={corridor} onChange={(e) => setCorridor(e.target.value)} className="cmd-select w-full">{corridors.filter((c) => c !== 'All Corridors').map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="section-label mb-1 block">Department</label><select value={department} onChange={(e) => setDepartment(e.target.value)} className="cmd-select w-full">{departments.filter((d) => d !== 'All Departments').map((d) => <option key={d}>{d}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="section-label mb-1 block">Day</label><select value={day} onChange={(e) => setDay(e.target.value)} className="cmd-select w-full">{weekDays.map((d) => <option key={d.short} value={d.short}>{d.label}</option>)}</select></div>
          <div><label className="section-label mb-1 block">Start</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="cmd-input w-full" /></div>
          <div><label className="section-label mb-1 block">End</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="cmd-input w-full" /></div>
        </div>
      </div>
    </Modal>
  );
}

function CrossCheckModal({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate?: (page: string) => void }) {
  const conflict = trains.filter((t) => t.id === 'train-12425' || t.id === 'train-12903');
  const clear = trains.filter((t) => t.id === 'train-14681' || t.id === 'train-04592');
  return (
    <Modal open={open} onClose={onClose} title="Cross-check Train Schedule" subtitle="Block RB-104 vs active trains" icon={<Train className="w-5 h-5" />} maxWidth="max-w-lg"
      footer={<><button onClick={onClose} className="btn btn-ghost">Close</button><button onClick={() => { onClose(); onNavigate?.('map'); }} className="btn btn-primary"><Train className="w-4 h-4" /> OPEN MAP</button></>}>
      <div className="space-y-3">
        <div className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
          <p className="section-label mb-0.5">Block</p><p className="text-[12px] font-semibold text-text-primary">RB-104 • JUC → PGW • KM 103–105 • 17 Sep 14:00–17:00</p>
        </div>
        <div><p className="text-[10px] font-bold text-critical-400 mb-2">CONFLICT / ADJUSTMENT</p>{conflict.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg mb-1.5" style={{ background: 'rgba(255,91,91,0.08)', border: '1px solid rgba(255,91,91,0.20)' }}>
            <div><p className="text-[12px] font-semibold text-text-primary">T-{t.number} — {t.name}</p><p className="text-[10px] text-text-muted">KM {t.segmentStart}–{t.segmentEnd} • {t.status}</p></div>
            <span className="text-[10px] font-bold text-critical-400">{t.delay > 0 ? `+${t.delay}m` : 'PROTECTED'}</span>
          </div>
        ))}</div>
        <div><p className="text-[10px] font-bold text-success-400 mb-2">NO CONFLICT</p>{clear.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg mb-1.5" style={{ background: 'rgba(45,212,166,0.08)', border: '1px solid rgba(45,212,166,0.20)' }}>
            <div><p className="text-[12px] font-semibold text-text-primary">T-{t.number} — {t.name}</p><p className="text-[10px] text-text-muted">KM {t.segmentStart}–{t.segmentEnd}</p></div>
            <CheckCircle2 className="w-4 h-4 text-success-400" />
          </div>
        ))}</div>
      </div>
    </Modal>
  );
}

