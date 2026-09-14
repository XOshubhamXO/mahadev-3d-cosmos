import * as THREE from 'three';
import { AGENTS_3D, AgentGeometryType, PHI } from '../data/agents';

export class AgentConstellation {
  public group: THREE.Group;
  public agentMeshes: THREE.Mesh[] = [];
  public agentSprites: THREE.Sprite[] = [];
  public agentHalos: THREE.Group[] = [];
  public orbitRings: THREE.Line[] = [];
  private time: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.createConcentricOrbitPlanes();
    this.createConstellation();
  }

  // 1. Pristine Golden Concentric Orbital Guide Planes (4 Sacred Spheres)
  private createConcentricOrbitPlanes() {
    const tierRadii = [16.0, 25.89, 41.89, 67.78];
    const tierColors = [0xfacc15, 0x38bdf8, 0xa78bfa, 0x34d399];

    tierRadii.forEach((radius, idx) => {
      const segments = 128;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: tierColors[idx],
        transparent: true,
        opacity: 0.18 + (3 - idx) * 0.05,
        linewidth: 1,
      });

      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.orbitRings.push(orbitLine);
      this.group.add(orbitLine);
    });
  }

  // 2. Pure Symmetric Polyhedra for Sacred Agent Archetypes
  private getGeometryForType(type: AgentGeometryType, scale: number): THREE.BufferGeometry {
    const baseRadius = 0.85 * scale;
    switch (type) {
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(baseRadius, 0);
      case 'octahedron':
        return new THREE.OctahedronGeometry(baseRadius, 0);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(baseRadius, 0);
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(baseRadius * 0.55, 0.16, 64, 16);
      case 'cuboctahedron':
        return new THREE.OctahedronGeometry(baseRadius, 1);
      case 'icosidodecahedron':
        return new THREE.DodecahedronGeometry(baseRadius, 1);
      case 'goldenTorus':
        return new THREE.TorusGeometry(baseRadius * 0.7, baseRadius * 0.22, 16, 48);
      case 'icosahedron':
      default:
        return new THREE.IcosahedronGeometry(baseRadius, 0);
    }
  }

  // 3. Optically Centered Retina Billboard Text Sprite with Golden Ratio Proportions
  private createTextSprite(text: string, colorHex: string, tier: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isCrit = tier === 'CRITICAL';
      ctx.fillStyle = isCrit ? 'rgba(8, 13, 26, 0.94)' : 'rgba(4, 7, 17, 0.88)';
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = isCrit ? 4 : 2;

      const radius = 30;
      const x = 12;
      const y = 12;
      const w = canvas.width - 24;
      const h = canvas.height - 24;

      // Rounded pill contour
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

      // Precision Core Focal Dot
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(60, canvas.height / 2, 8, 0, Math.PI * 2);
      ctx.fill();

      // Golden Specular Ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(60, canvas.height / 2, 13, 0, Math.PI * 2);
      ctx.stroke();

      // Optical Centered Typography
      ctx.font = isCrit
        ? '700 36px "Plus Jakarta Sans", sans-serif'
        : '600 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 92, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(spriteMat);
    // Golden aspect ratio scale: 4.4 x 0.96
    sprite.scale.set(4.4, 0.96, 1);
    return sprite;
  }

  // 4. Create 24 Harmonically Symmetrical Celestial Agents
  private createConstellation() {
    AGENTS_3D.forEach((agent) => {
      const nodeGroup = new THREE.Group();

      // (A) Main Symmetric Solid Core
      const geo = this.getGeometryForType(agent.geometryType, agent.nodeScale);
      const isCritical = agent.importanceTier === 'CRITICAL';

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(agent.color),
        emissive: new THREE.Color(agent.color),
        emissiveIntensity: isCritical ? 0.75 : 0.5,
        roughness: 0.12,
        metalness: 0.88,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { agent };
      this.agentMeshes.push(mesh);
      nodeGroup.add(mesh);

      // (B) Concentric Symmetrical Wireframe Cage (Scaled by sqrt(PHI) = 1.272)
      const cageGeo = new THREE.WireframeGeometry(geo);
      const cageMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(agent.accentColor),
        transparent: true,
        opacity: 0.45,
      });
      const cageMesh = new THREE.LineSegments(cageGeo, cageMat);
      cageMesh.scale.setScalar(Math.sqrt(PHI));
      nodeGroup.add(cageMesh);

      // (C) Dual Symmetrical Gyroscopic Halo Rings (Scaled by PHI = 1.618)
      const haloGroup = new THREE.Group();
      const ringGeo1 = new THREE.TorusGeometry(agent.nodeScale * 1.35, 0.03, 8, 48);
      const ringGeo2 = new THREE.TorusGeometry(agent.nodeScale * 1.55, 0.02, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(agent.color),
        transparent: true,
        opacity: 0.35,
      });

      const ring1 = new THREE.Mesh(ringGeo1, ringMat);
      const ring2 = new THREE.Mesh(ringGeo2, ringMat);
      ring2.rotation.x = Math.PI / 2;

      haloGroup.add(ring1);
      haloGroup.add(ring2);
      nodeGroup.add(haloGroup);
      this.agentHalos.push(haloGroup);

      // (D) Billboard Name Tag Sprite (Positioned at Golden Offset above Node)
      const sprite = this.createTextSprite(agent.name, agent.color, agent.importanceTier);
      sprite.position.y = agent.nodeScale * 1.45 + 0.6;
      sprite.userData = { agent };
      this.agentSprites.push(sprite);
      nodeGroup.add(sprite);

      // Store nodeGroup reference for orbital updates
      mesh.parent = nodeGroup;
      this.group.add(nodeGroup);
    });
  }

  // 5. Symmetric Keplerian Orbital Kinematics
  public update(delta: number) {
    this.time += delta;

    AGENTS_3D.forEach((agent, index) => {
      const mesh = this.agentMeshes[index];
      const nodeGroup = mesh.parent as THREE.Group;
      const halo = this.agentHalos[index];

      if (!nodeGroup) return;

      // Symmetrical Angular Motion along Golden Concentric Spheres
      const currentTheta = agent.angularOffset + this.time * agent.orbitSpeed;
      const r = agent.orbitRadius;

      // Axial Symmetrical 3D Coordinates
      const x = Math.cos(currentTheta) * r;
      const y = Math.sin(currentTheta) * r * Math.sin(agent.orbitInclination);
      const z = Math.sin(currentTheta) * r * Math.cos(agent.orbitInclination);

      nodeGroup.position.set(x, y, z);

      // Symmetric Self-Rotation & Gyro Precession
      mesh.rotation.x += delta * 0.8;
      mesh.rotation.y += delta * 1.2;

      if (halo) {
        halo.rotation.x += delta * 0.4;
        halo.rotation.z += delta * 0.6;
      }
    });
  }
}
