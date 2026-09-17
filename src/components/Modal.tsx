import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode | null;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, icon, children, footer, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,13,23,0.80)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div
        className={`w-full ${maxWidth} flex flex-col max-h-[90vh] animate-slide-up rounded-[12px] overflow-hidden`}
        style={{ background: '#10263A', border: '1px solid rgba(59,157,255,0.20)', boxShadow: '0 24px 64px rgba(0,0,0,0.60)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(59,157,255,0.12)', background: 'rgba(19,45,68,0.80)' }}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: 'rgba(59,157,255,0.12)', border: '1px solid rgba(59,157,255,0.20)' }}>
                <span className="text-blue-400">{icon}</span>
              </div>
            )}
            <div>
              <h2 className="text-[14px] font-bold text-text-primary leading-tight">{title}</h2>
              {subtitle && <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3.5 flex items-center justify-end gap-2.5 shrink-0"
            style={{ borderTop: '1px solid rgba(59,157,255,0.10)', background: 'rgba(8,27,45,0.60)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
