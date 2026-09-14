import * as THREE from 'three';
import { AGENTS_3D, AgentGeometryType, VEDIC_LOKAS, PHI } from '../data/agents';

export class AgentConstellation {
  public group: THREE.Group;
  public agentMeshes: THREE.Mesh[] = [];
  public agentSprites: THREE.Sprite[] = [];
  public agentHalos: THREE.Group[] = [];
  public skillOrbitGroups: THREE.Group[] = [];
  public pluginOrbitGroups: THREE.Group[] = [];
  public satelliteMeshes: THREE.Mesh[] = [];
  public orbitRings: THREE.Line[] = [];
  public lokaNameSprites: THREE.Sprite[] = [];
  private time: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.createConcentricVedicPlanes();
    this.createConstellation();
  }

  // 1. Pristine 6 Authentic Vedic Non-Overlapping Concentric Loka Orbital Rings
  private createConcentricVedicPlanes() {
    VEDIC_LOKAS.forEach((loka, idx) => {
      const segments = 180;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * loka.radius, loka.height, Math.sin(theta) * loka.radius));
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(loka.color),
        transparent: true,
        opacity: 0.28 + (5 - idx) * 0.03,
        linewidth: 1,
      });

      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.orbitRings.push(orbitLine);
      this.group.add(orbitLine);

      // Realm Title Billboard Marker positioned on the ring perimeter
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(6, 10, 20, 0.75)';
        ctx.strokeStyle = loka.color;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 20);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 24px "Cinzel", Georgia, serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${loka.sanskrit} · ${loka.name.toUpperCase()}`, canvas.width / 2, canvas.height / 2 - 4);

        ctx.font = '500 14px "JetBrains Mono", monospace';
        ctx.fillStyle = loka.color;
        ctx.fillText(`R: ${loka.radius}u · Y: ${loka.height >= 0 ? '+' : ''}${loka.height}u`, canvas.width / 2, canvas.height / 2 + 22);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });

      const lokaSprite = new THREE.Sprite(spriteMat);
      lokaSprite.scale.set(6.5, 1.3, 1);
      // Position at theta = 0 on each ring
      lokaSprite.position.set(loka.radius, loka.height + 0.8, 0);
      this.lokaNameSprites.push(lokaSprite);
      this.group.add(lokaSprite);
    });
  }

  // 2. Pure Symmetric Centrosymmetric Polyhedra
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

  // 3. Optically Centered Retina Billboard Text Sprite
  private createTextSprite(text: string, colorHex: string, lokaSanskrit: string, tier: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isCrit = tier === 'CRITICAL';
      ctx.fillStyle = isCrit ? 'rgba(7, 10, 22, 0.94)' : 'rgba(4, 7, 17, 0.88)';
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = isCrit ? 3.5 : 2;

      const radius = 28;
      const x = 12;
      const y = 12;
      const w = canvas.width - 24;
      const h = canvas.height - 24;

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
      ctx.arc(56, canvas.height / 2, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden Specular Ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(56, canvas.height / 2, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Agent Name Typography
      ctx.font = isCrit
        ? '700 32px "Plus Jakarta Sans", sans-serif'
        : '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 86, canvas.height / 2 - 8);

      // Subtle Loka Sanskrit Sub-label
      ctx.font = '500 18px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = colorHex;
      ctx.fillText(lokaSanskrit, 88, canvas.height / 2 + 22);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.6, 0.95, 1);
    return sprite;
  }

  // 4. Create 24 Symmetrical Celestial Agents across 6 Vedic Spheres
  private createConstellation() {
    AGENTS_3D.forEach((agent) => {
      const nodeGroup = new THREE.Group();

      // (A) Main Symmetric Solid Core
      const geo = this.getGeometryForType(agent.geometryType, agent.nodeScale);
      const isCritical = agent.importanceTier === 'CRITICAL';

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(agent.color),
        emissive: new THREE.Color(agent.color),
        emissiveIntensity: isCritical ? 0.75 : 0.45,
        roughness: 0.12,
        metalness: 0.88,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { agent };
      this.agentMeshes.push(mesh);
      nodeGroup.add(mesh);

      // (B) Sub-atomic Quantum Micro-Core (Visible when zooming into agent)
      const subAtomicCore = new THREE.Mesh(
        new THREE.SphereGeometry(agent.nodeScale * 0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      nodeGroup.add(subAtomicCore);

      // (C) Concentric Symmetrical Wireframe Cage (Scaled by sqrt(PHI) = 1.272)
      const cageGeo = new THREE.WireframeGeometry(geo);
      const cageMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(agent.accentColor),
        transparent: true,
        opacity: 0.4,
      });
      const cageMesh = new THREE.LineSegments(cageGeo, cageMat);
      cageMesh.scale.setScalar(Math.sqrt(PHI));
      nodeGroup.add(cageMesh);

      // (D) Dual Symmetrical Gyroscopic Halo Rings (Scaled by PHI = 1.618)
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

      // (E) Dynamic Orbiting Skills Satellites Sub-System (Golden Amber Crystalline Orbs)
      const skillsGroup = new THREE.Group();
      skillsGroup.rotation.x = 0.42; // Inclined orbital plane
      skillsGroup.rotation.y = 0.25;

      const skillRadius = agent.nodeScale * 1.95;
      const skillOrbitPathGeo = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, skillRadius, 0, Math.PI * 2, true).getPoints(48)
      );
      const skillOrbitLine = new THREE.LineLoop(
        skillOrbitPathGeo,
        new THREE.LineBasicMaterial({ color: 0xe6ca85, transparent: true, opacity: 0.35 })
      );
      skillsGroup.add(skillOrbitLine);

      const skillCount = agent.skills.length;
      agent.skills.forEach((skillName, sIdx) => {
        const theta = (sIdx / skillCount) * Math.PI * 2;
        const satGeo = new THREE.OctahedronGeometry(agent.nodeScale * 0.16, 0);
        const satMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xe6ca85,
          emissiveIntensity: 0.9,
          roughness: 0.1,
          metalness: 0.9,
        });
        const satMesh = new THREE.Mesh(satGeo, satMat);
        satMesh.position.set(Math.cos(theta) * skillRadius, Math.sin(theta) * skillRadius, 0);

        // Subtle wireframe cage for skill satellite
        const satWire = new THREE.LineSegments(
          new THREE.WireframeGeometry(satGeo),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        );
        satMesh.add(satWire);

        satMesh.userData = { agent, skill: skillName, type: 'skill' };
        this.satelliteMeshes.push(satMesh);
        skillsGroup.add(satMesh);
      });

      nodeGroup.add(skillsGroup);
      this.skillOrbitGroups.push(skillsGroup);

      // (F) Dynamic Orbiting Plugins & Tools Satellites Sub-System (Celestial Cyan Prisms)
      const pluginsGroup = new THREE.Group();
      pluginsGroup.rotation.x = -0.55; // Counter-inclined orbital plane
      pluginsGroup.rotation.z = 0.35;

      const pluginRadius = agent.nodeScale * 2.65;
      const pluginOrbitPathGeo = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, pluginRadius, 0, Math.PI * 2, true).getPoints(48)
      );
      const pluginOrbitLine = new THREE.LineLoop(
        pluginOrbitPathGeo,
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 })
      );
      pluginsGroup.add(pluginOrbitLine);

      const pluginCount = agent.plugins.length;
      agent.plugins.forEach((pluginName, pIdx) => {
        const theta = (pIdx / pluginCount) * Math.PI * 2;
        const satGeo = new THREE.TetrahedronGeometry(agent.nodeScale * 0.14, 0);
        const satMat = new THREE.MeshStandardMaterial({
          color: 0xbae6fd,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.9,
          roughness: 0.1,
          metalness: 0.9,
        });
        const satMesh = new THREE.Mesh(satGeo, satMat);
        satMesh.position.set(Math.cos(theta) * pluginRadius, Math.sin(theta) * pluginRadius, 0);

        // Subtle wireframe cage for plugin satellite
        const satWire = new THREE.LineSegments(
          new THREE.WireframeGeometry(satGeo),
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
        );
        satMesh.add(satWire);

        satMesh.userData = { agent, plugin: pluginName, type: 'plugin' };
        this.satelliteMeshes.push(satMesh);
        pluginsGroup.add(satMesh);
      });

      nodeGroup.add(pluginsGroup);
      this.pluginOrbitGroups.push(pluginsGroup);

      // (G) Billboard Name Tag Sprite
      const sprite = this.createTextSprite(agent.name, agent.color, agent.lokaSanskrit, agent.importanceTier);
      sprite.position.y = agent.nodeScale * 1.45 + 0.65;
      sprite.userData = { agent };
      this.agentSprites.push(sprite);
      nodeGroup.add(sprite);

      // Store nodeGroup reference for orbital kinematics
      mesh.parent = nodeGroup;
      this.group.add(nodeGroup);
    });
  }

  // 5. Multi-Tiered Non-Overlapping Orbital Kinematics
  public update(delta: number) {
    this.time += delta;

    AGENTS_3D.forEach((agent, index) => {
      const mesh = this.agentMeshes[index];
      const nodeGroup = mesh.parent as THREE.Group;
      const halo = this.agentHalos[index];
      const skillsGroup = this.skillOrbitGroups[index];
      const pluginsGroup = this.pluginOrbitGroups[index];

      if (!nodeGroup) return;

      // Angular Motion along Discrete Concentric Loka Planes
      const currentTheta = agent.angularOffset + this.time * agent.orbitSpeed;
      const r = agent.orbitRadius;

      // Non-Overlapping Coordinates with subtle vertical harmonic breathing
      const x = Math.cos(currentTheta) * r;
      const y = agent.orbitHeight + Math.sin(currentTheta * 2) * 0.35;
      const z = Math.sin(currentTheta) * r;

      nodeGroup.position.set(x, y, z);

      // Self-Rotation & Gyro Precession
      mesh.rotation.x += delta * 0.6;
      mesh.rotation.y += delta * 0.9;

      if (halo) {
        halo.rotation.x += delta * 0.3;
        halo.rotation.z += delta * 0.5;
      }

      // Orbiting Skills Satellites Kinematics (Golden Clockwise Rotation)
      if (skillsGroup) {
        skillsGroup.rotation.z += delta * 1.4;
        skillsGroup.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x += delta * 2.0;
            child.rotation.y += delta * 2.5;
          }
        });
      }

      // Orbiting Plugins Satellites Kinematics (Cyan Counter-Clockwise Rotation)
      if (pluginsGroup) {
        pluginsGroup.rotation.z -= delta * 1.1;
        pluginsGroup.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x -= delta * 1.8;
            child.rotation.z += delta * 2.2;
          }
        });
      }
    });

    // Gentle precession of Loka markers
    this.lokaNameSprites.forEach((sprite, idx) => {
      const loka = VEDIC_LOKAS[idx];
      const theta = this.time * loka.speed * 0.4;
      sprite.position.x = Math.cos(theta) * loka.radius;
      sprite.position.z = Math.sin(theta) * loka.radius;
    });
  }
}
