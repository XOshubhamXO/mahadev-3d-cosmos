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

export interface VedicLokaInfo {
  id: string;
  name: string;
  sanskrit: string;
  category: 'Supreme Transcendental' | 'Higher Celestial' | 'Earthly Plane' | 'Karmic & Subterranean';
  description: string;
  radius: number;
  height: number;
  color: string;
  accentColor: string;
  speed: number;
}

export const VEDIC_LOKAS: VedicLokaInfo[] = [
  {
    id: "kailash",
    name: "Kailash Parivara",
    sanskrit: "कैलास धाम",
    category: "Supreme Transcendental",
    description: "Supreme Transcendental Abode of Paramashiva. Supreme Command, Foundations, Governance & Sacred Dissolution.",
    radius: 16.0,
    height: 0.0,
    color: "#e6ca85", // Champagne Gold
    accentColor: "#ca8a04",
    speed: 0.16,
  },
  {
    id: "vaikuntha",
    name: "Vaikuntha & Dhruvaloka",
    sanskrit: "वैकुण्ठ धाम",
    category: "Supreme Transcendental",
    description: "Eternal Realm of Lord Vishnu & Cosmic Preservation. Operational Harmony, Asset Permanence & Real-time Previews.",
    radius: 28.0,
    height: 4.5,
    color: "#38bdf8", // Celestial Cyan / Blue Lotus
    accentColor: "#0284c7",
    speed: -0.11,
  },
  {
    id: "brahmaloka",
    name: "Satyaloka & Brahmaloka",
    sanskrit: "सत्यलोक · ब्रह्मलोक",
    category: "Higher Celestial",
    description: "The Supreme Heavenly Realm of Brahma & Saraswati. Cosmic Architecture, Product PRDs & Foundational Deep Research.",
    radius: 42.0,
    height: 9.0,
    color: "#f59e0b", // Sacred Amber / Crystal
    accentColor: "#d97706",
    speed: 0.08,
  },
  {
    id: "devlok",
    name: "Svargaloka & Devlok",
    sanskrit: "स्वर्गलोक · इन्द्रलोक",
    category: "Higher Celestial",
    description: "Heavenly Realm of Indra and the Devas. Infrastructure Fortification, Advisory Wisdom, Rigorous Testing & Compute Telemetry.",
    radius: 58.0,
    height: 2.5,
    color: "#60a5fa", // Indraneela Sapphire
    accentColor: "#2563eb",
    speed: -0.055,
  },
  {
    id: "prithvilok",
    name: "Prithvilok & Bhuloka",
    sanskrit: "पृथ्वीलोक · भूलोक",
    category: "Earthly Plane",
    description: "The Earthly Physical Reality & Experiential Plane. Customer Sentiment, Media Transcoding, Code Exploration & Orchestration.",
    radius: 76.0,
    height: -3.5,
    color: "#34d399", // Terrestrial Jade Emerald
    accentColor: "#059669",
    speed: 0.038,
  },
  {
    id: "yamlok",
    name: "Yamaloka & Bhairavaloka",
    sanskrit: "यमलोक · भैरव मण्डल",
    category: "Karmic & Subterranean",
    description: "Realm of Cosmic Justice, Karmic Audits & Adho Lokas. Impenetrable Security Armor, Secret Hygiene & Root-Cause Bug Eradication.",
    radius: 95.0,
    height: -8.5,
    color: "#f87171", // Ruby Obsidian & Crimson Flame
    accentColor: "#dc2626",
    speed: -0.026,
  },
];

export interface CapabilityMetadata {
  name: string;
  category: 'skill' | 'plugin';
  title: string;
  description: string;
}

export const CAPABILITIES_DICT: Record<string, CapabilityMetadata> = {
  // Skills
  "mission-anchor": {
    name: "mission-anchor",
    category: "skill",
    title: "Mission Anchor & Anti-Drift",
    description: "Enforces persistent project intent, anti-drift gating, and session memory across workflows.",
  },
  "plan-gate": {
    name: "plan-gate",
    category: "skill",
    title: "23-Section Planning Gate",
    description: "Enforces the 23-section Deep Planning Gate (PLAN.md) and single Founder Go approval before implementation.",
  },
  "runtime-governance": {
    name: "runtime-governance",
    category: "skill",
    title: "Runtime Governance & Safety",
    description: "Audits runtime boundaries, zero sudo policy, subagent concurrency caps, and recursion prevention.",
  },
  "version-reconciliation": {
    name: "version-reconciliation",
    category: "skill",
    title: "Version Reconciliation",
    description: "Harmonizes architecture versions, model catalogs, and release tags across documentation and config.",
  },
  "verification-before-completion": {
    name: "verification-before-completion",
    category: "skill",
    title: "Verification Before Completion",
    description: "Demands empirical evidence and test execution before claiming work is fixed or complete.",
  },
  "architecture-decision-records": {
    name: "architecture-decision-records",
    category: "skill",
    title: "Architecture Decision Records",
    description: "Captures structural architectural decisions, considered alternatives, and long-term rationale.",
  },
  "codebase-design": {
    name: "codebase-design",
    category: "skill",
    title: "Deep Module Codebase Design",
    description: "Designs deep modules with narrow interfaces, clear seams, and high AI navigability.",
  },
  "domain-modeling": {
    name: "domain-modeling",
    category: "skill",
    title: "Domain Modeling",
    description: "Builds and sharpens bounded context domain models, ubiquity lexicons, and entity relations.",
  },
  "improve-codebase-architecture": {
    name: "improve-codebase-architecture",
    category: "skill",
    title: "Improve Codebase Architecture",
    description: "Scans codebases for deepening opportunities, modular seams, and structural improvements.",
  },
  "apkleaks": {
    name: "apkleaks",
    category: "skill",
    title: "APK Leaks & Security Scanner",
    description: "Scans Android APK binaries for secret URIs, endpoints, hardcoded credentials, and API keys.",
  },
  "hardware-budget": {
    name: "hardware-budget",
    category: "skill",
    title: "Workstation Hardware Budget",
    description: "Assesses memory, CPU, disk, and GPU limits on the workstation to prevent OOM failures.",
  },
  "zero-trust-agent": {
    name: "zero-trust-agent",
    category: "skill",
    title: "Zero-Trust Agent Security",
    description: "Enforces least privilege, eliminates wildcard permissions, and isolates agent tools.",
  },
  "closeout": {
    name: "closeout",
    category: "skill",
    title: "Closeout & Cleanup Gate",
    description: "Executes maha-closer, purges disposable temporary caches, verifies zero secrets, and writes permanent task reports.",
  },
  "secret-hygiene": {
    name: "secret-hygiene",
    category: "skill",
    title: "Secret Hygiene & Scanner",
    description: "Scans files for plaintext secrets, prevents credential leaks, and enforces zero credential storage.",
  },
  "benchmark-provenance": {
    name: "benchmark-provenance",
    category: "skill",
    title: "Benchmark Provenance",
    description: "Validates empirical hardware benchmarks and Workload Fingerprint comparability matching.",
  },
  "browser-qa": {
    name: "browser-qa",
    category: "skill",
    title: "Browser Visual QA",
    description: "Automates visual testing, interactive checks, and console audits using Playwright.",
  },
  "webapp-testing": {
    name: "webapp-testing",
    category: "skill",
    title: "Web App Test Harness",
    description: "Tests local web applications with screenshot capture, interaction probes, and log inspection.",
  },
  "ponytail-audit": {
    name: "ponytail-audit",
    category: "skill",
    title: "Over-Engineering Audit",
    description: "Scans the codebase for bloat, reinvented standard library routines, and unnecessary complexity.",
  },
  "ponytail-debt": {
    name: "ponytail-debt",
    category: "skill",
    title: "Ponytail Debt Ledger",
    description: "Harvests and tracks deliberate shortcuts and deferral markers to prevent technical rot.",
  },
  "ponytail-gain": {
    name: "ponytail-gain",
    category: "skill",
    title: "Ponytail Efficiency Gain",
    description: "Measures impact of minimalist engineering: code reduction, cost optimization, and speedups.",
  },
  "test-driven-development": {
    name: "test-driven-development",
    category: "skill",
    title: "Test-Driven Development",
    description: "Enforces writing unit tests and verification assertions before implementing features.",
  },
  "subagent-driven-development": {
    name: "subagent-driven-development",
    category: "skill",
    title: "Subagent Parallel Execution",
    description: "Dispatches independent implementation tasks concurrently across specialized subagents.",
  },
  "executing-plans": {
    name: "executing-plans",
    category: "skill",
    title: "Plan Execution Engine",
    description: "Executes written implementation plans systematically with checkpoint review gates.",
  },
  "writing-plans": {
    name: "writing-plans",
    category: "skill",
    title: "Right-Sized Engineering Plans",
    description: "Drafts rigorous, structured implementation plans adapted to task tiers (Tier 0-4).",
  },
  "brainstorming": {
    name: "brainstorming",
    category: "skill",
    title: "Intent & Requirements Exploration",
    description: "Explores user intent, architectural alternatives, and design boundaries before writing code.",
  },
  "crawl4ai": {
    name: "crawl4ai",
    category: "skill",
    title: "Crawl4AI Asynchronous Scraper",
    description: "High-speed asynchronous crawler and markdown/JSON extractor for deep documentation research.",
  },
  "benchmark-methodology": {
    name: "benchmark-methodology",
    category: "skill",
    title: "Benchmark Methodology & Rubrics",
    description: "Scores platforms and architectures across 9 weighted dimensions with empirical evidence.",
  },
  "the-knowledge-guy": {
    name: "the-knowledge-guy",
    category: "skill",
    title: "Knowledge Base Router",
    description: "Discovers and synthesizes multi-domain knowledge from literature and technical archives.",
  },
  "docker-patterns": {
    name: "docker-patterns",
    category: "skill",
    title: "Hardened Docker Patterns",
    description: "Docker Compose patterns for local development, memory limits, and secure networking.",
  },
  "agent-architecture-audit": {
    name: "agent-architecture-audit",
    category: "skill",
    title: "Agent Architecture Audit",
    description: "Audits the 12-layer agent stack for memory pollution, repair loops, and tool discipline.",
  },
  "writing-for-agents": {
    name: "writing-for-agents",
    category: "skill",
    title: "Agent Instructions Engineering",
    description: "Writes high-precision, unambiguous instructions and skills for autonomous AI agents.",
  },
  "e2e-testing": {
    name: "e2e-testing",
    category: "skill",
    title: "End-to-End Test Suite",
    description: "Playwright E2E testing patterns, Page Object Model, and resilient regression tests.",
  },
  "eval-driven-development": {
    name: "eval-driven-development",
    category: "skill",
    title: "Eval-Driven Development (EDD)",
    description: "Creates and executes automated system prompt evaluation suites using promptfoo and pytest.",
  },
  "find-skills": {
    name: "find-skills",
    category: "skill",
    title: "Skill Discovery & Vetting",
    description: "Discovers, evaluates, audits, and installs external agent skills with provenance verification.",
  },
  "mcp-curation": {
    name: "mcp-curation",
    category: "skill",
    title: "MCP Tool Curation & Hardening",
    description: "Audits, hardens, registers, and prunes Model Context Protocol (MCP) server endpoints.",
  },
  "mcp-builder": {
    name: "mcp-builder",
    category: "skill",
    title: "MCP Server Builder",
    description: "Builds high-quality Model Context Protocol servers in Python (FastMCP) and TypeScript.",
  },
  "deterministic-pii-redaction": {
    name: "deterministic-pii-redaction",
    category: "skill",
    title: "Deterministic PII Redaction",
    description: "Redacts personally identifiable info, credentials, and customer data before LLM processing.",
  },
  "prompt-injection-sanitizer": {
    name: "prompt-injection-sanitizer",
    category: "skill",
    title: "Prompt Injection Sanitizer",
    description: "Sanitizes untrusted user inputs, bug reports, and external web content to prevent jailbreaks.",
  },
  "docx": { name: "docx", category: "skill", title: "Word Document Engine", description: "Creates, reads, and manipulates formatted DOCX documents with typography and styling." },
  "pdf": { name: "pdf", category: "skill", title: "PDF Processing Toolkit", description: "Extracts text/tables, splits/merges pages, and performs OCR on PDF documents." },
  "pptx": { name: "pptx", category: "skill", title: "PowerPoint Presentation Engine", description: "Builds, edits, and parses formatted slide decks and presentation templates." },
  "convert-documents-to-markdown": { name: "convert-documents-to-markdown", category: "skill", title: "Document to Markdown", description: "Converts Office documents, PDFs, and ebooks to clean GitHub-Flavored Markdown." },
  "dispatching-parallel-agents": { name: "dispatching-parallel-agents", category: "skill", title: "Parallel Agent Dispatch", description: "Orchestrates concurrent independent subagents without shared state conflicts." },
  "banner-design": { name: "banner-design", category: "skill", title: "Banner & Asset Design", description: "Designs high-impact visual banners, headers, and creative marketing graphics." },
  "brand": { name: "brand", category: "skill", title: "Brand Voice & Guidelines", description: "Enforces brand consistency, typography tokens, color harmonies, and voice." },
  "design": { name: "design", category: "skill", title: "Comprehensive Design Engine", description: "Generates design tokens, logos, slide templates, icons, and corporate identities." },
  "no-ai-slop": { name: "no-ai-slop", category: "skill", title: "Zero AI Slop Gate", description: "Edits drafts into sharp, human, opinionated writing free of generic AI buzzwords." },
  "security-review": { name: "security-review", category: "skill", title: "Security Architecture Review", description: "Reviews authentication, input sanitation, secret handling, and API endpoints." },
  "security-scan": { name: "security-scan", category: "skill", title: "Security Vulnerability Scanner", description: "Scans configurations, hooks, MCP servers, and agent definitions for vulnerabilities." },
  "systematic-debugging": { name: "systematic-debugging", category: "skill", title: "Systematic Debugging", description: "Reproduces failures, inspects logs, isolates root causes, and validates fixes." },
  "receiving-code-review": { name: "receiving-code-review", category: "skill", title: "Code Review Verification", description: "Rigorously verifies feedback suggestions with empirical tests before adopting them." },

  // Plugins & MCP
  "context7": { name: "context7", category: "plugin", title: "Context7 Realtime Docs MCP", description: "Fetches live, up-to-date documentation and code examples for any library or framework." },
  "docker-mcp": { name: "docker-mcp", category: "plugin", title: "Docker Infrastructure MCP", description: "Inspects and manages local container lifecycles, memory budgets, and logs." },
  "git-mcp": { name: "git-mcp", category: "plugin", title: "Git Version Control MCP", description: "Audits commits, status, diffs, branches, and worktrees with high precision." },
  "omniroute-telemetry": { name: "omniroute-telemetry", category: "plugin", title: "OmniRoute Telemetry Connector", description: "Tracks multi-model inference token usage, routing latencies, and step budgets." },
  "tree-sitter": { name: "tree-sitter", category: "plugin", title: "Tree-Sitter AST Parser", description: "Performs high-speed semantic syntax tree analysis across 40+ programming languages." },
  "ast-grep": { name: "ast-grep", category: "plugin", title: "AST Grep Structural Matcher", description: "Searches and rewrites code matching AST patterns without brittle regex." },
  "adb-connector": { name: "adb-connector", category: "plugin", title: "Physical Device ADB Connector", description: "Interfaces with the physical Samsung Galaxy A12 test device via USB debugging." },
  "android-sdk-36": { name: "android-sdk-36", category: "plugin", title: "Android 36 Platform SDK", description: "SDK platform tools, AAPT2 build tools, and APK packaging toolchain." },
  "gradle-daemon": { name: "gradle-daemon", category: "plugin", title: "Gradle 8.14 Daemon Accelerator", description: "Incremental Gradle build cache daemon configured for low-memory environments." },
  "council-audit-log": { name: "council-audit-log", category: "plugin", title: "Council Governance Ledger", description: "Immutable governance audit log recording all Tier 4 reviews and constitutional votes." },
  "task-reporter": { name: "task-reporter", category: "plugin", title: "Task Closeout Report Generator", description: "Generates permanent Markdown iteration closeout reports under ops/reports/tasks/." },
  "artifact-purger": { name: "artifact-purger", category: "plugin", title: "Disposable Artifact Purger", description: "Safely clears temporary compile caches, logs, and dangling preview files." },
  "redis-mcp": { name: "redis-mcp", category: "plugin", title: "Redis 7 Cache MCP", description: "Interacts with local Redis key-value store, hashes, sets, and pub/sub channels." },
  "postgres-mcp": { name: "postgres-mcp", category: "plugin", title: "PostgreSQL 16 Engine MCP", description: "Executes read-only and transactional SQL queries with least-privilege safety." },
  "playwright-mcp": { name: "playwright-mcp", category: "plugin", title: "Playwright Headless Browser MCP", description: "Controls Chromium browser for visual QA snapshots, DOM inspection, and console audits." },
  "caddy-proxy": { name: "caddy-proxy", category: "plugin", title: "Caddy 2 Reverse Proxy", description: "Manages local HTTPS certificates, port mappings, and preview reverse-proxies." },
  "port-probe": { name: "port-probe", category: "plugin", title: "Port Discovery & Health Probe", description: "Scans available localhost ports and validates HTTP 200 health check responses." },
  "reuse-index": { name: "reuse-index", category: "plugin", title: "Unused Code & Asset Index", description: "Maintains UNUSED-CODE-INDEX.md with keep, archive, prune, and reuse categories." },
  "compiler-j2": { name: "compiler-j2", category: "plugin", title: "Native Build Harness (-j2)", description: "Compiles C/C++/Rust/Go sequentially capped at -j2 threads to preserve system RAM." },
  "prd-generator": { name: "prd-generator", category: "plugin", title: "PRD & User Story Engine", description: "Drafts comprehensive functional specifications and acceptance test criteria." },
  "user-story-engine": { name: "user-story-engine", category: "plugin", title: "User Story Formatter", description: "Formats user stories with personas, preconditions, flows, and edge cases." },
  "webfetch": { name: "webfetch", category: "plugin", title: "Web Content Extractor", description: "Retrieves online documentation, RFCs, and articles in markdown format." },
  "pdf-extractor": { name: "pdf-extractor", category: "plugin", title: "PDF Technical Extractor", description: "Extracts structured tables and text from research whitepapers and datasheets." },
  "docker-compose": { name: "docker-compose", category: "plugin", title: "Docker Compose V5 Orchestrator", description: "Starts and stops isolated multi-container stacks with memory constraints." },
  "caddy-2": { name: "caddy-2", category: "plugin", title: "Caddy 2 Web Server", description: "Zero-config web server with automatic TLS for local microservices." },
  "prometheus-exporter": { name: "prometheus-exporter", category: "plugin", title: "Prometheus Metrics Exporter", description: "Gathers CPU, memory, and container metrics for real-time observability." },
  "license-auditor": { name: "license-auditor", category: "plugin", title: "Open Source License Auditor", description: "Validates dependency licenses (MIT, Apache 2.0, BSD) against copyleft risks." },
  "fin-modeler": { name: "fin-modeler", category: "plugin", title: "Infrastructure Cost Modeler", description: "Projects cloud API, storage, and compute costs based on usage formulas." },
  "intel-vaapi": { name: "intel-vaapi", category: "plugin", title: "Intel HD 620 VAAPI Engine", description: "Hardware-accelerated media decoding and encoding via Intel VAAPI driver." },
  "nvidia-cuda": { name: "nvidia-cuda", category: "plugin", title: "NVIDIA 920MX CUDA / OpenCL", description: "On-demand accelerator for custom compute kernels and 3D rendering (sm_50)." },
  "perf-telemetry": { name: "perf-telemetry", category: "plugin", title: "Resource Telemetry Profiler", description: "Profiles CPU cycles, memory allocations, and disk I/O bottlenecks." },
  "vitest": { name: "vitest", category: "plugin", title: "Vitest Fast Unit Test Runner", description: "Runs lightning-fast TypeScript unit tests with native ESM support." },
  "pytest": { name: "pytest", category: "plugin", title: "Pytest Python Test Runner", description: "Executes Python test suites, fixtures, and coverage metrics." },
  "npx-skills": { name: "npx-skills", category: "plugin", title: "OpenCode Skills Installer", description: "Discovers and installs external agent skills from npm and github repositories." },
  "fastmcp": { name: "fastmcp", category: "plugin", title: "FastMCP Python Toolkit", description: "Rapidly builds and validates MCP servers with Python type annotations." },
  "mcp-registry": { name: "mcp-registry", category: "plugin", title: "Centralized MCP Registry", description: "Maintains local ~/.config/opencode/opencode.json server definitions." },
  "sentiment-analyzer": { name: "sentiment-analyzer", category: "plugin", title: "Customer Sentiment Classifier", description: "Classifies incoming feedback into positive, neutral, and friction signals." },
  "feedback-sanitizer": { name: "feedback-sanitizer", category: "plugin", title: "Feedback Sanitization Pipe", description: "Removes sensitive account IDs, tokens, and PII from customer tickets." },
  "ffmpeg-vaapi": { name: "ffmpeg-vaapi", category: "plugin", title: "FFmpeg VAAPI Hardware Pipe", description: "Accelerated video transcoding using Intel HD Graphics 620 QuickSync." },
  "pandoc": { name: "pandoc", category: "plugin", title: "Pandoc Universal Converter", description: "Converts Markdown to PDF, HTML, EPUB, and Word formats." },
  "canvas-render": { name: "canvas-render", category: "plugin", title: "Canvas 2D/3D Renderer", description: "Renders vector graphics, charts, and textures to PNG and WebP formats." },
  "token-meter": { name: "token-meter", category: "plugin", title: "Real-Time Token Meter", description: "Tracks input/output tokens per agent step to prevent budget overruns." },
  "cost-calculator": { name: "cost-calculator", category: "plugin", title: "Model Cost Calculator", description: "Calculates exact model inference costs in USD and local currencies." },
  "omniroute-budget": { name: "omniroute-budget", category: "plugin", title: "OmniRoute Budget Enforcer", description: "Hard-stops agent execution if session spend exceeds allocated threshold." },
  "ripgrep": { name: "ripgrep", category: "plugin", title: "Ripgrep Fast Search", description: "Recursively searches directories for regex patterns at disk speed." },
  "fd-find": { name: "fd-find", category: "plugin", title: "FD File Path Finder", description: "Fast, user-friendly alternative to find for locating files and paths." },
  "task-dispatcher": { name: "task-dispatcher", category: "plugin", title: "Sub-Task Dispatch Controller", description: "Dispatches and monitors concurrent subagent tasks with dependency locks." },
  "channel-router": { name: "channel-router", category: "plugin", title: "Inter-Agent Channel Router", description: "Passes structured payloads between specialist agents with type validation." },
  "seo-matrix": { name: "seo-matrix", category: "plugin", title: "SEO Semantic Matrix", description: "Analyzes heading hierarchies, meta tags, and keyword densities for web copy." },
  "copy-polisher": { name: "copy-polisher", category: "plugin", title: "Technical Copy Polisher", description: "Removes fluff, clarifies value propositions, and refines documentation tone." },
  "agent-shield": { name: "agent-shield", category: "plugin", title: "AgentShield Security Auditor", description: "Audits agent configuration directories for privilege escalations." },
  "git-secrets": { name: "git-secrets", category: "plugin", title: "Git Secrets Commit Hook", description: "Prevents committing passwords, private keys, and API tokens to git." },
  "gdb": { name: "gdb", category: "plugin", title: "GNU Debugger Native Tracer", description: "Inspects core dumps, stack traces, and memory registers for compiled binaries." },
  "node-inspector": { name: "node-inspector", category: "plugin", title: "Node.js V8 Inspector", description: "Attaches V8 debugger for profiling memory leaks and breakpoint stepping." },
  "log-correlator": { name: "log-correlator", category: "plugin", title: "Log Correlation Engine", description: "Correlates distributed log timestamps to pinpoint exact root-cause failure points." },
};

export interface Agent3D {
  id: string;
  name: string;
  department: string;
  lokaId: string;
  lokaName: string;
  lokaSanskrit: string;
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
  skills: string[];
  plugins: string[];
  lokaIndex: number;
  angularOffset: number;
  orbitRadius: number;
  orbitHeight: number;
  orbitSpeed: number;
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
  skills: string[];
  plugins: string[];
}

// -------------------------------------------------------------
// REALM 1: KAILASH DHAMA (R = 16.0, Y = 0.0)
// -------------------------------------------------------------
const LOKA_KAILASH: RawAgentDef[] = [
  {
    id: "maha-dev",
    name: "Maha-Dev",
    department: "MAHA-EXECUTIVE",
    role: "CEO, Primary Executive Orchestrator & Product Delivery Lead",
    archetype: "Paramashiva (The Supreme Consciousness & Unmanifest Void)",
    archetypeSanskrit: "परमशिव · आदियोगी",
    importanceTier: "CRITICAL",
    geometryType: "dodecahedron",
    nodeScale: 1.85,
    ringCount: 3,
    color: "#e6ca85", // Champagne Gold
    accentColor: "#facc15",
    access: "R/I/E (Sovereign Orchestration)",
    hardwareTarget: "All Targets (CPU / iGPU / dGPU Dispatch)",
    verificationScope: "9-Tier Hierarchy Enforcer & Project Acceptance",
    mandate: "Directs entire 24-specialist AI organization. Transforms client intent into high-integrity systems.",
    longDescription: "Paramashiva represents the unmanifest stillness and transcendent intelligence from which all organizational acts originate. Directly reports to the Human Sovereign Founder.",
    sampleWorkflow: "maha-dev intake --brief 'Build resilient system' --tier 3",
    tools: ["task", "skill", "todowrite", "read", "bash"],
    skills: ["mission-anchor", "plan-gate", "runtime-governance", "version-reconciliation", "verification-before-completion"],
    plugins: ["omniroute-telemetry", "docker-mcp", "context7", "git-mcp"],
  },
  {
    id: "mahadev-architect",
    name: "Architect",
    department: "MAHA-ENGINEERING",
    role: "System Design, Alternatives Analysis & Data Architect",
    archetype: "Ganesha (Remover of Architectural Obstacles & Master of Wisdom)",
    archetypeSanskrit: "विघ्नहर्ता · महागणपतिः",
    importanceTier: "CORE",
    geometryType: "octahedron",
    nodeScale: 1.45,
    ringCount: 2,
    color: "#f8fafc", // Moonlit Diamond
    accentColor: "#94a3b8",
    access: "R (Architecture & Design Specifications)",
    hardwareTarget: "CPU Architecture Synthesis",
    verificationScope: "9-Vector Matrix & Deep Planning Gate (PLAN.md)",
    mandate: "System design and architecture agent. Conducts 9-vector alternative analysis and scalability evaluations.",
    longDescription: "Lord Ganesha eliminates architectural bottlenecks before code is written, ensuring perfect technical blueprints.",
    sampleWorkflow: "mahadev-architect plan --vectors 9 --output PLAN.md",
    tools: ["read", "write", "glob", "grep"],
    skills: ["architecture-decision-records", "codebase-design", "domain-modeling", "improve-codebase-architecture"],
    plugins: ["tree-sitter", "ast-grep", "context7"],
  },
  {
    id: "mahadev-android",
    name: "Android",
    department: "MAHA-ANDROID",
    role: "Mobile Engineering, Gradle Optimization & Device Profiling",
    archetype: "Kartikeya / Murugan (Cosmic Commander & Swift Executor)",
    archetypeSanskrit: "कार्तिकेय · सेनानी",
    importanceTier: "SPECIALIST",
    geometryType: "tetrahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#fb923c", // Fiery Vermilion
    accentColor: "#ea580c",
    access: "I (Android / Flutter Builds)",
    hardwareTarget: "CPU / Physical ADB Device Only",
    verificationScope: "Physical Samsung A12 Device Verification (Zero Emulators)",
    mandate: "Android development agent for Gradle builds, SDK management, ADB debugging, APK builds, and Flutter projects.",
    longDescription: "Murugan's vel spear pierces through mobile build complexity, enforcing physical device testing over bloated emulators.",
    sampleWorkflow: "mahadev-android build --flavor release --target physical-a12",
    tools: ["bash", "read", "write", "glob"],
    skills: ["apkleaks", "hardware-budget"],
    plugins: ["adb-connector", "gradle-daemon", "android-sdk-36"],
  },
  {
    id: "maha-council",
    name: "Maha-Council",
    department: "MAHA-GOVERNANCE",
    role: "Supreme Advisory Governance & Architectural Council",
    archetype: "Sadashiva (The Five-Faced Supreme Revealer of Cosmic Law)",
    archetypeSanskrit: "सदाशिव · पञ्चमुख",
    importanceTier: "CORE",
    geometryType: "cuboctahedron",
    nodeScale: 1.5,
    ringCount: 2,
    color: "#fde047", // Radiant Solar Gold
    accentColor: "#ca8a04",
    access: "R (Supreme Council Audit)",
    hardwareTarget: "CPU Governance Synthesis",
    verificationScope: "Constitutional Safety, Anti-Drift & Tier 4 Risk Auditing",
    mandate: "Governance & Advisory Council. Debates proposed changes to agent architecture, departments, and safety policies.",
    longDescription: "Sadashiva's five countenances oversee all cosmic departments, guaranteeing alignment with the sovereign Founder mandate.",
    sampleWorkflow: "maha-council audit --proposal ARCH-042 --gate tier-4",
    tools: ["read", "grep"],
    skills: ["mission-anchor", "runtime-governance", "zero-trust-agent"],
    plugins: ["council-audit-log", "context7"],
  },
  {
    id: "maha-closer",
    name: "Maha-Closer",
    department: "MAHA-FINALIZATION",
    role: "Mandatory Task Finalization, Hygiene & Institutional Memory",
    archetype: "Rudra & Nandi (The Sacred Dissolver of Temporary Artifacts)",
    archetypeSanskrit: "रुद्र · नन्दी",
    importanceTier: "CRITICAL",
    geometryType: "icosahedron",
    nodeScale: 1.55,
    ringCount: 2,
    color: "#e2e8f0", // Pure White Ash / Bhasma
    accentColor: "#cbd5e1",
    access: "R/I (Clean / Task Report Finalization)",
    hardwareTarget: "CPU Clean & Report Generator",
    verificationScope: "Mandatory Workflow Finalization & Zero Secret Guarantee",
    mandate: "Mandatory Close, Clean & Final Report Specialist. The last employee in every workflow. Verifies zero secrets and purges caches.",
    longDescription: "Nandi seals the completed temple doors, dissolving temporary caches into permanent institutional memory reports.",
    sampleWorkflow: "maha-closer seal --verify-secrets --write-report ops/reports/tasks/TASK-099.md",
    tools: ["read", "write", "bash", "edit"],
    skills: ["closeout", "secret-hygiene", "verification-before-completion"],
    plugins: ["task-reporter", "artifact-purger", "git-mcp"],
  },
];

// -------------------------------------------------------------
// REALM 2: VAIKUNTHA DHAMA (R = 28.0, Y = +4.5)
// -------------------------------------------------------------
const LOKA_VAIKUNTHA: RawAgentDef[] = [
  {
    id: "maha-operations",
    name: "Operations",
    department: "MAHA-OPERATIONS",
    role: "PMO, Milestone Tracking & Knowledge Management",
    archetype: "Vishnu / Dharma (The Cosmic Sustainer & Protector of Order)",
    archetypeSanskrit: "श्रीविष्णु · जगत्पालकः",
    importanceTier: "CORE",
    geometryType: "icosahedron",
    nodeScale: 1.4,
    ringCount: 2,
    color: "#38bdf8", // Sky Sapphire
    accentColor: "#0284c7",
    access: "R/I (Operations & Memory Ledger)",
    hardwareTarget: "CPU Knowledge Engine",
    verificationScope: "23-Section Deep Planning Gate & Milestone Enforcement",
    mandate: "Coordinates multi-phase projects, enforces the Deep Planning Gate, and curates institutional ADR memory.",
    longDescription: "Lord Vishnu maintains stability, coordinating release gates and curating persistent session memory.",
    sampleWorkflow: "maha-operations track --milestone M3 --enforce-gate",
    tools: ["read", "write", "edit", "todowrite"],
    skills: ["plan-gate", "mission-anchor", "benchmark-provenance"],
    plugins: ["redis-mcp", "postgres-mcp", "context7"],
  },
  {
    id: "maha-preview",
    name: "Maha-Preview",
    department: "MAHA-INFRA",
    role: "Local Preview Hosting, Runtime Health & Port Lifecycle",
    archetype: "Garuda (The Luminous Sun-Bird & Swift Messenger)",
    archetypeSanskrit: "गरुड़ · प्रत्यक्षदर्शी",
    importanceTier: "SPECIALIST",
    geometryType: "octahedron",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#0ea5e9", // Bright Celestial Azure
    accentColor: "#0369a1",
    access: "R/I (Runtime & Port Management)",
    hardwareTarget: "CPU Local Preview Daemon (127.0.0.1)",
    verificationScope: "Health Probes & Ephemeral Preview Tear-down",
    mandate: "Starts dev servers, executes health checks, exposes verified localhost URLs, and terminates previews cleanly.",
    longDescription: "Garuda exposes real-time runtime health and visual feedback on localhost ports without disturbing persistent containers.",
    sampleWorkflow: "maha-preview serve --port auto --health-check",
    tools: ["bash", "read", "write"],
    skills: ["browser-qa", "webapp-testing"],
    plugins: ["playwright-mcp", "caddy-proxy", "port-probe"],
  },
  {
    id: "maha-reuse",
    name: "Maha-Reuse",
    department: "MAHA-ENGINEERING",
    role: "Code & Asset Reuse Specialist, Unused Code Indexer",
    archetype: "Ananta Shesha (The Thousand-Headed Serpent of Infinite Continuity)",
    archetypeSanskrit: "अनन्त शेष · स्मृतिधारकः",
    importanceTier: "SPECIALIST",
    geometryType: "goldenTorus",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#7dd3fc", // Moonlit Azure
    accentColor: "#0284c7",
    access: "R/I (Reuse Auditing)",
    hardwareTarget: "CPU AST Tree Matcher",
    verificationScope: "YAGNI Verification & Zero Redundant Code Policy",
    mandate: "Scans project codebases during planning to identify reusable components and catalog unused code.",
    longDescription: "Shesha preserves institutional knowledge, preventing duplicate code and encouraging clean modular reuse.",
    sampleWorkflow: "maha-reuse audit --path src/ --output UNUSED-CODE-INDEX.md",
    tools: ["read", "glob", "grep"],
    skills: ["codebase-design", "ponytail-audit", "ponytail-debt"],
    plugins: ["ast-grep", "tree-sitter", "reuse-index"],
  },
];

// -------------------------------------------------------------
// REALM 3: SATYALOKA & BRAHMALOKA (R = 42.0, Y = +9.0)
// -------------------------------------------------------------
const LOKA_BRAHMALOKA: RawAgentDef[] = [
  {
    id: "mahadev-build",
    name: "Build",
    department: "MAHA-ENGINEERING",
    role: "Primary Implementation Lead, Modularity & Git Author",
    archetype: "Brahma (The Universal Creator & Manifestor of Code)",
    archetypeSanskrit: "ब्रह्मा · सृष्टिपालकः",
    importanceTier: "CORE",
    geometryType: "cuboctahedron",
    nodeScale: 1.45,
    ringCount: 2,
    color: "#f59e0b", // Sacred Amber
    accentColor: "#b45309",
    access: "I (Full Workspace Implementation)",
    hardwareTarget: "CPU (-j2 Native Compilation) / NVIDIA 920MX CUDA",
    verificationScope: "Level 0 to Level 4 (Syntax, LSP, Linter, Types, Tests)",
    mandate: "Primary implementation agent for writing modular software, running builds, executing tests, and git integration.",
    longDescription: "Brahma weaves pure requirements into high-performance source code, strictly observing workstation compilation bounds.",
    sampleWorkflow: "mahadev-build implement --spec PRD.md --verify",
    tools: ["read", "edit", "write", "bash", "glob", "grep"],
    skills: ["test-driven-development", "subagent-driven-development", "executing-plans", "writing-plans"],
    plugins: ["compiler-j2", "git-mcp", "context7"],
  },
  {
    id: "maha-product",
    name: "Maha-Product",
    department: "MAHA-PRODUCT",
    role: "Product Management, UX Research & PRD Specialist",
    archetype: "Saraswati (The Embodiment of Wisdom, Arts & Clear Knowledge)",
    archetypeSanskrit: "सरस्वती · ज्ञानदात्री",
    importanceTier: "CORE",
    geometryType: "dodecahedron",
    nodeScale: 1.4,
    ringCount: 2,
    color: "#fbbf24", // Golden Topaz
    accentColor: "#d97706",
    access: "R/I (Product Specifications)",
    hardwareTarget: "CPU PRD & User Story Engine",
    verificationScope: "Founder Requirement Harmonization & User Flow Rigor",
    mandate: "Transforms ideas into rigorous functional specifications, PRDs, user stories with acceptance criteria.",
    longDescription: "Goddess Saraswati brings absolute cognitive clarity, turning abstract Founder visions into flawless product architectures.",
    sampleWorkflow: "maha-product spec --feature 'Cosmic UI' --output PRD.md",
    tools: ["read", "write", "glob"],
    skills: ["brainstorming", "writing-plans", "domain-modeling"],
    plugins: ["prd-generator", "user-story-engine", "context7"],
  },
  {
    id: "maha-research",
    name: "Maha-Research",
    department: "MAHA-R&D",
    role: "Lead Deep Research, Source Auditing & Strategy",
    archetype: "Dhiman & Narada (The Omnipresent Seer & Deep Inquirer)",
    archetypeSanskrit: "धीमान् · नारदमुनिः",
    importanceTier: "SPECIALIST",
    geometryType: "octahedron",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#fde047", // Radiant Dawn
    accentColor: "#ca8a04",
    access: "R/I (Research & Experiments)",
    hardwareTarget: "CPU 4-Tier Source Hierarchy Scanner",
    verificationScope: "Level 1/2 Ground Truth Evidence & Benchmark Provenance",
    mandate: "Investigates emerging technologies, enforces 4-tier source hierarchy, and conducts evidence-backed evaluations.",
    longDescription: "Dhiman pierces through marketing claims to uncover ground truth technical evidence and empirical benchmarks.",
    sampleWorkflow: "maha-research investigate --topic 'WebGL Three.js' --sources 4-tier",
    tools: ["read", "webfetch", "glob"],
    skills: ["crawl4ai", "benchmark-methodology", "the-knowledge-guy"],
    plugins: ["context7", "webfetch", "pdf-extractor"],
  },
];

// -------------------------------------------------------------
// REALM 4: SVARGALOKA & DEVLOK (R = 58.0, Y = +2.5)
// -------------------------------------------------------------
const LOKA_DEVLOK: RawAgentDef[] = [
  {
    id: "mahadev-devops",
    name: "DevOps",
    department: "MAHA-INFRA",
    role: "Docker Orchestration, Container Hardening & CI/CD",
    archetype: "Indra (The King of Devas & Master of Fortifications)",
    archetypeSanskrit: "इन्द्र · वज्रधारी",
    importanceTier: "CORE",
    geometryType: "icosahedron",
    nodeScale: 1.4,
    ringCount: 2,
    color: "#60a5fa", // Indraneela Sapphire
    accentColor: "#1d4ed8",
    access: "I (Docker & Container Infrastructure)",
    hardwareTarget: "Docker Engine 29.8 (Memory-Capped Compose Services)",
    verificationScope: "Memory Capping (< 4.1 GB Host Total) & 127.0.0.1 Bindings",
    mandate: "Manages Docker Compose infrastructure, container memory limits, and automated developer harnesses.",
    longDescription: "Indra constructs fortified container environments, enforcing memory caps to protect the 12 GB workstation.",
    sampleWorkflow: "mahadev-devops deploy --stack dev-stack.yml --memory-limit 1g",
    tools: ["bash", "read", "write"],
    skills: ["docker-patterns", "runtime-governance"],
    plugins: ["docker-compose", "caddy-2", "prometheus-exporter"],
  },
  {
    id: "maha-advisory",
    name: "Maha-Advisory",
    department: "MAHA-GUIDANCE",
    role: "Strategic Advisory, Legal/Compliance & Cost Modeling",
    archetype: "Brihaspati (The Guru of the Gods & Master of Dharma)",
    archetypeSanskrit: "बृहस्पति · देवगुरुः",
    importanceTier: "ADVISORY",
    geometryType: "octahedron",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#93c5fd", // Celestial Sky
    accentColor: "#2563eb",
    access: "R (Read-Only Strategic Counsel)",
    hardwareTarget: "CPU Advisory Matrix",
    verificationScope: "Open Source License Compliance & Architectural Trade-offs",
    mandate: "Provides architectural trade-off comparisons, open source license reviews, and infrastructure cost modeling.",
    longDescription: "Brihaspati advises on strategic tradeoffs, license compliance, and high-level architectural decisions.",
    sampleWorkflow: "maha-advisory evaluate --licenses --cost-model",
    tools: ["read", "glob"],
    skills: ["agent-architecture-audit", "writing-for-agents"],
    plugins: ["license-auditor", "fin-modeler", "context7"],
  },
  {
    id: "mahadev-performance",
    name: "Performance",
    department: "MAHA-QUALITY",
    role: "Primary Hardware Advisor, Resource Profiling & Telemetry",
    archetype: "Agni (The Sacred Fire & Transmuter of Energy)",
    archetypeSanskrit: "अग्नि · पावकः",
    importanceTier: "CORE",
    geometryType: "tetrahedron",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#38bdf8", // Cosmic Plasma
    accentColor: "#0284c7",
    access: "R (Telemetry & Profiling)",
    hardwareTarget: "CPU / Intel HD 620 / NVIDIA 920MX Benchmark Provenance",
    verificationScope: "Level 7 Performance Profiling & Workload Fingerprints",
    mandate: "Evaluates CPU, memory, disk, GPU/VRAM, build times, and Workload Fingerprint comparability matching.",
    longDescription: "Agni measures energetic consumption, routing workloads to the optimal execution target based on empirical data.",
    sampleWorkflow: "mahadev-performance profile --target cpu --workload matrix",
    tools: ["read", "bash"],
    skills: ["benchmark-provenance", "hardware-budget"],
    plugins: ["intel-vaapi", "nvidia-cuda", "perf-telemetry"],
  },
  {
    id: "mahadev-test",
    name: "Test",
    department: "MAHA-QUALITY",
    role: "Test Strategy, Coverage Suites & Browser QA",
    archetype: "Varuna (The Cosmic Overseer of Truth & Flow)",
    archetypeSanskrit: "वरुण · ऋतपालकः",
    importanceTier: "CORE",
    geometryType: "cuboctahedron",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#818cf8", // Astral Violet
    accentColor: "#4f46e5",
    access: "I (Test Suites & QA Harnesses)",
    hardwareTarget: "CPU Pytest / Vitest / Playwright QA",
    verificationScope: "Level 4 (Unit), Level 5 (Integration), Level 8 (Browser QA)",
    mandate: "Creates unit tests, integration tests, measures coverage, and executes Playwright browser verification.",
    longDescription: "Varuna enforces rigorous verification gates, ensuring no regressions pass through unnoticed.",
    sampleWorkflow: "mahadev-test run --coverage 90 --suite e2e",
    tools: ["bash", "read", "write", "glob"],
    skills: ["e2e-testing", "eval-driven-development", "test-driven-development"],
    plugins: ["playwright-mcp", "vitest", "pytest"],
  },
  {
    id: "maha-capability-manager",
    name: "Capability Mgr",
    department: "MAHA-CAPABILITY",
    role: "External Tool Vetting, Capability Registry & GPU Gate",
    archetype: "Kubera (The Divine Treasurer & Guardian of Celestial Assets)",
    archetypeSanskrit: "कुबेर · धनाधिपतिः",
    importanceTier: "SPECIALIST",
    geometryType: "goldenTorus",
    nodeScale: 1.3,
    ringCount: 1,
    color: "#a78bfa", // Amethyst Gold
    accentColor: "#7c3aed",
    access: "R/I (Capability Registry)",
    hardwareTarget: "CPU Capability Registry & GPU Gatekeeper",
    verificationScope: "License Provenance, Security Vetting & GPU Hardware Gate",
    mandate: "Discovers, evaluates, vets provenance, and installs external tools and MCP servers safely.",
    longDescription: "Kubera audits external libraries, ensuring only vetted, hardware-compatible tools enter the ecosystem.",
    sampleWorkflow: "maha-capability-manager vet --package lucide-icons --gate hardware",
    tools: ["read", "write", "edit", "glob"],
    skills: ["find-skills", "mcp-curation", "mcp-builder"],
    plugins: ["npx-skills", "fastmcp", "mcp-registry"],
  },
];

// -------------------------------------------------------------
// REALM 5: PRITHVILOK & BHULOKA (R = 76.0, Y = -3.5)
// -------------------------------------------------------------
const LOKA_PRITHVILOK: RawAgentDef[] = [
  {
    id: "maha-feedback",
    name: "Maha-Feedback",
    department: "MAHA-CUSTOMER",
    role: "Customer Feedback, Support Triage & Sentiment Specialist",
    archetype: "Bhumi & Matrikas (The Nurturing Mother Earth & Voice of User)",
    archetypeSanskrit: "भूमि · मातृका",
    importanceTier: "SPECIALIST",
    geometryType: "icosidodecahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#34d399", // Terrestrial Jade
    accentColor: "#059669",
    access: "R/I (Sanitized Sentiment Ingestion)",
    hardwareTarget: "CPU PII Sanitizer",
    verificationScope: "Level 6 Deterministic PII Redaction",
    mandate: "Ingests, categorizes, sanitizes, and analyzes user feedback, bug reports, and sentiment into actionable insights.",
    longDescription: "Bhumi listens to end-user needs, sanitizing PII before routing feedback to product and debug teams.",
    sampleWorkflow: "maha-feedback ingest --sanitize-pii --classify-sentiment",
    tools: ["read", "edit", "write"],
    skills: ["deterministic-pii-redaction", "prompt-injection-sanitizer"],
    plugins: ["sentiment-analyzer", "feedback-sanitizer"],
  },
  {
    id: "mahadev-content",
    name: "Content",
    department: "MAHA-CONTENT",
    role: "FFmpeg Media Processing, Transcoding & Asset Preparation",
    archetype: "Chitraratha (The Celestial Bard & Master of Arts)",
    archetypeSanskrit: "चित्ररथ · गन्धर्वराजः",
    importanceTier: "SPECIALIST",
    geometryType: "dodecahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#10b981", // Emerald Art
    accentColor: "#047857",
    access: "I (Media & Assets)",
    hardwareTarget: "Intel HD 620 VAAPI Engine (BM-20260912-02)",
    verificationScope: "Hardware VAAPI Accelerated Media Transcoding",
    mandate: "Processes high-fidelity audio/video pipelines using Intel HD 620 VAAPI hardware acceleration.",
    longDescription: "Chitraratha automates media assets, using Intel VAAPI hardware transcoding for maximum energy efficiency.",
    sampleWorkflow: "mahadev-content transcode --input input.mp4 --vaapi h264",
    tools: ["bash", "read", "write"],
    skills: ["docx", "pdf", "pptx", "convert-documents-to-markdown"],
    plugins: ["ffmpeg-vaapi", "pandoc", "canvas-render"],
  },
  {
    id: "mahadev-cost",
    name: "Cost",
    department: "MAHA-FINANCE",
    role: "Token Budget Auditing, Spend & Compute Telemetry",
    archetype: "Ganita (The Master Reckoner & Accountant of Cosmos)",
    archetypeSanskrit: "गणित · लेखापालकः",
    importanceTier: "SPECIALIST",
    geometryType: "icosahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#6ee7b7", // Mint Ledger
    accentColor: "#047857",
    access: "R (Token & Compute Accounting)",
    hardwareTarget: "CPU Ledger Auditor",
    verificationScope: "Token Budget Gate & Step Quota Enforcement",
    mandate: "Cost analysis, token budget auditing, and spend optimization specialist. Tracks model API expenditures.",
    longDescription: "Ganita tracks model API costs, enforcing strict budgets to avoid wasteful token loops.",
    sampleWorkflow: "mahadev-cost audit --session current --currency USD",
    tools: ["read", "glob"],
    skills: ["hardware-budget", "ponytail-gain"],
    plugins: ["token-meter", "cost-calculator", "omniroute-budget"],
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
    nodeScale: 1.25,
    ringCount: 1,
    color: "#059669", // Deep Forest Green
    accentColor: "#065f46",
    access: "R (Read-Only Exploration)",
    hardwareTarget: "CPU AST & Text Scanner",
    verificationScope: "Structural AST Codebase Mapping",
    mandate: "Fast read-only repository exploration agent. Maps codebase structure, identifies patterns, and finds files.",
    longDescription: "Chara maps unfamiliar repos with rapid AST scans without modifying project files.",
    sampleWorkflow: "mahadev-explore map --path src/ --depth 3",
    tools: ["read", "glob", "grep"],
    skills: ["codebase-design", "improve-codebase-architecture"],
    plugins: ["ripgrep", "tree-sitter", "fd-find"],
  },
  {
    id: "mahadev-orchestrator",
    name: "Orchestrator",
    department: "MAHA-ENGINEERING",
    role: "Multi-Stage Subflow Routing & Task Dependency Lead",
    archetype: "Sutradhara (The Master Weaver of Cosmic Threads)",
    archetypeSanskrit: "सूत्रधार · समन्वयकः",
    importanceTier: "SPECIALIST",
    geometryType: "goldenTorus",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#2dd4bf", // Teal Silk
    accentColor: "#0f766e",
    access: "R (Workflow Routing)",
    hardwareTarget: "CPU Task Dispatcher",
    verificationScope: "Sub-Task Return Policy & Anti-Drift Gate",
    mandate: "Coordinates work between agents for complex multi-step tasks. Manages dependencies and ensures coherent returns.",
    longDescription: "Sutradhara weaves together multiple subagents, guaranteeing immediate return to the North Star Mission.",
    sampleWorkflow: "mahadev-orchestrator chain --stage build --stage test",
    tools: ["task", "read"],
    skills: ["dispatching-parallel-agents", "mission-anchor"],
    plugins: ["task-dispatcher", "channel-router"],
  },
  {
    id: "maha-marketing",
    name: "Maha-Marketing",
    department: "MAHA-MARKETING",
    role: "Product Positioning, Technical Copywriting & SEO",
    archetype: "Maya & Vani (The Master Architect of Perception & Expression)",
    archetypeSanskrit: "माया · वाणी",
    importanceTier: "SPECIALIST",
    geometryType: "octahedron",
    nodeScale: 1.25,
    ringCount: 1,
    color: "#a7f3d0", // Jade Mist
    accentColor: "#059669",
    access: "R/I (Commercial Copy & Positioning)",
    hardwareTarget: "CPU Copy & SEO Analyzer",
    verificationScope: "Zero AI Slop Gate & Technical Clarity Review",
    mandate: "Drafts product positioning, technical marketing copy, landing pages, and commercial proposals.",
    longDescription: "Maya crafts high-impact product positioning without synthetic marketing buzzwords.",
    sampleWorkflow: "maha-marketing position --product 'MahaDev 3D' --channel web",
    tools: ["read", "write"],
    skills: ["banner-design", "brand", "design", "no-ai-slop"],
    plugins: ["seo-matrix", "copy-polisher", "context7"],
  },
];

// -------------------------------------------------------------
// REALM 6: YAMALOKA & BHAIRAVALOKA (R = 95.0, Y = -8.5)
// -------------------------------------------------------------
const LOKA_YAMLOK: RawAgentDef[] = [
  {
    id: "mahadev-security",
    name: "Security",
    department: "MAHA-SECURITY",
    role: "Security Auditing, Secret Hygiene & Hardening",
    archetype: "Dharma-Raja & Kavacha (The Sovereign Judge & Impenetrable Armor)",
    archetypeSanskrit: "धर्मराज · कवचधारी",
    importanceTier: "CORE",
    geometryType: "octahedron",
    nodeScale: 1.4,
    ringCount: 2,
    color: "#f87171", // Ruby Flame
    accentColor: "#b91c1c",
    access: "R (Security Auditing)",
    hardwareTarget: "CPU Entropy & Secret Scanner",
    verificationScope: "Level 6 Security Audits & Zero Secret Leakage",
    mandate: "Security audit agent for secret detection, vulnerability scanning, and permission auditing.",
    longDescription: "Dharma-Raja audits codebase security, enforcing the strict Zero Sudo and Zero Credential policies.",
    sampleWorkflow: "mahadev-security scan --secrets --entropy-threshold 4.5",
    tools: ["read", "glob", "grep"],
    skills: ["secret-hygiene", "security-review", "zero-trust-agent", "security-scan"],
    plugins: ["apkleaks", "agent-shield", "git-secrets"],
  },
  {
    id: "mahadev-debug",
    name: "Debug",
    department: "MAHA-ENGINEERING",
    role: "Defect Reproduction, Root-Cause Analysis & Fix Lead",
    archetype: "Bhairava (The Fierce Destroyer of Bugs & Illusions)",
    archetypeSanskrit: "भैरव · संहारकः",
    importanceTier: "CORE",
    geometryType: "torusKnot",
    nodeScale: 1.35,
    ringCount: 1,
    color: "#ef4444", // Crimson Fury
    accentColor: "#991b1b",
    access: "I (Bug Fixing & Reproduction)",
    hardwareTarget: "CPU Isolated Test Sandbox",
    verificationScope: "Root-Cause Defect Resolution & Multi-Layer Isolation",
    mandate: "Debugging agent that reproduces failures, isolates root causes, and implements verified fixes.",
    longDescription: "Bhairava cuts through obscure runtime errors, reproducing bugs systematically and verifying permanent fixes.",
    sampleWorkflow: "mahadev-debug fix --error-trace stack.log --verify-unit",
    tools: ["read", "edit", "write", "bash"],
    skills: ["systematic-debugging", "receiving-code-review"],
    plugins: ["gdb", "node-inspector", "log-correlator"],
  },
];

// Configuration for mapping across 6 concentric non-overlapping spheres
const ALL_LOKAS_MAPPING = [
  { loka: VEDIC_LOKAS[0], agents: LOKA_KAILASH, lokaIdx: 0 },
  { loka: VEDIC_LOKAS[1], agents: LOKA_VAIKUNTHA, lokaIdx: 1 },
  { loka: VEDIC_LOKAS[2], agents: LOKA_BRAHMALOKA, lokaIdx: 2 },
  { loka: VEDIC_LOKAS[3], agents: LOKA_DEVLOK, lokaIdx: 3 },
  { loka: VEDIC_LOKAS[4], agents: LOKA_PRITHVILOK, lokaIdx: 4 },
  { loka: VEDIC_LOKAS[5], agents: LOKA_YAMLOK, lokaIdx: 5 },
];

let globalHarmonicIdx = 1;
export const AGENTS_3D: Agent3D[] = ALL_LOKAS_MAPPING.flatMap(({ loka, agents, lokaIdx }) => {
  const count = agents.length;
  const angularStep = (Math.PI * 2) / count;

  return agents.map((agent, i) => {
    const angularOffset = i * angularStep;

    const agent3D: Agent3D = {
      ...agent,
      lokaId: loka.id,
      lokaName: loka.name,
      lokaSanskrit: loka.sanskrit,
      lokaIndex: lokaIdx,
      angularOffset,
      orbitRadius: loka.radius,
      orbitHeight: loka.height,
      orbitSpeed: loka.speed,
      phiHarmonicIndex: globalHarmonicIdx++,
    };
    return agent3D;
  });
});
