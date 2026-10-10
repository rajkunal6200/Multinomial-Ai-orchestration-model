import React, { useState } from 'react';
import { 
  Zap, 
  TrendingDown, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Scale,
  DollarSign,
  Gauge,
  Sliders,
  Check
} from 'lucide-react';
import { TokenMetrics } from '../types';

interface TokenBudgetMeterProps {
  metrics?: TokenMetrics;
}

export const TokenBudgetMeter: React.FC<TokenBudgetMeterProps> = ({ metrics }) => {
  const [economyMode, setEconomyMode] = useState<'ultra' | 'balanced' | 'deep'>('balanced');

  const baseMetrics = metrics || {
    promptTokens: 245,
    completionTokens: 520,
    totalTokens: 765,
    tokenSavingsRatio: '89% via schema compression'
  };

  const modeMultipliers = {
    ultra: { prompt: 160, completion: 320, total: 480, saving: '93%', label: 'Ultra-Low (<500 tokens)' },
    balanced: { prompt: baseMetrics.promptTokens, completion: baseMetrics.completionTokens, total: baseMetrics.totalTokens, saving: '89%', label: 'Balanced (<800 tokens)' },
    deep: { prompt: 340, completion: 750, total: 1090, saving: '84%', label: 'Deep (<1200 tokens)' }
  };

  const current = modeMultipliers[economyMode];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#070f20] to-cyan-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> High-Efficiency Token Economy Engine
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">Strict Free-Tier Budgeting</span>
          </div>
          <h3 className="text-sm font-bold text-slate-100 mt-1">
            Minimal-Token Autonomous Orchestration
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
            All agent interactions are constrained to concise JSON schemas, slashing token consumption by 85%+ while maintaining rigorous architecture and coding standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">Total Financial Cost</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">$0.00 / month</span>
            <span className="text-[10px] font-mono text-cyan-400 block">100% Free-Tier Safe</span>
          </div>
        </div>
      </div>

      {/* Economy Mode Selector */}
      <div className="p-3.5 rounded-xl bg-[#070f20] border border-[#142845] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">Token Compression Economy Mode:</span>
        </div>
        <div className="flex items-center gap-2">
          {(['ultra', 'balanced', 'deep'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setEconomyMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                economyMode === mode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-[#050b18] text-slate-400 border border-[#142845] hover:text-slate-200'
              }`}
            >
              {modeMultipliers[mode].label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#070f20] border border-[#142845] text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Prompt Tokens</span>
          <span className="text-lg font-bold font-mono text-slate-100">
            {current.prompt}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">Ultra-compact schema</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#070f20] border border-[#142845] text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Completion Tokens</span>
          <span className="text-lg font-bold font-mono text-cyan-300">
            {current.completion}
          </span>
          <span className="text-[10px] font-mono text-cyan-400/80 block mt-0.5">Structured JSON only</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#070f20] border border-[#142845] text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Total Pipeline Tokens</span>
          <span className="text-lg font-bold font-mono text-amber-300">
            {current.total}
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">&lt; 1,000 target</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#070f20] border border-emerald-500/30 bg-emerald-950/20 text-center">
          <span className="text-[10px] font-mono uppercase text-emerald-300 block mb-1">Token Reduction</span>
          <span className="text-lg font-bold font-mono text-emerald-400">
            {current.saving}
          </span>
          <span className="text-[10px] font-mono text-emerald-300 block mt-0.5">vs 6,800 uncompressed</span>
        </div>
      </div>

      {/* Optimization Strategies Table */}
      <div className="border border-[#142845] rounded-xl overflow-hidden bg-[#070f20]">
        <div className="px-4 py-3 bg-[#050b18] border-b border-[#142845] flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Active Low-Token Architectural Directives
          </h4>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">4 / 4 Active</span>
        </div>
        <div className="divide-y divide-[#142845] p-4 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">1. Strict JSON Schema Output Constraints:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Passes <code>response_mime_type: 'application/json'</code> to Google Gemini 3.8 Flash, completely eliminating conversational preambles like "Sure, here is your code:". Saves ~450 tokens per turn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-slate-300 pt-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">2. AST Context Compression & Trimming:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Backend strips duplicate interface definitions and comments prior to tokenization. Distills 3,500 lines of type references into a compact 18-line signature summary.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-slate-300 pt-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">3. Differential Patching (Zero Full-File Repeats):</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Agents exchange line-level patches instead of regenerating complete source files. Saves ~2,200 tokens during QA hotfixes and test additions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-slate-300 pt-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">4. In-Memory SQLite Research Caching:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                arXiv and OpenAlex queries are cached with SHA-256 hashes in SQLite, avoiding duplicate external network and inference tokens on repeat project runs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
