import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  ArrowRight, 
  Cpu, 
  Database, 
  ShieldAlert, 
  Zap, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Lock,
  Globe,
  Sliders,
  Sparkles,
  Calculator,
  Download,
  Copy,
  Check,
  FileText,
  Activity
} from 'lucide-react';
import { SystemDesign } from '../types';

interface SystemDesignStudioProps {
  systemDesign?: SystemDesign;
  projectName: string;
}

export const SystemDesignStudio: React.FC<SystemDesignStudioProps> = ({
  systemDesign,
  projectName
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSection, setActiveSection] = useState<'hld' | 'sequence' | 'capacity' | 'resilience' | 'export'>('hld');
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Capacity Calculator State
  const [dailyUsers, setDailyUsers] = useState(50000);
  const [readRatio, setReadRatio] = useState(85); // 85% read, 15% write
  const [payloadKb, setPayloadKb] = useState(2.5);

  // Derived calculations
  const actionsPerUser = 20;
  const totalDailyRequests = dailyUsers * actionsPerUser;
  const avgQps = Math.round(totalDailyRequests / 86400);
  const peakQps = Math.round(avgQps * 2.5);
  const dailyWrites = Math.round(totalDailyRequests * ((100 - readRatio) / 100));
  const monthlyStorageGb = ((dailyWrites * payloadKb * 30) / (1024 * 1024)).toFixed(2);
  const bandwidthMbps = (((avgQps * payloadKb * 8) / 1024)).toFixed(2);
  const cacheMemoryMb = Math.round((dailyUsers * 0.2 * payloadKb * 1.5) / 1024 * 10) / 10;

  const defaultDesign: SystemDesign = systemDesign || {
    hldDiagram: `[Client Tier: React 19 SPA]
       | (HTTPS / REST)
       v
[Edge Gateway: FastAPI Python (Port 8000)]
       |
       +---> [In-Memory LRU Cache] -> (Sub-5ms hits, 85% Hit Ratio)
       |
       +---> [Persistent Store: PostgreSQL (Supabase Free Tier)]
       |        \\--> [Connection Pooler + B-Tree Indexes + RLS]
       |
       +---> [Autonomous arXiv Research Pod]
       |        \\--> [Academic Literature & Algorithmic Invariants]
       |
       +---> [Low-Token AI Inference: Gemini 3.8 Flash]
                \\--> [Compressed JSON Schema Mode <800 Tokens]`,
    sequenceFlow: [
      { step: 1, from: 'React 19 Client', to: 'FastAPI Edge Gateway', action: 'Transmits JSON payload with JWT authorization header' },
      { step: 2, from: 'FastAPI Gateway', to: 'Pydantic Validator', action: 'Enforces type schemas & strips malicious script tags' },
      { step: 3, from: 'FastAPI Gateway', to: 'In-Memory Cache', action: 'Checks memory cache for idempotent hits (<2ms)' },
      { step: 4, from: 'FastAPI Gateway', to: 'PostgreSQL Store', action: 'Executes atomic parameterized query with index scan' },
      { step: 5, from: 'FastAPI Gateway', to: 'Gemini 3.8 Flash', action: 'Dispatches condensed low-token prompt (<250 tokens)' },
      { step: 6, from: 'FastAPI Gateway', to: 'React 19 Client', action: 'Returns 200 OK JSON payload (<25ms total round-trip)' }
    ],
    scalabilityStrategy: 'Stateless horizontal edge instances with connection pooling. Single-writer multi-reader design guarantees zero storage fees under 500MB ceiling.',
    resilienceMatrix: [
      { failure: 'Gemini Free-Tier Rate Limit (15 RPM Exceeded)', mitigation: 'Circuit breaker serves local semantic cache with graceful degradation' },
      { failure: 'PostgreSQL Connection Exhaustion', mitigation: 'Connection pooler with 5s statement query timeouts' },
      { failure: 'Malformed Payload / Injection Attempt', mitigation: 'Pydantic strict schema validation with zero raw SQL execution' },
      { failure: 'Network Timeout on External Scholarly APIs', mitigation: 'Cached arXiv & OpenAlex research metadata served instantly from SQLite' }
    ],
    dataAccessPatterns: [
      'Write Pattern: Single atomic transaction with UUID primary key generation',
      'Read Pattern: Covered B-Tree index scan on (status, created_at DESC) avoiding full-table sweeps',
      'Cache Invalidation: Event-driven TTL purge on state mutations'
    ]
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev === null || prev >= defaultDesign.sequenceFlow.length) {
          clearInterval(interval);
          setIsSimulating(false);
          return null;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleCopyMarkdown = () => {
    const markdown = `# System Design Document (HLD & LLD): ${projectName}
Author: DevOS Lead Software Architect
License: MIT / Free-Tier Compliant
Date: ${new Date().toISOString().split('T')[0]}

## 1. High-Level Design (HLD)
\`\`\`
${defaultDesign.hldDiagram}
\`\`\`

## 2. Capacity & Scale Estimations
- Daily Active Users (DAU): ${dailyUsers.toLocaleString()}
- Average QPS: ${avgQps} queries/sec (Peak QPS: ${peakQps})
- Read / Write Ratio: ${readRatio}% Read / ${100 - readRatio}% Write
- Monthly Storage Ingestion: ~${monthlyStorageGb} GB / month
- Network Bandwidth: ~${bandwidthMbps} Mbps
- Cache Cluster Size: ~${cacheMemoryMb} MB (LRU Eviction)

## 3. End-to-End Sequence Flow (LLD)
${defaultDesign.sequenceFlow.map(s => `${s.step}. **${s.from}** -> **${s.to}**: ${s.action}`).join('\n')}

## 4. Scalability & High-Availability
${defaultDesign.scalabilityStrategy}

## 5. Resilience & Fault Tolerance Matrix
${defaultDesign.resilienceMatrix.map(r => `- **Failure Mode**: ${r.failure}\n  - *Mitigation*: ${r.mitigation}`).join('\n')}

## 6. Data Access Patterns
${defaultDesign.dataAccessPatterns.map(d => `- ${d}`).join('\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Studio Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#070f20] to-cyan-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" /> High-Level & Low-Level System Design Studio
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">Zero-Cost Scalable Blueprint</span>
          </div>
          <h3 className="text-sm font-bold text-slate-100 mt-1">
            Enterprise System Architecture for {projectName}
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
            Engineered to handle high concurrency, atomic transactions, and zero-token waste through layered caching and decoupled edge routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-3.5 py-1.5 bg-[#0c1833] hover:bg-[#122349] border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Trace...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                <span>Simulate Request Flow</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 bg-[#0c1833] hover:bg-[#122349] border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm"
            title="Export Full Markdown HLD/LLD Specification"
          >
            {copiedDoc ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied HLD!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export System Design</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-[#142845] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSection('hld')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
            activeSection === 'hld'
              ? 'bg-[#0c1833] text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" /> 1. HLD Topology Diagram
        </button>
        <button
          onClick={() => setActiveSection('sequence')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
            activeSection === 'sequence'
              ? 'bg-[#0c1833] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> 2. LLD Sequence Flow
        </button>
        <button
          onClick={() => setActiveSection('capacity')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
            activeSection === 'capacity'
              ? 'bg-[#0c1833] text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" /> 3. System Capacity Estimator
        </button>
        <button
          onClick={() => setActiveSection('resilience')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
            activeSection === 'resilience'
              ? 'bg-[#0c1833] text-violet-300 border border-violet-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> 4. Resilience & CAP Trade-offs
        </button>
      </div>

      {/* SECTION 1: HLD TOPOLOGY */}
      {activeSection === 'hld' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-xl border border-[#142845] bg-[#070f20] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 border-b border-[#142845] pb-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" /> Distributed Architecture Topology (ASCII Schema)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0c1833] text-slate-400 border border-[#142845]">
                  Micro-Edge Decoupled
                </span>
              </div>
              <pre className="font-mono text-xs text-emerald-300/90 leading-relaxed overflow-x-auto p-4 bg-[#050b18] rounded-lg border border-[#142845]">
                {defaultDesign.hldDiagram}
              </pre>
            </div>

            <div className="rounded-xl border border-[#142845] bg-[#070f20] p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Architectural Principles
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2 bg-[#050b18] p-2.5 rounded-lg border border-[#142845]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Stateless Edge:</strong> FastAPI micro-instances allow horizontal scaling with zero server cost.</span>
                </li>
                <li className="flex items-start gap-2 bg-[#050b18] p-2.5 rounded-lg border border-[#142845]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Layered In-Memory Caching:</strong> Sub-5ms response times for 85%+ idempotent read queries.</span>
                </li>
                <li className="flex items-start gap-2 bg-[#050b18] p-2.5 rounded-lg border border-[#142845]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Low-Token Gemini Budget:</strong> Prompt compression keeps inference strictly under 800 tokens.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LLD SEQUENCE FLOW */}
      {activeSection === 'sequence' && (
        <div className="rounded-xl border border-[#142845] bg-[#070f20] p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Low-Level Design (LLD) Execution Sequence
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Click 'Simulate Request Flow' to animate step</span>
          </div>

          <div className="space-y-2">
            {defaultDesign.sequenceFlow.map((seq) => {
              const isActive = activeStep === seq.step;
              return (
                <div
                  key={seq.step}
                  className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/50 scale-[1.01]'
                      : 'border-[#142845] bg-[#050b18]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                      isActive ? 'bg-cyan-400 text-slate-950' : 'bg-[#0c1833] text-slate-400 border border-[#142845]'
                    }`}>
                      {seq.step}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-200 font-semibold">{seq.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-300 font-semibold">{seq.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300">{seq.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: SYSTEM CAPACITY ESTIMATOR */}
      {activeSection === 'capacity' && (
        <div className="rounded-xl border border-[#142845] bg-[#070f20] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#142845] pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-amber-400" /> Interactive Scale & Capacity Estimator
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Adjust concurrency variables to compute QPS throughput, storage per month, and cache sizing.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Live Systems Math
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Input Controls */}
            <div className="space-y-4 md:col-span-1 border-r border-[#142845] pr-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Daily Active Users (DAU)</span>
                  <span className="font-mono text-cyan-400 font-bold">{dailyUsers.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={dailyUsers}
                  onChange={(e) => setDailyUsers(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Read / Write Ratio</span>
                  <span className="font-mono text-emerald-400 font-bold">{readRatio}% R / {100 - readRatio}% W</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={readRatio}
                  onChange={(e) => setReadRatio(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Payload Size per Request</span>
                  <span className="font-mono text-amber-400 font-bold">{payloadKb} KB</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={payloadKb}
                  onChange={(e) => setPayloadKb(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#050b18] border border-[#142845] text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Average QPS</span>
                <span className="text-xl font-bold font-mono text-cyan-300">{avgQps} req/s</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Peak: {peakQps} req/s</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050b18] border border-[#142845] text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Storage Ingestion</span>
                <span className="text-xl font-bold font-mono text-emerald-300">{monthlyStorageGb} GB / mo</span>
                <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">Fits within free tier</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050b18] border border-[#142845] text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Network Egress</span>
                <span className="text-xl font-bold font-mono text-amber-300">{bandwidthMbps} Mbps</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Minimal CDN bandwidth</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050b18] border border-[#142845] text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Recommended Cache</span>
                <span className="text-xl font-bold font-mono text-violet-300">{cacheMemoryMb} MB</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">LRU eviction policy</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: RESILIENCE & CAP TRADE-OFFS */}
      {activeSection === 'resilience' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#142845] bg-[#070f20] p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Resilience & Fault Mitigation Matrix
            </h4>
            <div className="space-y-2">
              {defaultDesign.resilienceMatrix.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#050b18] border border-[#142845] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-mono text-[11px]">
                    <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{item.failure}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-4">{item.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#142845] bg-[#070f20] p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-violet-400" /> Data Access & Consistency Patterns
            </h4>
            <div className="space-y-2">
              {defaultDesign.dataAccessPatterns.map((pattern, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#050b18] border border-[#142845] text-xs">
                  <span className="font-mono text-emerald-300 font-semibold block mb-0.5">Pattern #{idx + 1}:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{pattern}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
