import { CosmosScene, SatelliteHoverInfo } from './cosmos/CosmosScene';
import { AgentInspector3D } from './cosmos/AgentInspector3D';
import { AGENTS_3D, Agent3D, VEDIC_LOKAS, CAPABILITIES_DICT } from './data/agents';
import { audioEngine } from './audioEngine';

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

class App {
  private scene: CosmosScene | null = null;
  private inspector3D: AgentInspector3D | null = null;
  private hoverCard: HTMLElement | null = null;
  private satellitePopover: HTMLElement | null = null;

  // Magnetic cursor & stardust state
  private cursorDot: HTMLElement | null = null;
  private cursorRing: HTMLElement | null = null;
  private cursorCrosshair: HTMLElement | null = null;
  private stardustCanvas: HTMLCanvasElement | null = null;
  private stardustCtx: CanvasRenderingContext2D | null = null;
  private stardustParticles: StardustParticle[] = [];
  private mousePos = { x: -100, y: -100 };
  private ringPos = { x: -100, y: -100 };
  private lastMousePos = { x: -100, y: -100 };

  constructor() {
    this.init();
  }

  private init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    this.hoverCard = document.getElementById('agent-hover-card');
    this.satellitePopover = document.getElementById('satellite-hover-popover');
    this.cursorDot = document.getElementById('magnetic-cursor-dot');
    this.cursorRing = document.getElementById('magnetic-cursor-ring');
    this.cursorCrosshair = document.getElementById('magnetic-cursor-crosshair');
    this.stardustCanvas = document.getElementById('cursor-stardust-canvas') as HTMLCanvasElement;

    if (this.stardustCanvas) {
      this.stardustCtx = this.stardustCanvas.getContext('2d');
      this.resizeStardustCanvas();
      window.addEventListener('resize', () => this.resizeStardustCanvas());
    }

    // 1. Initialize Main 3D Cosmos Scene with Multi-Axial Navigation & Satellite Raycaster
    this.scene = new CosmosScene(
      container,
      (agent) => this.handleAgentSelected(agent),
      (agent, mouseEvent, satelliteInfo) => this.handleAgentHovered(agent, mouseEvent, satelliteInfo)
    );

    // 2. Initialize Drawer 3D Inspector Viewport
    const drawer3DContainer = document.getElementById('drawer-3d-viewport');
    if (drawer3DContainer) {
      this.inspector3D = new AgentInspector3D(drawer3DContainer);
    }

    this.setupMagneticCursorAndStardust();
    this.setupUIControls();
    this.setupModalControls();
    this.setupAudioToggle();
    this.setupTelemetryTicker();
  }

  private resizeStardustCanvas() {
    if (!this.stardustCanvas) return;
    this.stardustCanvas.width = window.innerWidth;
    this.stardustCanvas.height = window.innerHeight;
  }

private setupMagneticCursorAndStardust() {
     window.addEventListener('mousemove', (e) => {
       this.mousePos.x = e.clientX;
       this.mousePos.y = e.clientY;

      if (this.cursorDot) {
        this.cursorDot.style.left = `${e.clientX}px`;
        this.cursorDot.style.top = `${e.clientY}px`;
      }
      if (this.cursorCrosshair) {
        this.cursorCrosshair.style.left = `${e.clientX}px`;
        this.cursorCrosshair.style.top = `${e.clientY}px`;
      }

      // Calculate cursor velocity and spawn subtle aura particles (minimal, slow fade)
      const dx = e.clientX - this.lastMousePos.x;
      const dy = e.clientY - this.lastMousePos.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // ponytail: aura only, keep particle count tiny (max 1/move) so trail stays a whisper
      if (speed > 4 && this.stardustParticles.length < 24) {
        this.stardustParticles.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.15 - Math.random() * 0.2,
          size: Math.random() * 1.4 + 0.5,
          color: Math.random() > 0.25 ? '#e6ca85' : '#fef08a',
          alpha: 0.35,
          decay: Math.random() * 0.02 + 0.02,
        });
      }

      this.lastMousePos.x = e.clientX;
      this.lastMousePos.y = e.clientY;
    });

    // Gentle Click Shimmer (soft, small burst instead of shockwave)
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
        const speed = Math.random() * 1.2 + 0.6;
        this.stardustParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 1.4 + 0.6,
          color: '#e6ca85',
          alpha: 0.5,
          decay: 0.045,
        });
      }
    });

    // Interactive UI Elements Hover Feedback (Buttons, Inputs, Cards)
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (this.cursorRing) {
          this.cursorRing.style.width = '24px';
          this.cursorRing.style.height = '24px';
          this.cursorRing.style.borderColor = '#38bdf8';
        }
      } else if (target.tagName === 'BUTTON' || target.closest('button') || target.classList.contains('agent-card')) {
        if (this.cursorRing) {
          this.cursorRing.style.width = '44px';
          this.cursorRing.style.height = '44px';
          this.cursorRing.style.borderColor = '#e6ca85';
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button') || target.classList.contains('agent-card')) {
        if (this.cursorRing) {
          this.cursorRing.style.width = '32px';
          this.cursorRing.style.height = '32px';
          this.cursorRing.style.borderColor = 'rgba(230, 202, 133, 0.4)';
        }
      }
    });

    // Render Animation Loop for Cursor & Stardust
    const renderCursorAndStardust = () => {
      // Smooth lerp for outer magnetic ring
      this.ringPos.x += (this.mousePos.x - this.ringPos.x) * 0.22;
      this.ringPos.y += (this.mousePos.y - this.ringPos.y) * 0.22;

      if (this.cursorRing) {
        this.cursorRing.style.left = `${this.ringPos.x}px`;
        this.cursorRing.style.top = `${this.ringPos.y}px`;
      }

      // Render Stardust Canvas
      if (this.stardustCtx && this.stardustCanvas) {
        this.stardustCtx.clearRect(0, 0, this.stardustCanvas.width, this.stardustCanvas.height);

        for (let i = this.stardustParticles.length - 1; i >= 0; i--) {
          const p = this.stardustParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            this.stardustParticles.splice(i, 1);
            continue;
          }

          this.stardustCtx.save();
          this.stardustCtx.globalAlpha = p.alpha;
          this.stardustCtx.fillStyle = p.color;
          this.stardustCtx.shadowColor = p.color;
          this.stardustCtx.shadowBlur = 6;
          this.stardustCtx.beginPath();
          this.stardustCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.stardustCtx.fill();
          this.stardustCtx.restore();
        }
      }

      requestAnimationFrame(renderCursorAndStardust);
    };

    renderCursorAndStardust();
  }

  private handleAgentHovered(
    agent: Agent3D | null,
    mouseEvent?: MouseEvent,
    satelliteInfo?: SatelliteHoverInfo
  ) {
    if (!mouseEvent) return;

    // 1. If Hovering over an Orbiting Satellite (Skill or Plugin)
    if (satelliteInfo) {
      if (this.hoverCard) this.hoverCard.classList.add('opacity-0', 'pointer-events-none');
      if (!this.satellitePopover) return;

      const meta = CAPABILITIES_DICT[satelliteInfo.name] || {
        name: satelliteInfo.name,
        category: satelliteInfo.type,
        title: satelliteInfo.name.toUpperCase(),
        description: `Active autonomous capability configured for ${satelliteInfo.agent.name}.`,
      };

      const badgeEl = document.getElementById('sat-popover-badge');
      if (badgeEl) {
        if (satelliteInfo.type === 'skill') {
          badgeEl.className = 'px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-semibold flex items-center gap-1.5 glass-pill-gold';
          badgeEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#e6ca85] animate-pulse"></span><span>🔱 Orbiting Skill</span>`;
        } else {
          badgeEl.className = 'px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-semibold flex items-center gap-1.5 glass-pill-cyan';
          badgeEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span><span>⚡ Orbiting Tool/Plugin</span>`;
        }
      }

      const ownerEl = document.getElementById('sat-popover-owner');
      if (ownerEl) {
        ownerEl.textContent = `${satelliteInfo.agent.name} · ${satelliteInfo.agent.lokaSanskrit}`;
      }

      const titleEl = document.getElementById('sat-popover-title');
      if (titleEl) titleEl.textContent = meta.title;

      const nameEl = document.getElementById('sat-popover-name');
      if (nameEl) {
        nameEl.textContent = `@${meta.name}`;
        nameEl.style.color = satelliteInfo.type === 'skill' ? '#fef08a' : '#38bdf8';
      }

      const descEl = document.getElementById('sat-popover-desc');
      if (descEl) descEl.textContent = meta.description;

      const x = Math.min(window.innerWidth - 380, Math.max(16, mouseEvent.clientX + 16));
      const y = Math.min(window.innerHeight - 200, Math.max(16, mouseEvent.clientY - 40));

      this.satellitePopover.style.left = `${x}px`;
      this.satellitePopover.style.top = `${y}px`;
      this.satellitePopover.style.borderColor = satelliteInfo.type === 'skill' ? 'rgba(230,202,133,0.5)' : 'rgba(56,189,248,0.5)';
      this.satellitePopover.classList.remove('opacity-0', 'pointer-events-none');

      if (this.cursorRing) {
        this.cursorRing.style.width = '42px';
        this.cursorRing.style.height = '42px';
        this.cursorRing.style.borderColor = satelliteInfo.type === 'skill' ? '#e6ca85' : '#38bdf8';
      }
      return;
    }

    // Hide satellite popover when not hovering a satellite
    if (this.satellitePopover) {
      this.satellitePopover.classList.add('opacity-0', 'pointer-events-none');
    }

    // 2. If Hovering over an Agent Node
    if (!this.hoverCard) return;

    if (!agent) {
      this.hoverCard.classList.add('opacity-0', 'pointer-events-none');
      if (this.cursorRing) {
        this.cursorRing.style.width = '32px';
        this.cursorRing.style.height = '32px';
        this.cursorRing.style.borderColor = 'rgba(230, 202, 133, 0.4)';
      }
      return;
    }

    // Expand cursor ring on hover
    if (this.cursorRing) {
      this.cursorRing.style.width = '48px';
      this.cursorRing.style.height = '48px';
      this.cursorRing.style.borderColor = `${agent.color}`;
    }

    // Populate Hover Data
    const lokaElem = document.getElementById('hover-loka');
    const nameElem = document.getElementById('hover-name');
    const tierElem = document.getElementById('hover-tier');
    const archElem = document.getElementById('hover-archetype');
    const mandateElem = document.getElementById('hover-mandate');

    if (lokaElem) {
      lokaElem.textContent = `${agent.lokaSanskrit} · ${agent.lokaName}`;
      lokaElem.style.color = agent.color;
    }
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

    const hoverSkillsEl = document.getElementById('hover-skills-count');
    if (hoverSkillsEl) hoverSkillsEl.textContent = `${agent.skills.length} Orbiting Skills`;

    const hoverPluginsEl = document.getElementById('hover-plugins-count');
    if (hoverPluginsEl) hoverPluginsEl.textContent = `${agent.plugins.length} Plugins`;

    // Position floating card safely within viewport
    const x = Math.min(window.innerWidth - 340, Math.max(16, mouseEvent.clientX + 16));
    const y = Math.min(window.innerHeight - 220, Math.max(16, mouseEvent.clientY - 50));

    this.hoverCard.style.left = `${x}px`;
    this.hoverCard.style.top = `${y}px`;
    this.hoverCard.style.borderColor = `${agent.color}66`;
    this.hoverCard.classList.remove('opacity-0', 'pointer-events-none');
  }

  private handleAgentSelected(agent: Agent3D | null) {
    const drawer = document.getElementById('agent-drawer');
    if (!drawer || !agent) return;

    audioEngine.playChime(720, 0.25);

    // Smoothly fly-to / focus the 3D camera onto this agent node
    if (this.scene) {
      this.scene.focusOnAgent(agent);
    }

    // Hide hover card when selecting
    if (this.hoverCard) this.hoverCard.classList.add('opacity-0');
    if (this.satellitePopover) this.satellitePopover.classList.add('opacity-0');

    // Populate detailed dossier
    const lokaEl = document.getElementById('drawer-loka');
    if (lokaEl) {
      lokaEl.textContent = `${agent.lokaSanskrit} · ${agent.lokaName}`;
      lokaEl.style.borderColor = `${agent.color}66`;
      lokaEl.style.color = agent.color;
    }

    const tierEl = document.getElementById('drawer-tier');
    if (tierEl) tierEl.textContent = `${agent.importanceTier} · R: ${agent.orbitRadius}u · Φ#${agent.phiHarmonicIndex}`;

    document.getElementById('drawer-name')!.textContent = agent.name;
    document.getElementById('drawer-role')!.textContent = agent.role;
    document.getElementById('drawer-archetype')!.textContent = `${agent.archetype} · ${agent.archetypeSanskrit}`;
    document.getElementById('drawer-desc')!.textContent = agent.longDescription;
    document.getElementById('drawer-hardware')!.textContent = agent.hardwareTarget;
    document.getElementById('drawer-verification')!.textContent = agent.verificationScope;
    document.getElementById('drawer-workflow')!.textContent = agent.sampleWorkflow;

    // Render Orbiting Skills Satellites in Drawer
    const skillsNumEl = document.getElementById('drawer-skills-num');
    if (skillsNumEl) skillsNumEl.textContent = `${agent.skills.length}`;

    const skillsContainer = document.getElementById('drawer-skills-list');
    if (skillsContainer) {
      skillsContainer.innerHTML = agent.skills
        .map(
          (skill) =>
            `<div class="px-2.5 py-1.5 rounded-xl glass-pill-gold text-[10.5px] font-mono flex items-center gap-1.5 transition-all hover:scale-[1.03] cursor-default">
              <span class="w-1.5 h-1.5 rounded-full bg-[#e6ca85] shadow-[0_0_6px_#e6ca85] animate-pulse"></span>
              <span class="font-medium text-[#e6ca85]">${skill}</span>
            </div>`
        )
        .join('');
    }

    // Render Orbiting Plugins Satellites in Drawer
    const pluginsNumEl = document.getElementById('drawer-plugins-num');
    if (pluginsNumEl) pluginsNumEl.textContent = `${agent.plugins.length}`;

    const pluginsContainer = document.getElementById('drawer-plugins-list');
    if (pluginsContainer) {
      pluginsContainer.innerHTML = agent.plugins
        .map(
          (plugin) =>
            `<div class="px-2.5 py-1.5 rounded-xl glass-pill-cyan text-[10.5px] font-mono flex items-center gap-1.5 transition-all hover:scale-[1.03] cursor-default">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8] animate-pulse"></span>
              <span class="font-medium text-cyan-300">${plugin}</span>
            </div>`
        )
        .join('');
    }

    const toolsContainer = document.getElementById('drawer-tools')!;
    toolsContainer.innerHTML = agent.tools
      .map(
        (t) =>
          `<span class="px-2.5 py-1 bg-white/[0.04] text-slate-300 rounded-lg font-mono text-[10px] border border-white/10">${t}</span>`
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
    // Mode Buttons (Pancha Kritya — now integrated in top header)
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
                'px-3 py-1 rounded-lg text-slate-400 hover:text-white transition-all';
            }
          });
          btn.className =
            'px-3 py-1 rounded-lg bg-[#e6ca85]/25 text-[#e6ca85] border border-[#e6ca85]/50 font-semibold shadow-md shadow-amber-950/40 transition-all';

          if (this.scene) {
            this.scene.setMode(mode);
          }
        });
      }
    });

    // Scale Presets (Corner Navigator)
    const scaleBtns = [
      { id: 'btn-scale-atomic', preset: 'atomic' as const },
      { id: 'btn-scale-kailash', preset: 'kailash' as const },
      { id: 'btn-scale-system', preset: 'system' as const },
      { id: 'btn-scale-universal', preset: 'universal' as const },
    ];

    scaleBtns.forEach(({ id, preset }) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          audioEngine.playChime(720, 0.15);
          scaleBtns.forEach((s) => {
            const b = document.getElementById(s.id);
            if (b) {
              b.className =
                'px-1.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all text-center';
            }
          });
          btn.className =
            'px-1.5 py-1 rounded-md bg-[#e6ca85]/20 text-[#e6ca85] border border-[#e6ca85]/40 font-semibold transition-all text-center';

          if (this.scene) {
            this.scene.setCameraPreset(preset);
          }
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
          ? 'text-[9px] font-mono px-2 py-0.5 rounded bg-[#e6ca85]/15 border border-[#e6ca85]/30 text-[#e6ca85]'
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
            ? 'px-3 py-1.5 rounded-lg bg-[#e6ca85]/15 border border-[#e6ca85]/40 text-[#e6ca85] hover:bg-[#e6ca85]/25 transition-all flex items-center gap-1.5'
            : 'px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
        }
      });
    }

    // Drawer Close Button
    const closeBtn = document.getElementById('btn-close-drawer');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        audioEngine.playChime(480, 0.1);
        const drawer = document.getElementById('agent-drawer');
        if (drawer) drawer.classList.add('translate-x-full');
      });
    }

    this.setupNavigatorDragging();
    this.setupZenMode();
  }

  // Draggable Cosmic Navigator panel (repositionable anywhere via header handle)
  private setupNavigatorDragging() {
    const panel = document.getElementById('corner-viewpoint-panel');
    const handle = document.getElementById('navigator-drag-handle');
    if (!panel || !handle) return;

    let isDraggingPanel = false;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener('mousedown', (e) => {
      // Ignore drags initiated on the Orbit toggle button
      if ((e.target as HTMLElement).id === 'btn-toggle-rotate') return;

      e.preventDefault();
      isDraggingPanel = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panel.style.right = 'auto';
      handle.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingPanel) return;
      const x = Math.min(window.innerWidth - 80, Math.max(8, e.clientX - offsetX));
      const y = Math.min(window.innerHeight - 80, Math.max(8, e.clientY - offsetY));
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      panel.style.bottom = 'auto';
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingPanel) {
        isDraggingPanel = false;
        handle.style.cursor = 'grab';
      }
    });
  }

  // Dynamic Desktop / Zen Wallpaper Mode (hides HUD overlay for background usage)
  private setupZenMode() {
    const zenBtn = document.getElementById('btn-zen-mode');
    const exitPill = document.getElementById('zen-exit-pill');
    const exitBtn = document.getElementById('btn-exit-zen');

    const enterZen = () => {
      document.body.classList.add('zen-active');
      audioEngine.playChime(432, 0.2);
    };
    const exitZen = () => {
      document.body.classList.remove('zen-active');
      audioEngine.playChime(576, 0.15);
    };

    if (zenBtn) zenBtn.addEventListener('click', enterZen);
    if (exitBtn) exitBtn.addEventListener('click', (e) => { e.stopPropagation(); exitZen(); });
    // Hotkey: Z toggles Zen mode (ignored while typing in inputs)
    window.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'z') {
        if (document.body.classList.contains('zen-active')) exitZen();
        else enterZen();
      }
    });
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
      'nav-lokas': 'lokas',
      'nav-phi': 'phi',
      'nav-hardware': 'hardware',
      'nav-verification': 'verification',
      'nav-terminal': 'terminal',
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
            'modal-tab-btn w-full text-left px-3.5 py-2.5 rounded-xl bg-[#e6ca85]/15 text-[#e6ca85] border border-[#e6ca85]/40 font-semibold transition-all';
          this.renderModalContent(tab);
        }
      });
    });
  }

  private renderModalContent(tab: string) {
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    if (!body || !title) return;

    if (tab === 'lokas') {
      title.textContent = 'The 6 Authentic Vedic Lokas & 24 Specialist Agents';
      body.innerHTML = `
        <div class="space-y-6">
          <p class="text-xs text-slate-400 font-sans leading-relaxed">
            The MahaDev OS v3.2.0 cosmos integrates authentic Vedic cosmology across 6 multi-dimensional, non-overlapping cosmic spheres. Each sphere commands a discrete orbital radius ($R = 16$ to $95\\text{u}$) and vertical elevation tier ($Y = -8.5$ to $+9.0\\text{u}$), reflecting their divine archetypes and organizational roles.
          </p>

          <div class="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
            ${VEDIC_LOKAS.map((loka) => {
              const lokaAgents = AGENTS_3D.filter((a) => a.lokaId === loka.id);
              return `
                <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${loka.color}"></span>
                        <h3 class="font-serif font-bold text-white text-base">${loka.name}</h3>
                        <span class="text-xs font-cormorant italic text-[#e6ca85]">(${loka.sanskrit})</span>
                        <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">${loka.category}</span>
                      </div>
                      <p class="text-xs text-slate-400 mt-1 font-sans">${loka.description}</p>
                    </div>
                    <div class="flex items-center gap-2 font-mono text-[10px]">
                      <span class="px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/10">Radius: ${loka.radius}u</span>
                      <span class="px-2.5 py-1 rounded bg-white/5 text-[#e6ca85] border border-[#e6ca85]/30">Height: ${loka.height >= 0 ? '+' : ''}${loka.height}u</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    ${lokaAgents
                      .map(
                        (a) => `
                      <div class="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-[#e6ca85]/40 transition-all cursor-pointer agent-card flex flex-col justify-between space-y-2" data-id="${a.id}">
                        <div>
                          <div class="flex items-center justify-between">
                            <span class="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-cyan-300">${a.importanceTier}</span>
                            <span class="text-[9px] font-mono text-[#e6ca85]">Φ#${a.phiHarmonicIndex}</span>
                          </div>
                          <h4 class="font-bold text-white text-sm mt-1.5 font-sans" style="color: ${a.color}">${a.name}</h4>
                          <p class="text-xs font-cormorant italic text-[#e6ca85]">${a.archetype} · ${a.archetypeSanskrit}</p>
                          <p class="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans leading-relaxed">${a.mandate}</p>
                        </div>
                        <div class="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Target: ${a.hardwareTarget}</span>
                          <span class="text-[#e6ca85]">Inspect 3D →</span>
                        </div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

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
    } else if (tab === 'phi') {
      title.textContent = 'Φ Golden Ratio & Fibonacci Sacred Harmonics';
      body.innerHTML = `
        <div class="space-y-6">
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-[#e6ca85]/30">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-serif text-lg font-bold text-[#e6ca85]">Φ = 1.61803398875 · The Architectural Harmonic Law</h3>
              <span class="px-2.5 py-1 rounded bg-[#e6ca85]/15 border border-[#e6ca85]/40 text-[#e6ca85] font-mono text-[10px]">Golden Proportions Active</span>
            </div>
            <p class="text-slate-300 leading-relaxed text-sm font-sans">
              In MahaDev OS v3.2.0, the <strong class="text-[#e6ca85]">Golden Ratio ($\phi$)</strong> is the mathematical foundation governing non-overlapping multi-dimensional orbital radii, angular distribution, typography scales, centrosymmetric polyhedra, and sound frequencies.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-[#e6ca85] font-mono text-xs uppercase tracking-wider font-bold">1. 6 Authentic Vedic Spheres</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                24 agents are organized across 6 concentric discrete golden spheres with non-overlapping radii <strong class="text-white">R = 16.0, 28.0, 42.0, 58.0, 76.0, 95.0</strong> and stepped $Y$-elevation heights, guaranteeing zero orbital collisions.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">2. Centrosymmetric Platonic Solids</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                Every node is a strictly symmetric solid (Dodecahedron, Icosahedron, Octahedron, Cuboctahedron, Golden Torus) enclosed within a <strong class="text-white">ϕ^0.5 wireframe cage</strong> and dual <strong class="text-white">ϕ gyroscopic halos</strong>.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">3. Harmonic Keplerian Velocities</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                Orbital angular speeds are graduated by realm distance ($\omega \propto 1 / \sqrt{R}$), with alternating orbital senses across tiers for celestial stability.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-purple-400 font-mono text-xs uppercase tracking-wider font-bold">4. Golden Torus & Damru Vortex</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                The central Spanda Torus is shaped with major radius $R = \phi^3 \approx 4.236$ (strictly bounded $\le 7.5$), avoiding any overlap with the innermost Kailash orbit ($R = 16.0$).
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">5. Fibonacci UI Modular Scale</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                Spacing, card typography, and modal layouts follow Fibonacci progressions ($2, 3, 5, 8, 13, 21, 34, 55, 89\text{px}$) for natural visual elegance and cognitive comfort.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span class="text-sky-400 font-mono text-xs uppercase tracking-wider font-bold">6. 432 Hz Shiva Solfeggio Resonance</span>
              <p class="text-xs text-slate-300 font-sans leading-relaxed">
                The integrated Web Audio engine synthesizes 432 Hz fundamental ($27 \times 16$) and 216 Hz sub-octave drone, vibrating in exact mathematical resonance with the golden cosmic matrix.
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
            <h3 class="font-serif text-lg font-bold text-[#e6ca85] mb-2">ॐ Paramashiva: The Source, Flow & Void</h3>
            <p class="text-slate-300 leading-relaxed text-sm font-sans">
              In Kashmir Shaivism and Advaita Vedanta, <strong class="text-white">MahaDev (Lord Shiva)</strong> is the non-dual reality. <strong class="text-[#e6ca85]">Shiva</strong> translates to <em>"That which is not"</em> — the unmanifest zero-point void (<span class="text-[#e6ca85] font-serif">Shunya</span>) from which all intelligence originates.
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
              <span class="text-[#e6ca85] font-bold block uppercase text-[10px] tracking-wider">3. NVIDIA 920MX dGPU</span>
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
                  <span class="text-[#e6ca85] font-bold">${t.tier}: ${t.name}</span>
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
            <p class="text-[#e6ca85]">MahaDev OS v3.2.0 [Mission Anchor Active · 6 Authentic Vedic Lokas Engaged]</p>
            <p class="text-slate-500">Type a command or click quick actions below...</p>
            <p class="text-cyan-400">&gt; mahadev status --lokas</p>
            <p class="text-emerald-400">✔ 6 Vedic Lokas (Kailash, Vaikuntha, Satyaloka, Devlok, Prithvilok, Yamaloka) Synchronized | Spanda 432Hz Active</p>
          </div>
          <div class="flex gap-2">
            <input type="text" id="term-input" placeholder="Enter command (e.g. lokas, atomic, universal, phi, agents, hardware, clear)..." class="flex-1 bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#e6ca85]/60 font-mono text-xs">
            <button id="term-send" class="px-5 py-2.5 bg-[#e6ca85] hover:bg-amber-400 text-black rounded-xl font-bold font-mono text-xs transition-all">Execute</button>
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
          output.innerHTML += `<p class="text-[#e6ca85]">&gt; ${input.value}</p>`;
          input.value = '';

          if (cmd === 'lokas' || cmd === 'spheres') {
            output.innerHTML += `<p class="text-[#e6ca85]">6 Vedic Lokas: 1. Kailash (R=16), 2. Vaikuntha (R=28), 3. Satyaloka (R=42), 4. Devlok (R=58), 5. Prithvilok (R=76), 6. Yamaloka (R=95).</p>`;
          } else if (cmd === 'atomic' || cmd === 'bindu') {
            output.innerHTML += `<p class="text-cyan-300">Atomic Zoom: 0.25u Singularity Core · Subatomic Quarks · Planck Lattice.</p>`;
            if (this.scene) this.scene.setCameraPreset('atomic');
          } else if (cmd === 'universal' || cmd === 'macrocosm') {
            output.innerHTML += `<p class="text-purple-300">Universal Macrocosm: 850u Orbit · 3,000 Cosmic Dust Filaments · Brahmanda Halo.</p>`;
            if (this.scene) this.scene.setCameraPreset('universal');
          } else if (cmd === 'phi' || cmd === 'golden') {
            output.innerHTML += `<p class="text-[#e6ca85]">Φ Constant: 1.61803398875 | Non-overlapping Orbits: R=16 to R=95 units.</p>`;
          } else if (cmd === 'agents') {
            output.innerHTML += `<p class="text-cyan-300">Active Agents: 24 total across Kailash (5), Vaikuntha (3), Brahmaloka (3), Devlok (5), Prithvilok (6), Yamaloka (2).</p>`;
          } else if (cmd === 'pancha-kritya') {
            output.innerHTML += `<p class="text-cyan-300">Pancha Kritya Pipeline: Srishti (Creation) -> Sthiti (Preservation) -> Samhara (Dissolution) -> Tirobhava (Veiling) -> Anugraha (Grace).</p>`;
          } else if (cmd === 'hardware' || cmd === 'bench') {
            output.innerHTML += `<p class="text-cyan-300">Hardware Targets: CPU (-j2), Intel HD 620 VAAPI (BM-20260912-02), NVIDIA 920MX dGPU sm_50 (BM-20260912-01).</p>`;
          } else if (cmd === 'clear') {
            output.innerHTML = `<p class="text-[#e6ca85]">MahaDev OS v3.2.0 [Mission Anchor Active]</p>`;
          } else if (cmd === 'help') {
            output.innerHTML += `<p class="text-slate-300">Available commands: lokas, atomic, universal, phi, agents, pancha-kritya, hardware, clear, help</p>`;
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
            ? `<span class="w-0.5 h-1.5 bg-[#e6ca85] rounded-full animate-pulse"></span><span class="w-0.5 h-3 bg-[#e6ca85] rounded-full animate-pulse"></span><span class="w-0.5 h-2 bg-[#e6ca85] rounded-full animate-pulse"></span>`
            : `<span class="w-0.5 h-1.5 bg-slate-400 rounded-full"></span><span class="w-0.5 h-3 bg-slate-400 rounded-full"></span><span class="w-0.5 h-2 bg-slate-400 rounded-full"></span>`;
        }
        audioBtn.className = active
          ? 'px-3.5 py-1.5 rounded-lg bg-[#e6ca85]/15 border border-[#e6ca85]/40 text-[#e6ca85] transition-all flex items-center gap-2 font-medium shadow-md shadow-amber-950/40'
          : 'px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 hover:border-[#e6ca85]/40 text-slate-300 hover:text-white transition-all flex items-center gap-2';
      });
    }
  }

  private setupTelemetryTicker() {
    // Continuous telemetry update
  }
}

new App();
