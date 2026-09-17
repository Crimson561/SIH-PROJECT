import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  variant?: 'success' | 'info' | 'warning' | 'critical';
}

const variants = {
  success:  { icon: CheckCircle2, color: 'text-success-400', border: 'rgba(45,212,166,0.30)', bg: 'rgba(45,212,166,0.08)', bar: '#2DD4A6' },
  info:     { icon: Info,         color: 'text-blue-400',    border: 'rgba(59,157,255,0.30)', bg: 'rgba(59,157,255,0.08)', bar: '#3B9DFF' },
  warning:  { icon: AlertTriangle,color: 'text-warning-300', border: 'rgba(246,184,74,0.30)', bg: 'rgba(246,184,74,0.08)', bar: '#F6B84A' },
  critical: { icon: AlertTriangle,color: 'text-critical-400',border: 'rgba(255,91,91,0.30)',  bg: 'rgba(255,91,91,0.08)',  bar: '#FF5B5B' },
};

export function Toast({ message, show, onClose, variant = 'success' }: ToastProps) {
  const v = variants[variant];
  const Icon = v.icon;

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-[10px] animate-slide-up min-w-[280px] max-w-sm"
      style={{ background: '#10263A', border: `1px solid ${v.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.50)' }}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: v.bar }} />

      <Icon className={`w-4 h-4 ${v.color} shrink-0`} />
      <p className="flex-1 text-[13px] text-text-primary font-medium pr-2">{message}</p>
      <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
