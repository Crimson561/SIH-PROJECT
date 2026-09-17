import { useState, useMemo, useEffect } from 'react';
import { Search, ClipboardList, Eye,Inbox, Plus, CheckCircle2, Clock, X } from 'lucide-react';
import { tasks, corridors, departments, priorities, taskStatuses, type MaintenanceTask, type TaskStatus, type Priority, type Department } from '@/data/mockData';
import { PriorityBadge, StatusBadge, DeptBadge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { ProgressBar } from '@/components/ProgressBar';

const priorityStrip: Record<Priority, string> = {
  Critical: '#FF5B5B', High: '#F6B84A', Medium: '#3B9DFF', Low: 'rgba(59,157,255,0.20)',
};
const priorityScore: Record<Priority, number> = { Critical: 95, High: 75, Medium: 50, Low: 25 };

interface MaintenanceTasksPageProps {
  extraTasks?: MaintenanceTask[];
}

export function MaintenanceTasksPage({ extraTasks = [] }: MaintenanceTasksPageProps) {
 const [taskList, setTaskList] = useState<MaintenanceTask[]>(tasks);
  useEffect(() => {
    fetch("http://localhost:5000/api/maintenance")
      .then((response) => response.json())
      .then((data) => {
        console.log("MAINTENANCE FROM BACKEND:", data);
         setTaskList([...extraTasks, ...data]);
      })
      .catch((error) => {
        console.error("MAINTENANCE API ERROR:", error);
      });
  }, [extraTasks]);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All Departments');
  const [priority, setPriority] = useState('All Priorities');
  const [status, setStatus] = useState('All Statuses');
  const [corridor, setCorridor] = useState('All Corridors');
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const allTasks = useMemo(() => [...extraTasks, ...taskList.filter((t) => !extraTasks.some((e) => e.id === t.id))], [extraTasks, taskList]);

  const filtered = useMemo(() => allTasks.filter((t) => {
    const ms = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.workType.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()) || t.assetId.toLowerCase().includes(search.toLowerCase());
    return ms && (dept === 'All Departments' || t.department === dept) && (priority === 'All Priorities' || t.priority === priority) && (status === 'All Statuses' || t.status === status) && (corridor === 'All Corridors' || t.corridor === corridor);
  }), [allTasks, search, dept, priority, status, corridor]);

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/maintenance/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update maintenance task");
      }

      const updatedTask = await response.json();

      setTaskList((prev) => prev.map((t) => t.id === taskId ? updatedTask : t));
      setSelectedTask((prev) => prev && prev.id === taskId ? updatedTask : prev);
      setToastMsg(`Task ${taskId} updated to ${newStatus}.`);
      setToastShow(true);
    } catch (error) {
      console.error("UPDATE MAINTENANCE ERROR:", error);
    }
  };

  const handleCreate = async (newTask: MaintenanceTask) => {
    try {
      const response = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to create maintenance task");
      }

      const createdTask = await response.json();

      setTaskList((prev) => [createdTask, ...prev]);

      setCreateOpen(false);
      setToastMsg(`Task ${createdTask.id} created successfully.`);
      setToastShow(true);
    } catch (error) {
      console.error("CREATE MAINTENANCE ERROR:", error);
    }
  };

  return (
    <>
      <div className="panel p-0 overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-400" />
            <span className="panel-title">WORK ORDER MANAGEMENT</span>
          </div>
          <button onClick={() => setCreateOpen(true)} className="btn btn-primary btn-sm"><Plus className="w-3.5 h-3.5" /> CREATE TASK</button>
        </div>

        {/* Summary strip */}
        <div className="px-5 py-2.5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(59,157,255,0.08)' }}>
          <span className="text-[11px] text-text-secondary">Pending: <span className="font-bold text-warning-400">{allTasks.filter((t) => t.status === 'Pending').length}</span></span>
          <span className="text-[11px] text-text-secondary">Scheduled: <span className="font-bold text-blue-400">{allTasks.filter((t) => t.status === 'Scheduled' || t.status === 'Compatible').length}</span></span>
          <span className="text-[11px] text-text-secondary">Completed: <span className="font-bold text-success-400">{allTasks.filter((t) => t.status === 'Completed').length}</span></span>
          <span className="text-[11px] text-text-secondary">Total: <span className="font-bold text-text-primary">{allTasks.length}</span></span>
        </div>

        {/* Filter toolbar */}
        <div className="px-5 py-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5" style={{ borderBottom: '1px solid rgba(59,157,255,0.08)' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search ID, asset, location..." value={search} onChange={(e) => setSearch(e.target.value)} className="cmd-input w-full pl-9" />
          </div>
          <FilterDropdown value={dept} onChange={setDept} options={departments} />
          <FilterDropdown value={priority} onChange={setPriority} options={priorities} />
          <FilterDropdown value={status} onChange={setStatus} options={taskStatuses} />
          <FilterDropdown value={corridor} onChange={setCorridor} options={corridors} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="w-8 h-8 text-text-disabled mb-2" />
              <p className="text-[13px] font-semibold text-text-secondary">No tasks found</p>
            </div>
          ) : (
            <table className="data-table min-w-[1000px]">
              <thead><tr>
                <th className="w-1"></th><th>Task ID</th><th>Asset / Work Type</th><th>Dept</th><th>Corridor</th><th>Location</th><th>Priority</th><th className="text-right">Duration</th><th className="text-right">Overdue</th><th>Status</th><th className="text-center">Action</th>
              </tr></thead>
              <tbody>
                {filtered.map((task) => (
                  <tr key={task.id}>
                    <td><div className="w-1 h-8 rounded-full" style={{ background: priorityStrip[task.priority] }} /></td>
                    <td className="font-mono font-semibold text-text-primary">{task.id}</td>
                    <td><p className="font-medium text-text-primary">{task.workType}</p><p className="text-[10px] text-text-muted font-mono">{task.assetId}</p></td>
                    <td><DeptBadge department={task.department} /></td>
                    <td className="text-text-secondary text-[12px]">{task.corridor}</td>
                    <td className="text-text-muted font-mono text-[11px]">{task.location}</td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td className="text-right text-text-secondary">{task.estimatedDuration}m</td>
                    <td className="text-right">{task.overdueDays > 0 ? <span className={`font-bold ${task.overdueDays > 7 ? 'text-critical-400' : 'text-warning-400'}`}>{task.overdueDays}d</span> : <span className="text-text-disabled">—</span>}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td className="text-center"><button onClick={() => setSelectedTask(task)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-blue-400 hover:bg-surface-600 transition-colors"><Eye className="w-3 h-3" /> VIEW</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Task inspector drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: 'rgba(4,13,23,0.60)' }} onClick={() => setSelectedTask(null)}>
          <div className="w-full max-w-md h-full overflow-y-auto animate-slide-up" style={{ background: '#10263A', borderLeft: '1px solid rgba(59,157,255,0.20)' }} onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-10" style={{ background: 'rgba(19,45,68,0.95)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ background: priorityStrip[selectedTask.priority] }} />
                <div>
                  <h3 className="text-[14px] font-bold text-text-primary">{selectedTask.workType}</h3>
                  <p className="text-[10px] text-text-muted font-mono">{selectedTask.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-600 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={selectedTask.priority} />
                <StatusBadge status={selectedTask.status} />
                <DeptBadge department={selectedTask.department} />
                {selectedTask.compatibilityGroup && <span className="badge badge-success">COMPAT: {selectedTask.compatibilityGroup}</span>}
              </div>

              {/* Priority score */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="section-label">Priority Score</span>
                  <span className="text-[14px] font-bold text-blue-400">{priorityScore[selectedTask.priority]}/100</span>
                </div>
                <ProgressBar value={priorityScore[selectedTask.priority]} color="bg-blue-400" height="h-1.5" glow />
              </div>

              <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
                <p className="section-label mb-1">Description</p>
                <p className="text-[12px] text-text-secondary leading-relaxed">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <DetailField label="Asset ID" value={selectedTask.assetId} mono />
                <DetailField label="Corridor" value={selectedTask.corridor} />
                <DetailField label="Location" value={selectedTask.location} mono />
                <DetailField label="Duration" value={`${selectedTask.estimatedDuration} min`} />
                <DetailField label="Overdue" value={selectedTask.overdueDays > 0 ? `${selectedTask.overdueDays} days` : 'Not overdue'} />
                <DetailField label="Last Maint." value={selectedTask.lastMaintenance} />
                <DetailField label="Assigned Team" value={selectedTask.assignedTeam ?? 'Unassigned'} />
                <DetailField label="Compat Group" value={selectedTask.compatibilityGroup ?? '—'} />
              </div>

              <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
                <p className="section-label mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['Pending', 'Scheduled', 'Completed'] as TaskStatus[]).map((s) => (
                    <button key={s} onClick={() => updateTaskStatus(selectedTask.id, s)} disabled={selectedTask.status === s}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${selectedTask.status === s ? 'bg-blue-400 text-surface-900 cursor-default' : 'text-text-secondary hover:bg-surface-600'}`}
                      style={selectedTask.status === s ? {} : { border: '1px solid rgba(59,157,255,0.10)' }}>
                      {s === 'Completed' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {s === 'Scheduled' && <Clock className="w-3 h-3 inline mr-1" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} existingCount={allTasks.length} />
      <Toast message={toastMsg} show={toastShow} onClose={() => setToastShow(false)} variant="success" />
    </>
  );
}

function CreateTaskModal({ open, onClose, onCreate, existingCount }: { open: boolean; onClose: () => void; onCreate: (t: MaintenanceTask) => void; existingCount: number }) {
  const [workType, setWorkType] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [corridor, setCorridor] = useState('Jalandhar Cantt–Phagwara');
  const [location, setLocation] = useState('KM 104');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [duration, setDuration] = useState(60);
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const newTask: MaintenanceTask = {
      id: `TMS-${3000 + existingCount}`, workType: workType || 'Custom Maintenance Task', department, corridor, location, priority,
      estimatedDuration: duration, overdueDays: 0, status: 'Pending',
      description: description || 'Custom created mock task for demonstration.',
      assetId: `MOCK-${Math.floor(Math.random() * 9999)}`, lastMaintenance: 'N/A', assignedTeam: 'Unassigned',
    };
    onCreate(newTask);
    setWorkType(''); setDescription(''); setDuration(60);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Mock Task" subtitle="Add a new maintenance task" icon={<Plus className="w-5 h-5" />} maxWidth="max-w-lg"
      footer={<><button onClick={onClose} className="btn btn-ghost">Cancel</button><button onClick={handleSubmit} className="btn btn-success"><CheckCircle2 className="w-4 h-4" /> Save Task</button></>}>
      <div className="space-y-3">
        <div><label className="section-label mb-1 block">Work Type</label><input type="text" value={workType} onChange={(e) => setWorkType(e.target.value)} placeholder="e.g. Track Inspection" className="cmd-input w-full" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="section-label mb-1 block">Department</label><select value={department} onChange={(e) => setDepartment(e.target.value as Department)} className="cmd-select w-full"><option value="Engineering">Engineering</option><option value="S&T">S&T</option><option value="Traction/OHE">Traction/OHE</option></select></div>
          <div><label className="section-label mb-1 block">Priority</label><select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="cmd-select w-full"><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="section-label mb-1 block">Corridor</label><select value={corridor} onChange={(e) => setCorridor(e.target.value)} className="cmd-select w-full"><option>Amritsar–Beas</option><option>Beas–Jalandhar</option><option>Jalandhar City</option><option>Jalandhar Cantt–Phagwara</option><option>Phagwara–Ludhiana</option></select></div>
          <div><label className="section-label mb-1 block">Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="cmd-input w-full" /></div>
        </div>
        <div><label className="section-label mb-1 block">Estimated Duration (minutes)</label><input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="cmd-input w-full" /></div>
        <div><label className="section-label mb-1 block">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief description..." className="cmd-input w-full resize-none" /></div>
      </div>
    </Modal>
  );
}

function FilterDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="cmd-select w-full">{options.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
}
function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}><p className="section-label mb-0.5">{label}</p><p className={`text-[12px] font-semibold text-text-primary ${mono ? 'font-mono' : ''}`}>{value}</p></div>;
}
