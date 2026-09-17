import { useState } from 'react';
import { AIDecisionHero } from '@/components/dashboard/AIDecisionHero';
import { CorridorStatus } from '@/components/dashboard/CorridorStatus';
import { MetricStrip } from '@/components/dashboard/MetricStrip';
import { MiniCorridorMap } from '@/components/dashboard/MiniCorridorMap';
import { ExceptionsFeed } from '@/components/dashboard/ExceptionsFeed';
import { CorridorTimeline } from '@/components/dashboard/CorridorTimeline';
import { ConflictCheckModal } from '@/components/ConflictCheckModal';
import { Toast } from '@/components/Toast';
import { trains } from '@/data/mockData';

interface DashboardProps {
  onNavigate: (page: string, trainId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [approved, setApproved] = useState(false);
  const [crossCheckOpen, setCrossCheckOpen] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'info' | 'warning' | 'critical'>('success');

  const showToast = (msg: string, variant: 'success' | 'info' | 'warning' | 'critical' = 'success') => {
    setToastMsg(msg);
    setToastVariant(variant);
    setToastShow(true);
  };

  const handleApprove = () => {
    setApproved(true);
    showToast('Block RB-104 authorized. Added to active schedule.', 'success');
  };

  // Listen for safe-window switch via a custom event from AIDecisionHero
  // We use a callback approach: AIDecisionHero calls onSafeWindow when user clicks switch

  return (
    <div className="space-y-3 animate-fade-in">
      {/* ROW 1: Hero + Corridor Status */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-8">
          <AIDecisionHero
            approved={approved}
            onApprove={handleApprove}
            onOpenCrossCheck={() => setCrossCheckOpen(true)}
            onNavigate={onNavigate}
            onSafeWindow={() => showToast('Window shifted to avoid protected path. Ready for controller authorization.', 'success')}
          />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <CorridorStatus onNavigate={onNavigate} />
        </div>
      </div>

      {/* ROW 2: Metric strip */}
      <MetricStrip />

      {/* ROW 3: Mini map + Exceptions */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 xl:col-span-7">
          <MiniCorridorMap onNavigate={onNavigate} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <ExceptionsFeed onNavigate={onNavigate} />
        </div>
      </div>

      {/* ROW 4: 24h Timeline */}
      <CorridorTimeline onNavigate={onNavigate} />

      {/* Safety cross-check modal against train 12425 (most critical) */}
      <ConflictCheckModal
        open={crossCheckOpen}
        onClose={() => setCrossCheckOpen(false)}
        train={trains.find((t) => t.id === 'train-12425') ?? null}
      />

      <Toast message={toastMsg} show={toastShow} onClose={() => setToastShow(false)} variant={toastVariant} />
    </div>
  );
}
