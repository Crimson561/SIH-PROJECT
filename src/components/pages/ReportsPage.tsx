import { useState } from 'react';
import { FileBarChart, Download, TrendingUp, TrendingDown, Clock, Users, BarChart3, Eye, Calendar } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { ProgressBar, MiniTrend } from '@/components/ProgressBar';

const reports = [
  { id: 'block-utilization', title: 'Block Utilization', description: 'Weekly block window utilization across all corridors.', icon: BarChart3, color: 'blue' as const, metrics: { current: 78, target: 85, unit: '%' }, trend: [70,72,71,74,75,77,78], details: [{l:'Total block windows',v:'12'},{l:'Utilized',v:'9'},{l:'AI-optimized',v:'2'},{l:'Unused capacity',v:'22%'}] },
  { id: 'overdue-reduction', title: 'Overdue Task Reduction', description: 'Tracking overdue maintenance tasks week over week.', icon: TrendingDown, color: 'success' as const, metrics: { current: 42, target: 30, unit: ' tasks' }, trend: [55,52,48,46,44,43,42], details: [{l:'Cleared this week',v:'13'},{l:'Still overdue',v:'42'},{l:'Reduction rate',v:'23%'},{l:'Critical remaining',v:'3'}] },
  { id: 'planned-vs-actual', title: 'Planned vs Actual', description: 'Planned maintenance windows vs actual execution.', icon: Clock, color: 'warning' as const, metrics: { current: 87, target: 95, unit: '%' }, trend: [82,84,83,85,86,86,87], details: [{l:'Planned blocks',v:'12'},{l:'On time',v:'10'},{l:'Delayed',v:'2'},{l:'On-time rate',v:'83%'}] },
  { id: 'dept-coordination', title: 'Dept Coordination', description: 'Cross-department joint block efficiency.', icon: Users, color: 'navy' as const, metrics: { current: 91, target: 100, unit: '%' }, trend: [85,87,88,89,90,90,91], details: [{l:'Joint blocks',v:'2'},{l:'Departments',v:'3'},{l:'Conflict-free',v:'95%'},{l:'Score',v:'91/100'}] },
];

const colorMap: Record<string, { bar: string; text: string; hex: string }> = {
  rail:    { bar: 'bg-blue-400',    text: 'text-blue-400',    hex: '#3B9DFF' },
  success: { bar: 'bg-success-400', text: 'text-success-400', hex: '#2DD4A6' },
  warning: { bar: 'bg-warning-400', text: 'text-warning-400', hex: '#F6B84A' },
  navy:    { bar: 'bg-blue-400',    text: 'text-blue-300',    hex: '#6AACFF' },
};

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('14 Sep – 20 Sep 2026');
  const [toastShow, setToastShow] = useState(false);
  const [detailReport, setDetailReport] = useState<typeof reports[0] | null>(null);

  const handleExport = () => setToastShow(true);

  return (
    <>
      <div className="space-y-3">
        {/* Date range bar */}
        <div className="panel px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2"><FileBarChart className="w-4 h-4 text-blue-400" /><span className="panel-title">OPERATIONAL REPORTS</span></div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-muted" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="cmd-select">
              <option>14 Sep – 20 Sep 2026</option><option>07 Sep – 13 Sep 2026</option><option>01 Sep – 06 Sep 2026</option><option>Aug 2026 (Monthly)</option>
            </select>
            <button onClick={handleExport} className="btn btn-primary btn-sm"><Download className="w-3.5 h-3.5" /> EXPORT ALL</button>
          </div>
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reports.map((report) => {
            const colors = colorMap[report.color];
            const Icon = report.icon;
            return (
              <div key={report.id} className="panel p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: `${colors.hex}11`, border: `1px solid ${colors.hex}33` }}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div><h4 className="text-[13px] font-bold text-text-primary">{report.title}</h4><p className="text-[10px] text-text-muted mt-0.5">{report.description}</p></div>
                  </div>
                  <MiniTrend data={report.trend} color={colors.text} />
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className={`text-[26px] font-bold ${colors.text}`}>{report.metrics.current}<span className="text-[14px] text-text-muted">{report.metrics.unit}</span></span>
                  <span className="text-[10px] text-text-muted">Target: {report.metrics.target}{report.metrics.unit}</span>
                </div>
                <ProgressBar value={report.metrics.current} max={report.metrics.target} color={colors.bar} height="h-1.5" glow />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {report.details.map((d) => (
                    <div key={d.l} className="px-2.5 py-1.5 rounded-md" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.06)' }}>
                      <p className="text-[10px] text-text-muted">{d.l}</p><p className="text-[12px] font-semibold text-text-primary">{d.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => setDetailReport(report)} className="btn btn-outline btn-sm flex-1"><Eye className="w-3.5 h-3.5" /> VIEW DETAIL</button>
                  <button onClick={handleExport} className="btn btn-ghost btn-sm flex-1"><Download className="w-3.5 h-3.5" /> EXPORT</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={!!detailReport} onClose={() => setDetailReport(null)} title={detailReport?.title ?? ''} subtitle={`${dateRange} • Detailed breakdown`} icon={<FileBarChart className="w-5 h-5" />} maxWidth="max-w-xl"
        footer={<><button onClick={() => setDetailReport(null)} className="btn btn-ghost">Close</button><button onClick={handleExport} className="btn btn-primary"><Download className="w-4 h-4" /> Export Report</button></>}>
        {detailReport && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
              <span className="text-[12px] font-semibold text-text-primary">Current Performance</span>
              <span className={`text-[24px] font-bold ${colorMap[detailReport.color].text}`}>{detailReport.metrics.current}<span className="text-[12px] text-text-muted">{detailReport.metrics.unit}</span></span>
            </div>
            <div><h4 className="panel-title mb-2">PERFORMANCE BREAKDOWN</h4><div className="space-y-1.5">{detailReport.details.map((d) => (
              <div key={d.l} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
                <span className="text-[12px] text-text-secondary">{d.l}</span><span className="text-[12px] font-bold text-text-primary">{d.v}</span>
              </div>
            ))}</div></div>
            <div className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
              <MiniTrend data={detailReport.trend} color={colorMap[detailReport.color].text} />
              <div className="text-right"><p className="text-[10px] text-text-muted">Trend</p><p className={`text-[12px] font-semibold ${colorMap[detailReport.color].text}`}>{detailReport.trend[detailReport.trend.length-1] > detailReport.trend[0] ? 'Improving' : 'Stable'}</p></div>
            </div>
            <p className="text-[10px] text-text-muted italic">Report generated from synthetic demo data. Not for operational use.</p>
          </div>
        )}
      </Modal>

      <Toast message="Report export prepared for demo." show={toastShow} onClose={() => setToastShow(false)} variant="info" />
    </>
  );
}
