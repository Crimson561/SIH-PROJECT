import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Cpu,
  Layers,
  Network,
  ShieldCheck,
  GaugeCircle,
  UserCheck,
  Database,
  ListOrdered,
  Puzzle,
  Shield,
  Sliders,
  ClipboardCheck,
  FileCheck2,
  UserRound,
} from 'lucide-react';

interface AboutRailOptXPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const whatWeBuilt = [
  {
    icon: Layers,
    text: 'Brings maintenance requirements, asset information and train operations into one planning environment.',
  },
  {
    icon: Puzzle,
    text: 'Identifies compatible cross-department maintenance activities.',
  },
  {
    icon: Network,
    text: 'Checks train-path and corridor constraints.',
  },
  {
    icon: GaugeCircle,
    text: 'Helps plan and utilize maintenance blocks efficiently.',
  },
  {
    icon: UserCheck,
    text: 'Keeps the responsible human operator in the approval loop.',
  },
];

const workflowSteps = [
  { icon: Database, label: 'Maintenance Data' },
  { icon: ListOrdered, label: 'Prioritize Tasks' },
  { icon: Puzzle, label: 'Find Compatible Work' },
  { icon: Shield, label: 'Check Constraints' },
  { icon: Sliders, label: 'Optimize Block' },
  { icon: ClipboardCheck, label: 'Human Review' },
  { icon: FileCheck2, label: 'Final Maintenance Plan' },
];

const team = [
  { name: 'Deepak Banga', role: 'Team Lead/backend' },
  { name: 'Pratyush Kapoor', role: 'frontend/api integration' },
  { name: 'Niyati Gupta', role: 'Ui/UX Designer' },
  { name: 'Damanpreet Kaur', role: 'Data Analyst' },
  { name: 'Devansh', role: 'Workflow Specialist' },
  { name: 'Alankrita Garg', role:'Presenter'},
];

export function AboutRailOptXPage({ onBack, onContinue }: AboutRailOptXPageProps) {
  return (
    <div className="min-h-screen w-full animate-fade-in" style={{ background: '#071522' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-10 py-4"
        style={{
          background: 'rgba(7,21,34,0.85)',
          borderBottom: '1px solid rgba(59,157,255,0.10)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-text-secondary">
            RailOptX
          </span>
        </div>
        <button onClick={onContinue} className="btn btn-primary btn-sm">
          Enter Command Center
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-[880px] mx-auto px-6 sm:px-10 pb-24">
        {/* 1. HERO */}
        <section className="pt-16 pb-14 text-center animate-slide-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(59,157,255,0.08)',
              border: '1px solid rgba(59,157,255,0.20)',
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-300">
              About the Project
            </span>
          </div>
          <h1
            className="text-[36px] sm:text-[44px] font-extrabold leading-tight mb-4"
            style={{
              background: 'linear-gradient(90deg, #EAF2F8 0%, #9DCAFF 55%, #21D4C2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            About RailOptX
          </h1>
          <p className="text-[15px] sm:text-[16px] text-text-secondary max-w-[560px] mx-auto leading-relaxed">
            Integrated maintenance block planning for safer and more efficient
            railway operations.
          </p>
        </section>

        {/* 2. PROBLEM STATEMENT */}
        <section className="mb-14">
          <div className="section-label mb-3">The Problem</div>
          <div className="panel p-6 sm:p-7">
            <p className="text-[14px] leading-[1.8] text-text-secondary">
              Maintenance planning across{' '}
              <span className="text-text-primary font-semibold">Engineering</span>,{' '}
              <span className="text-text-primary font-semibold">S&amp;T</span> and{' '}
              <span className="text-text-primary font-semibold">Traction</span> is
              often handled independently while train operations and corridor
              constraints must also be considered. Maintenance data and block
              requests come from different operational systems, making
              coordination difficult and increasing the risk of fragmented or
              under-utilized maintenance blocks.
            </p>
          </div>
        </section>

        {/* 3. WHAT WE BUILT */}
        <section className="mb-14">
          <div className="section-label mb-3">What We Built</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {whatWeBuilt.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="panel p-4 flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(59,157,255,0.10)',
                      border: '1px solid rgba(59,157,255,0.20)',
                    }}
                  >
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-[13px] leading-[1.6] text-text-secondary pt-1">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. HOW RAILOPTX WORKS */}
        <section className="mb-14">
          <div className="section-label mb-3">How RailOptX Works</div>
          <div className="panel-elevated p-6 sm:p-8">
            <div className="flex flex-col items-center">
              {workflowSteps.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === workflowSteps.length - 1;
                return (
                  <div key={i} className="w-full flex flex-col items-center">
                    <div
                      className="w-full sm:w-[360px] flex items-center gap-3 px-4 py-3 rounded-[8px]"
                      style={{
                        background: isLast
                          ? 'rgba(45,212,166,0.08)'
                          : 'rgba(59,157,255,0.05)',
                        border: isLast
                          ? '1px solid rgba(45,212,166,0.25)'
                          : '1px solid rgba(59,157,255,0.14)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0"
                        style={{
                          background: isLast
                            ? 'rgba(45,212,166,0.15)'
                            : 'rgba(59,157,255,0.12)',
                        }}
                      >
                        <Icon
                          className={`w-4 h-4 ${isLast ? 'text-success-400' : 'text-blue-400'}`}
                        />
                      </div>
                      <span
                        className={`text-[13px] font-semibold ${
                          isLast ? 'text-success-400' : 'text-text-primary'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <ArrowDown className="w-4 h-4 text-text-disabled my-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. OUR TEAM */}
        <section className="mb-16">
          <div className="section-label mb-3">Our Team</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {team.map((member, i) => (
              <div key={i} className="panel p-4 text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{
                    background: 'rgba(59,157,255,0.10)',
                    border: '1px solid rgba(59,157,255,0.20)',
                  }}
                >
                  <UserRound className="w-4.5 h-4.5 text-blue-400" />
                </div>
                <p className="text-[12px] font-bold text-text-primary mb-0.5">
                  {member.name}
                </p>
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. ENTER COMMAND CENTER */}
        <section className="text-center">
          <div
            className="panel-elevated p-8 sm:p-10 flex flex-col items-center"
            style={{ border: '1px solid rgba(59,157,255,0.22)' }}
          >
            <ShieldCheck className="w-6 h-6 text-cyan-400 mb-3" />
            <h2 className="text-[18px] font-bold text-text-primary mb-2">
              Ready to plan smarter maintenance blocks?
            </h2>
            <p className="text-[13px] text-text-secondary max-w-[420px] mb-6">
              Continue into the operational dashboard to monitor corridors,
              plan blocks and review AI-assisted recommendations.
            </p>
            <button onClick={onContinue} className="btn btn-primary px-6 py-2.5">
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
