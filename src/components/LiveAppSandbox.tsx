import React, { useState } from 'react';
import { 
  Play, 
  ThumbsUp, 
  Plus, 
  Sparkles, 
  Kanban, 
  CheckCircle2, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Send, 
  RefreshCw, 
  FileText,
  AlertCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { ProjectArtifacts } from '../types';

interface LiveAppSandboxProps {
  project: ProjectArtifacts;
}

export const LiveAppSandbox: React.FC<LiveAppSandboxProps> = ({ project }) => {
  // FeedbackPulse State
  const [feedbackPosts, setFeedbackPosts] = useState([
    { id: '1', title: 'Export Roadmap to Markdown & CSV', category: 'Exports', votes: 48, status: 'backlog', sentiment: 'positive' },
    { id: '2', title: 'One-Click Supabase Auth Integration', category: 'Authentication', votes: 94, status: 'in_progress', sentiment: 'very_positive' },
    { id: '3', title: 'Automated Duplicate Clustering with Gemini Flash', category: 'AI Tools', votes: 112, status: 'completed', sentiment: 'positive' },
    { id: '4', title: 'Dark Mode Contrast AA Tweaks', category: 'UI/UX', votes: 31, status: 'in_progress', sentiment: 'neutral' },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [activeFilter, setActiveFilter] = useState<'all' | 'backlog' | 'in_progress' | 'completed'>('all');
  const [aiClusteringResult, setAiClusteringResult] = useState<string | null>(null);
  const [isClustering, setIsClustering] = useState(false);

  // SubSentinel State
  const [subs, setSubs] = useState([
    { id: 's1', name: 'GitHub Copilot Individual', cost: 10.00, cycle: 'Monthly', nextDate: 'Nov 12, 2026', category: 'Dev Tools' },
    { id: 's2', name: 'Supabase Pro (Upgrade Simulation)', cost: 25.00, cycle: 'Monthly', nextDate: 'Nov 18, 2026', category: 'Cloud' },
    { id: 's3', name: 'Spotify Premium', cost: 11.99, cycle: 'Monthly', nextDate: 'Nov 04, 2026', category: 'Media' },
  ]);
  const [cancellationDraft, setCancellationDraft] = useState<string | null>(null);

  // Handler for upvoting
  const handleVote = (id: string) => {
    setFeedbackPosts(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  // Handler for adding post
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      votes: 1,
      status: 'backlog' as const,
      sentiment: 'positive'
    };
    setFeedbackPosts([newPost, ...feedbackPosts]);
    setNewTitle('');
  };

  // Handler for AI Clustering
  const runAiClustering = () => {
    setIsClustering(true);
    setTimeout(() => {
      setAiClusteringResult(
        'Gemini 3.8 Flash Analysis: Detected 2 items related to "Developer Workflows & Auth". Semantic similarity score: 88%. Recommendation: Prioritize Supabase Auth integration first to satisfy 94 voters.'
      );
      setIsClustering(false);
    }, 800);
  };

  const filteredPosts = feedbackPosts.filter(p => activeFilter === 'all' || p.status === activeFilter);

  return (
    <div className="bg-[#0a0d16] border border-[#1b233a] rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Sandbox Control Bar */}
      <div className="px-5 py-3 bg-[#0d1222] border-b border-[#1b233a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Live Interactive Application Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c2e] text-cyan-300">
            Runtime: React 19 Client
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span>Target: {project.spec.name}</span>
        </div>
      </div>

      {/* Interactive App Screen */}
      <div className="p-5 bg-[#07090e]/70">
        
        {/* If FeedbackPulse */}
        {project.spec.id === 'feedback-hub' ? (
          <div className="space-y-5 max-w-4xl mx-auto bg-[#0a0d16] border border-[#1b233a] rounded-2xl p-5 shadow-2xl">
            {/* App Internal Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b233a]">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  FeedbackPulse <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">Roadmap v1.0</span>
                </h3>
                <p className="text-xs text-slate-400">Community submissions & zero-cost AI clustering</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={runAiClustering}
                  disabled={isClustering}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-medium transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>{isClustering ? 'Gemini Flash Clustering...' : 'Run AI Semantic Cluster'}</span>
                </button>
              </div>
            </div>

            {/* AI Cluster Announcement if triggered */}
            {aiClusteringResult && (
              <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 flex items-start gap-2.5 animate-in fade-in duration-200">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-violet-300">Google Gemini 3.8 Flash Insight:</span>
                  <p className="text-slate-300">{aiClusteringResult}</p>
                </div>
              </div>
            )}

            {/* Submit New Idea Form */}
            <form onSubmit={handleAddPost} className="flex flex-col sm:flex-row gap-2.5 bg-[#0c101c] p-3 rounded-xl border border-[#1b233a]">
              <input
                type="text"
                placeholder="Suggest a new feature idea (e.g. Slack Webhook Alerts)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-[#07090e] border border-[#1b233a] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-[#07090e] border border-[#1b233a] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Authentication">Authentication</option>
                <option value="Exports">Exports</option>
                <option value="UI/UX">UI/UX</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Submit Idea
              </button>
            </form>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 border-b border-[#1b233a] pb-2">
              {(['all', 'backlog', 'in_progress', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs px-3 py-1 rounded-lg capitalize font-medium transition ${
                    activeFilter === filter
                      ? 'bg-[#161c2e] text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#0c101c] border border-[#1b233a] rounded-xl p-4 flex flex-col justify-between hover:border-violet-500/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c2e] text-slate-300">
                        {post.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono capitalize px-2 py-0.5 rounded ${
                          post.status === 'completed'
                            ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/20'
                            : post.status === 'in_progress'
                            ? 'text-amber-300 bg-amber-950/40 border border-amber-500/20'
                            : 'text-slate-400 bg-[#161c2e]'
                        }`}
                      >
                        {post.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-100">{post.title}</h4>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1b233a]">
                    <span className="text-[10px] text-slate-500 font-mono">ID: #{post.id}</span>
                    <button
                      onClick={() => handleVote(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#161c2e] hover:bg-[#202b48] text-cyan-300 text-xs font-mono transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.votes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : project.spec.id === 'sub-sentinel' ? (
          /* SubSentinel Sandbox */
          <div className="space-y-5 max-w-4xl mx-auto bg-[#0a0d16] border border-[#1b233a] rounded-2xl p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1b233a]">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  SubSentinel Dashboard <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Zero Cost</span>
                </h3>
                <p className="text-xs text-slate-400">Total Monthly Burn: <span className="font-mono text-cyan-400 font-bold">$46.99 / mo</span></p>
              </div>
              <button
                onClick={() => setCancellationDraft('Dear Support,\n\nPlease cancel my recurring subscription immediately as I am auditing personal expenses. Confirm via email when processed.\n\nThank you.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>AI Draft Cancellation Letter</span>
              </button>
            </div>

            {cancellationDraft && (
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs space-y-1.5">
                <span className="font-mono text-cyan-400 font-semibold text-[11px]">Gemini 3.8 Flash Draft:</span>
                <pre className="text-slate-300 font-mono whitespace-pre-wrap">{cancellationDraft}</pre>
              </div>
            )}

            <div className="space-y-2">
              {subs.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-xl bg-[#0c101c] border border-[#1b233a] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{sub.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Next: {sub.nextDate}</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">${sub.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* General / Custom Spec Playground */
          <div className="max-w-4xl mx-auto bg-[#0a0d16] border border-[#1b233a] rounded-2xl p-6 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-100">{project.spec.name} Live Environment Ready</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              {project.spec.requirements}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-lg bg-[#0c101c] border border-[#1b233a]">
                <span className="text-[10px] font-mono text-slate-500 block">Database</span>
                <span className="text-xs font-medium text-slate-300">{project.spec.techStack.database}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0c101c] border border-[#1b233a]">
                <span className="text-[10px] font-mono text-slate-500 block">Backend Gateway</span>
                <span className="text-xs font-medium text-slate-300">{project.spec.techStack.backend}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0c101c] border border-[#1b233a]">
                <span className="text-[10px] font-mono text-slate-500 block">Cost Guarantee</span>
                <span className="text-xs font-medium text-emerald-400">$0.00 / month</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
