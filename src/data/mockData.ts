export type Department = 'Engineering' | 'S&T' | 'Traction/OHE';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Compatible' | 'Scheduled' | 'Planned' | 'Completed';

export interface MaintenanceTask {
  id: string;
  workType: string;
  department: Department;
  corridor: string;
  location: string;
  priority: Priority;
  estimatedDuration: number;
  overdueDays: number;
  status: TaskStatus;
  compatibilityGroup?: string;
  description: string;
  assetId: string;
  lastMaintenance: string;
  assignedTeam?: string;
}

export interface BlockEntry {
  id: string;
  title: string;
  department: Department | 'AI Joint';
  day: string;
  startHour: number;
  endHour: number;
  isAI?: boolean;
  isConflict?: boolean;
  description?: string;
  corridor?: string;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel: string;
  trainId?: string;
}

export interface ConstraintCheck {
  label: string;
  passed: boolean;
}

export interface Station {
  code: string;
  name: string;
  km: number;
  major: boolean;
}

export interface MockTrain {
  id: string;
  number: string;
  name: string;
  direction: 'Toward Amritsar' | 'Toward Ludhiana';
  status: 'Running on time' | 'Train-path protected' | 'Running late';
  speed: number;
  lastStation: string;
  nextStation: string;
  etaNext: string;
  scheduledArrival: string;
  delay: number;
  segmentStart: number;
  segmentEnd: number;
  color: 'blue' | 'red' | 'orange';
  positionKm: number;
  description: string;
  timetable: { station: string; scheduled: string; estimated: string; status: 'departed' | 'on-time' | 'delayed' | 'protected' | 'upcoming' }[];
}

export const stations: Station[] = [
  { code: 'ASR', name: 'Amritsar Jn', km: 0, major: true },
  { code: 'BEAS', name: 'Beas', km: 43, major: false },
  { code: 'JUC', name: 'Jalandhar City', km: 78, major: true },
  { code: 'JRC', name: 'Jalandhar Cantt', km: 84, major: false },
  { code: 'PGW', name: 'Phagwara Jn', km: 103, major: false },
  { code: 'LDH', name: 'Ludhiana Jn', km: 161, major: true },
];

export const trains: MockTrain[] = [
  {
    id: 'train-14681',
    number: '14681',
    name: 'New Delhi–Amritsar Express',
    direction: 'Toward Amritsar',
    status: 'Running on time',
    speed: 78,
    lastStation: 'Beas',
    nextStation: 'Amritsar Jn',
    etaNext: '20:35',
    scheduledArrival: '20:35',
    delay: 0,
    segmentStart: 25,
    segmentEnd: 43,
    color: 'blue',
    positionKm: 34,
    description: 'Express service running on time between Beas and Amritsar Junction.',
    timetable: [
      { station: 'Ludhiana Jn', scheduled: '18:30', estimated: '18:30', status: 'departed' },
      { station: 'Phagwara Jn', scheduled: '19:10', estimated: '19:10', status: 'departed' },
      { station: 'Jalandhar Cantt', scheduled: '19:25', estimated: '19:25', status: 'departed' },
      { station: 'Jalandhar City', scheduled: '19:35', estimated: '19:35', status: 'departed' },
      { station: 'Beas', scheduled: '20:10', estimated: '20:10', status: 'departed' },
      { station: 'Amritsar Jn', scheduled: '20:35', estimated: '20:35', status: 'on-time' },
    ],
  },
  {
    id: 'train-12425',
    number: '12425',
    name: 'New Delhi–Amritsar Intercity',
    direction: 'Toward Amritsar',
    status: 'Train-path protected',
    speed: 0,
    lastStation: 'Jalandhar City',
    nextStation: 'Jalandhar Cantt',
    etaNext: '21:10',
    scheduledArrival: '21:10',
    delay: 0,
    segmentStart: 78,
    segmentEnd: 84,
    color: 'red',
    positionKm: 81,
    description: 'Train-path protected between Jalandhar City and Jalandhar Cantt. No maintenance block can be granted during this protected movement.',
    timetable: [
      { station: 'Ludhiana Jn', scheduled: '19:00', estimated: '19:00', status: 'departed' },
      { station: 'Phagwara Jn', scheduled: '19:40', estimated: '19:40', status: 'departed' },
      { station: 'Jalandhar Cantt', scheduled: '20:00', estimated: '21:10', status: 'protected' },
      { station: 'Jalandhar City', scheduled: '20:10', estimated: '20:10', status: 'departed' },
      { station: 'Beas', scheduled: '20:50', estimated: '21:50', status: 'upcoming' },
      { station: 'Amritsar Jn', scheduled: '21:20', estimated: '22:20', status: 'upcoming' },
    ],
  },
  {
    id: 'train-12903',
    number: '12903',
    name: 'Golden Temple Mail',
    direction: 'Toward Ludhiana',
    status: 'Running late',
    speed: 54,
    lastStation: 'Jalandhar Cantt',
    nextStation: 'Phagwara Jn',
    etaNext: '21:28',
    scheduledArrival: '21:10',
    delay: 18,
    segmentStart: 84,
    segmentEnd: 103,
    color: 'orange',
    positionKm: 93,
    description: 'Running 18 minutes late between Jalandhar Cantt and Phagwara Junction. Timing adjustment required for any block in this segment.',
    timetable: [
      { station: 'Amritsar Jn', scheduled: '19:00', estimated: '19:00', status: 'departed' },
      { station: 'Beas', scheduled: '19:40', estimated: '19:40', status: 'departed' },
      { station: 'Jalandhar City', scheduled: '20:20', estimated: '20:38', status: 'departed' },
      { station: 'Jalandhar Cantt', scheduled: '20:35', estimated: '20:53', status: 'departed' },
      { station: 'Phagwara Jn', scheduled: '21:10', estimated: '21:28', status: 'delayed' },
      { station: 'Ludhiana Jn', scheduled: '21:55', estimated: '22:13', status: 'upcoming' },
    ],
  },
  {
    id: 'train-04592',
    number: '04592',
    name: 'Amritsar–Ludhiana Passenger Special',
    direction: 'Toward Ludhiana',
    status: 'Running on time',
    speed: 42,
    lastStation: 'Phagwara Jn',
    nextStation: 'Ludhiana Jn',
    etaNext: '22:15',
    scheduledArrival: '22:15',
    delay: 0,
    segmentStart: 103,
    segmentEnd: 161,
    color: 'blue',
    positionKm: 130,
    description: 'Passenger special running on time between Phagwara and Ludhiana.',
    timetable: [
      { station: 'Amritsar Jn', scheduled: '20:00', estimated: '20:00', status: 'departed' },
      { station: 'Beas', scheduled: '20:40', estimated: '20:40', status: 'departed' },
      { station: 'Jalandhar City', scheduled: '21:10', estimated: '21:10', status: 'departed' },
      { station: 'Jalandhar Cantt', scheduled: '21:25', estimated: '21:25', status: 'departed' },
      { station: 'Phagwara Jn', scheduled: '21:50', estimated: '21:50', status: 'departed' },
      { station: 'Ludhiana Jn', scheduled: '22:15', estimated: '22:15', status: 'on-time' },
    ],
  },
];

export const kpis = [
  { id: 'active-blocks', label: 'Active Blocks', value: '08', subtitle: '2 joint blocks today', icon: 'CalendarClock', trend: '+2 from yesterday', trendUp: true, color: 'rail' as const },
  { id: 'pending-tasks', label: 'Pending Tasks', value: '42', subtitle: 'Across 3 departments', icon: 'ClipboardList', trend: '11 high priority', trendUp: false, color: 'navy' as const },
  { id: 'critical-assets', label: 'Critical Assets', value: '07', subtitle: 'Need maintenance attention', icon: 'AlertTriangle', trend: '+2 this week', trendUp: false, color: 'critical' as const },
  { id: 'block-utilization', label: 'Block Utilization', value: '78%', subtitle: 'Target is 85%', icon: 'BarChart3', trend: '+6% this month', trendUp: true, color: 'success' as const },
];

export const aiRecommendation = {
  id: 'RB-104',
  corridor: 'Jalandhar Cantt–Phagwara',
  location: 'KM 103–105',
  window: '17 Sep 2026, 14:00–17:00',
  day: 'Thursday 17 Sep',
  duration: 180,
  workPackages: 6,
  departments: ['Engineering', 'S&T', 'Traction/OHE'] as Department[],
  confidence: 92,
  priorityScore: 91,
  taskIds: ['TMS-2041', 'SMMS-087', 'TDMS-451', 'TMS-2042', 'SMMS-088', 'TDMS-452'],
  reasons: [
    'High-priority tasks are located near Jalandhar Cantt–Phagwara.',
    'Combining departments avoids separate block requests.',
    'Train movements are cross-checked using the synthetic schedule.',
    'Final approval requires no active protected train path or unsafe conflict.',
  ],
  constraints: [
    { label: 'Train-path protection', passed: true },
    { label: 'Corridor capacity', passed: true },
    { label: 'Engineering crew availability', passed: true },
    { label: 'S&T crew availability', passed: true },
    { label: 'Traction crew availability', passed: true },
    { label: 'Block duration limit', passed: true },
    { label: 'Cross-department compatibility', passed: true },
  ] as ConstraintCheck[],
};

export const tasks: MaintenanceTask[] = [
  { id: 'TMS-2041', workType: 'Rail Joint Inspection', department: 'Engineering', corridor: 'Jalandhar Cantt–Phagwara', location: 'KM 103', priority: 'Critical', estimatedDuration: 90, overdueDays: 9, status: 'Pending', compatibilityGroup: 'RB-104', description: 'Urgent inspection of rail joints at KM 103 following defect report. Ultrasonic testing required for 4 joints showing surface cracks. Speed restriction of 30 km/h currently in effect.', assetId: 'ENG-RJ-103-A', lastMaintenance: '12 Jun 2026', assignedTeam: 'Eng Crew Alpha-3' },
  { id: 'SMMS-087', workType: 'Signal Relay Testing', department: 'S&T', corridor: 'Jalandhar Cantt–Phagwara', location: 'KM 104', priority: 'High', estimatedDuration: 60, overdueDays: 4, status: 'Compatible', compatibilityGroup: 'RB-104', description: 'Routine relay testing for signal cabin SB-104. 12 relays due for continuity and insulation resistance testing. No train-path conflict in proposed joint window.', assetId: 'SNT-RL-104-SB', lastMaintenance: '28 Jul 2026', assignedTeam: 'S&T Team Beta-1' },
  { id: 'TDMS-451', workType: 'OHE Insulator Replacement', department: 'Traction/OHE', corridor: 'Jalandhar Cantt–Phagwara', location: 'KM 105', priority: 'High', estimatedDuration: 120, overdueDays: 5, status: 'Compatible', compatibilityGroup: 'RB-104', description: 'Replacement of 3 cracked porcelain insulators on OHE mast structure at KM 105. Requires traction power isolation. Compatible with engineering and S&T work in same corridor.', assetId: 'OHE-IN-105-M4', lastMaintenance: '05 Aug 2026', assignedTeam: 'Traction Crew Gamma-2' },
  { id: 'TMS-1998', workType: 'Sleeper Replacement', department: 'Engineering', corridor: 'Beas–Jalandhar', location: 'KM 66', priority: 'Medium', estimatedDuration: 180, overdueDays: 2, status: 'Scheduled', description: 'Replacement of 14 concrete sleepers in the KM 66 zone. Pre-scheduled for Saturday block window. Ballast tamping to follow.', assetId: 'ENG-SL-066-C', lastMaintenance: '15 May 2026', assignedTeam: 'Eng Crew Alpha-1' },
  { id: 'SMMS-091', workType: 'Point Machine Inspection', department: 'S&T', corridor: 'Jalandhar City', location: 'KM 78', priority: 'High', estimatedDuration: 75, overdueDays: 7, status: 'Pending', description: 'Full inspection of point machine PM-078 including motor current draw, blade gap measurement, and detection rod alignment. Overdue by 7 days.', assetId: 'SNT-PM-078-A', lastMaintenance: '10 Jul 2026', assignedTeam: 'S&T Team Beta-2' },
  { id: 'TDMS-468', workType: 'OHE Earthing Check', department: 'Traction/OHE', corridor: 'Phagwara–Ludhiana', location: 'KM 130', priority: 'Medium', estimatedDuration: 60, overdueDays: 0, status: 'Pending', description: 'Verification of OHE earthing resistance at 6 mast locations. All readings must be below 10 ohms. No overdue — scheduled within normal cycle.', assetId: 'OHE-EA-130-M2', lastMaintenance: '22 Aug 2026', assignedTeam: 'Traction Crew Gamma-1' },
  { id: 'TMS-2090', workType: 'Rail Lubrication', department: 'Engineering', corridor: 'Amritsar–Beas', location: 'KM 25', priority: 'Low', estimatedDuration: 45, overdueDays: 0, status: 'Planned', description: 'Routine rail side lubrication at curve approaches near KM 25. Friction reduction to minimize rail wear. Planned for next available block.', assetId: 'ENG-RL-025-C', lastMaintenance: '01 Sep 2026', assignedTeam: 'Eng Crew Alpha-2' },
  { id: 'SMMS-105', workType: 'Cable Continuity Test', department: 'S&T', corridor: 'Phagwara–Ludhiana', location: 'KM 140', priority: 'High', estimatedDuration: 80, overdueDays: 1, status: 'Pending', description: 'Continuity testing for signaling cable bundle SC-140. 48-core cable showing intermittent faults on cores 12, 27, and 31. Requires jointing bay access.', assetId: 'SNT-CB-140-JB', lastMaintenance: '18 Aug 2026', assignedTeam: 'S&T Team Beta-3' },
];

export const alerts: Alert[] = [
  { id: 'alert-1', severity: 'critical', title: 'Train-path conflict', message: 'Train 12425 train-path protection near Jalandhar City–Jalandhar Cantt (KM 78–84). No block can be granted during this protected movement.', actionLabel: 'View Conflict', trainId: 'train-12425' },
  { id: 'alert-2', severity: 'warning', title: 'Train delayed', message: 'Train 12903 (Golden Temple Mail) delayed by 18 minutes near Jalandhar Cantt–Phagwara. Timing adjustment required.', actionLabel: 'View Conflict', trainId: 'train-12903' },
  { id: 'alert-3', severity: 'warning', title: 'Overdue work', message: 'Three maintenance tasks overdue in the Jalandhar–Phagwara section. Immediate scheduling recommended.', actionLabel: 'View Tasks' },
  { id: 'alert-4', severity: 'info', title: 'Data update', message: 'New defect reports received for the Amritsar–Jalandhar corridor. 4 defects imported from TMS.', actionLabel: 'View Updates' },
];

export const weeklyBlocks: BlockEntry[] = [
  { id: 'B-101', title: 'Engineering Track Inspection', department: 'Engineering', day: 'Mon', startHour: 1.0, endHour: 4.0, description: 'Routine track geometry inspection, Amritsar–Beas section KM 20–40.', corridor: 'Amritsar–Beas' },
  { id: 'B-102', title: 'S&T Relay Testing', department: 'S&T', day: 'Tue', startHour: 13.0, endHour: 15.0, description: 'Signal relay testing at cabin SB-078 near Jalandhar City.', corridor: 'Beas–Jalandhar' },
  { id: 'CONFLICT-TUE', title: 'Train 12425 Protected Movement', department: 'AI Joint', day: 'Tue', startHour: 14.5, endHour: 15.25, isConflict: true, description: 'Protected train-path window — no block allowed. Train 12425 Jalandhar City–Cantt.', corridor: 'Jalandhar City–Cantt' },
  { id: 'B-103', title: 'Traction OHE Inspection', department: 'Traction/OHE', day: 'Wed', startHour: 2.0, endHour: 5.0, description: 'OHE alignment and contact wire inspection, Phagwara–Ludhiana KM 103–130.', corridor: 'Phagwara–Ludhiana' },
  { id: 'RB-104', title: 'AI Optimized Joint Block', department: 'AI Joint', day: 'Thu', startHour: 14.0, endHour: 17.0, isAI: true, description: 'Joint block combining 6 work packages across 3 departments. Jalandhar Cantt–Phagwara KM 103–105.', corridor: 'Jalandhar Cantt–Phagwara' },
  { id: 'B-105', title: 'Sleeper Replacement', department: 'Engineering', day: 'Sat', startHour: 0.5, endHour: 3.5, description: '14 sleeper replacements at KM 66 (Beas–Jalandhar) with ballast tamping.', corridor: 'Beas–Jalandhar' },
];

export const weekDays = [
  { short: 'Mon', label: 'Monday 14 Sep', date: 14 },
  { short: 'Tue', label: 'Tuesday 15 Sep', date: 15 },
  { short: 'Wed', label: 'Wednesday 16 Sep', date: 16 },
  { short: 'Thu', label: 'Thursday 17 Sep', date: 17 },
  { short: 'Fri', label: 'Friday 18 Sep', date: 18 },
  { short: 'Sat', label: 'Saturday 19 Sep', date: 19 },
  { short: 'Sun', label: 'Sunday 20 Sep', date: 20 },
];

export const corridors = ['All Corridors', 'Amritsar–Beas', 'Beas–Jalandhar', 'Jalandhar City', 'Jalandhar Cantt–Phagwara', 'Phagwara–Ludhiana'];
export const departments = ['All Departments', 'Engineering', 'S&T', 'Traction/OHE'];
export const priorities = ['All Priorities', 'Critical', 'High', 'Medium', 'Low'];
export const taskStatuses = ['All Statuses', 'Pending', 'Compatible', 'Scheduled', 'Planned', 'Completed'];

export const assetHealth = [
  { name: 'Track Assets', health: 86, detail: '3 critical inspections due', color: 'rail' as const, trend: [78, 80, 82, 81, 84, 85, 86], assets: [
    { id: 'ENG-RJ-103-A', name: 'Rail Joints KM 103', condition: 'Critical', lastInspection: '12 Jun 2026', defects: 4, recommendation: 'Immediate ultrasonic testing and joint replacement' },
    { id: 'ENG-SL-066-C', name: 'Sleepers KM 66', condition: 'Fair', lastInspection: '15 May 2026', defects: 14, recommendation: 'Sleeper replacement scheduled for Saturday block' },
    { id: 'ENG-RL-025-C', name: 'Rail Surface KM 25', condition: 'Good', lastInspection: '01 Sep 2026', defects: 0, recommendation: 'Routine lubrication planned' },
  ]},
  { name: 'Signal & Telecom', health: 91, detail: '1 relay-testing task overdue', color: 'success' as const, trend: [88, 89, 90, 89, 90, 91, 91], assets: [
    { id: 'SNT-RL-104-SB', name: 'Signal Relay Cabin SB-104', condition: 'Fair', lastInspection: '28 Jul 2026', defects: 2, recommendation: 'Relay testing compatible with RB-104' },
    { id: 'SNT-PM-078-A', name: 'Point Machine PM-078', condition: 'Poor', lastInspection: '10 Jul 2026', defects: 3, recommendation: 'Overdue inspection — schedule immediately' },
    { id: 'SNT-CB-140-JB', name: 'Cable Bundle SC-140', condition: 'Fair', lastInspection: '18 Aug 2026', defects: 3, recommendation: 'Continuity testing required on cores 12, 27, 31' },
  ]},
  { name: 'Traction / OHE', health: 74, detail: '3 OHE tasks need attention', color: 'warning' as const, trend: [82, 80, 78, 76, 75, 74, 74], assets: [
    { id: 'OHE-IN-105-M4', name: 'OHE Insulators KM 105', condition: 'Critical', lastInspection: '05 Aug 2026', defects: 3, recommendation: 'Cracked porcelain insulators — replace during RB-104' },
    { id: 'OHE-EA-130-M2', name: 'OHE Earthing KM 130', condition: 'Fair', lastInspection: '22 Aug 2026', defects: 1, recommendation: 'Routine earthing resistance check' },
    { id: 'OHE-CW-084-M1', name: 'Contact Wire KM 84', condition: 'Poor', lastInspection: '30 Jul 2026', defects: 2, recommendation: 'Wear exceeding threshold — plan replacement' },
  ]},
];

export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'map', label: 'Live Operations Map', icon: 'Map' },
  { id: 'schedule', label: 'Train Schedule', icon: 'TrainFront' },
  { id: 'tasks', label: 'Maintenance Tasks', icon: 'ClipboardList' },
  { id: 'planning', label: 'Block Planning', icon: 'CalendarClock' },
  { id: 'assets', label: 'Asset Health', icon: 'Activity' },
  { id: 'alerts', label: 'Conflicts & Alerts', icon: 'AlertTriangle' },
  { id: 'reports', label: 'Reports', icon: 'FileBarChart' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export const trainScheduleFilters = ['All Trains', 'Running On Time', 'Delayed', 'Train-Path Protected', 'Toward Amritsar', 'Toward Ludhiana'];

export function checkBlockConflict(train: MockTrain): { result: string; type: 'conflict' | 'adjustment' | 'clear'; explanation: string; alternativeWindow: string } {
  const blockStart = 103;
  const blockEnd = 105;
  if (train.id === 'train-12425') {
    return {
      result: 'Conflict detected — block cannot be granted during protected movement.',
      type: 'conflict',
      explanation: 'Train 12425 has an active train-path protection between KM 78–84. While this does not directly overlap KM 103–105, the protected movement window conflicts with the block timing on 17 Sep.',
      alternativeWindow: '17 Sep 2026, 17:30–20:00',
    };
  }
  if (train.id === 'train-12903') {
    return {
      result: 'Timing adjustment required — train delayed by 18 minutes.',
      type: 'adjustment',
      explanation: 'Train 12903 occupies segment KM 84–103 which is adjacent to the proposed block at KM 103–105. The 18-minute delay may push the train into the block window.',
      alternativeWindow: '17 Sep 2026, 17:30–20:00',
    };
  }
  return {
    result: 'No conflict in proposed block window.',
    type: 'clear',
    explanation: `Train ${train.number} occupies segment KM ${train.segmentStart}–${train.segmentEnd} which does not overlap with the proposed block at KM ${blockStart}–${blockEnd}.`,
    alternativeWindow: '17 Sep 2026, 17:30–20:00',
  };
}
