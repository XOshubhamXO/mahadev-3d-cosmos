export const PHI = 1.61803398875;
export const GOLDEN_RATIO = PHI;
export const GOLDEN_ANGLE = Math.PI * 2 * (1 - 1 / PHI); // ~137.507764 degrees (~2.399963 rad)
export const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

export type AgentGeometryType =
  | 'icosahedron'
  | 'dodecahedron'
  | 'octahedron'
  | 'tetrahedron'
  | 'torusKnot'
  | 'cuboctahedron'
  | 'icosidodecahedron'
  | 'goldenTorus';

export type ImportanceTier = 'CRITICAL' | 'CORE' | 'SPECIALIST' | 'ADVISORY';

export interface Agent3D {
  id: string;
  name: string;
  department: string;
  role: string;
  archetype: string;
  archetypeSanskrit: string;
  importanceTier: ImportanceTier;
  geometryType: AgentGeometryType;
  nodeScale: number;
  ringCount: number;
  color: string;
  accentColor: string;
  access: string;
  hardwareTarget: string;
  verificationScope: string;
  mandate: string;
  longDescription: string;
  sampleWorkflow: string;
  tools: string[];
  tierIndex: number;      // 0 = Executive (R=16), 1 = Core (R=26), 2 = Strategy (R=42), 3 = Outer (R=68)
  angularOffset: number;  // Symmetrical radians
  orbitRadius: number;    // Exact Golden Ratio quantized radius
  orbitSpeed: number;     // Keplerian harmonic angular velocity
  orbitInclination: number; // Symmetrical inclination angle
  phiHarmonicIndex: number;
}

interface RawAgentDef {
  id: string;
  name: string;
  department: string;
  role: string;
  archetype: string;
  archetypeSanskrit: string;
  importanceTier: ImportanceTier;
  geometryType: AgentGeometryType;
  nodeScale: number;
  ringCount: number;
  color: string;
  accentColor: string;
  access: string;
  hardwareTarget: string;
  verificationScope: string;
  mandate: string;
  longDescription: string;
  sampleWorkflow: string;
  tools: string[];
}

// 4 Concentric Cosmic Spheres strictly ordered by Importance & Department
const TIER_1_EXECUTIVE: RawAgentDef[] = [
  {
    id: "maha-dev",
    name: "Maha-Dev",
    department: "MAHA-EXECUTIVE",
    role: "CEO, Primary Executive Orchestrator & Delivery Lead",
    archetype: "Ishana (Supreme Sovereign & Source Anchor)",
    archetypeSanskrit: "ईशान · सर्वविद्यानां प्रभुः",
    importanceTier: "CRITICAL",
    geometryType: "torusKnot",
    nodeScale: 2.18,
    ringCount: 3,
    color: "#38bdf8",
    accentColor: "#f59e0b",
    access: "R/W/I (Full Sovereign Orchestration)",
    hardwareTarget: "CPU Orchestrator · Directs CPU, iGPU & dGPU",
    verificationScope: "Enforces 9-Tier Hierarchy (Level 0 to Level 8)",
    mandate: "Directs complete autonomous product lifecycle, hardware-aware execution, and packages sovereign deliverables.",
    longDescription: "The sovereign CEO and Primary Orchestrator. Coordinates the 24 active specialist agents across 10 departments, translates zero-jargon Founder intent into formal specifications, and ensures zero drift from the North Star Mission.",
    sampleWorkflow: "antigravity dispatch --mission 'v3.2.0-cosmos' --hardware auto",
    tools: ["edit", "write", "read", "bash", "task", "skill", "todowrite"],
  },
  {
    id: "maha-council",
    name: "Maha-Council",
    department: "MAHA-GOVERNANCE",
    role: "Governance, Architecture Board & Safety Council",
    archetype: "Sadashiva (Eternal Wisdom & Cosmic Council)",
    archetypeSanskrit: "सदाशिव · तत्त्वविचारकः",
    importanceTier: "CRITICAL",
    geometryType: "dodecahedron",
    nodeScale: 1.95,
    ringCount: 2,
    color: "#818cf8",
    accentColor: "#c084fc",
    access: "R (Strictly Read-Only Analysis)",
    hardwareTarget: "CPU Analysis Host",
    verificationScope: "Level 1 to Level 6 Architectural Review",
    mandate: "Debates changes to operating system architecture, department mandates, safety review gates, and anti-drift policies.",
    longDescription: "The supreme deliberative governance board. Produces structured architectural recommendations for Tier 4 strategic decisions without ever altering code directly, guaranteeing safety invariants.",
    sampleWorkflow: "maha-council review --proposal RFC-0042 --gate DEEP_PLANNING",
    tools: ["read", "glob", "grep"],
  },
  {
    id: "maha-closer",
    name: "Maha-Closer",
    department: "MAHA-FINALIZATION",
    role: "Mandatory Close, Clean & Final Report Specialist",
    archetype: "Rudra (Cosmic Dissolution & Technical Debt Purifier)",
    archetypeSanskrit: "रुद्र · संहारकः शोधकश्च",
    importanceTier: "CRITICAL",
    geometryType: "octahedron",
    nodeScale: 1.85,
    ringCount: 2,
    color: "#34d399",
    accentColor: "#059669",
    access: "R/I (Workspace Sanitization)",
    hardwareTarget: "CPU Sanitizer & Closer",
    verificationScope: "Level 6 Security Audit & Report Indexing",
    mandate: "Mandatory final subagent in EVERY iteration. Verifies zero secrets, purges temporary files, and writes factual reports.",
    longDescription: "The relentless closer that executes at the end of every workflow. Purges disposable caches, verifies zero secret leakage, updates project memory, and assigns immutable task completion status.",
    sampleWorkflow: "maha-closer verify-and-report --task-id task-789 --clean",
    tools: ["read", "write", "edit", "bash"],
  },
  {
    id: "mahadev-architect",
    name: "Architect",
    department: "MAHA-ENGINEERING",
    role: "System Design, 9-Vector Alternatives & Schemas",
    archetype: "Vishwakarma (Divine Architect & Master Blueprint Builder)",
    archetypeSanskrit: "विश्वकर्मा · वास्तुविधाता",
    importanceTier: "CRITICAL",
    geometryType: "cuboctahedron",
    nodeScale: 1.85,
    ringCount: 2,
    color: "#fbbf24",
    accentColor: "#d97706",
    access: "R (Read-Only Architecture)",
    hardwareTarget: "CPU System Designer",
    verificationScope: "9-Vector Alternatives Matrix & Schema Gate",
    mandate: "System design, dependency analysis, scalability assessment, and technical planning before code is written.",
    longDescription: "Architects robust modular software systems. Evaluates 9 architectural vectors (scalability, isolation, latency, memory, correctness, etc.) to produce authoritative PLANS before any implementation begins.",
    sampleWorkflow: "mahadev-architect plan --spec specs/api.md --output PLAN.md",
    tools: ["read", "glob", "grep"],
  }
];

const TIER_2_CORE: RawAgentDef[] = [
  {
    id: "mahadev-build",
    name: "Build",
    department: "MAHA-ENGINEERING",
    role: "Primary Implementation & API Integrator",
    archetype: "Brahma (Creation, Manifestation & Craft)",
    archetypeSanskrit: "ब्रह्मा · निर्माणकर्ता",
    importanceTier: "CORE",
    geometryType: "icosahedron",
    nodeScale: 1.62,
    ringCount: 2,
    color: "#60a5fa",
    accentColor: "#2563eb",
    access: "I (Full Code Implementation)",
    hardwareTarget: "CPU (-j2 concurrency limit)",
    verificationScope: "Level 0 to Level 3 Compilation Verification",
    mandate: "Primary implementation agent for writing software, modifying repos, running builds, and integrating APIs.",
    longDescription: "Executes verified implementation plans with maximum modularity. Adheres to strict -j2 concurrency on the workstation CPU to prevent thermal throttling or memory exhaustion.",
    sampleWorkflow: "mahadev-build implement --plan PLAN.md --step 1",
    tools: ["edit", "write", "read", "bash"],
  },
  {
    id: "mahadev-test",
    name: "Test",
    department: "MAHA-QUALITY",
    role: "Test Suites, Coverage & Regression Specialist",
    archetype: "Varuna (Keeper of Cosmic Order & Truth Verifier)",
    archetypeSanskrit: "वरुण · ऋतस्य गोपाः",
    importanceTier: "CORE",
    geometryType: "octahedron",
    nodeScale: 1.55,
    ringCount: 1,
    color: "#4ade80",
    accentColor: "#16a34a",
    access: "I (Test Execution)",
    hardwareTarget: "CPU Test Runner",
    verificationScope: "Level 4 Unit & Level 5 Integration Tests",
    mandate: "Creates unit and integration test suites, measures branch coverage, and verifies test invariants.",
    longDescription: "Guarantees correctness across all codebases. Enforces high branch coverage, executes unit and integration suites, and isolates failing edge cases with actionable regression reports.",
    sampleWorkflow: "mahadev-test run --suite all --coverage 90",
    tools: ["read", "edit", "write", "bash"],
  },
  {
    id: "mahadev-security",
    name: "Security",
    department: "MAHA-SECURITY",
    role: "Security Auditing, Secret Leak Detection & Hardening",
    archetype: "Kavacha (Impenetrable Armor & Shield)",
    archetypeSanskrit: "कवच · सर्वसंरक्षकः",
    importanceTier: "CORE",
    geometryType: "icosidodecahedron",
    nodeScale: 1.55,
    ringCount: 2,
    color: "#f87171",
    accentColor: "#dc2626",
    access: "R (Security Auditing)",
    hardwareTarget: "CPU Secret & AST Auditor",
    verificationScope: "Level 6 Security Audits & Zero-Trust Gate",
    mandate: "Audits code for secrets, CVE vulnerabilities, credential leaks, and permissions boundaries.",
    longDescription: "Enforces strict Zero-Sudo and Zero-Trust policies. Audits file diffs for plaintext credentials, analyzes tool permission scopes, and scans dependencies for known vulnerabilities.",
    sampleWorkflow: "mahadev-security audit --dir src/ --secrets --cve",
    tools: ["read", "glob", "grep"],
  },
  {
    id: "mahadev-devops",
    name: "DevOps",
    department: "MAHA-INFRA",
    role: "Container Architecture, Compose & CI/CD",
    archetype: "Indra (Wielder of Infrastructure & Containers)",
    archetypeSanskrit: "इन्द्र · वज्रधरः",
    importanceTier: "CORE",
    geometryType: "dodecahedron",
    nodeScale: 1.55,
    ringCount: 1,
    color: "#38bdf8",
    accentColor: "#0284c7",
    access: "I (Container Management)",
    hardwareTarget: "Docker 29.8 Engine · Bind Mounts",
    verificationScope: "Container Resource Caps (RAM & CPU limits)",
    mandate: "Docker Compose, database lifecycle, reverse proxy configuration, and deployment automation.",
    longDescription: "Orchestrates container infrastructure in ~/Containers. Enforces memory caps on all running services and maintains PostgreSQL 16 and Redis 7 in healthy, isolated states.",
    sampleWorkflow: "mahadev-devops compose up --service postgres redis",
    tools: ["bash", "read", "edit", "write"],
  },
  {
    id: "mahadev-debug",
    name: "Debug",
    department: "MAHA-ENGINEERING",
    role: "Defect Reproduction, Root Cause & Patching",
    archetype: "Bhairava (Fierce Destroyer of Illusions & Root-Cause Hunter)",
    archetypeSanskrit: "भैरव · भ्रमविनाशकः",
    importanceTier: "CORE",
    geometryType: "tetrahedron",
    nodeScale: 1.5,
    ringCount: 1,
    color: "#fb923c",
    accentColor: "#ea580c",
    access: "I (Defect Resolution)",
    hardwareTarget: "CPU Diagnostic Runner",
    verificationScope: "Reproduction Test Case -> Fix Verification",
    mandate: "Reproduces defects, inspects runtime logs, isolates root causes, and implements minimal verified fixes.",
    longDescription: "Systematically debugs software failures. First creates a minimal reproduction test, locates root causes through call-stack analysis, and verifies patches against the 9-Tier hierarchy.",
    sampleWorkflow: "mahadev-debug trace --error 'MemoryLeak' --reproduce",
    tools: ["read", "edit", "write", "bash", "grep"],
  },
  {
    id: "mahadev-performance",
    name: "Performance",
    department: "MAHA-QUALITY",
    role: "Hardware Advisor, Resource Profiler & Benchmark Auditor",
    archetype: "Agni (Transformative Flame & Performance Catalyst)",
    archetypeSanskrit: "अग्नि · कार्यकुशलः",
    importanceTier: "CORE",
    geometryType: "goldenTorus",
    nodeScale: 1.5,
    ringCount: 1,
    color: "#e879f9",
    accentColor: "#c026d3",
    access: "R (Resource Telemetry)",
    hardwareTarget: "CPU / iGPU / dGPU Hardware Profiler",
    verificationScope: "Level 7 Performance Profiling & Hardware Budget",
    mandate: "Evaluates CPU, RAM, disk, and GPU utilization. Enforces Workload Fingerprints and Benchmark Provenance.",
    longDescription: "The Primary Hardware Advisor. Monitors the 12GB RAM ceiling, routes workloads to CPU/iGPU/dGPU, validates benchmark provenance (BM- artifacts), and prevents system OOM conditions.",
    sampleWorkflow: "mahadev-performance profile --target GPU --benchmark BM-20260912-01",
    tools: ["read", "glob", "grep"],
  }
];

const TIER_3_STRATEGY: RawAgentDef[] = [
  {
    id: "maha-product",
    name: "Maha-Product",
    department: "MAHA-PRODUCT",
    role: "PRDs, User Stories & Qualitative UX Research",
    archetype: "Saraswati (Divine Flow of Speech & Specification)",
    archetypeSanskrit: "सरस्वती · ज्ञानप्रदा",
    importanceTier: "SPECIALIST",
    geometryType: "icosahedron",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#f472b6",
    accentColor: "#db2777",
    access: "R/I (Product Artifacts)",
    hardwareTarget: "CPU PRD Engine",
    verificationScope: "User Story Acceptance Criteria Gate",
    mandate: "Transforms Founder ideas into rigorous functional specifications, PRDs, user stories, and product validation plans.",
    longDescription: "Translates high-level Founder visions into crystal-clear PRDs, wireframe user journeys, and verifiable acceptance criteria, ensuring engineering teams build exactly what is needed.",
    sampleWorkflow: "maha-product prd --feature '3d-inspector' --output PRD.md",
    tools: ["read", "write", "edit"],
  },
  {
    id: "maha-research",
    name: "Maha-Research",
    department: "MAHA-R&D",
    role: "Lead Deep Research & 4-Tier Source Verification",
    archetype: "Dhiman (Deep Seeker of Truth & Analytical Intellect)",
    archetypeSanskrit: "धीमान् · गवेषकः",
    importanceTier: "SPECIALIST",
    geometryType: "dodecahedron",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#2dd4bf",
    accentColor: "#0d9488",
    access: "R/I (Research Artifacts)",
    hardwareTarget: "CPU Deep Researcher",
    verificationScope: "4-Tier Source Hierarchy (Level 1 to Level 4)",
    mandate: "Investigates emerging technologies, enforces 4-tier source hierarchy, manages RESEARCH/ directories, and delivers findings.",
    longDescription: "Conducts deep empirical technology evaluations. Audits Level 1 official documentation, conducts sandbox experiments, and prevents premature architecture commitments.",
    sampleWorkflow: "maha-research eval --tech 'webgl-shaders' --output RESEARCH.md",
    tools: ["read", "webfetch", "write"],
  },
  {
    id: "maha-operations",
    name: "Maha-Operations",
    department: "MAHA-OPERATIONS",
    role: "PMO, 23-Section Deep Planning Gate & ADRs",
    archetype: "Dharma (Cosmic Law, Order & Operating Rhythm)",
    archetypeSanskrit: "धर्म · व्यवस्थापकः",
    importanceTier: "SPECIALIST",
    geometryType: "octahedron",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#a78bfa",
    accentColor: "#7c3aed",
    access: "R/I (Operations Registry)",
    hardwareTarget: "CPU PMO Engine",
    verificationScope: "23-Section Deep Planning Gate Enforcement",
    mandate: "Coordinates multi-phase projects, enforces the 23-section Deep Planning Gate (PLAN.md), tracks milestones, and curates ADRs.",
    longDescription: "The operational engine of MahaDev OS. Enforces the 23-section Deep Planning Gate for Tier 3/4 projects, coordinates multi-agent dependencies, and manages persistent project memory.",
    sampleWorkflow: "maha-operations gate --check PLAN.md --status IN_PROGRESS",
    tools: ["read", "write", "edit", "glob"],
  },
  {
    id: "maha-capability-manager",
    name: "Maha-Capability Manager",
    department: "MAHA-CAPABILITY",
    role: "Capability Discovery, License Vetting & Toolchain",
    archetype: "Kubera (Guardian of Treasures & Capabilities)",
    archetypeSanskrit: "कुबेर · शक्तिपालकः",
    importanceTier: "SPECIALIST",
    geometryType: "cuboctahedron",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#fb7185",
    accentColor: "#e11d48",
    access: "R/I (Skill Registry)",
    hardwareTarget: "CPU Dependency Manager",
    verificationScope: "License Audit & Capability Gap Analysis",
    mandate: "Discovers, evaluates, vets licenses, and manages external skills, plugins, and dependencies.",
    longDescription: "Maintains the central capability registry. Performs capability gap analysis (CAPABILITY-GAP.md) and enforces GPU/VRAM hardware compatibility gates before adding tools.",
    sampleWorkflow: "maha-capability-manager audit --tool 'threejs' --license MIT",
    tools: ["read", "edit", "write", "bash"],
  },
  {
    id: "maha-preview",
    name: "Maha-Preview",
    department: "MAHA-INFRA",
    role: "Local Preview Hosting, Port Discovery & Health Probes",
    archetype: "Pratyaksha (Direct Perception & Real-Time Observer)",
    archetypeSanskrit: "प्रत्यक्ष · साक्षात्कारी",
    importanceTier: "SPECIALIST",
    geometryType: "goldenTorus",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#34d399",
    accentColor: "#10b981",
    access: "R/I (Runtime Hosting)",
    hardwareTarget: "Localhost 127.0.0.1 Server",
    verificationScope: "HTTP Status 200 Health Probe Check",
    mandate: "Starts dev servers, discovers available ports, executes health checks, and manages preview lifecycles.",
    longDescription: "Manages local test preview instances strictly bound to 127.0.0.1. Validates HTTP response codes, assists visual QA snapshots, and safely terminates disposable processes.",
    sampleWorkflow: "maha-preview host --dir dist --port auto --probe",
    tools: ["bash", "read"],
  },
  {
    id: "maha-reuse",
    name: "Maha-Reuse",
    department: "MAHA-ENGINEERING",
    role: "Code & Asset Reuse Auditing, Unused Code Index",
    archetype: "Samgraha (Gatherer of Wisdom & Code Conservator)",
    archetypeSanskrit: "संग्रह · मितव्ययी",
    importanceTier: "SPECIALIST",
    geometryType: "icosidodecahedron",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#94a3b8",
    accentColor: "#64748b",
    access: "R/I (Code Reuse Index)",
    hardwareTarget: "CPU AST Scanner",
    verificationScope: "Dead Code Elimination & Asset Deduplication",
    mandate: "Scans project codebases to identify reusable components, utilities, and maintain UNUSED-CODE indexes.",
    longDescription: "Protects against duplication and code bloat. Catalogs reusable components across projects and curates the UNUSED-CODE-INDEX with explicit retention categories.",
    sampleWorkflow: "maha-reuse scan --project 'mahadev-3d-cosmos' --audit",
    tools: ["read", "glob", "grep", "write"],
  },
  {
    id: "maha-advisory",
    name: "Maha-Advisory",
    department: "MAHA-GUIDANCE",
    role: "Trade-offs, Mentorship, Legal & Financial Modeling",
    archetype: "Brihaspati (Guru of the Celestials & Wise Counselor)",
    archetypeSanskrit: "बृहस्पति · मन्त्रवेत्ता",
    importanceTier: "ADVISORY",
    geometryType: "dodecahedron",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#c084fc",
    accentColor: "#9333ea",
    access: "R (Read-Only Advisory)",
    hardwareTarget: "CPU Advisory Host",
    verificationScope: "License Compliance & Cost Modeling",
    mandate: "Strategic advisory, legal/compliance, open source license reviews, and infrastructure cost modeling.",
    longDescription: "Provides high-level strategic trade-off analysis, open source licensing compliance guidance, privacy checklists, and computational cost projections without modifying code.",
    sampleWorkflow: "maha-advisory evaluate --license Apache-2.0 --risk low",
    tools: ["read", "glob"],
  }
];

const TIER_4_OUTER: RawAgentDef[] = [
  {
    id: "mahadev-android",
    name: "Android",
    department: "MAHA-ANDROID",
    role: "Flutter, Gradle & Physical Samsung A12 Testing",
    archetype: "Skanda (Swift Commander of Mobile Surfaces)",
    archetypeSanskrit: "स्कन्द · सेनापतिः",
    importanceTier: "SPECIALIST",
    geometryType: "icosahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#4ade80",
    accentColor: "#15803d",
    access: "I (Android Build & ADB)",
    hardwareTarget: "Physical Device via USB ADB (Samsung A12)",
    verificationScope: "Zero Emulator Policy · Physical Device Test",
    mandate: "Android development agent for Gradle builds, SDK management, ADB debugging, and Flutter projects.",
    longDescription: "Builds and tests Android and Flutter mobile apps on physical Samsung A12 hardware via ADB. Strictly prohibits heavy Android emulators to respect the 12GB RAM ceiling.",
    sampleWorkflow: "mahadev-android build-apk --release --device-adb",
    tools: ["bash", "read", "edit", "write"],
  },
  {
    id: "mahadev-content",
    name: "Content",
    department: "MAHA-CONTENT",
    role: "FFmpeg Media Pipelines, Video & Asset Automation",
    archetype: "Kala (Lord of Time, Rhythm & Audio-Visual Media)",
    archetypeSanskrit: "काल · कालप्रवर्तकः",
    importanceTier: "SPECIALIST",
    geometryType: "cuboctahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#f43f5e",
    accentColor: "#be123c",
    access: "I (Media Processing)",
    hardwareTarget: "Intel HD 620 VAAPI Hardware Acceleration",
    verificationScope: "VAAPI Transcode Fidelity & Pandoc Render",
    mandate: "Content creation agent for FFmpeg media processing, video/audio pipelines, and documentation publishing.",
    longDescription: "Processes high-fidelity audio/video pipelines using Intel HD 620 VAAPI hardware acceleration (BM-20260912-02), generating video assets, audio drones, and converted documents.",
    sampleWorkflow: "mahadev-content transcode --input input.mp4 --vaapi h264",
    tools: ["bash", "read", "write"],
  },
  {
    id: "maha-marketing",
    name: "Maha-Marketing",
    department: "MAHA-MARKETING",
    role: "Positioning, Technical Copy & Commercial Proposals",
    archetype: "Vak (Power of Expression & Commercial Voice)",
    archetypeSanskrit: "वाक् · शब्दब्रह्ममयी",
    importanceTier: "SPECIALIST",
    geometryType: "octahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#f59e0b",
    accentColor: "#b45309",
    access: "R/I (Commercial Copy)",
    hardwareTarget: "CPU Copywriter Engine",
    verificationScope: "Copy Clarity & Zero AI Slop Gate",
    mandate: "Product positioning, technical marketing copy, landing pages, READMEs, and commercial proposals.",
    longDescription: "Crafts compelling technical marketing narratives, zero-slop documentation, feature release announcements, and commercial strategy proposals aligned with Founder brand voice.",
    sampleWorkflow: "maha-marketing draft --page 'landing' --tone 'authoritative'",
    tools: ["read", "write", "edit"],
  },
  {
    id: "mahadev-explore",
    name: "Explore",
    department: "MAHA-ENGINEERING",
    role: "Read-Only Codebase Mapping & Pattern Discovery",
    archetype: "Chara (The Swift Scout & Code Navigator)",
    archetypeSanskrit: "चर · मार्गदर्शकः",
    importanceTier: "SPECIALIST",
    geometryType: "tetrahedron",
    nodeScale: 1.2,
    ringCount: 1,
    color: "#38bdf8",
    accentColor: "#0369a1",
    access: "R (Read-Only Exploration)",
    hardwareTarget: "CPU AST & Text Scanner",
    verificationScope: "Structural AST Codebase Mapping",
    mandate: "Fast read-only repository exploration agent. Maps codebase structure, identifies patterns, and finds files.",
    longDescription: "Rapidly inspects and maps unknown repositories. Scans directory trees, analyzes manifests, and builds structural context without modifying any files.",
    sampleWorkflow: "mahadev-explore map --path src/ --depth 3",
    tools: ["read", "glob", "grep"],
  },
  {
    id: "mahadev-orchestrator",
    name: "Orchestrator",
    department: "MAHA-ENGINEERING",
    role: "Multi-Stage Subflow Routing & Task Dependency Lead",
    archetype: "Sutradhara (The Master Weaver of Threads)",
    archetypeSanskrit: "सूत्रधार · समन्वयकः",
    importanceTier: "SPECIALIST",
    geometryType: "goldenTorus",
    nodeScale: 1.2,
    ringCount: 1,
    color: "#818cf8",
    accentColor: "#4338ca",
    access: "R (Workflow Routing)",
    hardwareTarget: "CPU Task Dispatcher",
    verificationScope: "Sub-Task Return Policy & Anti-Drift Gate",
    mandate: "Coordinates work between agents for complex multi-step tasks. Manages dependencies and ensures coherent returns.",
    longDescription: "Enforces the Sub-Task Return Policy. Coordinates parallel subagents for multi-step tasks, guarantees dependency ordering, and routes control back to the North Star Mission.",
    sampleWorkflow: "mahadev-orchestrator chain --stage build --stage test",
    tools: ["task", "read"],
  },
  {
    id: "mahadev-cost",
    name: "Cost",
    department: "MAHA-FINANCE",
    role: "Token Budget Auditing, Spend & Compute Telemetry",
    archetype: "Ganita (The Master Reckoner & Token Auditor)",
    archetypeSanskrit: "गणित · लेखापालकः",
    importanceTier: "SPECIALIST",
    geometryType: "dodecahedron",
    nodeScale: 1.2,
    ringCount: 1,
    color: "#34d399",
    accentColor: "#047857",
    access: "R (Token & Compute Accounting)",
    hardwareTarget: "CPU Ledger Auditor",
    verificationScope: "Token Budget Gate & Step Quota Enforcement",
    mandate: "Cost analysis, token budget auditing, and spend optimization specialist. Tracks model API expenditures.",
    longDescription: "Tracks and optimizes model API expenditures. Flags wasteful multi-turn token loops and ensures every agent task executes within its allocated compute budget.",
    sampleWorkflow: "mahadev-cost audit --session current --currency USD",
    tools: ["read", "glob"],
  },
  {
    id: "maha-feedback",
    name: "Maha-Feedback",
    department: "MAHA-CUSTOMER",
    role: "Customer Feedback, Support Triage & Sentiment Specialist",
    archetype: "Matrikas (Nurturing Protectors & Voice of User)",
    archetypeSanskrit: "मातृका · संवेदनशीला",
    importanceTier: "SPECIALIST",
    geometryType: "icosidodecahedron",
    nodeScale: 1.2,
    ringCount: 1,
    color: "#94a3b8",
    accentColor: "#475569",
    access: "R/I (Sanitized Sentiment Ingestion)",
    hardwareTarget: "CPU PII Sanitizer",
    verificationScope: "Level 6 Deterministic PII Redaction",
    mandate: "Ingests, categorizes, sanitizes, and analyzes user feedback, bug reports, and sentiment into actionable insights.",
    longDescription: "Triage customer feedback, issue reports, and user sentiment. Sanitizes PII before routing bug reports to mahadev-debug or feature requests to maha-product.",
    sampleWorkflow: "maha-feedback ingest --sanitize-pii --classify-sentiment",
    tools: ["read", "edit", "write"],
  }
];

// 4 Concentric Sacred Golden Spheres with exact mathematical radii
const TIERS_CONFIG = [
  { agents: TIER_1_EXECUTIVE, radius: 16.0, speed: 0.007, inclination: 0.08, tierIdx: 0 },
  { agents: TIER_2_CORE,      radius: 25.89, speed: -0.005, inclination: -0.12, tierIdx: 1 },
  { agents: TIER_3_STRATEGY,  radius: 41.89, speed: 0.0035, inclination: 0.16, tierIdx: 2 },
  { agents: TIER_4_OUTER,     radius: 67.78, speed: -0.0022, inclination: -0.20, tierIdx: 3 }
];

let globalHarmonicIdx = 1;
export const AGENTS_3D: Agent3D[] = TIERS_CONFIG.flatMap((tierConf) => {
  const count = tierConf.agents.length;
  const angularStep = (Math.PI * 2) / count;

  return tierConf.agents.map((agent, i) => {
    // Symmetrical angular placement around 360 degrees
    const angularOffset = i * angularStep;
    // Symmetrical alternating inclination
    const inclination = tierConf.inclination * (i % 2 === 0 ? 1 : -1);

    const agent3D: Agent3D = {
      ...agent,
      tierIndex: tierConf.tierIdx,
      angularOffset,
      orbitRadius: tierConf.radius,
      orbitSpeed: tierConf.speed,
      orbitInclination: inclination,
      phiHarmonicIndex: globalHarmonicIdx++,
    };
    return agent3D;
  });
});
