import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Layout, 
  Cpu, 
  ShieldCheck, 
  FolderTree, 
  Copy, 
  Check, 
  Play, 
  Download, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Zap,
  Activity,
  Network
} from 'lucide-react';
import { ProjectArtifacts, TestCase } from '../types';
import { ResearchViewer } from './ResearchViewer';
import { TokenBudgetMeter } from './TokenBudgetMeter';
import { SelfTestHarness } from './SelfTestHarness';
import { SystemDesignStudio } from './SystemDesignStudio';

export type ArtifactTabType = 'systemDesign' | 'research' | 'architecture' | 'api' | 'frontend' | 'token' | 'qa' | 'files';

interface ArtifactsViewerProps {
  artifacts: ProjectArtifacts;
  activeTab: ArtifactTabType;
  onTabChange: (tab: ArtifactTabType) => void;
  onRunSelfTests?: () => void;
  isSelfTesting?: boolean;
}

export const ArtifactsViewer: React.FC<ArtifactsViewerProps> = ({
  artifacts,
  activeTab,
  onTabChange,
  onRunSelfTests,
  isSelfTesting = false
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string>('api/main.py');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabs = [
    { id: 'systemDesign', label: 'System Design (HLD/LLD)', icon: Network, agent: 'Architect Pod' },
    { id: 'research', label: 'Autonomous Research (arXiv)', icon: BookOpen, agent: 'Scholarly Crawler' },
    { id: 'architecture', label: 'Database & SQL DDL', icon: Database, agent: 'Data Architect' },
    { id: 'api', label: 'FastAPI & OpenAPI 3.1', icon: Code2, agent: 'Backend Agent' },
    { id: 'frontend', label: 'React 19 UI Layout', icon: Layout, agent: 'UI/UX Agent' },
    { id: 'token', label: 'Low-Token Economy', icon: Zap, agent: 'Optimizer' },
    { id: 'qa', label: '8-Point Self-Test Seal', icon: ShieldCheck, agent: 'QA Agent' },
    { id: 'files', label: 'Workspace Files', icon: FolderTree, agent: 'Codebase' },
  ] as const;

  return (
    <div className="bg-[#070f20] border border-[#142845] rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[580px]">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#142845] bg-[#050b18]/90 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ArtifactTabType)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'border-emerald-400 text-emerald-300 bg-[#0c1833] font-semibold shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#081226]'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#142845] text-slate-300 hidden xl:inline">
                {tab.agent}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="p-5 flex-1 overflow-y-auto">
        
        {/* TAB 1: SYSTEM DESIGN STUDIO (HLD/LLD) */}
        {activeTab === 'systemDesign' && (
          <SystemDesignStudio
            systemDesign={artifacts.systemDesign}
            projectName={artifacts.spec.name}
          />
        )}

        {/* TAB 2: AUTONOMOUS ACADEMIC RESEARCH */}
        {activeTab === 'research' && (
          <ResearchViewer
            papers={artifacts.researchPapers || []}
            projectName={artifacts.spec.name}
          />
        )}

        {/* TAB 3: LOW-TOKEN ECONOMY */}
        {activeTab === 'token' && (
          <TokenBudgetMeter metrics={artifacts.tokenMetrics} />
        )}

        {/* TAB 4: SELF-TESTING & QA */}
        {activeTab === 'qa' && (
          <SelfTestHarness
            tests={artifacts.selfTests}
            certifiedComplete={artifacts.certifiedComplete}
            projectId={artifacts.spec.id}
            onRunTests={onRunSelfTests}
            isRunning={isSelfTesting}
          />
        )}

        {/* TAB 5: ARCHITECTURE & DATABASE */}
        {activeTab === 'architecture' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* System Summary */}
            <div className="p-4 rounded-xl bg-[#0c101c] border border-violet-500/20">
              <h3 className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Database & Schema Architecture
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {artifacts.architecture.systemSummary}
              </p>
            </div>

            {/* SQL Schema DDL */}
            <div className="border border-[#1b233a] rounded-xl overflow-hidden bg-[#07090e]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1222] border-b border-[#1b233a]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-200">schema.sql</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                    PostgreSQL 16 / Supabase Free Tier
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(artifacts.architecture.sqlSchema, 'sql')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-[#161c2e] transition"
                >
                  {copiedKey === 'sql' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-72 leading-relaxed">
                {artifacts.architecture.sqlSchema}
              </pre>
            </div>

            {/* ER Diagram ASCII & Architect Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-[#1b233a] rounded-xl p-4 bg-[#0c101c]">
                <h4 className="text-xs font-mono text-slate-300 font-semibold mb-2">
                  Relational Entity-Relationship Diagram (ASCII)
                </h4>
                <pre className="text-[11px] font-mono text-slate-400 bg-[#07090e] p-3 rounded-lg border border-[#1b233a] overflow-x-auto leading-relaxed">
                  {artifacts.architecture.erDiagramAscii}
                </pre>
              </div>

              <div className="border border-[#1b233a] rounded-xl p-4 bg-[#0c101c] flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono text-slate-300 font-semibold mb-2">
                    Architectural Enforcement Notes
                  </h4>
                  <ul className="space-y-2">
                    {artifacts.architecture.architectNotes.map((note, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1b233a] text-[11px] font-mono text-cyan-400">
                  Target: 0 database hosting fees under 500MB storage ceiling
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: API & OPENAPI 3.1 */}
        {activeTab === 'api' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-200">
                  Documented REST API Endpoints (OpenAPI 3.1 / FastAPI Swagger Spec)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Built by Backend Agent using FastAPI (Python) with parameterized SQL safety & interactive Swagger at /docs
                </p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(artifacts.architecture.openApiEndpoints, null, 2), 'endpoints')}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-slate-100 px-2.5 py-1.5 rounded-lg bg-[#161c2e] hover:bg-[#1b233a] transition"
              >
                {copiedKey === 'endpoints' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy OpenAPI JSON</span>
              </button>
            </div>

            <div className="space-y-3">
              {artifacts.architecture.openApiEndpoints.map((ep, idx) => (
                <div key={idx} className="border border-[#1b233a] rounded-xl bg-[#0c101c] p-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          ep.method === 'GET'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : ep.method === 'POST'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : ep.method === 'PUT' || ep.method === 'PATCH'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-xs font-mono font-semibold text-slate-200">{ep.path}</code>
                    </div>
                    <span className="text-[11px] text-slate-400">{ep.description}</span>
                  </div>

                  {ep.requestBody && (
                    <div className="bg-[#07090e] rounded-lg p-2.5 border border-[#1b233a] text-[11px] font-mono text-slate-300">
                      <span className="text-[10px] text-slate-400 block mb-1">Request Body Schema:</span>
                      <code>{ep.requestBody}</code>
                    </div>
                  )}

                  <div className="bg-[#07090e] rounded-lg p-2.5 border border-[#1b233a] text-[11px] font-mono text-cyan-400/90 overflow-x-auto">
                    <span className="text-[10px] text-slate-400 block mb-1">Response Sample (200 OK):</span>
                    <code>{ep.responseSample}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: UI LAYOUT & COMPONENTS */}
        {activeTab === 'frontend' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0c101c] border border-[#1b233a]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Color Palette</span>
                <p className="text-xs font-semibold text-violet-300">Cosmic Obsidian & Cyber Cyan</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c101c] border border-[#1b233a]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Theme Contrast</span>
                <p className="text-xs font-semibold text-slate-200">Deep Glassmorphism (WCAG AAA)</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c101c] border border-[#1b233a]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Typography</span>
                <p className="text-xs font-semibold text-slate-200">Inter + JetBrains Monospace</p>
              </div>
            </div>

            <div className="border border-[#1b233a] rounded-xl p-4 bg-[#0c101c]">
              <h4 className="text-xs font-mono font-semibold text-slate-300 mb-2">React 19 Component Hierarchy</h4>
              <div className="flex flex-wrap gap-1.5">
                {artifacts.frontend.componentTree.map((comp, idx) => (
                  <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded bg-[#161c2e] text-slate-200 border border-[#1b233a]">
                    &lt;{comp} /&gt;
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-[#1b233a] rounded-xl overflow-hidden bg-[#07090e]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1222] border-b border-[#1b233a]">
                <span className="text-xs font-mono font-medium text-slate-300">src/components/DashboardView.tsx</span>
                <button
                  onClick={() => handleCopy(artifacts.frontend.reactAppCode, 'reactCode')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-[#161c2e] transition"
                >
                  {copiedKey === 'reactCode' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'reactCode' ? 'Copied' : 'Copy React Component'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-64 leading-relaxed">
                {artifacts.frontend.reactAppCode}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 8: WORKSPACE FILES */}
        {activeTab === 'files' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col md:flex-row gap-4">
              {/* File list tree */}
              <div className="w-full md:w-56 space-y-1 border border-[#1b233a] rounded-xl p-2 bg-[#0c101c]">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 block">
                  Project Workspace
                </span>
                {Object.keys(artifacts.files).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                      activeFile === filename
                        ? 'bg-violet-500/15 text-violet-300 border border-violet-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#161c2e]'
                    }`}
                  >
                    <span className="truncate">{filename}</span>
                  </button>
                ))}
              </div>

              {/* File Viewer */}
              <div className="flex-1 border border-[#1b233a] rounded-xl overflow-hidden bg-[#07090e]">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1222] border-b border-[#1b233a]">
                  <span className="text-xs font-mono font-semibold text-slate-300">{activeFile}</span>
                  <button
                    onClick={() => handleCopy(artifacts.files[activeFile] || '', activeFile)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-[#161c2e] transition"
                  >
                    {copiedKey === activeFile ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === activeFile ? 'Copied' : 'Copy Content'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
                  {artifacts.files[activeFile] || '// Empty file'}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
