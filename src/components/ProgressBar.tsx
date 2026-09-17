interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  glow?: boolean;
}

export function ProgressBar({ value, max = 100, color = 'bg-blue-400', height = 'h-1.5', glow }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full ${height} rounded-full overflow-hidden`} style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{
          width: `${pct}%`,
          ...(glow ? { boxShadow: '0 0 6px currentColor' } : {}),
        }}
      />
    </div>
  );
}

const sparkId = (() => { let i = 0; return () => ++i; })();

export function MiniTrend({ data, color = 'text-blue-400' }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const id = `sp-${sparkId()}`;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const W = 72, H = 24;
  const px = (i: number) => (i / (data.length - 1)) * W;
  const py = (v: number) => H - ((v - min) / range) * H;
  const points = data.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  const areaPoints = `0,${H} ${points} ${W},${H}`;
  // resolve color class to hex
  const colorHex = color.includes('blue') ? '#3B9DFF'
    : color.includes('cyan') ? '#21D4C2'
    : color.includes('success') ? '#2DD4A6'
    : color.includes('warning') ? '#F6B84A'
    : color.includes('critical') ? '#FF5B5B'
    : '#3B9DFF';

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorHex} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colorHex} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={colorHex} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(data.length - 1)} cy={py(data[data.length - 1])} r="2.5" fill={colorHex} />
    </svg>
  );
}
