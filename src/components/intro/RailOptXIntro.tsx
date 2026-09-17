import { ArrowRight, Cpu, Circle } from 'lucide-react';

interface RailOptXIntroProps {
  onEnter: () => void;
}

export function RailOptXIntro({ onEnter }: RailOptXIntroProps) {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden animate-fade-in"
      style={{ background: '#071522' }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 900px 520px at 50% 38%, rgba(59,157,255,0.14) 0%, rgba(59,157,255,0) 70%), radial-gradient(ellipse 700px 400px at 80% 85%, rgba(33,212,194,0.08) 0%, rgba(33,212,194,0) 70%)',
        }}
      />

      {/* Faint grid, control-room feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,157,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,157,255,0.05) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      {/* Decorative corridor line with moving blips */}
      <div className="absolute bottom-0 left-0 right-0 h-[160px] pointer-events-none">
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <line
            x1="0"
            y1="120"
            x2="1200"
            y2="120"
            stroke="#3B9DFF"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            className="rail-pulse"
          />
          <line
            x1="0"
            y1="126"
            x2="1200"
            y2="126"
            stroke="#21D4C2"
            strokeWidth="1"
            strokeOpacity="0.2"
            className="rail-pulse"
          />
          <circle cx="180" cy="120" r="5" fill="#3B9DFF" className="train-blip" />
          <circle cx="560" cy="120" r="5" fill="#21D4C2" className="train-blip" />
          <circle cx="940" cy="120" r="5" fill="#3B9DFF" className="train-blip" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center animate-slide-up">
        {/* Logo mark */}
        <div
          className="relative flex items-center justify-center w-20 h-20 rounded-[16px] mb-8"
          style={{
            background: 'linear-gradient(135deg,#1A3A55 0%,#0B1B2E 100%)',
            border: '1px solid rgba(59,157,255,0.35)',
            boxShadow:
              '0 0 40px rgba(59,157,255,0.20), 0 0 80px rgba(33,212,194,0.08)',
          }}
        >
          <Cpu className="w-8 h-8 text-blue-400 absolute" style={{ opacity: 0.25 }} />
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div
              className="w-10 h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg,#21D4C2,#3B9DFF)' }}
            />
            <div className="flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>
            <div
              className="w-10 h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg,#3B9DFF,#21D4C2)' }}
            />
          </div>
        </div>

        {/* Wordmark */}
        <h1
          className="text-[52px] sm:text-[64px] font-extrabold tracking-[0.06em] leading-none mb-4"
          style={{
            background: 'linear-gradient(90deg, #EAF2F8 0%, #9DCAFF 55%, #21D4C2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          RAILOPTX
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.16em] text-text-secondary max-w-[520px] mb-10">
          AI-Powered Integrated Maintenance Block Optimization
        </p>

        {/* Status strip */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-10"
          style={{
            background: 'rgba(45,212,166,0.06)',
            border: '1px solid rgba(45,212,166,0.18)',
          }}
        >
          <Circle className="w-2 h-2 fill-success-400 text-success-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-success-400">
            System Nominal
          </span>
          <span className="w-px h-3" style={{ background: 'rgba(94,122,145,0.3)' }} />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
            Corridor Network Online
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={onEnter}
          className="btn btn-primary px-8 py-3 text-[14px] tracking-wide"
        >
          Enter RailOptX
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer disclaimer */}
      <div className="absolute bottom-4 left-0 right-0 text-center px-6 z-10">
        <p className="text-[10px] text-text-disabled">
          Prototype using synthetic data • Human-in-the-loop approval required
        </p>
      </div>
    </div>
  );
}
