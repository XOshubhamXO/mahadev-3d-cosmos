import * as THREE from 'three';
import { PHI, GOLDEN_ANGLE } from '../data/agents';

export class SacredGeometryCore {
  public group: THREE.Group;
  private torus: THREE.Mesh;
  private innerMeru: THREE.LineSegments;
  private damruParticles: THREE.Points;
  private axisRingsGroup: THREE.Group;
  private time: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Golden Ratio Torus (Major Radius R = 8 * PHI, Tube Radius r = 8 / PHI)
    const majorRadius = 8 * PHI; // ~12.944
    const tubeRadius = 8 / PHI;   // ~4.944
    const torusGeo = new THREE.TorusGeometry(majorRadius, tubeRadius * 0.35, 34, 89);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    this.torus = new THREE.Mesh(torusGeo, torusMat);
    this.group.add(this.torus);

    // 2. Inner Meru / Sri Yantra Tetrahedral Wireframe (Golden Octahedron scaled by PHI)
    const meruGeo = new THREE.OctahedronGeometry(5 * PHI, 1);
    const wireGeo = new THREE.WireframeGeometry(meruGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.75,
    });
    this.innerMeru = new THREE.LineSegments(wireGeo, wireMat);
    this.group.add(this.innerMeru);

    // 3. Gyroscopic Coordinate Axis Rings with Fibonacci Radii (F_7=13, F_8=21, F_9=34)
    this.axisRingsGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.38 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true, transparent: true, opacity: 0.38 });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.38 });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(13, 0.08, 8, 89), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(21, 0.08, 8, 89), ringMat2);
    ring2.rotation.x = Math.PI / PHI;
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(34, 0.08, 8, 89), ringMat3);
    ring3.rotation.y = Math.PI / PHI;

    this.axisRingsGroup.add(ring1);
    this.axisRingsGroup.add(ring2);
    this.axisRingsGroup.add(ring3);
    this.group.add(this.axisRingsGroup);

    // 4. Damru (Hourglass Vortex using Golden Angle psi = 137.508 deg distribution)
    const particleCount = 890; // Fibonacci F_11 * 10
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x38bdf8);
    const c2 = new THREE.Color(0xf43f5e);

    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount - 0.5) * 2; // -1 to 1
      const y = u * (8 * PHI);
      // Hourglass waist curved by Golden Ratio parabola
      const r = (Math.abs(u) * (5 * PHI) + 0.618);
      // Golden Angle distribution
      const angle = i * GOLDEN_ANGLE;

      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(angle);

      const mixed = c1.clone().lerp(c2, (u + 1) / 2);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const damruGeo = new THREE.BufferGeometry();
    damruGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    damruGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const damruMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
    });

    this.damruParticles = new THREE.Points(damruGeo, damruMat);
    this.group.add(this.damruParticles);
  }

  public update(delta: number, modeScale: number = 1.0) {
    this.time += delta;

    // Simultaneous self-rotation on own axis + golden precession
    this.torus.rotation.x += delta * (0.3 / PHI);
    this.torus.rotation.y += delta * (0.5 / PHI);
    this.torus.scale.setScalar(1 + Math.sin(this.time * PHI) * 0.05 * modeScale);

    this.innerMeru.rotation.x -= delta * (0.6 / PHI);
    this.innerMeru.rotation.z += delta * (0.4 / PHI);
    this.innerMeru.rotation.y += delta * (0.3 / PHI);

    // Gyroscope axis rings dual revolution & counter-rotation
    this.axisRingsGroup.rotation.x = Math.sin(this.time * 0.3) * (Math.PI / (PHI * 4));
    this.axisRingsGroup.rotation.y += delta * (0.2 / PHI);
    this.axisRingsGroup.rotation.z += delta * (0.12 / PHI);

    // Damru particle vortex spinning at Golden Frequency
    this.damruParticles.rotation.y += delta * PHI * 0.6;
    this.damruParticles.rotation.x = Math.sin(this.time * (1 / PHI)) * 0.1;

    // Whole core dynamic orbital precession
    this.group.rotation.y += delta * 0.03;
    this.group.rotation.z = Math.cos(this.time * (1 / PHI)) * 0.05;
  }

  public setModeVisuals(mode: string) {
    if (mode === 'srishti') {
      this.torus.scale.set(PHI, PHI, PHI);
      (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
    } else if (mode === 'sthiti') {
      this.torus.scale.set(1.0, 1.0, 1.0);
      (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0x10b981);
    } else if (mode === 'samhara') {
      this.torus.scale.set(1 / PHI, 1 / PHI, 1 / PHI);
      (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0xf43f5e);
    } else if (mode === 'tirobhava') {
      this.torus.scale.set(Math.sqrt(1 / PHI), Math.sqrt(1 / PHI), Math.sqrt(1 / PHI));
      (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0x8b5cf6);
    } else if (mode === 'anugraha') {
      this.torus.scale.set(PHI * PHI * 0.65, PHI * PHI * 0.65, PHI * PHI * 0.65);
      (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
    }
  }
}
