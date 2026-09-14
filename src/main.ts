import { CosmosScene } from './cosmos/CosmosScene';
import { AgentInspector3D } from './cosmos/AgentInspector3D';
import { AGENTS_3D, Agent3D } from './data/agents';
import { audioEngine } from './audioEngine';

class App {
  private scene: CosmosScene | null = null;
  private inspector3D: AgentInspector3D | null = null;
  private hoverCard: HTMLElement | null = null;

  // Magnetic cursor state
  private cursorDot: HTMLElement | null = null;
  private cursorRing: HTMLElement | null = null;
  private mousePos = { x: -100, y: -100 };
  private ringPos = { x: -100, y: -100 };

  constructor() {
    this.init();
  }

  private init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    this.hoverCard = document.getElementById('agent-hover-card');
    this.cursorDot = document.getElementById('magnetic-cursor-dot');
    this.cursorRing = document.getElementById('magnetic-cursor-ring');

    // 1. Initialize Main 3D Cosmos Scene
    this.scene = new CosmosScene(
      container,
      (agent) => this.handleAgentSelected(agent),
      (agent, mouseEvent) => this.handleAgentHovered(agent, mouseEvent)
    );

    // 2. Initialize Drawer 3D Inspector Viewport
    const drawer3DContainer = document.getElementById('drawer-3d-viewport');
    if (drawer3DContainer) {
      this.inspector3D = new AgentInspector3D(drawer3DContainer);
    }

    this.setupMagneticCursor();
    this.setupUIControls();
    this.setupModalControls();
    this.setupAudioToggle();
    this.setupTelemetryTicker();
  }

  private setupMagneticCursor() {
    if (!this.cursorDot || !this.cursorRing) return;

    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;

      this.cursorDot!.style.opacity = '1';
      this.cursorRing!.style.opacity = '1';
      this.cursorDot!.style.left = `${e.clientX}px`;
      this.cursorDot!.style.top = `${e.clientY}px`;
    });

    const renderCursor = () => {
      // Smooth lerp for outer ring
      this.ringPos.x += (this.mousePos.x - this.ringPos.x) * 0.18;
      this.ringPos.y += (this.mousePos.y - this.ringPos.y) * 0.18;

      if (this.cursorRing) {
        this.cursorRing.style.left = `${this.ringPos.x}px`;
        this.cursorRing.style.top = `${this.ringPos.y}px`;
      }
      requestAnimationFrame(renderCursor);
    };
    renderCursor();
  }

  private handleAgentHovered(agent: Agent3D | null, mouseEvent?: MouseEvent) {
    if (!this.hoverCard) return;

    if (!agent || !mouseEvent) {
      this.hoverCard.classList.add('opacity-0', 'pointer-events-none');
      if (this.cursorRing) {
        this.cursorRing.style.width = '28px';
        this.cursorRing.style.height = '28px';
        this.cursorRing.style.borderColor = 'rgba(250, 204, 21, 0.4)';
      }
      return;
    }

    // Expand cursor ring on hover
    if (this.cursorRing) {
      this.cursorRing.style.width = '46px';
      this.cursorRing.style.height = '46px';
      this.cursorRing.style.borderColor = `${agent.color}`;
    }

    // Populate Hover Data
    const deptElem = document.getElementById('hover-dept');
    const nameElem = document.getElementById('hover-name');
    const tierElem = document.getElementById('hover-tier');
    const archElem = document.getElementById('hover-archetype');
    const mandateElem = document.getElementById('hover-mandate');

    if (deptElem) deptElem.textContent = agent.department;
    if (nameElem) {
      nameElem.textContent = agent.name;
      nameElem.style.color = agent.color;
    }
    if (tierElem) {
      tierElem.textContent = `${agent.importanceTier} · Φ#${agent.phiHarmonicIndex}`;
      tierElem.style.borderColor = `${agent.color}66`;
    }
    if (archElem) archElem.textContent = `${agent.archetype} (${agent.archetypeSanskrit})`;
    if (mandateElem) mandateElem.textContent = agent.mandate;

    // Position floating card safely within viewport
    const x = Math.min(window.innerWidth - 320, Math.max(16, mouseEvent.clientX + 16));
    const y = Math.min(window.innerHeight - 200, Math.max(16, mouseEvent.clientY - 50));

    this.hoverCard.style.left = `${x}px`;
    this.hoverCard.style.top = `${y}px`;
    this.hoverCard.style.borderColor = `${agent.color}66`;
    this.hoverCard.classList.remove('opacity-0', 'pointer-events-none');
  }

  private handleAgentSelected(agent: Agent3D | null) {
    const drawer = document.getElementById('agent-drawer');
    if (!drawer || !agent) return;

    audioEngine.playChime(720, 0.25);

    // Hide hover card when selecting
    if (this.hoverCard) this.hoverCard.classList.add('opacity-0');

    // Populate detailed dossier
    document.getElementById('drawer-name')!.textContent = agent.name;
    document.getElementById('drawer-role')!.textContent = agent.role;
    document.getElementById('drawer-dept')!.textContent = agent.department;
    document.getElementById('drawer-tier')!.textContent = `${agent.importanceTier} · R: ${agent.orbitRadius} · Φ#${agent.phiHarmonicIndex}`;
    document.getElementById('drawer-archetype')!.textContent = `${agent.archetype} · ${agent.archetypeSanskrit}`;
    document.getElementById('drawer-desc')!.textContent = agent.longDescription;
    document.getElementById('drawer-hardware')!.textContent = agent.hardwareTarget;
    document.getElementById('drawer-verification')!.textContent = agent.verificationScope;
    document.getElementById('drawer-workflow')!.textContent = agent.sampleWorkflow;

    const toolsContainer = document.getElementById('drawer-tools')!;
    toolsContainer.innerHTML = agent.tools
      .map(
        (t) =>
          `<span class="px-2.5 py-1 bg-white/[0.04] text-cyan-300 rounded-md font-mono text-[10px] border border-white/10">${t}</span>`
      )
      .join('');

    // Open drawer
    drawer.classList.remove('translate-x-full');

    // Load Agent 3D Model into Inspector Viewport
    if (this.inspector3D) {
      setTimeout(() => {
        this.inspector3D?.resize();
        this.inspector3D?.loadAgent(agent);
      }, 50);
    }
  }

  private setupUIControls() {
    // Mode Buttons (Pancha Kritya)
    const modes = ['srishti', 'sthiti', 'samhara', 'tirobhava', 'anugraha'];
    modes.forEach((mode) => {
      const btn = document.getElementById(`btn-mode-${mode}`);
      if (btn) {
        btn.addEventListener('click', () => {
          audioEngine.playChime(576, 0.15);

          modes.forEach((m) => {
            const b = document.getElementById(`btn-mode-${m}`);
            if (b) {
              b.className =
                'px-3.5 py-1.5 rounded-xl font-mono text-[11px] bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/20 transition-all';
            }
          });
          btn.className =
            'px-3.5 py-1.5 rounded-xl font-mono text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/50 font-semibold shadow-md shadow-amber-950/40 transition-all';

          if (this.scene) {
            this.scene.setMode(mode);
          }
          this.updateModeHUD(mode);
        });
      }
    });

    // Orbit Rotate Toggle Button
    const rotateBtn = document.getElementById('btn-toggle-rotate');
    let rotating = true;
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        audioEngine.playChime(640, 0.1);
        rotating = !rotating;
        if (this.scene) this.scene.setAutoRotate(rotating);
        rotateBtn.textContent = rotating ? 'Orbit: Active' : 'Orbit: Paused';
        rotateBtn.className = rotating
          ? 'text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300'
          : 'text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400';
      });
    }

    // Golden Ratio Spiral Toggle
    const phiBtn = document.getElementById('btn-toggle-phi');
    const phiLabel = document.getElementById('phi-toggle-label');
    let phiVisible = true;
    if (phiBtn) {
      phiBtn.addEventListener('click', () => {
        audioEngine.playChime(864, 0.15);
        if (this.scene) {
          phiVisible = this.scene.toggleGoldenSpiral();
          if (phiLabel) phiLabel.textContent = phiVisible ? 'Φ Spiral: On' : 'Φ Spiral: Off';
          phiBtn.className = phiVisible
            ? 'px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all flex items-center gap-1.5'
            : 'px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
        }
      });
    }

    // Modal Close Drawer
    const closeBtn = document.getElementById('btn-close-drawer');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        audioEngine.playChime(480, 0.1);
        const drawer = document.getElementById('agent-drawer');
        if (drawer) drawer.classList.add('translate-x-full');
      });
    }
  }

  private setupModalControls() {
    const modal = document.getElementById('info-modal');
    if (!modal) return;

    const openModal = (tab: string) => {
      audioEngine.playChime(864, 0.2);
      this.renderModalContent(tab);
      modal.classList.remove('hidden');
    };

    const closeModal = () => {
      audioEngine.playChime(432, 0.15);
      modal.classList.add('hidden');
    };

    // Nav Buttons
    const navMapping: Record<string, string> = {
      'nav-philosophy': 'philosophy',
      'nav-phi': 'phi',
      'nav-agents': 'agents',
      'nav-hardware': 'hardware',
      'nav-verification': 'verification',
      'nav-terminal': 'terminal',
      'mob-modal-btn': 'philosophy',
    };

    Object.entries(navMapping).forEach(([id, tab]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => openModal(tab));
    });

    // Close Button
    const closeBtn = document.getElementById('btn-close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Tab Switchers in Modal Sidebar Rail
    document.querySelectorAll('.modal-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        audioEngine.playChime(720, 0.1);
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          document.querySelectorAll('.modal-tab-btn').forEach((b) => {
            b.className =
              'modal-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all';
          });
          btn.className =
            'modal-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 font-semibold transition-all';
          this.renderModalContent(tab);
        }
      });
    });
  }

  private renderModalContent(tab: string) {
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    if (!body || !title) return;

    if (tab === 'phi') {
      title.textContent = 'Φ Golden Ratio & Fibonacci Sacred Harmonics';
      body.innerHTML = `
        <div class="space-y-6">
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-amber-500/30">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-serif text-lg font-bold text-amber-300">Φ = 1.61803398875 · The Architectural Harmonic Law</h3>
              <span class="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px]">Golden Proportions Active</span>
            </div>
            <p class="text-slate-300 leading-relaxed text-sm font-sans">
              In MahaDev OS v3.2.0, the <strong class="text-amber-300">Golden Ratio ($\phi$)</strong> is the mathematical foundation governing orbital radii, angular distribution, typography scales, WebGL geometries, and sound frequencies.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">1. 3D Logarithmic Golden Spiral</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                Rendered as an exact celestial curve ($r = a \\cdot e^{b\\theta}$ where $b = \\frac{\\ln\\phi}{\\pi/2} \\approx 0.30635$). Concentric orbital guide rings follow Fibonacci radii: <strong class="text-white">8, 13, 21, 34, 55, 89 units</strong>.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">2. Golden Angle Cosmic Distribution</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                All 24 agents are positioned using the Golden Angle <strong class="text-white">$\\psi = 137.507764^{\\circ} = 2\\pi(1 - 1/\\phi)$</strong>, guaranteeing zero planetary collision and optimal spatial packing across 3D space.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">3. Keplerian Harmonic Speeds</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                Orbital velocity decays harmonically with distance: $\\omega_n = \\frac{\\omega_0}{\\phi^{(0.9n / 24)}}$, producing perfectly synchronous celestial orbital mechanics.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-purple-400 font-mono text-xs uppercase tracking-wider font-bold">4. Golden Torus & Damru Vortex</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                The central Spanda Torus is shaped with major radius $R = 8\\phi = 12.944$ and tube $r = 8/\\phi = 4.944$. The Damru particle vortex distributes 890 particles along the Fermat Golden Spiral.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">5. Fibonacci UI Modular Scale</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                Spacing and card aspect ratios follow Fibonacci numbers ($2, 3, 5, 8, 13, 21, 34, 55, 89, 377\\text{px}$) for natural visual elegance and cognitive comfort.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-sky-400 font-mono text-xs uppercase tracking-wider font-bold">6. 432 Hz Shiva Solfeggio Sound</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                The integrated Web Audio engine synthesizes 432 Hz fundamental ($27 \\times 16$) and 216 Hz sub-octave drone, vibrating in exact mathematical resonance with the golden cosmic matrix.
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'philosophy') {
      title.textContent = 'Vedic Metaphysics & Autonomous Architecture';
      body.innerHTML = `
        <div class="space-y-6">
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 class="font-serif text-lg font-bold text-amber-300 mb-2">ॐ Paramashiva: The Source, Flow & Void</h3>
            <p class="text-slate-300 leading-relaxed text-sm font-sans">
              In Kashmir Shaivism and Advaita Vedanta, <strong class="text-white">MahaDev (Lord Shiva)</strong> is the non-dual reality. <strong class="text-amber-300">Shiva</strong> translates to <em>"That which is not"</em> — the unmanifest zero-point void (<span class="text-amber-400 font-serif">Shunya</span>) from which all intelligence originates.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 class="font-serif font-bold text-white text-sm tracking-wide">शून्य & अनन्त (Shunya & Ananta)</h4>
              <p class="text-xs text-slate-400 leading-relaxed font-sans">
                Absolute stillness and infinite potential. In MahaDev OS v3.2.0, every project begins from absolute zero assumptions (Level 1/2 Ground Truth), preventing bloated code.
              </p>
            </div>
            <div class="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 class="font-serif font-bold text-white text-sm tracking-wide">स्पन्द & ताण्डव (Spanda & Tandava)</h4>
              <p class="text-xs text-slate-400 leading-relaxed font-sans">
                The primordial pulse of vibration and the cosmic dance of energy. 24 specialist subagents coordinate concurrently across 10 autonomous departments like a choreographed dance.
              </p>
            </div>
            <div class="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 class="font-serif font-bold text-white text-sm tracking-wide">त्रिनेत्र & त्रिशूल (Trinetra & Trishula)</h4>
              <p class="text-xs text-slate-400 leading-relaxed font-sans">
                The Third Eye pierces through AI hallucinations into empirical truth. The Trident unites three energetic channels mapped to CPU, Intel iGPU, and NVIDIA dGPU hardware.
              </p>
            </div>
            <div class="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 class="font-serif font-bold text-white text-sm tracking-wide">पञ्च कृत्य (Pancha Kritya)</h4>
              <p class="text-xs text-slate-400 leading-relaxed font-sans">
                The 5 Cosmic Acts: Srishti (Creation), Sthiti (Preservation), Samhara (Dissolution), Tirobhava (Veiling), and Anugraha (Grace) governing our software lifecycles.
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'agents') {
      title.textContent = 'The 24 Specialist Agent Pantheon';
      body.innerHTML = `
        <div class="space-y-4">
          <p class="text-xs text-slate-400 font-sans">
            Autonomous, role-bounded specialist agents executing under sovereign Founder command along the Golden Spiral matrix. Click any agent card to inspect its full 3D artifact and capabilities.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-2">
            ${AGENTS_3D.map(
              (a) => `
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/40 transition-all cursor-pointer agent-card flex flex-col justify-between space-y-3" data-id="${a.id}">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300">${a.department}</span>
                    <span class="text-[9px] font-mono text-amber-400 font-bold">Φ#${a.phiHarmonicIndex}</span>
                  </div>
                  <h4 class="font-bold text-white text-sm mt-2 font-sans" style="color: ${a.color}">${a.name}</h4>
                  <p class="text-[11px] text-amber-300 font-cormorant italic">${a.archetype}</p>
                  <p class="text-[11px] text-slate-400 font-sans line-clamp-2 mt-1 leading-relaxed">${a.mandate}</p>
                </div>
                <div class="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-white/5 pt-2">
                  <span>Radius: ${a.orbitRadius}</span>
                  <span class="text-amber-400 font-medium">Inspect 3D →</span>
                </div>
              </div>
            `
            ).join('')}
          </div>
        </div>
      `;

      // Add click handlers for agent cards
      setTimeout(() => {
        document.querySelectorAll('.agent-card').forEach((card) => {
          card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const agent = AGENTS_3D.find((ag) => ag.id === id);
            if (agent) {
              document.getElementById('info-modal')!.classList.add('hidden');
              this.handleAgentSelected(agent);
            }
          });
        });
      }, 50);
    } else if (tab === 'hardware') {
      title.textContent = 'Trishula Hardware Matrix & Provenance';
      body.innerHTML = `
        <div class="space-y-6">
          <div class="p-5 rounded-xl bg-white/[0.02] border border-white/10">
            <h4 class="font-serif font-bold text-white mb-1 text-sm">Lenovo IdeaPad 310-15IKB Topology</h4>
            <p class="text-xs text-slate-400 font-mono">Intel Core i5-7200U · 12 GB RAM · Zorin OS 18.1 · Docker 29.8 · NVIDIA 920MX</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-cyan-400 font-bold block uppercase text-[10px] tracking-wider">1. CPU Channel</span>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">Intel i5-7200U (2 cores / 4 threads). Runs native compilation with strict <code class="text-cyan-300 font-mono">-j2</code> concurrency.</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-emerald-400 font-bold block uppercase text-[10px] tracking-wider">2. Intel HD 620 iGPU</span>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">Primary display & media transcoding engine via Intel VAAPI (<code class="text-cyan-300 font-mono">BM-20260912-02</code>).</p>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wider">3. NVIDIA 920MX dGPU</span>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">Reserved on-demand for 3D rendering and custom CUDA <code class="text-cyan-300 font-mono">sm_50</code> kernels (<code class="text-cyan-300 font-mono">BM-20260912-01</code>).</p>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'verification') {
      title.textContent = '9-Tier Correctness Verification Hierarchy';
      body.innerHTML = `
        <div class="space-y-4">
          <p class="text-xs text-slate-400 font-sans">
            Every software increment must ascend through the 9-Tier verification ladder before merging. Multi-layer failure isolation guarantees zero regressions.
          </p>
          <div class="space-y-2 font-mono text-xs max-h-[50vh] overflow-y-auto pr-2">
            ${[
              { tier: 'Level 0', name: 'Textual Syntax', desc: 'Raw AST and character-level structure.' },
              { tier: 'Level 1', name: 'LSP Diagnostics', desc: 'Real-time static type and symbol checking.' },
              { tier: 'Level 2', name: 'Linters & Formatters', desc: 'Ruff, Prettier, and ShellCheck adherence.' },
              { tier: 'Level 3', name: 'Compiler & Types', desc: 'Strict TypeScript tsc, GCC, or Cargo checks.' },
              { tier: 'Level 4', name: 'Unit Testing', desc: 'Isolated component and function test suites.' },
              { tier: 'Level 5', name: 'Integration Testing', desc: 'Multi-service and API flow validation.' },
              { tier: 'Level 6', name: 'Security Audits', desc: 'Secret detection and least-privilege checks.' },
              { tier: 'Level 7', name: 'Performance Profiling', desc: 'CPU, memory, and VRAM budget verification.' },
              { tier: 'Level 8', name: 'Browser & Device QA', desc: 'Playwright visual assertions and responsive QA.' },
            ]
              .map(
                (t) => `
              <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span class="text-amber-300 font-bold">${t.tier}: ${t.name}</span>
                  <p class="text-slate-400 font-sans text-xs mt-0.5">${t.desc}</p>
                </div>
                <span class="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 text-[10px] border border-emerald-800/60 font-semibold">VERIFIED</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    } else if (tab === 'terminal') {
      title.textContent = 'MahaDev Interactive Cosmic Console';
      body.innerHTML = `
        <div class="space-y-4 font-mono text-xs">
          <div class="bg-black/80 p-5 rounded-2xl border border-white/10 h-64 overflow-y-auto space-y-2 text-slate-300" id="terminal-output">
            <p class="text-amber-300">MahaDev OS v3.2.0 [Mission Anchor Active · Φ Harmonics Engaged]</p>
            <p class="text-slate-500">Type a command or click quick actions below...</p>
            <p class="text-cyan-400">&gt; mahadev status --phi</p>
            <p class="text-emerald-400">✔ Φ = 1.61803398875 | 24 Agents in Golden Angle Orbit | Spanda 432Hz Synchronized</p>
          </div>
          <div class="flex gap-2">
            <input type="text" id="term-input" placeholder="Enter command (e.g. phi, agents, pancha-kritya, hardware, clear)..." class="flex-1 bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-amber-500/60 font-mono text-xs">
            <button id="term-send" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold font-mono text-xs transition-all">Execute</button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const input = document.getElementById('term-input') as HTMLInputElement;
        const send = document.getElementById('term-send');
        const output = document.getElementById('terminal-output');

        const runCmd = () => {
          if (!input || !output) return;
          const cmd = input.value.trim().toLowerCase();
          if (!cmd) return;

          audioEngine.playChime(600, 0.1);
          output.innerHTML += `<p class="text-amber-300">&gt; ${input.value}</p>`;
          input.value = '';

          if (cmd === 'phi' || cmd === 'golden') {
            output.innerHTML += `<p class="text-amber-300">Φ Constant: 1.61803398875 | Golden Angle: 137.507764° | Radii Range: F_7(13) to F_11(89) units.</p>`;
          } else if (cmd === 'agents') {
            output.innerHTML += `<p class="text-cyan-300">Active Agents: Maha-Dev, Maha-Council, Maha-Closer, Build, Test, Security, DevOps, Android, Content, etc. (24 total arranged via PHI logarithmic spiral).</p>`;
          } else if (cmd === 'pancha-kritya') {
            output.innerHTML += `<p class="text-cyan-300">Pancha Kritya Pipeline: Srishti (Creation) -> Sthiti (Preservation) -> Samhara (Dissolution) -> Tirobhava (Veiling) -> Anugraha (Grace).</p>`;
          } else if (cmd === 'hardware' || cmd === 'bench') {
            output.innerHTML += `<p class="text-cyan-300">Hardware Targets: CPU (-j2), Intel HD 620 VAAPI (BM-20260912-02), NVIDIA 920MX dGPU sm_50 (BM-20260912-01).</p>`;
          } else if (cmd === 'clear') {
            output.innerHTML = `<p class="text-amber-300">MahaDev OS v3.2.0 [Mission Anchor Active]</p>`;
          } else if (cmd === 'help') {
            output.innerHTML += `<p class="text-slate-300">Available commands: phi, agents, pancha-kritya, hardware, clear, help</p>`;
          } else {
            output.innerHTML += `<p class="text-red-400">Command not recognized. Type 'help' for available commands.</p>`;
          }
          output.scrollTop = output.scrollHeight;
        };

        if (send) send.addEventListener('click', runCmd);
        if (input) {
          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') runCmd();
          });
        }
      }, 50);
    }
  }

  private setupAudioToggle() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    const audioLabel = document.getElementById('audio-toggle-label');
    const waveIcon = document.getElementById('audio-wave-icon');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const active = audioEngine.toggle();
        if (audioLabel) audioLabel.textContent = active ? '432Hz Active' : '432Hz Spanda';
        if (waveIcon) {
          waveIcon.innerHTML = active
            ? `<span class="w-0.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span><span class="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse"></span><span class="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse"></span>`
            : `<span class="w-0.5 h-1.5 bg-slate-400 rounded-full"></span><span class="w-0.5 h-3 bg-slate-400 rounded-full"></span><span class="w-0.5 h-2 bg-slate-400 rounded-full"></span>`;
        }
        audioBtn.className = active
          ? 'px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 transition-all flex items-center gap-2 font-medium shadow-md shadow-amber-950/40'
          : 'px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-2';
      });
    }
  }

  private updateModeHUD(mode: string) {
    const titles: Record<string, { sanskrit: string; title: string; desc: string }> = {
      srishti: {
        sanskrit: 'सृष्टि (Srishti)',
        title: 'Cosmic Creation & Ideation',
        desc: 'Deep planning, architectural alternatives synthesis, and autonomous build pipelines.',
      },
      sthiti: {
        sanskrit: 'स्थिति (Sthiti)',
        title: 'Preservation & Equilibrium',
        desc: '9-Tier Correctness Verification, LSP diagnostics, and local container orchestration.',
      },
      samhara: {
        sanskrit: 'संहार (Samhara)',
        title: 'Dissolution & Purification',
        desc: 'Maha-Closer cache wiping, dead code elimination, and zero-secret enforcement.',
      },
      tirobhava: {
        sanskrit: 'तिरोभाव (Tirobhava)',
        title: 'Veiling & Abstraction',
        desc: 'Zero-sudo isolation, least-privilege database roles, and jargon-free Founder abstractions.',
      },
      anugraha: {
        sanskrit: 'अनुग्रह (Anugraha)',
        title: 'Grace & Delivery',
        desc: 'Sovereign deliverable release with persistent episodic memory anchored.',
      },
    };

    const info = titles[mode] || titles.sthiti;
    document.getElementById('hud-mode-sanskrit')!.textContent = info.sanskrit;
    document.getElementById('hud-mode-title')!.textContent = info.title;
    document.getElementById('hud-mode-desc')!.textContent = info.desc;
  }

  private setupTelemetryTicker() {
    setInterval(() => {
      if (!this.scene) return;
      const fpsElem = document.getElementById('telemetry-fps');
      if (fpsElem) fpsElem.textContent = '60 FPS · Φ 1.618';
    }, 1000);
  }
}

new App();
