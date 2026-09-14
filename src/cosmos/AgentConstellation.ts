import * as THREE from 'three';
import { AGENTS_3D, Agent3D, AgentGeometryType } from '../data/agents';

export class AgentConstellation {
  public group: THREE.Group;
  public agentMeshes: THREE.Mesh[] = [];
  public agentSprites: THREE.Sprite[] = [];
  public orbitLines: THREE.Line[] = [];
  private time: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.createConstellation();
  }

  private getGeometryForType(type: AgentGeometryType, scale: number): THREE.BufferGeometry {
    const baseRadius = 0.9 * scale;
    switch (type) {
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(baseRadius, 0);
      case 'octahedron':
        return new THREE.OctahedronGeometry(baseRadius, 0);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(baseRadius, 0);
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(baseRadius * 0.6, 0.22, 64, 16);
      case 'gearSphere':
        return new THREE.IcosahedronGeometry(baseRadius, 1);
      case 'shieldGem':
        return new THREE.ConeGeometry(baseRadius, baseRadius * 1.5, 6);
      case 'stellarPolyhedron':
        return new THREE.OctahedronGeometry(baseRadius, 1);
      case 'icosahedron':
      default:
        return new THREE.IcosahedronGeometry(baseRadius, 0);
    }
  }

  private createTextSprite(text: string, colorHex: string, tier: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isCrit = tier === 'CRITICAL';
      // Subtle frosted glass pill
      ctx.fillStyle = isCrit ? 'rgba(8, 12, 22, 0.95)' : 'rgba(4, 7, 17, 0.88)';
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = isCrit ? 4 : 2.5;

      const radius = 32;
      const x = 8;
      const y = 8;
      const w = canvas.width - 16;
      const h = canvas.height - 16;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Precision Core Dot
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(52, canvas.height / 2, 9, 0, Math.PI * 2);
      ctx.fill();

      // Golden Ring around dot
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(52, canvas.height / 2, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Typography
      ctx.font = isCrit ? '700 38px "Plus Jakarta Sans", sans-serif' : '600 34px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 82, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.2, 0.98, 1);
    return sprite;
  }

  private createConstellation() {
    AGENTS_3D.forEach((agent) => {
      // 1. Unique Agent Geometry based on Role & Importance
      const geo = this.getGeometryForType(agent.geometryType, agent.nodeScale);
      const isCritical = agent.importanceTier === 'CRITICAL';

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(agent.color),
        emissive: new THREE.Color(agent.color),
        emissiveIntensity: isCritical ? 0.9 : 0.65,
        roughness: 0.15,
        metalness: 0.85,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { agent };

      // Outer Wireframe Overlay
      const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(agent.accentColor),
        wireframe: true,
        transparent: true,
        opacity: isCritical ? 0.8 : 0.45,
      });
      const wireMesh = new THREE.Mesh(geo, wireMat);
      wireMesh.scale.set(1.2, 1.2, 1.2);
      mesh.add(wireMesh);

      // Gyroscopic Coronal Rings based on ringCount
      for (let r = 0; r < agent.ringCount; r++) {
        const ringRadius = 1.3 * agent.nodeScale + r * 0.4;
        const ringGeo = new THREE.TorusGeometry(ringRadius, 0.04, 8, 36);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(r % 2 === 0 ? agent.color : agent.accentColor),
          transparent: true,
          opacity: 0.65,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = (Math.PI / (r + 2)) * (r + 1);
        ring.rotation.y = (Math.PI / 3) * r;
        ring.name = `axial_ring_${r}`;
        mesh.add(ring);
      }

      this.agentMeshes.push(mesh);
      this.group.add(mesh);

      // 2. Visible Label Sprite
      const sprite = this.createTextSprite(agent.name, agent.color, agent.importanceTier);
      sprite.userData = { agent };
      this.agentSprites.push(sprite);
      this.group.add(sprite);

      // 3. Orbit Path
      const orbitGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 96;

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = agent.orbitRadius * Math.cos(theta);
        const z = agent.orbitRadius * Math.sin(theta);
        const y = Math.sin(theta) * (agent.orbitInclination * 10);
        points.push(new THREE.Vector3(x, y, z));
      }

      orbitGeo.setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(agent.color),
        transparent: true,
        opacity: isCritical ? 0.28 : 0.14,
      });

      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.orbitLines.push(orbitLine);
      this.group.add(orbitLine);
    });
  }

  public update(delta: number) {
    this.time += delta;

    // Constellation overall precession (gyroscopic revolution)
    this.group.rotation.y += delta * 0.03;
    this.group.rotation.x = Math.sin(this.time * 0.2) * 0.05;

    this.agentMeshes.forEach((mesh, index) => {
      const agent: Agent3D = mesh.userData.agent;

      // 1. REVOLUTION (Orbital movement around the core)
      const angle = this.time * agent.orbitSpeed * 15 + agent.orbitRadius;
      const x = agent.orbitRadius * Math.cos(angle);
      const z = agent.orbitRadius * Math.sin(angle);
      const y = Math.sin(angle) * (agent.orbitInclination * 10);

      mesh.position.set(x, y, z);

      // 2. ROTATION (Simultaneous self-rotation around own local axes)
      mesh.rotation.x += delta * 1.6;
      mesh.rotation.y += delta * 2.2;
      mesh.rotation.z += delta * 1.1;

      // Rotate child axial rings
      mesh.children.forEach((child) => {
        if (child.name.startsWith('axial_ring_')) {
          child.rotation.z += delta * 1.5;
        }
      });

      // Subtle breath pulse
      const pulse = 1 + Math.sin(this.time * 3 + agent.orbitRadius) * 0.1;
      mesh.scale.set(pulse, pulse, pulse);

      // 3. Label tracking node position with dynamic vertical clearance
      const sprite = this.agentSprites[index];
      if (sprite) {
        sprite.position.set(x, y + 1.8 * agent.nodeScale, z);
      }
    });
  }
}
