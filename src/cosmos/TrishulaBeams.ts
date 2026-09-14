import * as THREE from 'three';

export class TrishulaBeams {
  public group: THREE.Group;
  private particleCount: number = 450;
  private cpuPoints: THREE.Points;
  private igpuPoints: THREE.Points;
  private dgpuPoints: THREE.Points;
  private time: number = 0;

  constructor() {
    this.group = new THREE.Group();

    this.cpuPoints = this.createBeam(0x38bdf8, 0);       // Center / CPU
    this.igpuPoints = this.createBeam(0x10b981, -0.35); // Left Prong / Intel iGPU
    this.dgpuPoints = this.createBeam(0xf59e0b, 0.35);  // Right Prong / NVIDIA dGPU

    this.group.add(this.cpuPoints);
    this.group.add(this.igpuPoints);
    this.group.add(this.dgpuPoints);
  }

  private createBeam(colorHex: number, angleOffset: number): THREE.Points {
    const positions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      const t = i / this.particleCount;
      const y = t * 60 - 30;
      const spread = (Math.random() - 0.5) * 1.5;
      const x = Math.sin(angleOffset) * (Math.abs(y) * 0.4 + 5) + spread;
      const z = Math.cos(angleOffset) * spread;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.25,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  public update(delta: number) {
    this.time += delta;
    this.group.rotation.y = this.time * 0.15;
  }
}
