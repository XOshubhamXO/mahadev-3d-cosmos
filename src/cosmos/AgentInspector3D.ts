import * as THREE from 'three';
import { Agent3D, AgentGeometryType } from '../data/agents';

export class AgentInspector3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private currentMeshGroup: THREE.Group | null = null;
  private clock: THREE.Clock;
  private animFrameId: number | null = null;
  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationSpeed = { x: 0.01, y: 0.015 };

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 180;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    const keyLight = new THREE.PointLight(0x38bdf8, 3, 20);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 2.5, 20);
    rimLight.position.set(-5, -5, -3);
    this.scene.add(rimLight);

    // 5. Interactivity
    this.setupInteractivity();

    // 6. Start Loop
    this.animate();
  }

  private setupInteractivity() {
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.currentMeshGroup) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.currentMeshGroup.rotation.y += deltaX * 0.02;
      this.currentMeshGroup.rotation.x += deltaY * 0.02;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });
  }

  public loadAgent(agent: Agent3D) {
    if (this.currentMeshGroup) {
      this.scene.remove(this.currentMeshGroup);
      this.currentMeshGroup = null;
    }

    const group = new THREE.Group();
    const primaryColor = new THREE.Color(agent.color);
    const accentColor = new THREE.Color(agent.accentColor);

    // 1. Core Geometry
    const coreGeo = this.getGeometryForType(agent.geometryType, 1.8);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Outer Wireframe Halo
    const wireMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.scale.set(1.25, 1.25, 1.25);
    group.add(wireMesh);

    // 3. Gyroscopic Coronal Rings
    for (let i = 0; i < agent.ringCount + 1; i++) {
      const ringRadius = 2.2 + i * 0.45;
      const ringGeo = new THREE.TorusGeometry(ringRadius, 0.03, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? primaryColor : accentColor,
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = (Math.PI / (i + 2)) * (i + 1);
      ringMesh.rotation.y = (Math.PI / 3) * i;
      ringMesh.name = `ring_${i}`;
      group.add(ringMesh);
    }

    // 4. Orbiting Skills Satellites (Golden Octahedrons)
    const skillsGroup = new THREE.Group();
    skillsGroup.name = 'skills_orbit_group';
    skillsGroup.rotation.x = 0.45;

    const skillOrbitRadius = 3.2;
    const skillPathGeo = new THREE.BufferGeometry().setFromPoints(
      new THREE.Path().absarc(0, 0, skillOrbitRadius, 0, Math.PI * 2, true).getPoints(48)
    );
    const skillPath = new THREE.LineLoop(
      skillPathGeo,
      new THREE.LineBasicMaterial({ color: 0xe6ca85, transparent: true, opacity: 0.4 })
    );
    skillsGroup.add(skillPath);

    const sCount = agent.skills.length;
    agent.skills.forEach((_, idx) => {
      const theta = (idx / sCount) * Math.PI * 2;
      const satGeo = new THREE.OctahedronGeometry(0.22, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xe6ca85,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.9,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.set(Math.cos(theta) * skillOrbitRadius, Math.sin(theta) * skillOrbitRadius, 0);
      skillsGroup.add(satMesh);
    });
    group.add(skillsGroup);

    // 5. Orbiting Plugins Satellites (Celestial Cyan Tetrahedrons)
    const pluginsGroup = new THREE.Group();
    pluginsGroup.name = 'plugins_orbit_group';
    pluginsGroup.rotation.x = -0.55;

    const pluginOrbitRadius = 4.1;
    const pluginPathGeo = new THREE.BufferGeometry().setFromPoints(
      new THREE.Path().absarc(0, 0, pluginOrbitRadius, 0, Math.PI * 2, true).getPoints(48)
    );
    const pluginPath = new THREE.LineLoop(
      pluginPathGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
    );
    pluginsGroup.add(pluginPath);

    const pCount = agent.plugins.length;
    agent.plugins.forEach((_, idx) => {
      const theta = (idx / pCount) * Math.PI * 2;
      const satGeo = new THREE.TetrahedronGeometry(0.2, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.9,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.set(Math.cos(theta) * pluginOrbitRadius, Math.sin(theta) * pluginOrbitRadius, 0);
      pluginsGroup.add(satMesh);
    });
    group.add(pluginsGroup);

    this.currentMeshGroup = group;
    this.scene.add(group);
  }

  private getGeometryForType(type: AgentGeometryType, size: number): THREE.BufferGeometry {
    switch (type) {
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(size, 0);
      case 'octahedron':
        return new THREE.OctahedronGeometry(size, 0);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(size, 0);
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(size * 0.65, 0.22, 64, 16);
      case 'cuboctahedron':
        return new THREE.OctahedronGeometry(size, 1);
      case 'icosidodecahedron':
        return new THREE.DodecahedronGeometry(size, 1);
      case 'goldenTorus':
        return new THREE.TorusGeometry(size * 0.85, size * 0.25, 16, 48);
      case 'icosahedron':
      default:
        return new THREE.IcosahedronGeometry(size, 0);
    }
  }

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();

    if (this.currentMeshGroup && !this.isDragging) {
      this.currentMeshGroup.rotation.y += this.rotationSpeed.y;
      this.currentMeshGroup.rotation.x += this.rotationSpeed.x;

      // Animate child rings counter-rotation & orbiting skill/plugin satellites
      this.currentMeshGroup.children.forEach((child) => {
        if (child.name.startsWith('ring_')) {
          child.rotation.z += delta * 0.8;
          child.rotation.x += delta * 0.4;
        } else if (child.name === 'skills_orbit_group') {
          child.rotation.z += delta * 1.5;
          child.children.forEach((sat) => {
            if (sat instanceof THREE.Mesh) {
              sat.rotation.x += delta * 2.0;
              sat.rotation.y += delta * 2.2;
            }
          });
        } else if (child.name === 'plugins_orbit_group') {
          child.rotation.z -= delta * 1.2;
          child.children.forEach((sat) => {
            if (sat instanceof THREE.Mesh) {
              sat.rotation.x -= delta * 1.8;
              sat.rotation.z += delta * 2.4;
            }
          });
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  };

  public resize() {
    const width = this.container.clientWidth || 320;
    const height = this.container.clientHeight || 180;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
  }
}
