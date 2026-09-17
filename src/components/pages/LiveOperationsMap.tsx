import { useState, useEffect } from 'react';
import {
  Map as MapIcon, ZoomIn, ZoomOut, Maximize, X, Train, Clock,
  Gauge, Navigation, MapPin, CalendarClock, ShieldCheck, Layers, Info,
} from 'lucide-react';
import { stations, trains, aiRecommendation, type MockTrain } from '@/data/mockData';
import { ConflictCheckModal } from '@/components/ConflictCheckModal';

interface LiveOperationsMapProps {
  selectedTrainId?: string | null;
  onNavigate?: (page: string) => void;
}

const trainColorMap: Record<string, { hex: string; text: string }> = {
  blue:   { hex: '#3B9DFF', text: 'text-blue-400' },
  red:    { hex: '#FF5B5B', text: 'text-critical-400' },
  orange: { hex: '#F6B84A', text: 'text-warning-400' },
};

const statusBadge: Record<string, string> = {
  'Running on time': 'badge badge-success',
  'Train-path protected': 'badge badge-critical',
  'Running late': 'badge badge-warning',
};

const maxKm = 161;
const mapWidth = 980;
const mapHeight = 460;
const trackY = 260;
const padding = 60;
const kmToX = (km: number) => padding + (km / maxKm) * (mapWidth - padding * 2);

// Backward-compat alias so the drawer/progress-bar code below (unchanged)
// keeps working without modification.
const lineY = trackY;

// ── Train label-lane layout ──────────────────────────────────────────────
// Cards sit in one of two rows above the track so that closely spaced
// trains never overlap. A train is bumped to the far row only when it
// would otherwise sit within MIN_GAP px of its neighbour.
const CARD_W = 78;
const CARD_H = 36;
const ROW_NEAR_Y = trackY - 160; // card center, closer to the track
const ROW_FAR_Y = trackY - 215; // card center, further from the track
const MIN_GAP = 92;

function computeTrainRows(list: MockTrain[]): Record<string, 0 | 1> {
  const sorted = [...list].sort((a, b) => a.positionKm - b.positionKm);
  const rows: Record<string, 0 | 1> = {};
  let prevX = -Infinity;
  let prevRow: 0 | 1 = 0;
  for (const t of sorted) {
    const x = kmToX(t.positionKm);
    const row: 0 | 1 = x - prevX < MIN_GAP ? (prevRow === 0 ? 1 : 0) : 0;
    rows[t.id] = row;
    prevRow = row;
    prevX = x;
  }
  return rows;
}

export function LiveOperationsMap({ selectedTrainId, onNavigate }: LiveOperationsMapProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedTrain, setSelectedTrain] = useState<MockTrain | null>(
    selectedTrainId ? trains.find((t) => t.id === selectedTrainId) ?? null : null
  );
  const [conflictOpen, setConflictOpen] = useState(false);
  const [showLayers, setShowLayers] = useState(true);

  // Sync selected train when navigating from another page with a trainId
  useEffect(() => {
    if (selectedTrainId) {
      const train = trains.find((t) => t.id === selectedTrainId) ?? null;
      if (train) setSelectedTrain(train);
    }
  }, [selectedTrainId]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  // AI proposed work-zone boundaries (from the RB-104 recommendation data)
  const workZoneStart = 103, workZoneEnd = 105;
  const workZoneStartX = kmToX(workZoneStart), workZoneEndX = kmToX(workZoneEnd);

  // The train currently holding a protected path, and its segment bounds
  const protectedTrain = trains.find((t) => t.status === 'Train-path protected');
  const protectedStart = protectedTrain?.segmentStart ?? 78;
  const protectedEnd = protectedTrain?.segmentEnd ?? 84;
  const protectedStartX = kmToX(protectedStart), protectedEndX = kmToX(protectedEnd);

  const trainRows = computeTrainRows(trains);

  // Decorative flow chevrons at each corridor mid-span, skipped wherever
  // they'd fall inside the work zone or the protected-path segment.
  const flowArrowKms = stations.slice(0, -1).map((s, i) => (s.km + stations[i + 1].km) / 2)
    .filter((km) => !(km > workZoneStart - 3 && km < workZoneEnd + 3) && !(km > protectedStart - 3 && km < protectedEnd + 3));

  return (
    <div className="space-y-3">
      {/* Map panel */}
      <div className="panel p-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
          <div className="flex items-center gap-3">
            <MapIcon className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-[15px] font-bold text-text-primary leading-tight">LIVE CORRIDOR MAP</h3>
              <p className="text-[10px] text-text-muted mt-0.5">ASR → JUC → LDH • SYNTHETIC TELEMETRY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg font-mono text-[11px] text-blue-300" style={{ background: 'rgba(59,157,255,0.08)', border: '1px solid rgba(59,157,255,0.15)' }}>
              20:47 IST
            </div>
            <span className="badge badge-warning">SYNTHETIC</span>
          </div>
        </div>

        {/* Map area */}
        <div className="relative overflow-auto" style={{ background: '#071522', maxHeight: '68vh' }}>
          <div className="relative inline-block" style={{ minWidth: '100%' }}>
            <svg width={mapWidth * zoom} height={mapHeight * zoom} viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="block" style={{ transformOrigin: 'top left' }}>
              <defs>
                <pattern id="gridMap" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(59,157,255,0.05)" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="railGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B9DFF" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#21D4C2" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3B9DFF" stopOpacity="0.5" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <rect width={mapWidth} height={mapHeight} fill="url(#gridMap)" />

              {/* ── AI proposed work zone: a full-height closure band so it reads as a
                   distinct "slice" through the corridor, separate from the train lane ── */}
              <rect x={workZoneStartX} y={16} width={Math.max(workZoneEndX - workZoneStartX, 3)} height={trackY + 70 - 16}
                fill="rgba(45,212,166,0.08)" />
              <line x1={workZoneStartX} y1={16} x2={workZoneStartX} y2={trackY + 70} stroke="rgba(45,212,166,0.55)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1={workZoneEndX} y1={16} x2={workZoneEndX} y2={trackY + 70} stroke="rgba(45,212,166,0.55)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1={workZoneStartX} y1={16} x2={workZoneEndX} y2={16} stroke="rgba(45,212,166,0.35)" strokeWidth="1.5" />
              <line x1={workZoneStartX} y1={trackY + 70} x2={workZoneEndX} y2={trackY + 70} stroke="rgba(45,212,166,0.35)" strokeWidth="1.5" />
              <text x={(workZoneStartX + workZoneEndX) / 2} y={trackY + 92} textAnchor="middle" style={{ fontSize: '10px', fill: '#2DD4A6', fontWeight: 700, letterSpacing: '0.03em' }}>
                {aiRecommendation.id} PROPOSED WORK ZONE
              </text>
              <text x={(workZoneStartX + workZoneEndX) / 2} y={trackY + 105} textAnchor="middle" style={{ fontSize: '9px', fill: 'rgba(45,212,166,0.75)', fontFamily: 'JetBrains Mono' }}>
                KM {workZoneStart}–{workZoneEnd}
              </text>

              {/* ── Rail line ── */}
              <line x1={kmToX(0)} y1={trackY} x2={kmToX(maxKm)} y2={trackY} stroke="rgba(59,157,255,0.20)" strokeWidth="8" strokeLinecap="round" />
              <line x1={kmToX(0)} y1={trackY} x2={kmToX(maxKm)} y2={trackY} stroke="url(#railGlow)" strokeWidth="2.5" strokeLinecap="round" className="rail-pulse" />
              {/* Ties — subtle track segmentation */}
              {Array.from({ length: 46 }, (_, i) => {
                const x = kmToX((i / 46) * maxKm);
                return <line key={i} x1={x} y1={trackY - 5} x2={x} y2={trackY + 5} stroke="rgba(59,157,255,0.15)" strokeWidth="1" />;
              })}
              {/* Subtle bidirectional flow chevrons between stations */}
              {flowArrowKms.map((km) => {
                const x = kmToX(km);
                return (
                  <g key={`flow-${km}`} opacity="0.28">
                    <path d={`M ${x - 5} ${trackY - 3} L ${x + 1} ${trackY} L ${x - 5} ${trackY + 3}`} fill="none" stroke="#3B9DFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={`M ${x + 1} ${trackY - 3} L ${x + 7} ${trackY} L ${x + 1} ${trackY + 3}`} fill="none" stroke="#3B9DFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}
              {/* Corridor endpoint caps */}
              <line x1={kmToX(0)} y1={trackY - 11} x2={kmToX(0)} y2={trackY + 11} stroke="#3B9DFF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={kmToX(maxKm)} y1={trackY - 11} x2={kmToX(maxKm)} y2={trackY + 11} stroke="#3B9DFF" strokeWidth="2.5" strokeLinecap="round" />

              {/* ── Protected train path: highlighted directly on the rail, distinct
                   from the AI work-zone band above ── */}
              <line x1={protectedStartX} y1={trackY} x2={protectedEndX} y2={trackY} stroke="#FF5B5B" strokeWidth="5" strokeLinecap="round" opacity="0.85" filter="url(#glow)" />
              <line x1={protectedStartX} y1={trackY - 13} x2={protectedStartX} y2={trackY + 13} stroke="#FF5B5B" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />
              <line x1={protectedEndX} y1={trackY - 13} x2={protectedEndX} y2={trackY + 13} stroke="#FF5B5B" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />
              <text x={(protectedStartX + protectedEndX) / 2} y={trackY + 50} textAnchor="middle" style={{ fontSize: '10px', fill: '#FF5B5B', fontWeight: 700, letterSpacing: '0.03em' }}>
                PROTECTED PATH{protectedTrain ? ` · TRAIN ${protectedTrain.number}` : ''}
              </text>
              <text x={(protectedStartX + protectedEndX) / 2} y={trackY + 63} textAnchor="middle" style={{ fontSize: '9px', fill: 'rgba(255,91,91,0.75)', fontFamily: 'JetBrains Mono' }}>
                KM {protectedStart}–{protectedEnd}
              </text>

              {/* ── Stations: major names sit above the track, minor codes sit below,
                   so tightly-spaced stations (e.g. JUC/JRC) never collide ── */}
              {stations.map((st) => {
                const x = kmToX(st.km);
                return (
                  <g key={st.code}>
                    {st.major && <circle cx={x} cy={trackY} r="13" fill="rgba(59,157,255,0.10)" />}
                    <circle cx={x} cy={trackY} r={st.major ? 7 : 4} fill="#071522" stroke={st.major ? '#3B9DFF' : 'rgba(59,157,255,0.45)'} strokeWidth={st.major ? 2.5 : 1.5} />
                    {st.major ? (
                      <>
                        <text x={x} y={trackY - 34} textAnchor="middle" style={{ fontSize: '11px', fill: '#EAF2F8', fontWeight: 700 }}>{st.name}</text>
                        <text x={x} y={trackY - 20} textAnchor="middle" style={{ fontSize: '9px', fill: '#3B9DFF', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{st.code}</text>
                      </>
                    ) : (
                      <>
                        <text x={x} y={trackY + 30} textAnchor="middle" style={{ fontSize: '9px', fill: '#93A8BA', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>{st.code}</text>
                      </>
                    )}
                    {/* KM marker — kept subtle for every station */}
                    <text x={x} y={trackY + 16} textAnchor="middle" style={{ fontSize: '8px', fill: '#5E7A91', fontFamily: 'JetBrains Mono' }}>KM {st.km}</text>
                  </g>
                );
              })}

              {/* ── Trains: markers sit ON the track; small cards float ABOVE it in a
                   two-row lane with vertical connector lines, so labels never overlap ── */}
              {trains.map((train) => {
                const x = kmToX(train.positionKm);
                const c = trainColorMap[train.color].hex;
                const isSelected = selectedTrain?.id === train.id;
                const isProtected = train.status === 'Train-path protected';
                const cardY = trainRows[train.id] === 1 ? ROW_FAR_Y : ROW_NEAR_Y;
                const cardTop = cardY - CARD_H / 2;
                const speedLabel = train.speed > 0 ? `${train.speed} km/h` : 'HELD';
                return (
                  <g key={train.id} className="cursor-pointer" onClick={() => setSelectedTrain(train)}>
                    {/* connector line from the card down to the track marker */}
                    <line x1={x} y1={cardTop + CARD_H} x2={x} y2={trackY - 10} stroke={c} strokeWidth="1" strokeDasharray="2 2" opacity="0.55" />

                    {/* track-position marker */}
                    {isSelected && <circle cx={x} cy={trackY} r="13" fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" className="animate-pulse" />}
                    {isProtected && !isSelected && <circle cx={x} cy={trackY} r="12" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />}
                    <circle cx={x} cy={trackY} r="6" fill={c} className="train-blip" filter="url(#glow)" />
                    <path
                      d={train.direction === 'Toward Amritsar'
                        ? `M ${x - 4} ${trackY - 12} L ${x + 4} ${trackY - 12} L ${x} ${trackY - 18} Z`
                        : `M ${x - 4} ${trackY + 12} L ${x + 4} ${trackY + 12} L ${x} ${trackY + 18} Z`}
                      fill={c} opacity="0.85"
                    />

                    {/* label card */}
                    <rect x={x - CARD_W / 2} y={cardTop} width={CARD_W} height={CARD_H} rx="6"
                      fill="rgba(8,27,45,0.92)" stroke={c} strokeWidth={isSelected ? 1.75 : 1} opacity={isSelected ? 1 : 0.9} />
                    <rect x={x - CARD_W / 2} y={cardTop} width="3" height={CARD_H} rx="1.5" fill={c} />
                    <text x={x + 3} y={cardTop + 15} textAnchor="middle" style={{ fontSize: '10px', fill: '#EAF2F8', fontWeight: 700 }}>{train.number}</text>
                    <text x={x + 3} y={cardTop + 28} textAnchor="middle" style={{ fontSize: '8.5px', fill: c, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                      {isProtected ? 'PROTECTED' : train.status === 'Running late' ? `+${train.delay} MIN` : speedLabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            {showLayers && (
              <div className="absolute top-3 right-3 rounded-lg p-3 space-y-1.5" style={{ background: 'rgba(8,27,45,0.95)', border: '1px solid rgba(59,157,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <p className="section-label mb-1">LAYERS</p>
                {[
                  { c: '#3B9DFF', l: 'Running train' },
                  { c: '#2DD4A6', l: 'AI joint block zone' },
                  { c: '#FF5B5B', l: 'Protected train path' },
                  { c: '#F6B84A', l: 'Delayed train' },
                ].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: c }} />
                    <span className="text-[11px] text-text-secondary">{l}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Zoom + layers controls — one integrated toolbar */}
            <div className="absolute top-3 left-3 flex flex-col rounded-lg overflow-hidden" style={{ background: 'rgba(8,27,45,0.95)', border: '1px solid rgba(59,157,255,0.15)' }}>
              <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-surface-600" aria-label="Zoom in"><ZoomIn className="w-4 h-4 text-blue-400" /></button>
              <div style={{ height: 1, background: 'rgba(59,157,255,0.15)' }} />
              <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-surface-600" aria-label="Zoom out"><ZoomOut className="w-4 h-4 text-blue-400" /></button>
              <div style={{ height: 1, background: 'rgba(59,157,255,0.15)' }} />
              <button onClick={handleReset} className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-surface-600" aria-label="Reset zoom"><Maximize className="w-4 h-4 text-blue-400" /></button>
              <div style={{ height: 1, background: 'rgba(59,157,255,0.15)' }} />
              <button onClick={() => setShowLayers(!showLayers)} className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-surface-600" style={{ background: showLayers ? 'rgba(59,157,255,0.12)' : 'transparent' }} aria-label="Toggle layers"><Layers className="w-4 h-4 text-blue-400" /></button>
            </div>
          </div>
        </div>

        {/* Status ribbon */}
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(8,27,45,0.60)', borderTop: '1px solid rgba(59,157,255,0.10)' }}>
          <div className="flex items-center gap-4 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1.5"><Train className="w-3.5 h-3.5 text-blue-400" />4 active trains</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-critical-400" />1 protected path</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-warning-400" />1 delay</span>
            <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-success-400" />RB-104 awaiting validation</span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">UPDATED 20:47:03 IST</span>
        </div>
      </div>

      {/* Train telemetry drawer */}
      {selectedTrain && (
        <div className="panel p-0 overflow-hidden animate-slide-up">
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: `${trainColorMap[selectedTrain.color].hex}22`, border: `1px solid ${trainColorMap[selectedTrain.color].hex}44` }}>
                <Train className="w-5 h-5" style={{ color: trainColorMap[selectedTrain.color].hex }} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-text-primary leading-tight">Train {selectedTrain.number} — {selectedTrain.name}</h3>
                <p className="text-[10px] text-text-muted mt-0.5">SYNTHETIC TELEMETRY</p>
              </div>
            </div>
            <button onClick={() => setSelectedTrain(null)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={statusBadge[selectedTrain.status]}>{selectedTrain.status}</span>
              <span className="badge badge-muted">{selectedTrain.direction}</span>
              {selectedTrain.delay > 0 && <span className="badge badge-warning">+{selectedTrain.delay} MIN</span>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <DetailCard icon={<Gauge className="w-3.5 h-3.5" />} label="Speed" value={`${selectedTrain.speed} km/h`} />
              <DetailCard icon={<MapPin className="w-3.5 h-3.5" />} label="Last Station" value={selectedTrain.lastStation} />
              <DetailCard icon={<MapPin className="w-3.5 h-3.5" />} label="Next Station" value={selectedTrain.nextStation} />
              <DetailCard icon={<Clock className="w-3.5 h-3.5" />} label="ETA" value={selectedTrain.etaNext} />
              <DetailCard icon={<Navigation className="w-3.5 h-3.5" />} label="Segment" value={`KM ${selectedTrain.segmentStart}–${selectedTrain.segmentEnd}`} />
              <DetailCard icon={<Clock className="w-3.5 h-3.5" />} label="Delay" value={selectedTrain.delay > 0 ? `${selectedTrain.delay} min` : 'On time'} />
            </div>

            {/* Route progress */}
            <div>
              <p className="section-label mb-2">Route Progress</p>
              <div className="relative flex items-center justify-between px-2">
                <div className="absolute left-2 right-2 h-px" style={{ background: 'rgba(59,157,255,0.15)', top: '50%', transform: 'translateY(-50%)' }} />
                <div className="absolute h-px rounded-full" style={{ left: 8, width: `calc(${(selectedTrain.positionKm / maxKm) * 100}% - 16px)`, background: trainColorMap[selectedTrain.color].hex, top: '50%', transform: 'translateY(-50%)' }} />
                {stations.map((st) => {
                  const passed = selectedTrain.direction === 'Toward Ludhiana' ? selectedTrain.positionKm > st.km : selectedTrain.positionKm < st.km;
                  return (
                    <div key={st.code} className="relative z-10 flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full border-2`} style={{ background: passed ? trainColorMap[selectedTrain.color].hex : '#071522', borderColor: passed ? trainColorMap[selectedTrain.color].hex : 'rgba(59,157,255,0.20)' }} />
                      <span className="text-[8px] text-text-muted mt-1 font-mono">{st.code}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timetable */}
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(59,157,255,0.10)' }}>
              <table className="data-table">
                <thead><tr><th>Station</th><th className="text-right">Scheduled</th><th className="text-right">Estimated</th><th className="text-center">Status</th></tr></thead>
                <tbody>
                  {selectedTrain.timetable.map((stop) => (
                    <tr key={stop.station}>
                      <td className="font-medium text-text-primary">{stop.station}</td>
                      <td className="text-right text-text-muted font-mono">{stop.scheduled}</td>
                      <td className={`text-right font-mono font-medium ${stop.estimated !== stop.scheduled ? 'text-warning-400' : 'text-text-primary'}`}>{stop.estimated}</td>
                      <td className="text-center">
                        <span className={`text-[10px] font-bold uppercase ${
                          stop.status === 'departed' ? 'text-text-muted' :
                          stop.status === 'on-time' ? 'text-success-400' :
                          stop.status === 'delayed' ? 'text-warning-400' :
                          stop.status === 'protected' ? 'text-critical-400' : 'text-text-muted'
                        }`}>{stop.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate?.('schedule')} className="btn btn-outline flex-1"><CalendarClock className="w-4 h-4" /> OPEN SCHEDULE</button>
              <button onClick={() => setConflictOpen(true)} className="btn btn-primary flex-1"><ShieldCheck className="w-4 h-4" /> CHECK AGAINST RB-104</button>
              <button onClick={() => setSelectedTrain(null)} className="btn btn-ghost flex-1"><X className="w-4 h-4" /> CLOSE</button>
            </div>
          </div>
        </div>
      )}

      <ConflictCheckModal open={conflictOpen} onClose={() => setConflictOpen(false)} train={selectedTrain} />
    </div>
  );
}

function DetailCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
      <div className="flex items-center gap-1.5 text-text-muted mb-0.5">{icon}<span className="text-[10px]">{label}</span></div>
      <p className="text-[13px] font-semibold text-text-primary">{value}</p>
    </div>
  );
}
