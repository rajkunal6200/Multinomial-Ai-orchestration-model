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
  Network,
  Laptop
} from 'lucide-react';
import { ProjectArtifacts } from '../types';
import { ResearchViewer } from './ResearchViewer';
import { TokenBudgetMeter } from './TokenBudgetMeter';
import { SelfTestHarness } from './SelfTestHarness';
import { SystemDesignStudio } from './SystemDesignStudio';
import { LiveAppSandbox } from './LiveAppSandbox';

export type ArtifactTabType = 
  | 'systemDesign' 
  | 'research' 
  | 'sandbox'
  | 'architecture' 
  | 'api' 
  | 'frontend' 
  | 'token' 
  | 'qa' 
  | 'files';

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
  const [activeFile, setActiveFile] = useState<string>(() => {
    return Object.keys(artifacts.files)[0] || 'api/main.py';
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFiles = () => {
    const content = JSON.stringify(artifacts.files, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifacts.spec.id || 'project'}-codebase.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'systemDesign', label: 'System Design (HLD/LLD)', icon: Network, pod: 'Architect' },
    { id: 'research', label: 'arXiv Research Grounding', icon: BookOpen, pod: 'Scholar' },
    { id: 'sandbox', label: 'Interactive App Sandbox', icon: Laptop, pod: 'Runtime' },
    { id: 'architecture', label: 'Database & SQL DDL', icon: Database, pod: 'Database' },
    { id: 'api', label: 'FastAPI & OpenAPI 3.1', icon: Code2, pod: 'REST API' },
    { id: 'files', label: 'Workspace Files', icon: FolderTree, pod: 'Codebase' },
    { id: 'token', label: 'Low-Token Economy', icon: Zap, pod: 'Optimizer' },
    { id: 'qa', label: '8-Point QA Self-Test', icon: ShieldCheck, pod: 'Certifier' },
  ] as const;

  return (
    <div className="bg-[#070f20] border border-[#142845] rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
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
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#142845] text-slate-300 hidden xl:inline">
                {tab.pod}
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

        {/* TAB 3: DYNAMIC INTERACTIVE RUNTIME SANDBOX */}
        {activeTab === 'sandbox' && (
          <LiveAppSandbox project={artifacts} />
        )}

        {/* TAB 4: DATABASE & SQL DDL */}
        {activeTab === 'architecture' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* System Summary */}
            <div className="p-4 rounded-xl bg-[#0c1833] border border-cyan-500/20">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Database & Schema Architecture
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {artifacts.architecture.systemSummary}
              </p>
            </div>

            {/* SQL Schema DDL */}
            <div className="border border-[#142845] rounded-xl overflow-hidden bg-[#050b18]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c1833] border-b border-[#142845]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-200">schema.sql</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    {artifacts.spec.techStack.database}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(artifacts.architecture.sqlSchema, 'sql')}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-[#142845] hover:bg-[#1c3960] transition"
                >
                  {copiedKey === 'sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-72 leading-relaxed">
                {artifacts.architecture.sqlSchema}
              </pre>
            </div>

            {/* ER Diagram ASCII & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-[#142845] rounded-xl p-4 bg-[#0c1833]">
                <h4 className="text-xs font-mono text-slate-300 font-semibold mb-2">
                  Relational Entity-Relationship Model (ASCII)
                </h4>
                <pre className="text-[11px] font-mono text-cyan-300/80 bg-[#050b18] p-3 rounded-lg border border-[#142845] overflow-x-auto leading-relaxed">
                  {artifacts.architecture.erDiagramAscii}
                </pre>
              </div>

              <div className="border border-[#142845] rounded-xl p-4 bg-[#0c1833] flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono text-slate-300 font-semibold mb-2">
                    Architectural Enforcement Directives
                  </h4>
                  <ul className="space-y-2">
                    {artifacts.architecture.architectNotes.map((note, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#142845] text-[11px] font-mono text-emerald-400">
                  Storage Ceiling: 500MB Free Tier with Index-Covered Queries
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: API & OPENAPI 3.1 */}
        {activeTab === 'api' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  REST API Endpoints (OpenAPI 3.1 Specification)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Synthesized for {artifacts.spec.name} with Pydantic validation & OpenAPI interactive Swagger at /docs
                </p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(artifacts.architecture.openApiEndpoints, null, 2), 'endpoints')}
                className="flex items-center gap-1 text-xs text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg bg-[#0c1833] hover:bg-[#142845] border border-[#142845] transition shrink-0"
              >
                {copiedKey === 'endpoints' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy OpenAPI JSON</span>
              </button>
            </div>

            <div className="space-y-3">
              {artifacts.architecture.openApiEndpoints.map((ep, idx) => (
                <div key={idx} className="border border-[#142845] rounded-xl bg-[#0c1833] p-4 space-y-2.5">
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
                      <code className="text-xs font-mono font-semibold text-slate-100">{ep.path}</code>
                    </div>
                    <span className="text-[11px] text-slate-400">{ep.description}</span>
                  </div>

                  {ep.requestBody && (
                    <div className="bg-[#050b18] rounded-lg p-2.5 border border-[#142845] text-[11px] font-mono text-slate-300">
                      <span className="text-[10px] text-slate-400 block mb-1">Request Body Schema:</span>
                      <code>{ep.requestBody}</code>
                    </div>
                  )}

                  <div className="bg-[#050b18] rounded-lg p-2.5 border border-[#142845] text-[11px] font-mono text-cyan-300 overflow-x-auto">
                    <span className="text-[10px] text-slate-400 block mb-1">Response Sample (200 OK):</span>
                    <code>{ep.responseSample}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: WORKSPACE CODE FILES */}
        {activeTab === 'files' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-emerald-400" />
                  Codebase File Explorer
                </h3>
                <p className="text-[11px] text-slate-400">
                  Target Stack: {artifacts.spec.techStack.frontend} + {artifacts.spec.techStack.backend}
                </p>
              </div>
              <button
                onClick={handleDownloadFiles}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1833] hover:bg-[#142845] border border-[#142845] text-xs font-mono text-cyan-300 transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Bundle (JSON)</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* File list tree */}
              <div className="w-full md:w-60 space-y-1 border border-[#142845] rounded-xl p-2 bg-[#0c1833]">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 block">
                  Project Files ({Object.keys(artifacts.files).length})
                </span>
                {Object.keys(artifacts.files).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                      activeFile === filename
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#142845]'
                    }`}
                  >
                    <span className="truncate">{filename}</span>
                  </button>
                ))}
              </div>

              {/* File Viewer */}
              <div className="flex-1 border border-[#142845] rounded-xl overflow-hidden bg-[#050b18]">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c1833] border-b border-[#142845]">
                  <span className="text-xs font-mono font-semibold text-slate-200">{activeFile}</span>
                  <button
                    onClick={() => handleCopy(artifacts.files[activeFile] || '', activeFile)}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-[#142845] hover:bg-[#1c3960] transition"
                  >
                    {copiedKey === activeFile ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === activeFile ? 'Copied' : 'Copy File'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed">
                  {artifacts.files[activeFile] || '// Empty file'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: LOW-TOKEN ECONOMY */}
        {activeTab === 'token' && (
          <TokenBudgetMeter metrics={artifacts.tokenMetrics} />
        )}

        {/* TAB 8: SELF-TESTING & QA */}
        {activeTab === 'qa' && (
          <SelfTestHarness
            tests={artifacts.selfTests}
            certifiedComplete={artifacts.certifiedComplete}
            projectId={artifacts.spec.id}
            onRunTests={onRunSelfTests}
            isRunning={isSelfTesting}
          />
        )}

      </div>
    </div>
  );
};
