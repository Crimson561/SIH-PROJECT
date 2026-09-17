import { useState } from 'react';
import { Settings, Save, Bell, MapPin, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Toast } from '@/components/Toast';

export function SettingsPage() {
  const [division, setDivision] = useState('Amritsar–Ludhiana Demo Corridor');
  const [planningHorizon, setPlanningHorizon] = useState('7 days');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [conflictAlerts, setConflictAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [conflictBuffer, setConflictBuffer] = useState('30 minutes');
  const [toastShow, setToastShow] = useState(false);

  const handleSave = () => setToastShow(true);

  return (
    <>
      <div className="max-w-3xl space-y-3">
        <div className="panel px-5 py-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <span className="panel-title">SYSTEM SETTINGS</span>
        </div>

        {/* Corridor scope */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-blue-400" /><h4 className="text-[13px] font-bold text-text-primary">Corridor Scope</h4></div>
          <div className="space-y-3">
            <div><label className="section-label mb-1 block">Active Corridor / Division</label><select value={division} onChange={(e) => setDivision(e.target.value)} className="cmd-select w-full"><option>Amritsar–Ludhiana Demo Corridor</option><option>Firozpur Division</option><option>Delhi Division</option><option>Mumbai Division</option></select></div>
            <div><label className="section-label mb-1 block">Default Planning Horizon</label><select value={planningHorizon} onChange={(e) => setPlanningHorizon(e.target.value)} className="cmd-select w-full"><option>3 days</option><option>7 days</option><option>14 days</option><option>30 days</option></select></div>
          </div>
        </div>

        {/* Alert policy */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3"><Bell className="w-4 h-4 text-blue-400" /><h4 className="text-[13px] font-bold text-text-primary">Alert Policy</h4></div>
          <div className="space-y-2">
            <ToggleRow label="Enable notifications" description="Show in-app alerts for operational events" value={notifEnabled} onChange={setNotifEnabled} />
            <ToggleRow label="Email alerts" description="Send critical alerts to registered email" value={emailAlerts} onChange={setEmailAlerts} />
            <ToggleRow label="Conflict alerts" description="Immediate notification on train-path conflicts" value={conflictAlerts} onChange={setConflictAlerts} />
          </div>
        </div>

        {/* AI parameters */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-success-400" /><h4 className="text-[13px] font-bold text-text-primary">AI Optimization Parameters</h4></div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2"><label className="text-[12px] text-text-secondary font-medium">Confidence Threshold</label><span className="text-[14px] font-bold text-blue-400">{confidenceThreshold}%</span></div>
              <input type="range" min={50} max={100} value={confidenceThreshold} onChange={(e) => setConfidenceThreshold(Number(e.target.value))} className="w-full" style={{ accentColor: '#3B9DFF' }} />
              <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>50%</span><span>100%</span></div>
              <p className="text-[10px] text-text-muted mt-1">Minimum AI confidence score required before recommending a block.</p>
            </div>
            <div>
              <label className="section-label mb-1 block">Train-Delay Safety Buffer</label>
              <select value={conflictBuffer} onChange={(e) => setConflictBuffer(e.target.value)} className="cmd-select w-full"><option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option></select>
              <p className="text-[10px] text-text-muted mt-1">Minimum time buffer between train movements and block windows.</p>
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-2"><ShieldAlert className="w-4 h-4 text-critical-400" /><h4 className="text-[13px] font-bold text-text-primary">Safety & Compliance</h4></div>
          <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(255,91,91,0.06)', border: '1px solid rgba(255,91,91,0.15)' }}>
            <p className="text-[12px] text-critical-400">Human-in-the-loop approval is always required. The AI system can only recommend — final authorization remains with the Control Desk Officer.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn btn-primary"><Save className="w-4 h-4" /> Save Settings</button>
        </div>
      </div>

      <Toast message="Settings saved successfully." show={toastShow} onClose={() => setToastShow(false)} variant="success" />
    </>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div><p className="text-[12px] font-medium text-text-primary">{label}</p><p className="text-[10px] text-text-muted">{description}</p></div>
      <button onClick={() => onChange(!value)} className="relative w-10 h-5 rounded-full transition-colors" style={{ background: value ? '#3B9DFF' : 'rgba(59,157,255,0.15)' }}>
        <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform" style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }} />
      </button>
    </div>
  );
}
