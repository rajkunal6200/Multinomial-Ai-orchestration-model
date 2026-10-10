import React from 'react';
import { 
  Network, 
  Code, 
  Workflow, 
  ShieldCheck, 
  Check, 
  Zap
} from 'lucide-react';
import { PipelinePhase } from '../types';

interface PipelineStepperProps {
  currentPhase: PipelinePhase;
  onSetPhase: (phase: PipelinePhase) => void;
  isRunningPipeline: boolean;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentPhase,
  onSetPhase,
  isRunningPipeline
}) => {
  const phases: { id: PipelinePhase; number: number; label: string; agentLead: string; summary: string; icon: any }[] = [
    {
      id: 'phase1',
      number: 1,
      label: 'PHASE 1: Research & System Design',
      agentLead: 'Lead Architect Pod',
      summary: 'Crawled arXiv papers, HLD/LLD diagrams & normalized database schema',
      icon: Network
    },
    {
      id: 'phase2',
      number: 2,
      label: 'PHASE 2: Full-Stack Dev & API',
      agentLead: 'Backend & Frontend Pod',
      summary: 'FastAPI routes, responsive UI components & dynamic entity schemas',
      icon: Code
    },
    {
      id: 'phase3',
      number: 3,
      label: 'PHASE 3: Low-Token AI Wiring',
      agentLead: 'AI Optimization Specialist',
      summary: 'Strict schema compression (<1,000 tokens), saving 85%+ quota',
      icon: Zap
    },
    {
      id: 'phase4',
      number: 4,
      label: 'PHASE 4: 8-Point Self-Testing',
      agentLead: 'QA Certification Agent',
      summary: 'Automated functional, latency & security test suite certification',
      icon: ShieldCheck
    }
  ];

  const getPhaseIndex = (p: PipelinePhase) => {
    switch (p) {
      case 'phase1': return 0;
      case 'phase2': return 1;
      case 'phase3': return 2;
      case 'phase4':
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="bg-[#070f20] border border-[#142845] rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#142845]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Coordinated Multi-Agent Lifecycle
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-mono text-slate-400">Click any phase to inspect artifacts</span>
        </div>
        {isRunningPipeline && (
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30 animate-pulse flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Pipeline Running Autonomously...
          </span>
        )}
      </div>

      {/* Stepper Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3.5">
        {phases.map((phase, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const IconComponent = phase.icon;

          return (
            <button
              key={phase.id}
              onClick={() => onSetPhase(phase.id)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-[#0c1833] border-emerald-500/70 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/40'
                  : isDone
                  ? 'bg-[#081226] border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-[#050b18]/60 border-[#142845] opacity-70 hover:opacity-100 hover:border-[#1c3960]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isDone
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950'
                          : isCurrent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                          : 'bg-[#0c1833] text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : phase.number}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      Phase {phase.number}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold animate-pulse">
                      ACTIVE
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0c1833] text-emerald-400 font-semibold">
                      COMPLETE
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <IconComponent className="w-3.5 h-3.5 text-cyan-400" />
                  {phase.label.split(':')[1]}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug mb-2">
                  {phase.summary}
                </p>
              </div>

              <div className="text-[10px] font-mono text-emerald-300/90 pt-1.5 border-t border-[#142845]">
                Lead: {phase.agentLead}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
