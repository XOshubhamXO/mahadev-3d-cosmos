import * as THREE from 'three';
import { SacredGeometryCore } from './SacredGeometryCore';
import { TrishulaBeams } from './TrishulaBeams';
import { AgentConstellation } from './AgentConstellation';
import { GoldenSpiralOverlay } from './GoldenSpiralOverlay';
import { Agent3D } from '../data/agents';

export class CosmosScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private core: SacredGeometryCore;
  private trishula: TrishulaBeams;
  private constellation: AgentConstellation;
  private goldenSpiral: GoldenSpiralOverlay;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private clock: THREE.Clock;
  private onAgentSelected: (agent: Agent3D | null) => void;
  private onAgentHovered: (agent: Agent3D | null, mouseEvent?: MouseEvent) => void;
  private isAutoRotating: boolean = true;

  // Orbit control state
  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private spherical: THREE.Spherical;

  constructor(
    container: HTMLElement,
    onAgentSelected: (agent: Agent3D | null) => void,
    onAgentHovered: (agent: Agent3D | null, mouseEvent?: MouseEvent) => void
  ) {
    this.container = container;
    this.onAgentSelected = onAgentSelected;
    this.onAgentHovered = onAgentHovered;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.008);

    // 2. Camera & Spherical Coordinates
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 35, 75);
    this.camera.lookAt(0, 0, 0);

    this.spherical = new THREE.Spherical();
    this.spherical.setFromVector3(this.camera.position);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0x0a192f, 1.5);
    this.scene.add(ambient);

    const centerPointLight = new THREE.PointLight(0x38bdf8, 3, 100);
    centerPointLight.position.set(0, 0, 0);
    this.scene.add(centerPointLight);

    const amberLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    amberLight.position.set(20, 40, 20);
    this.scene.add(amberLight);

    // 5. Components
    this.core = new SacredGeometryCore();
    this.scene.add(this.core.group);

    this.trishula = new TrishulaBeams();
    this.scene.add(this.trishula.group);

    this.constellation = new AgentConstellation();
    this.scene.add(this.constellation.group);

    this.goldenSpiral = new GoldenSpiralOverlay();
    this.scene.add(this.goldenSpiral.group);

    // 6. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', () => this.onMouseUp());
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    window.addEventListener('click', (e) => this.onClick(e));

    // 7. Start Loop
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
  }

  private onMouseUp() {
    this.isDragging = false;
  }

  private onWheel(e: WheelEvent) {
    if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
    e.preventDefault();
    this.spherical.radius += e.deltaY * 0.05;
    this.spherical.radius = Math.max(25, Math.min(130, this.spherical.radius));
    this.camera.position.setFromSpherical(this.spherical);
    this.camera.lookAt(0, 0, 0);
  }

  private onMouseMove(e: MouseEvent) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.spherical.theta -= deltaX * 0.005;
      this.spherical.phi -= deltaY * 0.005;
      this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));

      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(0, 0, 0);

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    // Hover Raycasting
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targets = [
      ...this.constellation.agentMeshes,
      ...this.constellation.agentSprites,
    ];
    const intersects = this.raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
      const selectedObj = intersects[0].object;
      if (selectedObj.userData && selectedObj.userData.agent) {
        document.body.style.cursor = 'pointer';
        this.onAgentHovered(selectedObj.userData.agent, e);
        return;
      }
    }

    document.body.style.cursor = this.isDragging ? 'grabbing' : 'default';
    this.onAgentHovered(null, e);
  }

  private onClick(e: MouseEvent) {
    if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const targets = [
      ...this.constellation.agentMeshes,
      ...this.constellation.agentSprites,
    ];
    const intersects = this.raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
      const selectedObj = intersects[0].object;
      if (selectedObj.userData && selectedObj.userData.agent) {
        this.onAgentSelected(selectedObj.userData.agent);
      }
    }
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

  private animate = () => {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();

    this.core.update(delta);
    this.trishula.update(delta);
    this.constellation.update(delta);
    this.goldenSpiral.update(delta);

    if (this.isAutoRotating && !this.isDragging) {
      this.spherical.theta += delta * 0.04;
      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(0, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
  };

  public getRendererInfo() {
    return {
      triangles: this.renderer.info.render.triangles,
      calls: this.renderer.info.render.calls,
      memory: this.renderer.info.memory.geometries,
    };
  }
}
