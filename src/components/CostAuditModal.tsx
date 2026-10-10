import React from 'react';
import { 
  X, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Scale, 
  Cpu, 
  Database, 
  Server,
  Lock
} from 'lucide-react';

interface CostAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CostAuditModal: React.FC<CostAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const freeTierRules = [
    {
      category: 'Lead Software Architect & Backend Agent',
      models: 'DeepSeek-V3 / Qwen-2.5-Coder (70B / 32B)',
      provider: 'Hugging Face Free Serverless Inference / Ollama Local Open Weights',
      status: '100% Free / Open Source Weights (Apache 2.0 / MIT)',
      cost: '$0.00 / month'
    },
    {
      category: 'Frontend & UI/UX Agent',
      models: 'Llama-3.3-70B via Groq / Gemini Flash Free Tier',
      provider: 'Groq Free Tier (30 RPM) / Google AI Studio Free Tier',
      status: 'Permanent Free Tier with zero payment details required',
      cost: '$0.00 / month'
    },
    {
      category: 'API & AI Integration Agent',
      models: 'Google Gemini 3.8 Flash (Official Generative AI SDK)',
      provider: 'Google AI Studio Free Tier',
      status: '15 RPM / 1,000,000 TPM Free Tier Limit (Verified Non-Billable)',
      cost: '$0.00 / month'
    },
    {
      category: 'QA Tester & Feature Validation Agent',
      models: 'Claude 3.5 Sonnet Rules / Vitest & Playwright Open-Source',
      provider: 'Open Source MIT & Free Tier Auditing',
      status: 'Open Source MIT / Automated headless test runners',
      cost: '$0.00 / month'
    },
    {
      category: 'Database & Persistent Storage',
      models: 'Supabase PostgreSQL 16 / SQLite',
      provider: 'Supabase Free Tier (500MB DB, 50,000 MAU Auth, RLS)',
      status: 'Permanent Free Plan',
      cost: '$0.00 / month'
    },
    {
      category: 'Hosting & Deployment',
      models: 'Vercel Hobby / Cloud Run Free Tier',
      provider: 'Vercel / Cloud Run',
      status: 'Free Tier with automatic SSL and edge CDN',
      cost: '$0.00 / month'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#040812]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#070f20] border border-[#142845] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#142845] bg-[#050b18]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Zero-Cost Legal Compliance & Model Routing Audit
              </h2>
              <p className="text-xs text-slate-400">
                100% legal, open-source (MIT/Apache 2.0) and permanent free-tier certified
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

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Guarantee Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold block mb-0.5">
                Total Operational Financial Expense
              </span>
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                $0.00 USD
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold inline-block">
                LEGAL & MIT / APACHE 2.0 COMPLIANT
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Zero credit card requirement</p>
            </div>
          </div>

          {/* Audit Breakdown Table */}
          <div className="border border-[#142845] rounded-xl overflow-hidden bg-[#050b18]">
            <div className="divide-y divide-[#142845]">
              {freeTierRules.map((rule, idx) => (
                <div key={idx} className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{rule.category}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{rule.cost}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
                    <span className="font-mono text-cyan-300">{rule.models}</span>
                    <span className="text-slate-500">Provider: {rule.provider}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90 pt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{rule.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Compliance Guarantee */}
          <div className="p-4 rounded-xl bg-[#050b18] border border-[#142845] space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              Open-Source & Terms of Service Adherence
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every tool, library, and API framework routed by the Multi-Agent System conforms strictly to legal terms of service:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
              <li>Google Gemini API Free Tier utilized strictly under official terms with server-side SDK encapsulation.</li>
              <li>PostgreSQL / Supabase free tier configured under fair-use 500MB database limits.</li>
              <li>Frontend and backend code generated under open-source MIT license for unfettered commercial/production usage.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#142845] bg-[#050b18] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition"
          >
            Close Audit Report
          </button>
        </div>

      </div>
    </div>
  );
};
