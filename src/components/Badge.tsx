import type { Priority, TaskStatus } from '@/data/mockData';

const priorityMap: Record<Priority, { cls: string; dot?: string }> = {
  Critical: { cls: 'badge badge-critical', dot: 'animate-pulse' },
  High:     { cls: 'badge badge-warning' },
  Medium:   { cls: 'badge badge-blue' },
  Low:      { cls: 'badge badge-muted' },
};

const statusMap: Record<TaskStatus, string> = {
  Pending:    'badge badge-warning',
  Compatible: 'badge badge-cyan',
  Scheduled:  'badge badge-blue',
  Planned:    'badge badge-muted',
  Completed:  'badge badge-success',
};

const deptMap: Record<string, string> = {
  'Engineering':   'badge-blue',
  'S&T':           'badge-cyan',
  'Traction/OHE':  'badge-warning',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityMap[priority];
  return (
    <span className={cfg.cls}>
      {priority === 'Critical' && <span className={`w-1.5 h-1.5 rounded-full bg-critical-400 inline-block mr-0.5 ${cfg.dot ?? ''}`} />}
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={statusMap[status]}>{status}</span>;
}

export function DeptBadge({ department }: { department: string }) {
  const cls = deptMap[department] ?? 'badge-muted';
  return <span className={`badge ${cls}`}>{department}</span>;
}
