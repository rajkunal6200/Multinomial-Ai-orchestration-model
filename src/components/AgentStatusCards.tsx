import React from 'react';
import { 
  Database, 
  Layout, 
  Cpu, 
  CheckCircle, 
  Terminal, 
  Activity, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Network
} from 'lucide-react';
import { AgentInfo } from '../types';

interface AgentStatusCardsProps {
  agents: AgentInfo[];
  activeAgentId?: string;
  onSelectAgent?: (agentId: string) => void;
}

export const AgentStatusCards: React.FC<AgentStatusCardsProps> = ({
  agents,
  activeAgentId,
  onSelectAgent
}) => {
  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'architect':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'frontend':
        return <Layout className="w-5 h-5 text-cyan-400" />;
      case 'integration':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'qa':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Terminal className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: AgentInfo['status']) => {
    switch (status) {
      case 'generating':
      case 'analyzing':
      case 'integrating':
      case 'verifying':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            ACTIVE: {status.toUpperCase()}
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            READY / VERIFIED
          </span>
        );
      case 'alert':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            HOTFIX LOOP
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0c1833] text-slate-400 border border-[#142845]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            STANDBY
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {agents.map((agent) => {
        const isSelected = activeAgentId === agent.id;
        return (
          <div
            key={agent.id}
            onClick={() => onSelectAgent?.(agent.id)}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between ${
              isSelected
                ? 'bg-[#0a152d] border-emerald-500/70 ring-1 ring-emerald-500/50 shadow-xl shadow-emerald-950/40'
                : 'bg-[#070f20] hover:bg-[#0a152d] border-[#142845] hover:border-emerald-500/40'
            }`}
          >
            <div>
              {/* Agent Header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#0c1833] border border-[#142845]">
                    {getAgentIcon(agent.id)}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100 tracking-tight">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{agent.title}</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                {getStatusBadge(agent.status)}
              </div>

              {/* Model & Free-Tier Assignment */}
              <div className="bg-[#050b18] rounded-xl p-2.5 border border-[#142845] mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Model:</span>
                  <span className="text-slate-200 font-mono font-medium truncate max-w-[130px] text-right" title={agent.model}>
                    {agent.model}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Provider:</span>
                  <span className="text-cyan-400 font-mono text-[10px] truncate max-w-[130px] text-right">
                    {agent.provider}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#142845]">
                  <span className="text-slate-400 font-medium">Cost:</span>
                  <span className="text-emerald-400 font-mono font-semibold text-[10px]">
                    $0.00 (Free Tier)
                  </span>
                </div>
              </div>

              {/* Current Task */}
              <div className="text-[11px] text-slate-300 bg-[#0c1833]/60 rounded-lg p-2.5 border border-[#142845] mb-3">
                <span className="text-emerald-400 block text-[10px] uppercase font-mono tracking-wider mb-0.5">
                  Autonomous Execution
                </span>
                <p className="line-clamp-2 leading-relaxed text-slate-200">{agent.currentTask}</p>
              </div>
            </div>

            {/* Tool Stack Tags */}
            <div className="pt-2 border-t border-[#142845] flex flex-wrap gap-1">
              {agent.tools.slice(0, 3).map((tool, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0c1833] text-slate-300 border border-[#142845]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
