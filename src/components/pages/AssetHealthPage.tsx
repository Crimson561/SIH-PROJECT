import { useState } from 'react';
import { Activity, AlertCircle, TrendingDown, Wrench, History, ShieldCheck, ChevronRight } from 'lucide-react';
import { assetHealth } from '@/data/mockData';
import { ProgressBar, MiniTrend } from '@/components/ProgressBar';
import { Modal } from '@/components/Modal';

const colorMap: Record<string, { bar: string; text: string; bg: string; hex: string }> = {
  rail:    { bar: 'bg-blue-400',   text: 'text-blue-400',   bg: 'rgba(59,157,255,0.06)', hex: '#3B9DFF' },
  success: { bar: 'bg-success-400',text: 'text-success-400',bg: 'rgba(45,212,166,0.06)',hex: '#2DD4A6' },
  warning: { bar: 'bg-warning-400',text: 'text-warning-400',bg: 'rgba(246,184,74,0.06)', hex: '#F6B84A' },
};

const conditionBadge: Record<string, string> = {
  Critical: 'badge badge-critical', Poor: 'badge badge-warning', Fair: 'badge badge-blue', Good: 'badge badge-success',
};

export function AssetHealthPage() {
  const [selectedAsset, setSelectedAsset] = useState<typeof assetHealth[0] | null>(null);

  return (
    <>
      <div className="space-y-3">
        {/* Health bands */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {assetHealth.map((asset) => {
            const colors = colorMap[asset.color];
            return (
              <button key={asset.name} onClick={() => setSelectedAsset(asset)} className="panel p-4 text-left transition-all hover:shadow-panel-lg" style={{ border: `1px solid ${colors.hex}22` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-bold text-text-primary">{asset.name}</p>
                    <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{asset.detail}</p>
                  </div>
                  <MiniTrend data={asset.trend} color={colors.text} />
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className={`text-[28px] font-bold ${colors.text}`}>{asset.health}%</span>
                  <span className="text-[10px] text-text-muted">{asset.assets.length} assets</span>
                </div>
                <ProgressBar value={asset.health} color={colors.bar} height="h-1.5" glow />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-text-muted">Click for diagnostics</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Defect history */}
        <div className="panel p-0 overflow-hidden">
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(59,157,255,0.06)', borderBottom: '1px solid rgba(59,157,255,0.12)' }}>
            <History className="w-4 h-4 text-blue-400" /><span className="panel-title">RECENT DEFECT HISTORY</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[600px]">
              <thead><tr><th>Asset ID</th><th>Asset Name</th><th>Condition</th><th className="text-right">Defects</th><th>Last Inspection</th></tr></thead>
              <tbody>
                {assetHealth.flatMap((cat) => cat.assets.map((asset) => (
                  <tr key={asset.id} onClick={() => setSelectedAsset(cat)}>
                    <td className="font-mono text-text-primary font-semibold">{asset.id}</td>
                    <td className="text-text-secondary">{asset.name}</td>
                    <td><span className={conditionBadge[asset.condition]}>{asset.condition}</span></td>
                    <td className="text-right font-semibold text-text-primary">{asset.defects}</td>
                    <td className="text-text-muted">{asset.lastInspection}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset?.name ?? ''} subtitle="Asset diagnostics and recommendations" icon={<Activity className="w-5 h-5" />} maxWidth="max-w-2xl"
        footer={<button onClick={() => setSelectedAsset(null)} className="btn btn-primary">Close</button>}>
        {selectedAsset && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.06)', border: '1px solid rgba(59,157,255,0.10)' }}>
              <div className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-text-muted" /><span className="text-[12px] font-semibold text-text-primary">Health Score</span></div>
              <div className="flex items-baseline gap-1"><span className={`text-[28px] font-bold ${colorMap[selectedAsset.color].text}`}>{selectedAsset.health}%</span></div>
            </div>
            <div>
              <h4 className="panel-title mb-2">TRACKED ASSETS ({selectedAsset.assets.length})</h4>
              <div className="space-y-2">
                {selectedAsset.assets.map((asset) => (
                  <div key={asset.id} className="px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-[12px] font-semibold text-text-primary">{asset.name}</p><p className="text-[10px] text-text-muted font-mono">{asset.id}</p></div>
                      <span className={conditionBadge[asset.condition]}>{asset.condition}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-text-muted">Defects: </span><span className="font-semibold text-text-primary">{asset.defects}</span></div>
                      <div><span className="text-text-muted">Last Insp: </span><span className="font-medium text-text-secondary">{asset.lastInspection}</span></div>
                    </div>
                    <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(45,212,166,0.06)', border: '1px solid rgba(45,212,166,0.12)' }}>
                      <p className="text-[11px] text-success-400 flex items-start gap-1.5"><ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />{asset.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(59,157,255,0.04)', border: '1px solid rgba(59,157,255,0.08)' }}>
              <MiniTrend data={selectedAsset.trend} color={colorMap[selectedAsset.color].text} />
              <span className="text-[11px] text-text-muted">7-day health trend</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
