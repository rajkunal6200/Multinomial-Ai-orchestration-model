import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Database, 
  Cpu, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  Bot,
  Zap,
  Network
} from 'lucide-react';
import { ProjectArtifacts, ProjectSpec } from '../types';
import { PROJECT_PRESETS } from '../data/presets';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCustomSpec: (spec: ProjectSpec) => void;
  onSelectPreset: (preset: ProjectArtifacts) => void;
}

export const IntakeModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmitCustomSpec,
  onSelectPreset
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // Custom Spec Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [requirements, setRequirements] = useState('');
  const [scope, setScope] = useState('Full production web application (Zero-Cost Free Tier)');
  const [targetFeatures, setTargetFeatures] = useState('');
  const [userRoles, setUserRoles] = useState('Admin, Standard User');

  if (!isOpen) return null;

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !requirements.trim()) return;

    const featuresList = targetFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const rolesList = userRoles
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const newSpec: ProjectSpec = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'Custom Research-Backed Production App',
      requirements: requirements.trim(),
      scope: scope.trim(),
      targetFeatures: featuresList.length > 0 ? featuresList : ['Core CRUD operations', 'AI Integration via Gemini 3.8 Flash', 'Interactive Tailwind UI'],
      userRoles: rolesList.length > 0 ? rolesList : ['Administrator', 'User'],
      techStack: {
        frontend: 'React 19, Tailwind CSS, Lucide Icons, Vite',
        backend: 'FastAPI (Python 3.10)',
        database: 'PostgreSQL 16 (Supabase Free Tier) / SQLite',
        aiModel: 'Gemini 3.8 Flash (Low-Token Budget <1000 tokens)',
        auth: 'Supabase Auth Free Tier / JWT',
        hosting: 'Vercel / Cloud Run Free Tier'
      }
    };

    onSubmitCustomSpec(newSpec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040812]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#070f20] border border-[#142845] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#142845] bg-[#050b18]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Project Scope & Requirements Intake
              </h2>
              <p className="text-xs text-slate-400">
                System autonomously crawls arXiv research, designs system architecture, and optimizes token budget.
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

        {/* Tab Switcher */}
        <div className="flex border-b border-[#142845] bg-[#050b18]/60 px-5 pt-3">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-emerald-400 text-emerald-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated System Design Blueprints</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'border-emerald-400 text-emerald-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Custom Project Specifications Form</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'presets' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select a production blueprint complete with autonomous arXiv citations, enterprise System Design (HLD/LLD), FastAPI routes, and automated self-tests:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {PROJECT_PRESETS.map((preset) => (
                  <div
                    key={preset.spec.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="group cursor-pointer p-4 rounded-xl border border-[#1b233a] bg-[#0c101c] hover:border-violet-500/50 hover:bg-[#0f1526] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                          {preset.spec.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                          arXiv Grounded
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          FastAPI + React 19
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {preset.spec.requirements}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {preset.spec.targetFeatures.slice(0, 3).map((feat, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c2e] text-slate-300">
                            • {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-950 font-bold text-xs group-hover:opacity-95 transition">
                        <span>Load Blueprint</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Application / Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DistributedTaskOS, HealthPredict AI, CloudPulse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#07090e] border border-[#1b233a] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / High-Level Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. High-throughput distributed task scheduler with minimal token overhead"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#07090e] border border-[#1b233a] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Core Requirements & System Behavior *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what the system does. The 4 agents will autonomously search arXiv, generate System Design HLD/LLD diagrams, build FastAPI endpoints, and run self-tests..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-[#07090e] border border-[#1b233a] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="FastAPI REST endpoints&#10;System Design HLD Sequence&#10;PostgreSQL B-Tree Indexing&#10;Low-token AI summarize"
                    value={targetFeatures}
                    onChange={(e) => setTargetFeatures(e.target.value)}
                    className="w-full bg-[#07090e] border border-[#1b233a] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    User Roles (comma separated)
                  </label>
                  <input
                    type="text"
                    value={userRoles}
                    onChange={(e) => setUserRoles(e.target.value)}
                    placeholder="Admin, Developer, Guest"
                    className="w-full bg-[#050b18] border border-[#142845] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-2"
                  />

                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" /> Autonomous Literature Crawling:
                    </span>
                    <p>
                      You don't need to provide papers. The system automatically searches arXiv & OpenAlex in the background.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#142845]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#0c1833] hover:bg-[#122349] text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Dispatch 4 Agents & Synthesize Project</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
