export type AgentRole = 'architect' | 'frontend' | 'integration' | 'qa';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  title: string;
  model: string;
  provider: string;
  cost: string;
  status: 'idle' | 'analyzing' | 'generating' | 'integrating' | 'verifying' | 'completed' | 'alert';
  currentTask: string;
  tools: string[];
  avatarColor: string;
}

export type PipelinePhase = 'intake' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'completed';

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: string;
  responseSample: string;
}

export interface TestCase {
  id: string;
  name: string;
  type: 'Unit' | 'E2E' | 'Security' | 'Integration';
  description: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING' | 'PENDING';
  latencyMs: number;
  assertion: string;
}

export interface ResearchPaper {
  source: string;
  title: string;
  authors: string;
  published: string;
  summary: string;
  url: string;
  relevanceScore: string;
  architecturalTakeaway: string;
}

export interface TokenMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  tokenSavingsRatio: string;
}

export interface SelfTestResult {
  id: string;
  name: string;
  type: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
  latencyMs: number;
  details: string;
}

export interface SystemDesign {
  hldDiagram: string;
  sequenceFlow: {
    step: number;
    from: string;
    to: string;
    action: string;
  }[];
  scalabilityStrategy: string;
  resilienceMatrix: {
    failure: string;
    mitigation: string;
  }[];
  dataAccessPatterns: string[];
}

export type FrontendFramework = 'React 19' | 'Next.js 15' | 'Vue 3' | 'Svelte 5';
export type BackendFramework = 'FastAPI (Python)' | 'Express.js (Node)' | 'Go Fiber' | 'NestJS';
export type DatabaseFramework = 'PostgreSQL (Supabase Free)' | 'SQLite / Turso' | 'MongoDB Atlas Free';
export type AiEngine = 'Google Gemini 3.8 Flash' | 'Groq Llama-3.3' | 'Hugging Face Free';

export type ColorTheme = 'emerald' | 'cyan' | 'violet' | 'amber';

export interface TechStackConfig {
  frontend: string;
  backend: string;
  database: string;
  aiModel: string;
  auth: string;
  hosting: string;
  architectureTopology?: string;
}

export interface ProjectSpec {
  id: string;
  name: string;
  tagline: string;
  requirements: string;
  scope: string;
  targetFeatures: string[];
  userRoles: string[];
  techStack: TechStackConfig;
}

export interface ProjectArtifacts {
  spec: ProjectSpec;
  architecture: {
    systemSummary: string;
    sqlSchema: string;
    openApiEndpoints: ApiEndpoint[];
    erDiagramAscii: string;
    architectNotes: string[];
  };
  systemDesign?: SystemDesign;
  frontend: {
    componentTree: string[];
    designSystem: {
      palette: string;
      theme: string;
      typography: string;
    };
    reactAppCode: string;
    uiHighlights: string[];
  };
  integration: {
    freeTierProviders: {
      name: string;
      quota: string;
      model: string;
      purpose: string;
    }[];
    apiClientCode: string;
    aiIntegrationSnippet: string;
    authFlowGuide: string;
  };
  qa: {
    testCases: TestCase[];
    edgeCasesAudited: string[];
    sonarMetrics: {
      bugs: number;
      vulnerabilities: number;
      codeSmells: number;
      coveragePct: number;
      freeTierCompliancePct: number;
    };
    validationChecklist: {
      title: string;
      checked: boolean;
      certifiedBy: string;
    }[];
  };
  researchPapers?: ResearchPaper[];
  tokenMetrics?: TokenMetrics;
  selfTests?: SelfTestResult[];
  certifiedComplete?: boolean;
  files: {
    [filename: string]: string;
  };
}

export interface AgentLogMessage {
  id: string;
  timestamp: string;
  fromAgent: AgentRole | 'coordinator';
  toAgent?: AgentRole | 'all';
  type: 'info' | 'artifact' | 'warning' | 'hotfix' | 'success';
  content: string;
}
