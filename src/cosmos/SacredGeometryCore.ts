import * as THREE from 'three';
import { PHI, GOLDEN_ANGLE } from '../data/agents';

// Helper to create a perfectly round antialiased particle texture
export function createRoundParticleTexture(size: number = 64): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.45)');
    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// Helper to create a blazing solar corona lens flare texture
export function createSolarCoronaTexture(size: number = 256): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.15, 'rgba(254, 240, 138, 0.95)');
    gradient.addColorStop(0.35, 'rgba(245, 158, 11, 0.65)');
    gradient.addColorStop(0.65, 'rgba(217, 119, 6, 0.25)');
    gradient.addColorStop(0.9, 'rgba(180, 83, 9, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export class SacredGeometryCore {
  public group: THREE.Group;
  private torus: THREE.Mesh;
  private innerMeru: THREE.LineSegments;
  private damruParticles: THREE.Points;
  private axisRingsGroup: THREE.Group;
  
  // Blazing Sun Core & Coronal Flare Components
  private solarSunMesh: THREE.Mesh;
  private solarInnerCorona: THREE.Sprite;
  private solarOuterCorona: THREE.Sprite;
  private solarRaysMesh: THREE.LineSegments;
  private coreLight: THREE.PointLight;

  // Atomic / Quantum Singularity Components (Visible at atomic zoom < 2.0u)
  private atomicSingularityGroup: THREE.Group;
  private quantumBindu: THREE.Mesh;
  private subatomicQuarks: THREE.Points;
  private planckLattice: THREE.LineSegments;
  private sriYantraEnergyLines: THREE.LineSegments;

  private roundParticleMap: THREE.Texture;
  private solarCoronaMap: THREE.Texture;
  private time: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.roundParticleMap = createRoundParticleTexture(64);
    this.solarCoronaMap = createSolarCoronaTexture(256);

    // ==========================================
    // 1. BLAZING SUN CORE (Bright like the Sun)
    // ==========================================
    const sunGeo = new THREE.SphereGeometry(1.65, 32, 32);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a, // Blazing Solar Gold
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.2,
    });
    this.solarSunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.group.add(this.solarSunMesh);

    // Sun Inner Corona Glow
    const innerCoronaMat = new THREE.SpriteMaterial({
      map: this.solarCoronaMap,
      color: 0xfffbeb,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.solarInnerCorona = new THREE.Sprite(innerCoronaMat);
    this.solarInnerCorona.scale.set(7.5, 7.5, 1);
    this.group.add(this.solarInnerCorona);

    // Sun Outer Coronal Radiance
    const outerCoronaMat = new THREE.SpriteMaterial({
      map: this.solarCoronaMap,
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.solarOuterCorona = new THREE.Sprite(outerCoronaMat);
    this.solarOuterCorona.scale.set(13.5, 13.5, 1);
    this.group.add(this.solarOuterCorona);

    // Dynamic Solar Flare Energy Rays (12 Golden Radial Beams)
    const rayPoints: THREE.Vector3[] = [];
    const rayCount = 24;
    for (let i = 0; i < rayCount; i++) {
      const theta = (i / rayCount) * Math.PI * 2;
      const rInner = 1.65;
      const rOuter = 4.2 + (i % 2 === 0 ? 1.8 : 0.8);
      rayPoints.push(new THREE.Vector3(Math.cos(theta) * rInner, 0, Math.sin(theta) * rInner));
      rayPoints.push(new THREE.Vector3(Math.cos(theta) * rOuter, (i % 3 - 1) * 0.4, Math.sin(theta) * rOuter));
    }
    const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPoints);
    const rayMat = new THREE.LineBasicMaterial({
      color: 0xfff08a,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    this.solarRaysMesh = new THREE.LineSegments(rayGeo, rayMat);
    this.group.add(this.solarRaysMesh);

    // Dedicated Blazing Solar Point Light
    this.coreLight = new THREE.PointLight(0xfff7ed, 6.0, 150, 1.2);
    this.group.add(this.coreLight);

    // ==========================================
    // 2. ATOMIC / QUANTUM BINDU SINGULARITY (R < 1.5u)
    // ==========================================
    this.atomicSingularityGroup = new THREE.Group();

    // Planck-Scale Quantum Bindu Core
    const binduGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const binduMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
    });
    this.quantumBindu = new THREE.Mesh(binduGeo, binduMat);
    this.atomicSingularityGroup.add(this.quantumBindu);

    // Sub-atomic Orbiting Quarks with ROUND particles
    const quarkCount = 65;
    const quarkPositions = new Float32Array(quarkCount * 3);
    const quarkColors = new Float32Array(quarkCount * 3);
    const goldColor = new THREE.Color(0xfef08a);
    const cyanColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < quarkCount; i++) {
      const theta = i * GOLDEN_ANGLE;
      const r = 0.15 + (i / quarkCount) * 0.65;
      const y = (Math.sin(i * 3.5) * 0.25);
      quarkPositions[i * 3] = r * Math.cos(theta);
      quarkPositions[i * 3 + 1] = y;
      quarkPositions[i * 3 + 2] = r * Math.sin(theta);

      const mixed = goldColor.clone().lerp(cyanColor, i / quarkCount);
      quarkColors[i * 3] = mixed.r;
      quarkColors[i * 3 + 1] = mixed.g;
      quarkColors[i * 3 + 2] = mixed.b;
    }

    const quarkGeo = new THREE.BufferGeometry();
    quarkGeo.setAttribute('position', new THREE.BufferAttribute(quarkPositions, 3));
    quarkGeo.setAttribute('color', new THREE.BufferAttribute(quarkColors, 3));

    const quarkMat = new THREE.PointsMaterial({
      size: 0.12,
      map: this.roundParticleMap,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.subatomicQuarks = new THREE.Points(quarkGeo, quarkMat);
    this.atomicSingularityGroup.add(this.subatomicQuarks);

    // Microscopic Planck Icosahedral Lattice
    const planckGeo = new THREE.IcosahedronGeometry(0.45, 0);
    const planckWire = new THREE.WireframeGeometry(planckGeo);
    const planckMat = new THREE.LineBasicMaterial({
      color: 0xe6ca85,
      transparent: true,
      opacity: 0.65,
    });
    this.planckLattice = new THREE.LineSegments(planckWire, planckMat);
    this.atomicSingularityGroup.add(this.planckLattice);

    // Sri Yantra Sacred Energy Lines
    const trianglePoints: THREE.Vector3[] = [];
    const triScales = [0.25, 0.45, 0.75, 1.15];
    triScales.forEach((sc, idx) => {
      const flip = idx % 2 === 0 ? 1 : -1;
      const p1 = new THREE.Vector3(0, sc * flip, 0);
      const p2 = new THREE.Vector3(sc * 0.866, -sc * 0.5 * flip, 0);
      const p3 = new THREE.Vector3(-sc * 0.866, -sc * 0.5 * flip, 0);
      
      trianglePoints.push(p1, p2, p2, p3, p3, p1);
    });

    const triGeo = new THREE.BufferGeometry().setFromPoints(trianglePoints);
    const triMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    this.sriYantraEnergyLines = new THREE.LineSegments(triGeo, triMat);
    this.atomicSingularityGroup.add(this.sriYantraEnergyLines);

    this.group.add(this.atomicSingularityGroup);

    // ==========================================
    // 3. CENTRAL GOLDEN SPANDA TORUS (R = 4.236, r = 0.85)
    // ==========================================
    const majorRadius = Math.pow(PHI, 3); // ~4.236
    const tubeRadius = 0.85;
    const torusGeo = new THREE.TorusGeometry(majorRadius, tubeRadius, 34, 89);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xe6ca85,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    this.torus = new THREE.Mesh(torusGeo, torusMat);
    this.group.add(this.torus);

    // ==========================================
    // 4. INNER MERU SRI YANTRA OCTAHEDRON WIREFRAME
    // ==========================================
    const meruGeo = new THREE.OctahedronGeometry(Math.pow(PHI, 2), 1);
    const wireGeo = new THREE.WireframeGeometry(meruGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    this.innerMeru = new THREE.LineSegments(wireGeo, wireMat);
    this.group.add(this.innerMeru);

    // ==========================================
    // 5. GYROSCOPIC CORE AXIS RINGS
    // ==========================================
    this.axisRingsGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xfef08a, wireframe: true, transparent: true, opacity: 0.45 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.45 });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xf8fafc, wireframe: true, transparent: true, opacity: 0.45 });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.05, 8, 64), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.05, 8, 64), ringMat2);
    ring2.rotation.x = Math.PI / PHI;
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.05, 8, 64), ringMat3);
    ring3.rotation.y = Math.PI / PHI;

    this.axisRingsGroup.add(ring1);
    this.axisRingsGroup.add(ring2);
    this.axisRingsGroup.add(ring3);
    this.group.add(this.axisRingsGroup);

    // ==========================================
    // 6. DAMRU VORTEX (Strictly ROUND Particles with Radial Map)
    // ==========================================
    const particleCount = 610;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xfffbeb); // Blazing Sun Gold
    const c2 = new THREE.Color(0xf59e0b); // Solar Amber

    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount - 0.5) * 2; // -1 to 1
      const y = u * 5.5;
      const r = (Math.abs(u) * 2.5 + 0.45);
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
      size: 0.38, // Round soft particle
      map: this.roundParticleMap,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.damruParticles = new THREE.Points(damruGeo, damruMat);
    this.group.add(this.damruParticles);
  }

  public update(delta: number, modeScale: number = 1.0) {
    this.time += delta;

    // 1. Solar Pulse & Coronal Breathing (Bright like the Sun)
    const solarPulse = 1.0 + Math.sin(this.time * 2.5) * 0.05;
    this.solarSunMesh.scale.setScalar(solarPulse);
    this.solarInnerCorona.scale.setScalar(7.5 * (1.0 + Math.sin(this.time * 3.0) * 0.06));
    this.solarOuterCorona.scale.setScalar(13.5 * (1.0 + Math.cos(this.time * 2.0) * 0.08));
    this.solarRaysMesh.rotation.y += delta * 0.3 * modeScale;
    this.solarRaysMesh.rotation.z += delta * 0.15 * modeScale;

    // 2. Quantum Singularity High-Frequency Jitter & Rotation
    this.atomicSingularityGroup.rotation.y += delta * 1.6 * modeScale;
    this.planckLattice.rotation.x -= delta * 1.2 * modeScale;
    this.planckLattice.rotation.z += delta * 0.9 * modeScale;
    this.subatomicQuarks.rotation.y += delta * 2.5 * modeScale;
    this.sriYantraEnergyLines.rotation.z += delta * 0.4 * modeScale;

    const binduPulse = 1.0 + Math.sin(this.time * 8.0) * 0.25;
    this.quantumBindu.scale.setScalar(binduPulse);

    // 3. Macro Spanda Rotation
    this.torus.rotation.x += delta * 0.25 * modeScale;
    this.torus.rotation.y += delta * 0.4 * modeScale;

    this.innerMeru.rotation.x -= delta * 0.35 * modeScale;
    this.innerMeru.rotation.z += delta * 0.25 * modeScale;

    this.axisRingsGroup.rotation.x += delta * 0.15 * modeScale;
    this.axisRingsGroup.rotation.y += delta * 0.2 * modeScale;

    // 4. Damru Golden Vortex Pulse
    this.damruParticles.rotation.y += delta * 0.6 * modeScale;
    const damruPulse = 1.0 + Math.sin(this.time * 2) * 0.04;
    this.damruParticles.scale.set(damruPulse, 1.0, damruPulse);
  }

  public setModeVisuals(mode: string) {
    switch (mode) {
      case 'srishti': // Creation (Blazing Warm Gold)
        (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0xfffbeb);
        (this.torus.material as THREE.MeshStandardMaterial).emissive.setHex(0xf59e0b);
        (this.solarSunMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xfef08a);
        break;
      case 'sthiti': // Preservation (Solar Platinum & Gold)
        (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0xf8fafc);
        (this.torus.material as THREE.MeshStandardMaterial).emissive.setHex(0xca8a04);
        (this.solarSunMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xfef08a);
        break;
      case 'samhara': // Dissolution (Fiery Red-Amber)
        (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0xf87171);
        (this.torus.material as THREE.MeshStandardMaterial).emissive.setHex(0xb91c1c);
        (this.solarSunMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xef4444);
        break;
      case 'tirobhava': // Veiling (Astral Indigo Sun)
        (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0x818cf8);
        (this.torus.material as THREE.MeshStandardMaterial).emissive.setHex(0x4338ca);
        (this.solarSunMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x818cf8);
        break;
      case 'anugraha': // Grace (Luminous Diamond White Sun)
        (this.torus.material as THREE.MeshStandardMaterial).color.setHex(0xffffff);
        (this.torus.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff);
        (this.solarSunMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff);
        break;
    }
  }
}
