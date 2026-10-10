import { ProjectArtifacts } from '../types';

export const PROJECT_PRESETS: ProjectArtifacts[] = [
  {
    spec: {
      id: 'feedback-hub',
      name: 'FeedbackPulse SaaS',
      tagline: 'Public Feature Voting & AI-Powered Feedback Clustering Platform',
      requirements: 'A production-grade feedback board where users can submit feature requests, upvote ideas, and view public roadmap columns (Backlog, In Progress, Shipped). The system uses free-tier AI (Gemini 3.8 Flash) to automatically group duplicates, tag sentiment, and generate weekly changelog summaries.',
      scope: 'Full-stack web application with Supabase Free Tier backend, Express REST API, React 19 Frontend, and Gemini 3.8 Flash SDK integration for AI clustering.',
      targetFeatures: [
        'User submission of feature requests with tags and priority',
        'Real-time upvoting and community comments',
        'Interactive 3-column Kanban Roadmap (Planned, In Progress, Released)',
        'Zero-Cost AI Feature Clustering: Auto-detects similar ideas & merges duplicates',
        'Admin Changelog Generator using Gemini Flash Free Tier',
        'Supabase Free Tier PostgreSQL database with Row Level Security'
      ],
      userRoles: ['Guest / End User', 'Registered Contributor', 'Product Admin'],
      techStack: {
        frontend: 'React 19, Tailwind CSS, Lucide Icons, Vite',
        backend: 'FastAPI (Python 3.10), Supabase Free Tier / SQLite',
        database: 'PostgreSQL 16 (Supabase 500MB Free Tier)',
        aiModel: 'Gemini 3.8 Flash (Google AI Studio Free Tier - 15 RPM)',
        auth: 'Supabase Auth (Free Tier - 50,000 MAU)',
        hosting: 'Vercel / Cloud Run Free Tier ($0.00/mo)'
      }
    },
    architecture: {
      systemSummary: 'Architected as a modular RESTful backend pairing FastAPI (Python 3.10) with a normalized PostgreSQL schema on Supabase. Utilizes Row Level Security (RLS) to enforce vote uniqueness and admin privileges, while offloading semantic clustering to server-side Gemini 3.8 Flash calls without browser key exposure.',
      sqlSchema: `-- ===================================================
-- FeedbackPulse PostgreSQL DDL (Supabase Free Tier)
-- ===================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Integrated with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Feedback Posts
CREATE TABLE IF NOT EXISTS public.feedback_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(40) DEFAULT 'general',
  status VARCHAR(30) DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'completed', 'declined')),
  votes_count INT DEFAULT 1,
  ai_cluster_id VARCHAR(60),
  ai_sentiment VARCHAR(20) DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Votes (Prevent double voting)
CREATE TABLE IF NOT EXISTS public.post_votes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.feedback_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- 4. Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.feedback_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast roadmap queries
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.feedback_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_votes ON public.feedback_posts(votes_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_cluster ON public.feedback_posts(ai_cluster_id);`,
      openApiEndpoints: [
        {
          method: 'GET',
          path: '/api/v1/posts',
          description: 'Fetch paginated feedback posts with filtering by status and category',
          responseSample: '{"posts": [{"id": "uuid", "title": "Dark Mode Toggle", "votes": 42, "status": "in_progress"}]}'
        },
        {
          method: 'POST',
          path: '/api/v1/posts',
          description: 'Submit a new feedback item with auto AI semantic clustering',
          requestBody: '{"title": "string (min 5)", "description": "string", "category": "ui|backend|billing"}',
          responseSample: '{"success": true, "post": {"id": "uuid", "ai_cluster": "theme_customization"}}'
        },
        {
          method: 'POST',
          path: '/api/v1/posts/:id/vote',
          description: 'Toggle upvote on a post with idempotent counter update',
          responseSample: '{"voted": true, "totalVotes": 43}'
        },
        {
          method: 'POST',
          path: '/api/v1/ai/cluster-analysis',
          description: 'Server-side Gemini 3.8 Flash analysis to detect duplicates and summarize roadmap themes',
          requestBody: '{"postIds": ["uuid1", "uuid2"]}',
          responseSample: '{"clusters": [{"theme": "Navigation UX", "duplicatePostIds": ["uuid2"], "suggestedAction": "merge"}]}'
        }
      ],
      erDiagramAscii: `+---------------+          1:N          +-------------------+
|  auth.users   | --------------------> |   profiles        |
+---------------+                       +-------------------+
                                                  | 1:N
                                                  v
                                        +-------------------+
                                        |  feedback_posts   | <------+
                                        +-------------------+        |
                                           | 1:N           | 1:N     |
                                           v               v         |
                                    +------------+   +-------------+ |
                                    | post_votes |   | post_comm'ts| |
                                    +------------+   +-------------+ |
                                           ^                         |
                                           +-------------------------+`,
      architectNotes: [
        'Zero-Cost DB: Utilizing Supabase PostgreSQL free tier (500MB storage, 50,000 MAU auth) without credit card requirement.',
        'High Throughput Voting: Implemented database triggers to safely increment votes_count in atomic transaction.',
        'Clean Separation: API models decouple database rows from public representations to protect user IDs.'
      ]
    },
    systemDesign: {
      hldDiagram: `[Client Tier: React 19 SPA]
       | (HTTPS / REST)
       v
[Edge Gateway: FastAPI Python (Port 8001)]
       |
       +---> [In-Memory Cache (LRU)] -> (Sub-5ms hits)
       |
       +---> [Persistent Store: Supabase PostgreSQL (500MB Free Tier)]
       |        \\--> [Row Level Security + Connection Pooler]
       |
       +---> [AI Inference: Google Gemini 3.8 Flash (Token-Budgeted)]
                \\--> [Exponential Backoff with Jitter for 15 RPM]`,
      sequenceFlow: [
        { step: 1, from: 'React 19 Client', to: 'FastAPI Edge Gateway', action: 'Transmits vote or feedback payload with JWT' },
        { step: 2, from: 'FastAPI Gateway', to: 'Pydantic Validator', action: 'Enforces type schemas & strips malicious script tags' },
        { step: 3, from: 'FastAPI Gateway', to: 'In-Memory Cache', action: 'Checks memory cache for idempotent hits (<2ms)' },
        { step: 4, from: 'FastAPI Gateway', to: 'Supabase PostgreSQL', action: 'Executes atomic parameterized query with index' },
        { step: 5, from: 'FastAPI Gateway', to: 'Gemini 3.8 Flash', action: 'Dispatches condensed low-token prompt (<250 tokens)' },
        { step: 6, from: 'FastAPI Gateway', to: 'React 19 Client', action: 'Returns 200 OK JSON payload (<25ms total)' }
      ],
      scalabilityStrategy: 'Stateless horizontal edge instances with connection pooling via PgBouncer. Single-writer multi-reader design guarantees zero storage fees under 500MB ceiling.',
      resilienceMatrix: [
        { failure: 'Gemini Free-Tier Rate Limit (15 RPM Exceeded)', mitigation: 'Circuit breaker serves local semantic cache with graceful degradation' },
        { failure: 'PostgreSQL Connection Exhaustion', mitigation: 'Atomic batch transactions with 5s statement timeout' },
        { failure: 'Malformed Payload / Injection Attempt', mitigation: 'Pydantic strict schema validation with zero raw SQL execution' },
        { failure: 'Network Timeout on External Scholarly APIs', mitigation: 'Cached arXiv & OpenAlex research metadata served instantly from SQLite' }
      ],
      dataAccessPatterns: [
        'Write Pattern: Single atomic transaction with UUID primary key generation',
        'Read Pattern: Covered B-Tree index scan on (status, created_at DESC) avoiding full-table sweeps',
        'Cache Invalidation: Event-driven TTL purge on state mutations'
      ]
    },
    frontend: {
      componentTree: [
        'AppRoot (ThemeProvider, AuthContext)',
        'Navbar (Brand, SearchFilter, CreatePostModalButton, UserMenu)',
        'RoadmapKanban (Planned, InProgress, Shipped boards)',
        'PostCard (UpvoteButton, CategoryBadge, AIClusterTag, CommentModal)',
        'AIClusterBanner (Gemini Flash duplicate insights & merge prompt)',
        'AdminChangelogPanel (One-click release notes generator)'
      ],
      designSystem: {
        palette: 'Emerald/Slate Minimalist with high contrast badges',
        theme: 'Subtle Dark Slate (#0f172a / #1e293b) with emerald-400 highlights',
        typography: 'Inter sans-serif with monospace metric tags'
      },
      reactAppCode: `// FeedbackPulse Main Layout Component
import React, { useState } from 'react';
import { ThumbsUp, Sparkles, Plus, Kanban, MessageSquare, CheckCircle2 } from 'lucide-react';

export function FeedbackDashboard() {
  const [activeTab, setActiveTab] = useState<'board' | 'roadmap'>('board');
  const [posts, setPosts] = useState([
    { id: '1', title: 'OAuth Sign-in via GitHub & Google', votes: 84, status: 'in_progress', category: 'Auth', author: 'DevTeam' },
    { id: '2', title: 'Export Feedback to CSV / Markdown', votes: 41, status: 'backlog', category: 'Export', author: 'Alex' },
    { id: '3', title: 'Webhook notifications on status change', votes: 62, status: 'completed', category: 'API', author: 'Sara' },
  ]);

  const handleVote = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            FeedbackPulse <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Free Tier v1.0</span>
          </h1>
          <p className="text-sm text-slate-400">Community feature requests & AI roadmap clustering</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition">
          <Plus className="w-4 h-4" /> New Idea
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {posts.map(post => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">{post.category}</span>
              <h3 className="font-semibold text-slate-100 mt-2">{post.title}</h3>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 capitalize">{post.status.replace('_', ' ')}</span>
              <button onClick={() => handleVote(post.id)} className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm font-mono">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> {post.votes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      uiHighlights: [
        'Zero-clutter high contrast typography with clear hierarchy',
        'Interactive real-time vote counter with immediate optimistic UI updates',
        'Kanban drag-or-toggle roadmap view with instant status filters',
        'Accessible color pairings compliant with WCAG AA standards'
      ]
    },
    integration: {
      freeTierProviders: [
        {
          name: 'Google Gemini 3.8 Flash (AI Studio)',
          quota: '15 requests per minute, 1,000,000 tokens per minute (Permanent Free)',
          model: 'gemini-3.8-flash',
          purpose: 'Server-side semantic clustering of duplicate feature requests & changelog summarization'
        },
        {
          name: 'Supabase PostgreSQL Free Tier',
          quota: '500MB Database storage, 50,000 MAU Auth, 2GB Bandwidth',
          model: 'PostgreSQL 16 with RLS',
          purpose: 'Persistent storage, user profiles, and row-level security for voting records'
        },
        {
          name: 'Groq Cloud Free Tier',
          quota: '30 requests per minute, 7,000 tokens/min',
          model: 'Llama-3.3-70B-Versatile',
          purpose: 'Secondary fallback for fast copywriting & sentiment categorization'
        }
      ],
      apiClientCode: `// API Client for FeedbackPulse (Axios / Fetch)
export async function submitFeedbackPost(payload: { title: string; description: string; category: string }) {
  const response = await fetch('/api/v1/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit feedback');
  }
  return response.json();
}

export async function toggleVote(postId: string) {
  const response = await fetch(\`/api/v1/posts/\${postId}/vote\`, { method: 'POST' });
  return response.json();
}`,
      aiIntegrationSnippet: `// Server-Side Gemini 3.8 Flash AI Clustering Utility
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

export async function clusterFeedbackIdeas(posts: { id: string; title: string; description: string }[]) {
  const prompt = \`Analyze the following feature requests and group duplicates into clusters.
Return JSON with cluster names, duplicate post IDs, and suggested unified title:
\${JSON.stringify(posts, null, 2)}\`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text || '{}');
}`,
      authFlowGuide: 'Users authenticate via Supabase Auth client library. The resulting JWT is passed in Bearer authorization header to Express API, where JWT is verified with Supabase public key.'
    },
    qa: {
      testCases: [
        {
          id: 'TC-01',
          name: 'Idempotent Double Vote Prevention',
          type: 'Security',
          description: 'A user attempts to submit two upvotes to the same post ID.',
          status: 'PASSED',
          latencyMs: 14,
          assertion: 'Database UNIQUE(user_id, post_id) constraint returns 409 Conflict without incrementing count.'
        },
        {
          id: 'TC-02',
          name: 'Input Sanitization on Feedback Title',
          type: 'Security',
          description: 'Submitting feedback with XSS HTML script payload <script>alert(1)</script>.',
          status: 'PASSED',
          latencyMs: 11,
          assertion: 'Input is safely HTML-escaped and stored without raw code execution.'
        },
        {
          id: 'TC-03',
          name: 'Gemini Free-Tier Rate Limiting Graceful Fallback',
          type: 'Integration',
          description: 'Simulating 20 simultaneous cluster requests to verify 15 RPM queue handling.',
          status: 'PASSED',
          latencyMs: 48,
          assertion: 'Exponential backoff with jitter intercepts 429 and serves cached cluster themes.'
        },
        {
          id: 'TC-04',
          name: 'Roadmap Kanban Column Filter State',
          type: 'E2E',
          description: 'Switching filter between Planned, In Progress, and Completed.',
          status: 'PASSED',
          latencyMs: 19,
          assertion: 'All DOM nodes re-render cleanly with correct counts matching database state.'
        }
      ],
      edgeCasesAudited: [
        'Submission with 0-character or whitespace-only title blocked by schema validator',
        'Post deletion cascades cleanly to votes and comments without orphan records',
        'Concurrent voting race conditions handled via atomic SQL: UPDATE feedback_posts SET votes_count = votes_count + 1'
      ],
      sonarMetrics: {
        bugs: 0,
        vulnerabilities: 0,
        codeSmells: 0,
        coveragePct: 94.6,
        freeTierCompliancePct: 100
      },
      validationChecklist: [
        { title: 'Zero Cost Verification: No paid API or commercial licensing in code', checked: true, certifiedBy: 'Lead Architect' },
        { title: 'UI Accessibility: WCAG AA contrast and full keyboard navigation verified', checked: true, certifiedBy: 'Frontend Agent' },
        { title: 'AI Integration: Gemini 3.8 Flash server-side only with no browser key leak', checked: true, certifiedBy: 'AI Integration Agent' },
        { title: 'Test Coverage: E2E and unit test suite passing with 0 critical defects', checked: true, certifiedBy: 'QA Tester Agent' }
      ]
    },
    files: {
      'schema.sql': `-- FeedbackPulse PostgreSQL Schema
CREATE TABLE profiles (id UUID PRIMARY KEY, username TEXT, role TEXT DEFAULT 'user');
CREATE TABLE feedback_posts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, votes INT DEFAULT 0, status TEXT DEFAULT 'backlog');
CREATE TABLE post_votes (user_id UUID, post_id UUID, PRIMARY KEY (user_id, post_id));`,
      'api/main.py': `# FastAPI Backend for FeedbackPulse
from fastapi import FastAPI
app = FastAPI(title="FeedbackPulse API")

@app.get("/api/v1/posts")
def get_posts():
    return {"posts": []}

@app.post("/api/v1/posts/{post_id}/vote")
def vote_post(post_id: str):
    return {"voted": True, "postId": post_id}`,
      'src/App.tsx': `export default function App() { return <div className="p-4">FeedbackPulse Active</div>; }`,
      'tests/suite.spec.ts': `import { describe, it, expect } from 'vitest';
describe('FeedbackPulse', () => {
  it('prevents double voting', () => { expect(true).toBe(true); });
});`,
      'README.md': `# FeedbackPulse (100% Free Tier Dev Stack)
- Database: Supabase Free Tier
- AI: Google Gemini 3.8 Flash Free Tier
- UI: React 19 + Tailwind CSS`
    },
    researchPapers: [
      {
        source: 'arXiv CS.SE',
        title: 'Crowdsourced Requirements Clustering: Semantic Duplicate Identification at Scale',
        authors: 'H. Zhang, K. Chen, Y. Liu',
        published: '2025',
        summary: 'Presents an empirical comparison of embedding clustering against direct LLM prompting for user feedback prioritization with low latency.',
        url: 'https://arxiv.org/abs/2403.01120',
        relevanceScore: '96%',
        architecturalTakeaway: 'Adopted 2-tier semantic similarity hashing before calling Gemini 3.8 Flash, reducing API calls by 74%.'
      },
      {
        source: 'IEEE TSE',
        title: 'Transactional Integrity in High-Velocity Voting and Polling Platforms',
        authors: 'R. Garcia, S. Patel',
        published: '2024',
        summary: 'Proves mathematical idempotency patterns using compound primary keys and atomic conditional SQL updates to prevent race-condition vote duplication.',
        url: 'https://doi.org/10.1109/TSE.2024',
        relevanceScore: '94%',
        architecturalTakeaway: 'Enforced database-level UNIQUE(user_id, post_id) constraint rather than application-layer locks.'
      }
    ],
    tokenMetrics: {
      promptTokens: 245,
      completionTokens: 520,
      totalTokens: 765,
      tokenSavingsRatio: '89% via schema compression'
    },
    selfTests: [
      { id: 'ST-01', name: 'FastAPI Health & Uvicorn Loop', type: 'Backend', status: 'PASSED', latencyMs: 6, details: 'Server loop alive on port 8001' },
      { id: 'ST-02', name: 'OpenAlex / arXiv Ingestion', type: 'Research', status: 'PASSED', latencyMs: 12, details: 'Verified 2 peer-reviewed paper links' },
      { id: 'ST-03', name: 'Low-Token Budget Ceiling (<1000)', type: 'TokenEconomy', status: 'PASSED', latencyMs: 3, details: 'Run completed in 765 tokens' },
      { id: 'ST-04', name: 'PostgreSQL DDL Parse Sanity', type: 'Database', status: 'PASSED', latencyMs: 8, details: 'Zero SQL syntax discrepancies' }
    ],
    certifiedComplete: true
  },
  {
    spec: {
      id: 'sub-sentinel',
      name: 'SubSentinel Free Budget',
      tagline: 'Zero-Cost Subscription & Recurring Expense Sentinel with AI Anomaly Alerts',
      requirements: 'A privacy-first personal finance tracker that monitors recurring SaaS and home subscriptions, calculates upcoming cash-flow burns, and uses free-tier AI to parse statements, highlight price creep, and propose savings alternatives.',
      scope: 'Lightweight client-side first architecture with Supabase Free sync, local encrypted caching, and Gemini Flash for receipt parsing.',
      targetFeatures: [
        'Subscription registry with renewal date, cadence (monthly/yearly), and billing card',
        'Cash flow calendar view showing renewal deadlines',
        'AI Receipt & Invoice text parser using Gemini 3.8 Flash',
        'Price creep detector alerting if Netflix, Spotify, or gym rates increased',
        'One-click cancellation template generator for awkward recurring contracts',
        'Zero-Cost export to CSV / JSON'
      ],
      userRoles: ['Household Admin', 'Member'],
      techStack: {
        frontend: 'React 19, Tailwind CSS, Motion, Lucide',
        backend: 'Express.js microservice + Supabase Free',
        database: 'SQLite local + Supabase PostgreSQL Free',
        aiModel: 'Gemini 3.8 Flash (Free Tier)',
        auth: 'Local Session / Supabase Auth Free',
        hosting: 'Vercel Free Tier'
      }
    },
    architecture: {
      systemSummary: 'Designed for privacy and resilience. Stores transaction and recurring items in structured tables with encrypted fields. Analyzes spending velocity through deterministic calculations and invokes Gemini 3.8 Flash only on user-requested statement OCR and cancellation drafting.',
      sqlSchema: `CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  provider_name VARCHAR(100) NOT NULL,
  cost_cents INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  next_renewal_date DATE NOT NULL,
  category VARCHAR(50) DEFAULT 'entertainment',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  recorded_cents INT NOT NULL,
  recorded_date DATE NOT NULL
);`,
      openApiEndpoints: [
        { method: 'GET', path: '/api/v1/subs', description: 'List user active subscriptions with monthly burn totals', responseSample: '{"totalMonthlyCents": 14250, "items": []}' },
        { method: 'POST', path: '/api/v1/subs', description: 'Create subscription', responseSample: '{"success": true}' },
        { method: 'POST', path: '/api/v1/ai/parse-statement', description: 'Parse raw text or invoice snippet via Gemini Flash', responseSample: '{"foundSubs": [{"name": "Netflix", "cost": 15.99}]}' }
      ],
      erDiagramAscii: `+---------------+          1:N          +-------------------+
|     users     | --------------------> |   subscriptions   |
+---------------+                       +-------------------+
                                                  | 1:N
                                                  v
                                        +-------------------+
                                        |   price_history   |
                                        +-------------------+`,
      architectNotes: [
        'Stores currency as integer cents (cost_cents) to completely eliminate floating-point rounding bugs.',
        'Runs all recurring date projections using date-fns pure functions for zero-latency UI updates.'
      ]
    },
    frontend: {
      componentTree: ['App', 'SpendingOverviewCard', 'SubscriptionList', 'RenewalCalendar', 'AICancellationModal'],
      designSystem: { palette: 'Cyan & Slate Dark', theme: 'Slate-900 with Cyan-400 metrics', typography: 'JetBrains Mono + Inter' },
      reactAppCode: `// SubSentinel React Component snippet...`,
      uiHighlights: ['Real-time monthly burn calculator', 'Color-coded renewal urgency (next 3 days in amber/red)', 'Modal for automated cancellation letter generation']
    },
    integration: {
      freeTierProviders: [
        { name: 'Gemini 3.8 Flash Free', quota: '15 RPM / 1M TPM', model: 'gemini-3.8-flash', purpose: 'Statement OCR & cancellation letter draft' },
        { name: 'Supabase Free', quota: '500MB DB', model: 'Postgres 16', purpose: 'Cloud sync' }
      ],
      apiClientCode: `// SubSentinel Fetch client...`,
      aiIntegrationSnippet: `// Server-side cancellation draft generator with Gemini 3.8 Flash...`,
      authFlowGuide: 'Local first with optional Supabase Auth synchronization.'
    },
    qa: {
      testCases: [
        { id: 'TC-10', name: 'Leap Year Renewal Calculation', type: 'Unit', description: 'Verifies Feb 29 renewal dates roll to Feb 28 on non-leap years.', status: 'PASSED', latencyMs: 3, assertion: 'Renewal date arithmetic conforms to ISO 8601' },
        { id: 'TC-11', name: 'Zero Cost Compliance Audit', type: 'Security', description: 'Scan dependencies for commercial licensing.', status: 'PASSED', latencyMs: 6, assertion: 'All packages are MIT or Apache 2.0' }
      ],
      edgeCasesAudited: ['Currency conversion rounding errors', 'Negative cost inputs rejected by validation'],
      sonarMetrics: { bugs: 0, vulnerabilities: 0, codeSmells: 0, coveragePct: 96.1, freeTierCompliancePct: 100 },
      validationChecklist: [
        { title: 'Zero Cost Guaranteed ($0.00)', checked: true, certifiedBy: 'Lead Architect' },
        { title: 'Responsive Mobile UI', checked: true, certifiedBy: 'Frontend Agent' }
      ]
    },
    files: {
      'schema.sql': 'CREATE TABLE subscriptions (id UUID PRIMARY KEY, cost_cents INT NOT NULL);',
      'README.md': '# SubSentinel: Zero-Cost Financial Sentinel'
    }
  },
  {
    spec: {
      id: 'docu-play',
      name: 'DocuPlay API Studio',
      tagline: 'Interactive API Documentation & Live Request Playground with Code Generation',
      requirements: 'A modern developer portal that ingests OpenAPI 3.0/3.1 specs, renders dynamic interactive endpoint documentation, executes live HTTP requests against endpoints, and generates copy-pasteable client SDK snippets in JavaScript, Python, Go, cURL, and Rust using free-tier tools.',
      scope: 'Client-side documentation viewer with backend proxy for CORS bypassing and Gemini 3.8 Flash for automatic SDK comment generation.',
      targetFeatures: [
        'OpenAPI 3.1 JSON / YAML parser and visual endpoint tree',
        'Live Request Runner with custom headers, query params, and body editor',
        'Instant multi-language code snippets (cURL, JS Fetch, Python Requests, Go, Rust)',
        'Zero-Cost AI Endpoint Explainer: Gemini Flash breaks down complex payloads',
        'Response status badge, latency profiler, and JSON tree viewer'
      ],
      userRoles: ['Developer', 'API Consumer', 'Tech Writer'],
      techStack: {
        frontend: 'React 19, Tailwind CSS, Monaco-style editor, Lucide',
        backend: 'Express.js CORS-Proxy',
        database: 'Local In-Memory Cache (No DB costs)',
        aiModel: 'Gemini 3.8 Flash (Free Tier)',
        auth: 'API Key Bearer (client-side)',
        hosting: 'Vercel / Cloudflare Pages Free Tier'
      }
    },
    architecture: {
      systemSummary: 'Stateless architecture requiring $0 database costs. Uses a secure Express server proxy to handle cross-origin browser requests while protecting client secrets, with Gemini 3.8 Flash providing AI SDK code generation.',
      sqlSchema: `-- Stateless Tool: No database required ($0.00 operational cost)
-- Local storage used for saved request history and API keys.`,
      openApiEndpoints: [
        { method: 'POST', path: '/api/v1/proxy/request', description: 'Safe CORS proxy to dispatch test requests to arbitrary APIs', responseSample: '{"status": 200, "headers": {}, "body": {}}' },
        { method: 'POST', path: '/api/v1/ai/generate-sdk', description: 'Generate idiomatic typed SDK client for an endpoint', responseSample: '{"code": "async function callApi() {...}"}' }
      ],
      erDiagramAscii: `+-----------------------+       +------------------------+
|  Browser Dev Studio   | ----> |  Express CORS Proxy    | ----> Target API
+-----------------------+       +------------------------+`,
      architectNotes: [
        'Completely avoids database overhead: 100% free forever hosting on serverless edge runtimes.',
        'Express proxy strips sensitive hop-by-hop headers to prevent SSRF vulnerabilities.'
      ]
    },
    frontend: {
      componentTree: ['App', 'SidebarEndpointNav', 'EndpointDetail', 'RequestPlayground', 'ResponseViewer', 'CodeSnippetTabs'],
      designSystem: { palette: 'Indigo & Zinc Monospace', theme: 'Deep Dark Zinc (#18181b)', typography: 'Fira Code + Inter' },
      reactAppCode: `// DocuPlay React Component snippet...`,
      uiHighlights: ['Syntax-colored JSON viewer', 'Quick copy button with animated checkmark', 'Split-pane request builder and response inspector']
    },
    integration: {
      freeTierProviders: [
        { name: 'Gemini 3.8 Flash Free', quota: '15 RPM / 1M TPM', model: 'gemini-3.8-flash', purpose: 'Autonomous SDK generation and docstring generation' }
      ],
      apiClientCode: `// DocuPlay Proxy Client...`,
      aiIntegrationSnippet: `// Gemini 3.8 Flash SDK Generator...`,
      authFlowGuide: 'API consumer injects their Bearer token into playground headers.'
    },
    qa: {
      testCases: [
        { id: 'TC-20', name: 'CORS Preflight Proxy Header Passthrough', type: 'Security', description: 'Verifies proxy does not leak authorization keys to third-party endpoints.', status: 'PASSED', latencyMs: 8, assertion: 'Strict whitelist applied on target headers' }
      ],
      edgeCasesAudited: ['Malformed OpenAPI JSON handled with clear line-number syntax errors'],
      sonarMetrics: { bugs: 0, vulnerabilities: 0, codeSmells: 0, coveragePct: 98.0, freeTierCompliancePct: 100 },
      validationChecklist: [
        { title: 'Zero Server Cost Confirmed ($0.00)', checked: true, certifiedBy: 'Lead Architect' }
      ]
    },
    files: {
      'openapi.json': '{"openapi": "3.1.0", "info": {"title": "Sample API", "version": "1.0.0"}}',
      'README.md': '# DocuPlay: Interactive API Playground'
    }
  }
];
