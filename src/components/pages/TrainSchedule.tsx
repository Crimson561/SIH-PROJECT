import { useState, useMemo, useEffect } from 'react';
import { Search, TrainFront, Eye, ShieldCheck, ArrowRight} from 'lucide-react';
import { trainScheduleFilters, trains, type MockTrain } from "@/data/mockData";
import { Modal } from '@/components/Modal';
import { ConflictCheckModal } from '@/components/ConflictCheckModal';

interface TrainScheduleProps {
  onNavigate?: (page: string, trainId?: string) => void;
}

const statusBadge: Record<string, string> = {
  'Running on time': 'badge badge-success',
  'Train-path protected': 'badge badge-critical',
  'Running late': 'badge badge-warning',
};

const trainHex: Record<string, string> = { blue: '#3B9DFF', red: '#FF5B5B', orange: '#F6B84A' };
const maxKm = 161;

export function TrainSchedule({ onNavigate }: TrainScheduleProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Trains');
  const [selectedTrain, setSelectedTrain] = useState<MockTrain | null>(null);
  const [conflictTrain, setConflictTrain] = useState<MockTrain | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [backendTrains, setBackendTrains] = useState<MockTrain[]>(trains);

 useEffect(() => {
   fetch("http://localhost:5000/api/trains")
     .then((response) => response.json())
     .then((data) => {
       console.log("TRAINS FROM BACKEND:", data);
       setBackendTrains(data);
     })
     .catch((error) => {
       console.error("TRAIN API ERROR:", error);
     });
 }, []);


  const filtered = useMemo(() => backendTrains.filter((t) => {
    const ms = !search || t.number.includes(search) || t.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All Trains' ||
      (filter === 'Running On Time' && t.status === 'Running on time') ||
      (filter === 'Delayed' && t.status === 'Running late') ||
      (filter === 'Train-Path Protected' && t.status === 'Train-path protected') ||
      (filter === 'Toward Amritsar' && t.direction === 'Toward Amritsar') ||
      (filter === 'Toward Ludhiana' && t.direction === 'Toward Ludhiana');
    return ms && mf;
  }), [search, filter , backendTrains]);

  return (
    <>
      <div className="panel p-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
          <div className="flex items-center gap-2">
            <TrainFront className="w-4 h-4 text-blue-400" />
            <span className="panel-title">TRAIN MOVEMENT BOARD</span>
          </div>
          <span className="badge badge-warning">SYNTHETIC</span>
        </div>

        {/* Summary strip */}
        <div className="px-5 py-2.5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(59,157,255,0.08)' }}>
          <span className="text-[11px] text-text-secondary">On time: <span className="font-bold text-success-400">2</span></span>
          <span className="text-[11px] text-text-secondary">Delayed: <span className="font-bold text-warning-400">1</span></span>
          <span className="text-[11px] text-text-secondary">Path protected: <span className="font-bold text-critical-400">1</span></span>
          <span className="text-[11px] text-text-secondary">Corridor capacity: <span className="font-bold text-blue-400">81%</span></span>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 flex flex-col md:flex-row gap-3" style={{ borderBottom: '1px solid rgba(59,157,255,0.08)' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search train number or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="cmd-input w-full pl-9" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trainScheduleFilters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${filter === f ? 'bg-blue-400 text-surface-900' : 'text-text-secondary hover:bg-surface-600'}`} style={filter === f ? {} : { border: '1px solid rgba(59,157,255,0.10)' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrainFront className="w-8 h-8 text-text-disabled mb-2" />
              <p className="text-[13px] font-semibold text-text-secondary">No trains found</p>
            </div>
          ) : (
            <table className="data-table min-w-[900px]">
              <thead><tr>
                <th>Train</th><th>Movement</th><th>Current Position</th><th>Next Stop</th><th className="text-right">Scheduled</th><th className="text-right">Predicted</th><th className="text-center">Variance</th><th>Progress</th><th>Status</th><th className="text-center">Action</th>
              </tr></thead>
              <tbody>
                {filtered.map((train) => (
                  <tr key={train.id} onClick={() => setSelectedTrain(train)}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: trainHex[train.color] }} />
                        <div>
                          <p className="font-mono font-bold text-text-primary">{train.number}</p>
                          <p className="text-[10px] text-text-muted">{train.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-[11px] text-text-secondary">{train.direction === 'Toward Amritsar' ? '← ASR' : 'LDH →'}</td>
                    <td className="text-text-secondary">{train.lastStation}</td>
                    <td className="text-text-secondary">{train.nextStation}</td>
                    <td className="text-right text-text-muted font-mono">{train.scheduledArrival}</td>
                    <td className={`text-right font-mono font-medium ${train.delay > 0 ? 'text-warning-400' : 'text-text-primary'}`}>{train.etaNext}</td>
                    <td className="text-center">{train.delay > 0 ? <span className="text-warning-400 font-bold text-[11px]">+{train.delay}m</span> : train.status === 'Train-path protected' ? <span className="text-critical-400 font-bold text-[10px]">PROT</span> : <span className="text-success-400 font-bold text-[10px]">ON TIME</span>}</td>
                    <td>
                      <div className="relative w-20 h-1.5 rounded-full" style={{ background: 'rgba(59,157,255,0.10)' }}>
                        <div className="absolute h-full rounded-full" style={{ width: `${(train.positionKm / maxKm) * 100}%`, background: trainHex[train.color] }} />
                      </div>
                    </td>
                    <td><span className={statusBadge[train.status]}>{train.status === 'Running on time' ? 'ON TIME' : train.status === 'Train-path protected' ? 'PROTECTED' : 'DELAYED'}</span></td>
                    <td className="text-center">
                      <button onClick={(e) => { e.stopPropagation(); onNavigate?.('map', train.id); }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-blue-400 hover:bg-surface-600 transition-colors">
                        <Eye className="w-3 h-3" /> MAP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!selectedTrain} onClose={() => setSelectedTrain(null)} title={selectedTrain ? `Train ${selectedTrain.number}` : ''} subtitle={selectedTrain?.name} icon={<TrainFront className="w-5 h-5" />} maxWidth="max-w-xl"
        footer={<>
          <button onClick={() => setSelectedTrain(null)} className="btn btn-ghost">Close</button>
          <button onClick={() => { setConflictTrain(selectedTrain); setConflictOpen(true); }} className="btn btn-cyan"><ShieldCheck className="w-4 h-4" /> CROSS-CHECK BLOCK</button>
          <button onClick={() => { const tid = selectedTrain?.id ?? null; setSelectedTrain(null); onNavigate?.('map', tid ?? undefined); }} className="btn btn-primary"><ArrowRight className="w-4 h-4" /> VIEW ON MAP</button>
        </>}>
        {selectedTrain && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={statusBadge[selectedTrain.status]}>{selectedTrain.status}</span>
              <span className="badge badge-muted">{selectedTrain.direction}</span>
            </div>
            <div>
              <p className="section-label mb-2">Full Route Timetable</p>
              <div className="space-y-0">
                {selectedTrain.timetable.map((stop, i) => (
                  <div key={stop.station} className="flex items-center gap-3 py-2">
                    <div className="relative flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full border-2" style={{
                        background: stop.status === 'departed' ? '#3B9DFF' : stop.status === 'on-time' ? '#2DD4A6' : stop.status === 'delayed' ? '#F6B84A' : stop.status === 'protected' ? '#FF5B5B' : '#071522',
                        borderColor: stop.status === 'departed' ? '#3B9DFF' : stop.status === 'on-time' ? '#2DD4A6' : stop.status === 'delayed' ? '#F6B84A' : stop.status === 'protected' ? '#FF5B5B' : 'rgba(59,157,255,0.20)',
                      }} />
                      {i < selectedTrain.timetable.length - 1 && <div className="absolute top-3 w-px h-6" style={{ background: 'rgba(59,157,255,0.10)' }} />}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-[12px] font-semibold text-text-primary">{stop.station}</p>
                      <div className="flex items-center gap-4">
                        <div className="text-right"><p className="text-[9px] text-text-muted">Scheduled</p><p className="text-[12px] font-mono text-text-muted">{stop.scheduled}</p></div>
                        <div className="text-right"><p className="text-[9px] text-text-muted">Estimated</p><p className={`text-[12px] font-mono font-medium ${stop.estimated !== stop.scheduled ? 'text-warning-400' : 'text-text-primary'}`}>{stop.estimated}</p></div>
                        <span className={`text-[10px] font-bold uppercase w-20 text-center ${stop.status === 'departed' ? 'text-text-muted' : stop.status === 'on-time' ? 'text-success-400' : stop.status === 'delayed' ? 'text-warning-400' : stop.status === 'protected' ? 'text-critical-400' : 'text-text-muted'}`}>{stop.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConflictCheckModal open={conflictOpen} onClose={() => setConflictOpen(false)} train={conflictTrain} />
    </>
  );
}
