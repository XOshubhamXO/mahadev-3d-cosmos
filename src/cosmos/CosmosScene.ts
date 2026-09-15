import * as THREE from 'three';
import { SacredGeometryCore, createRoundParticleTexture } from './SacredGeometryCore';
import { TrishulaBeams } from './TrishulaBeams';
import { AgentConstellation } from './AgentConstellation';
import { Agent3D, GOLDEN_ANGLE } from '../data/agents';

export interface SatelliteHoverInfo {
  name: string;
  type: 'skill' | 'plugin';
  agent: Agent3D;
}

export class CosmosScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private core: SacredGeometryCore;
  private trishula: TrishulaBeams;
  private constellation: AgentConstellation;
  private goldenSpiral: GoldenSpiralOverlay;
  private universalStarfield: THREE.Points;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private clock: THREE.Clock;
  private onAgentSelected: (agent: Agent3D | null) => void;
  private onAgentHovered: (
    agent: Agent3D | null,
    mouseEvent?: MouseEvent,
    satelliteInfo?: SatelliteHoverInfo
  ) => void;
  private isAutoRotating: boolean = false; // Default: stable camera centered on cosmos

  // True Multi-Axial 6-DOF Camera Navigation State
  private isDragging: boolean = false;
  private dragMode: 'orbit' | 'pan' = 'orbit';
  private previousMousePosition = { x: 0, y: 0 };
  private target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private desiredTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private spherical: THREE.Spherical;
  private desiredSpherical: THREE.Spherical;

  constructor(
    container: HTMLElement,
    onAgentSelected: (agent: Agent3D | null) => void,
    onAgentHovered: (
      agent: Agent3D | null,
      mouseEvent?: MouseEvent,
      satelliteInfo?: SatelliteHoverInfo
    ) => void
  ) {
    this.container = container;
    this.onAgentSelected = onAgentSelected;
    this.onAgentHovered = onAgentHovered;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x03050c, 0.0015);

    // 2. Camera with Full Multi-Axial Dynamic Range (0.05 to 10,000)
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.05,
      10000
    );
    this.camera.position.set(0, 42, 92);
    this.camera.lookAt(this.target);

    this.spherical = new THREE.Spherical();
    this.spherical.setFromVector3(this.camera.position.clone().sub(this.target));
    this.desiredSpherical = this.spherical.clone();

    // 3. High-Performance Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting Suite
    const ambient = new THREE.AmbientLight(0x0c1322, 1.8);
    this.scene.add(ambient);

    const centerPointLight = new THREE.PointLight(0xe6ca85, 3.5, 180);
    centerPointLight.position.set(0, 0, 0);
    this.scene.add(centerPointLight);

    const amberLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    amberLight.position.set(30, 60, 30);
    this.scene.add(amberLight);

    const cyanLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    cyanLight.position.set(-30, -40, -30);
    this.scene.add(cyanLight);

    // 5. Components
    this.core = new SacredGeometryCore();
    this.scene.add(this.core.group);

    this.trishula = new TrishulaBeams();
    this.scene.add(this.trishula.group);

    this.constellation = new AgentConstellation();
    this.scene.add(this.constellation.group);

    // Removed GoldenSpiralOverlay per specification
//     // Removed GoldenSpiralOverlay per specification
    // this.goldenSpiral = new GoldenSpiralOverlay();
    // this.scene.add(this.goldenSpiral.group);

    // 6. Universal Macrocosm Elements (High Star Density: 12,000 stars)
    const starCount = 12000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const colorPalette = [
      new THREE.Color(0xe6ca85), // Champagne Gold
      new THREE.Color(0x38bdf8), // Celestial Cyan
      new THREE.Color(0xf8fafc), // Diamond White
      new THREE.Color(0x818cf8), // Astral Indigo
      new THREE.Color(0x34d399), // Jade Emerald
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 60 + Math.pow(Math.random(), 0.5) * 1800;
      const theta = i * GOLDEN_ANGLE;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.6,
      map: createRoundParticleTexture(64),
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.universalStarfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.universalStarfield);

    // 7. Event Listeners with Multi-Axial Pan & Focal Zoom Support
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', () => this.onMouseUp());
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    window.addEventListener('click', (e) => this.onClick(e));
    window.addEventListener('contextmenu', (e) => {
      if ((e.target as HTMLElement).tagName === 'CANVAS') {
        e.preventDefault(); // Prevent context menu to allow smooth right-click panning
      }
    });

    // 8. Start Animation Loop
    this.animate();
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
    this.isDragging = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };

    // Detect Pan mode (Right Click, Middle Click, or Shift+Left Click)
    if (e.button === 2 || e.button === 1 || e.shiftKey) {
      this.dragMode = 'pan';
    } else {
      this.dragMode = 'orbit';
    }
  }

  private onMouseUp() {
    this.isDragging = false;
  }

  // Multi-Axial Focal Zoom (dollies along 3D ray through cursor towards any off-center point)
  private onWheel(e: WheelEvent) {
    if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
    e.preventDefault();

    // Calculate mouse 3D ray for directional focal zooming
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const rayDir = this.raycaster.ray.direction.clone().normalize();

    const zoomStep = e.deltaY > 0 ? 1.12 : 0.89;
    const currentRadius = this.desiredSpherical.radius;
    const newRadius = Math.max(0.25, Math.min(2200, currentRadius * zoomStep));
    const radiusDelta = newRadius - currentRadius;

    this.desiredSpherical.radius = newRadius;

    // Shift target slightly along mouse ray on zoom-in to focus directly on whatever is under cursor
    if (e.deltaY < 0 && newRadius > 0.5 && newRadius < 800) {
      const shiftAmount = Math.abs(radiusDelta) * 0.15;
      this.desiredTarget.add(rayDir.multiplyScalar(shiftAmount));
    } else if (e.deltaY > 0 && newRadius > 150) {
      // Pull back towards origin when zooming way out to macrocosm
      this.desiredTarget.lerp(new THREE.Vector3(0, 0, 0), 0.12);
    }

    this.updateZoomTelemetry(newRadius);
  }

  private updateZoomTelemetry(radius: number) {
    const zoomElem = document.getElementById('telemetry-scale');
    if (!zoomElem) return;

    if (radius < 1.5) {
      zoomElem.textContent = 'ATOMIC · QUANTUM BINDU';
      zoomElem.className = 'text-cyan-300 font-bold';
    } else if (radius < 22) {
      zoomElem.textContent = 'PARAMA DHAMA · KAILASH';
      zoomElem.className = 'text-[#e6ca85] font-bold';
    } else if (radius < 110) {
      zoomElem.textContent = 'VEDIC LOKAS · SOLAR SCALE';
      zoomElem.className = 'text-amber-300 font-bold';
    } else {
      zoomElem.textContent = 'UNIVERSAL · BRAHMANDA';
      zoomElem.className = 'text-purple-300 font-bold';
    }
  }

  private onMouseMove(e: MouseEvent) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      if (this.dragMode === 'pan') {
        // Multi-Axial 3D Pan in Camera Plane
        const panSpeed = Math.max(0.001, this.desiredSpherical.radius * 0.0012);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);

        const panOffset = right.multiplyScalar(-deltaX * panSpeed).add(up.multiplyScalar(deltaY * panSpeed));
        this.desiredTarget.add(panOffset);
        this.target.add(panOffset);
      } else {
        // Multi-Axial Orbit Rotation (Azimuth and Polar Elevation)
        this.desiredSpherical.theta -= deltaX * 0.005;
        this.desiredSpherical.phi -= deltaY * 0.005;
        this.desiredSpherical.phi = Math.max(0.04, Math.min(Math.PI - 0.04, this.desiredSpherical.phi));
      }

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    // Comprehensive Raycasting: Nodes, Badges, and Orbiting Satellites
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targets = [
      ...this.constellation.agentMeshes,
      ...this.constellation.agentSprites,
      ...this.constellation.satelliteMeshes,
    ];
    const intersects = this.raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
      const selectedObj = intersects[0].object;
      if (selectedObj.userData) {
        if (selectedObj.userData.type === 'skill') {
          this.onAgentHovered(selectedObj.userData.agent, e, {
            name: selectedObj.userData.skill,
            type: 'skill',
            agent: selectedObj.userData.agent,
          });
          return;
        } else if (selectedObj.userData.type === 'plugin') {
          this.onAgentHovered(selectedObj.userData.agent, e, {
            name: selectedObj.userData.plugin,
            type: 'plugin',
            agent: selectedObj.userData.agent,
          });
          return;
        } else if (selectedObj.userData.agent) {
          this.onAgentHovered(selectedObj.userData.agent, e, undefined);
          return;
        }
      }
    }

    this.onAgentHovered(null, e, undefined);
  }

  private onClick(e: MouseEvent) {
    if ((e.target as HTMLElement).tagName !== 'CANVAS') return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targets = [
      ...this.constellation.agentMeshes,
      ...this.constellation.agentSprites,
      ...this.constellation.satelliteMeshes,
    ];
    const intersects = this.raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
      const selectedObj = intersects[0].object;
      if (selectedObj.userData && selectedObj.userData.agent) {
        this.onAgentSelected(selectedObj.userData.agent);
        this.focusOnAgent(selectedObj.userData.agent);
      }
    }
  }

  // Smooth Multi-Axial Fly-To Focus on any Agent Node in 3D
  public focusOnAgent(agent: Agent3D) {
    const nodeGroup = this.constellation.agentMeshes.find(
      (m) => m.userData?.agent?.id === agent.id
    )?.parent as THREE.Group | undefined;

    if (nodeGroup) {
      this.desiredTarget.copy(nodeGroup.position);
    } else {
      const nodePosition = new THREE.Vector3(
        Math.cos(agent.angularOffset) * agent.orbitRadius,
        agent.orbitHeight,
        Math.sin(agent.angularOffset) * agent.orbitRadius
      );
      this.desiredTarget.copy(nodePosition);
    }
    this.desiredSpherical.radius = Math.max(3.2, agent.nodeScale * 6.0);
    this.desiredSpherical.phi = Math.PI / 2.3;
    this.updateZoomTelemetry(this.desiredSpherical.radius);
  }

  public setMode(newMode: string) {
    this.core.setModeVisuals(newMode);
  }

  public setAutoRotate(rotate: boolean) {
    this.isAutoRotating = rotate;
  }

  public toggleGoldenSpiral(): boolean {
    return this.goldenSpiral.toggle();
  }

  public setCameraPreset(preset: 'atomic' | 'kailash' | 'system' | 'universal') {
    this.desiredTarget.set(0, 0, 0);
    switch (preset) {
      case 'atomic':
        this.desiredSpherical.radius = 0.85;
        this.desiredSpherical.phi = Math.PI / 2.2;
        break;
      case 'kailash':
        this.desiredSpherical.radius = 22.0;
        this.desiredSpherical.phi = Math.PI / 2.5;
        break;
      case 'system':
        this.desiredSpherical.radius = 92.0;
        this.desiredSpherical.phi = Math.PI / 3.0;
        break;
      case 'universal':
        this.desiredSpherical.radius = 850.0;
        this.desiredSpherical.phi = Math.PI / 3.5;
        break;
    }
    this.updateZoomTelemetry(this.desiredSpherical.radius);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();

    this.core.update(delta);
    this.trishula.update(delta);
    this.constellation.update(delta);
    this.goldenSpiral.update(delta);

    // Starfield subtle rotation
    this.universalStarfield.rotation.y += delta * 0.002;

    // Smooth Multi-Axial Interpolation / Lerp
    this.target.lerp(this.desiredTarget, 0.075);
    this.spherical.radius += (this.desiredSpherical.radius - this.spherical.radius) * 0.085;
    this.spherical.phi += (this.desiredSpherical.phi - this.spherical.phi) * 0.085;
    this.spherical.theta += (this.desiredSpherical.theta - this.spherical.theta) * 0.085;

    if (this.isAutoRotating && !this.isDragging) {
      this.desiredSpherical.theta += delta * 0.003;
      this.spherical.theta += delta * 0.003;
    }

    const cameraOffset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(cameraOffset);
    this.camera.lookAt(this.target);

    this.renderer.render(this.scene, this.camera);
  };
}
