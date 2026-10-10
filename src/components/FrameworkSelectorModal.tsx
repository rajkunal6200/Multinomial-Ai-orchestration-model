import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Check, 
  Sparkles, 
  Cpu, 
  Database, 
  Server, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Terminal,
  Code2
} from 'lucide-react';
import { TechStackConfig } from '../types';

interface FrameworkSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStack: TechStackConfig;
  onApplyStack: (newStack: TechStackConfig) => void;
}

export const FrameworkSelectorModal: React.FC<FrameworkSelectorModalProps> = ({
  isOpen,
  onClose,
  currentStack,
  onApplyStack
}) => {
  const [frontend, setFrontend] = useState(currentStack.frontend || 'React 19 (Vite)');
  const [backend, setBackend] = useState(currentStack.backend || 'FastAPI (Python 3.10)');
  const [database, setDatabase] = useState(currentStack.database || 'PostgreSQL (Supabase Free)');
  const [topology, setTopology] = useState(currentStack.architectureTopology || 'Modular Monolith with In-Memory LRU Cache');
  const [aiModel, setAiModel] = useState(currentStack.aiModel || 'Google Gemini 3.8 Flash');

  if (!isOpen) return null;

  const frontendOptions = [
    { id: 'React 19 (Vite)', label: 'React 19 (Vite)', desc: 'SPA with hooks, Tailwind CSS, component state, fast HMR' },
    { id: 'Next.js 15 (App Router)', label: 'Next.js 15', desc: 'React Server Components, edge SSR, nested layouts' },
    { id: 'Vue 3 (Vite)', label: 'Vue 3 (Vite)', desc: 'Composition API, reactive refs, Pinia state store' },
    { id: 'Svelte 5 (Vite)', label: 'Svelte 5', desc: 'Runes reactivity, zero runtime virtual-DOM overhead' },
    { id: 'Astro 4', label: 'Astro 4', desc: 'Zero JS island architecture, ultra-fast static & edge' },
    { id: 'Nuxt 3', label: 'Nuxt 3', desc: 'Full-stack Vue framework with auto-imported components' },
    { id: 'Remix / React Router v7', label: 'Remix / RR v7', desc: 'Nested routing, loaders, form actions, optimistic UI' },
    { id: 'SolidJS', label: 'SolidJS', desc: 'Fine-grained reactive primitives, extreme rendering speed' },
  ];

  const backendOptions = [
    { id: 'FastAPI (Python 3.10)', label: 'FastAPI (Python)', desc: 'Async ASGI, Pydantic type validation, auto OpenAPI /docs' },
    { id: 'Express.js (Node / TS)', label: 'Express.js (Node / TS)', desc: 'Lightweight REST, TypeScript middlewares, JWT auth' },
    { id: 'Go Fiber / Gin', label: 'Go Fiber / Gin (Golang)', desc: 'Zero memory allocations, extreme concurrency, microservice speed' },
    { id: 'Rust (Axum / Actix)', label: 'Rust (Axum / Actix)', desc: 'Zero cost abstractions, memory safety without GC, blazing fast' },
    { id: 'Django Ninja (Python)', label: 'Django Ninja', desc: 'Async Django REST with type hints & automatic Swagger docs' },
    { id: 'NestJS (TypeScript)', label: 'NestJS', desc: 'Enterprise modular architecture, decorators, dependency injection' },
    { id: 'Hono / Elysia (Bun Edge)', label: 'Hono / Elysia (Bun)', desc: 'Ultrafast edge runtime, sub-millisecond cold starts' },
  ];

  const databaseOptions = [
    { id: 'PostgreSQL (Supabase Free)', label: 'PostgreSQL (Supabase)', desc: '500MB free tier, Row Level Security, relational DDL, pgvector' },
    { id: 'SQLite / Turso (LibSQL)', label: 'SQLite / Turso (LibSQL)', desc: 'Edge serverless replication, sub-1ms read latency, zero cost' },
    { id: 'MongoDB Atlas Free', label: 'MongoDB Atlas Free', desc: '512MB M0 cluster, JSON document model, flexible indexing' },
    { id: 'Neon Serverless Postgres', label: 'Neon Postgres Free', desc: 'Autoscaling serverless PostgreSQL with branchable databases' },
    { id: 'Upstash Redis (Serverless)', label: 'Upstash Redis Cache', desc: '10k commands/day free, sub-5ms LRU caching & rate limiting' },
  ];

  const topologyOptions = [
    { id: 'Modular Monolith with In-Memory LRU Cache', label: 'Modular Monolith (LRU Cache)', desc: 'Unified codebase, decoupled domain modules, low ops burden' },
    { id: 'Event-Driven Microservices with Async Workers', label: 'Event-Driven Microservices', desc: 'Independent deployable services, message broker, event isolation' },
    { id: 'Serverless Edge API with Global Database', label: 'Serverless Edge Architecture', desc: 'Zero-idle compute cost, CDN edge routing, global distribution' },
    { id: 'CQRS with Read-Replicas & Event Sourcing', label: 'CQRS & Read-Replicas', desc: 'Separated write and query data models, audit log event sourcing' },
  ];

  const aiOptions = [
    { id: 'Google Gemini 3.8 Flash', label: 'Gemini 3.8 Flash (Free Tier)', desc: '15 RPM / 1M TPM free tier, schema JSON mode, reasoning' },
    { id: 'Groq Llama-3.3 70B', label: 'Groq Llama-3.3 70B (Free Tier)', desc: '30 RPM free tier, sub-second TTFT, open weights' },
    { id: 'DeepSeek-V3 (Hugging Face Free)', label: 'DeepSeek-V3 / Qwen (Free)', desc: 'Serverless open-weights reasoning & code generation' },
  ];

  const handleApply = () => {
    onApplyStack({
      frontend,
      backend,
      database,
      aiModel,
      architectureTopology: topology,
      auth: 'Supabase Auth (Free Tier - 50k MAU) / JWT',
      hosting: 'Vercel / Cloud Run Free Tier ($0.00/mo)'
    });
    onClose();
  };

  const applyPreset = (f: string, b: string, d: string, top: string, ai: string) => {
    setFrontend(f);
    setBackend(b);
    setDatabase(d);
    setTopology(top);
    setAiModel(ai);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040711]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#070f20] border border-[#142845] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#142845] bg-[#050b18]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Select Framework & Architecture Stack
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Multi-Framework Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose any combination of Frontend, Backend, Database, and Topology. The multi-agent system will generate matching code, system designs, and schemas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0c1833] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-5 py-3 bg-[#0a1428]/60 border-b border-[#142845] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono uppercase text-slate-400 shrink-0 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Stacks:
          </span>
          <button
            onClick={() => applyPreset('React 19 (Vite)', 'FastAPI (Python 3.10)', 'PostgreSQL (Supabase Free)', 'Modular Monolith with In-Memory LRU Cache', 'Google Gemini 3.8 Flash')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#0c1833] hover:bg-[#122349] border border-emerald-500/30 text-emerald-300 font-medium whitespace-nowrap transition"
          >
            ⚡ Python AI (FastAPI + React 19)
          </button>
          <button
            onClick={() => applyPreset('Next.js 15 (App Router)', 'Express.js (Node / TS)', 'PostgreSQL (Supabase Free)', 'Serverless Edge API with Global Database', 'Google Gemini 3.8 Flash')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#0c1833] hover:bg-[#122349] border border-[#142845] text-cyan-300 font-medium whitespace-nowrap transition"
          >
            🚀 Full-Stack TS (Next.js 15 + Supabase)
          </button>
          <button
            onClick={() => applyPreset('Svelte 5 (Vite)', 'Go Fiber / Gin', 'SQLite / Turso (LibSQL)', 'Event-Driven Microservices with Async Workers', 'Groq Llama-3.3 70B')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#0c1833] hover:bg-[#122349] border border-[#142845] text-amber-300 font-medium whitespace-nowrap transition"
          >
            🏎️ Ultra Performance (Go Fiber + Svelte 5)
          </button>
          <button
            onClick={() => applyPreset('React 19 (Vite)', 'Rust (Axum / Actix)', 'PostgreSQL (Supabase Free)', 'CQRS with Read-Replicas & Event Sourcing', 'DeepSeek-V3 (Hugging Face Free)')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#0c1833] hover:bg-[#122349] border border-[#142845] text-violet-300 font-medium whitespace-nowrap transition"
          >
            🦀 Systems Grade (Rust Axum + React)
          </button>
          <button
            onClick={() => applyPreset('Vue 3 (Vite)', 'Django Ninja (Python)', 'PostgreSQL (Supabase Free)', 'Modular Monolith with In-Memory LRU Cache', 'Google Gemini 3.8 Flash')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#0c1833] hover:bg-[#122349] border border-[#142845] text-emerald-300 font-medium whitespace-nowrap transition"
          >
            🐍 Django Ninja + Vue 3
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Section 1: Backend Framework */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> 1. Backend Server Framework
              </label>
              <span className="text-[11px] font-mono text-slate-400">Selected: <strong className="text-slate-100">{backend}</strong></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {backendOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBackend(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    backend === opt.id
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-950/40 text-cyan-100'
                      : 'border-[#142845] bg-[#050b18] hover:border-[#223e6b] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {backend === opt.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Frontend Framework */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> 2. Frontend UI Framework
              </label>
              <span className="text-[11px] font-mono text-slate-400">Selected: <strong className="text-slate-100">{frontend}</strong></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {frontendOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFrontend(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    frontend === opt.id
                      ? 'border-emerald-400 bg-emerald-950/30 shadow-md shadow-emerald-950/40 text-emerald-100'
                      : 'border-[#142845] bg-[#050b18] hover:border-[#223e6b] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {frontend === opt.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Database & ORM */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> 3. Persistent Database & Cache
              </label>
              <span className="text-[11px] font-mono text-slate-400">Selected: <strong className="text-slate-100">{database}</strong></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {databaseOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDatabase(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    database === opt.id
                      ? 'border-violet-400 bg-violet-950/30 shadow-md shadow-violet-950/40 text-violet-100'
                      : 'border-[#142845] bg-[#050b18] hover:border-[#223e6b] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {database === opt.id && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: System Architecture Topology */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> 4. System Design Topology Pattern
              </label>
              <span className="text-[11px] font-mono text-slate-400">Selected: <strong className="text-slate-100">{topology}</strong></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topologyOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTopology(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    topology === opt.id
                      ? 'border-amber-400 bg-amber-950/30 shadow-md shadow-amber-950/40 text-amber-100'
                      : 'border-[#142845] bg-[#050b18] hover:border-[#223e6b] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {topology === opt.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#142845] bg-[#050b18] flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All frameworks fall strictly within free tiers & MIT/Apache open-source licenses.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#142845] text-slate-300 hover:text-white text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition"
            >
              <span>Apply Stack Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
