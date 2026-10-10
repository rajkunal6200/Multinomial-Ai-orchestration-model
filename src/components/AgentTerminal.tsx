import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Filter, 
  Trash2, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AgentLogMessage, AgentRole } from '../types';

interface AgentTerminalProps {
  logs: AgentLogMessage[];
  onClearLogs?: () => void;
  onSendDirective?: (text: string) => void;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  logs,
  onClearLogs,
  onSendDirective
}) => {
  const [filterAgent, setFilterAgent] = useState<AgentRole | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const [directiveInput, setDirectiveInput] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.fromAgent.toUpperCase()}] ${l.content}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveInput.trim()) return;
    onSendDirective?.(directiveInput.trim());
    setDirectiveInput('');
  };

  const filteredLogs = logs.filter(l => filterAgent === 'all' || l.fromAgent === filterAgent || l.toAgent === filterAgent);

  const getAgentColor = (agent: AgentRole | 'coordinator' | 'all') => {
    switch (agent) {
      case 'architect': return 'text-violet-400';
      case 'frontend': return 'text-cyan-400';
      case 'integration': return 'text-amber-400';
      case 'qa': return 'text-emerald-400';
      case 'coordinator': return 'text-purple-400';
      case 'all': return 'text-cyan-300 font-semibold';
      default: return 'text-slate-400';
    }
  };

  const getAgentBadge = (agent: AgentRole | 'coordinator' | 'all') => {
    switch (agent) {
      case 'architect': return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      case 'frontend': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'integration': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'qa': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'all': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default: return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="bg-[#070f20] border border-[#142845] rounded-2xl overflow-hidden shadow-xl flex flex-col h-72">
      {/* Terminal Title Bar */}
      <div className="px-4 py-2 bg-[#050b18] border-b border-[#142845] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            Inter-Agent Dialogue & Handoff Terminal
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            ({filteredLogs.length} events)
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Agent Filter */}
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value as any)}
            className="bg-[#0c1833] border border-[#142845] text-[11px] font-mono text-slate-300 rounded-lg px-2 py-0.5 focus:outline-none"
          >
            <option value="all">All Agents</option>
            <option value="architect">Lead Architect</option>
            <option value="frontend">Frontend Agent</option>
            <option value="integration">AI Integration</option>
            <option value="qa">QA Agent</option>
          </select>

          <button
            onClick={handleCopyLogs}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0c1833] transition"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Stream */}
      <div
        ref={logContainerRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-2 bg-[#040812]/95 scrollbar-thin"
      >
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-600 select-none text-[10px]">{log.timestamp}</span>
            <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold tracking-wider shrink-0 ${getAgentBadge(log.fromAgent)}`}>
              {log.fromAgent}
            </span>
            {log.toAgent && (
              <span className="text-slate-500 flex items-center gap-1 text-[10px] shrink-0">
                <ArrowRight className="w-2.5 h-2.5" />
                <span className={getAgentColor(log.toAgent)}>{log.toAgent}</span>
              </span>
            )}
            <span
              className={`flex-1 break-words ${
                log.type === 'hotfix'
                  ? 'text-amber-300 font-semibold'
                  : log.type === 'warning'
                  ? 'text-rose-300'
                  : log.type === 'success'
                  ? 'text-emerald-300'
                  : log.type === 'artifact'
                  ? 'text-cyan-300'
                  : 'text-slate-300'
              }`}
            >
              {log.content}
            </span>
          </div>
        ))}
      </div>

      {/* Directive Input */}
      <form onSubmit={handleDirectiveSubmit} className="p-2 bg-[#050b18] border-t border-[#142845] flex items-center gap-2">
        <span className="text-xs font-mono text-emerald-400 pl-2">&gt;</span>
        <input
          type="text"
          placeholder="Inject prompt or directive to all 4 agents (e.g. 'Optimize PostgreSQL B-Tree indexing')..."
          value={directiveInput}
          onChange={(e) => setDirectiveInput(e.target.value)}
          className="flex-1 bg-transparent text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs transition"
          title="Send Directive"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
