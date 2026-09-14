import * as THREE from 'three';
import { PHI } from '../data/agents';

export class GoldenSpiralOverlay {
  public group: THREE.Group;
  private spiralLine: THREE.Line;
  private fibonacciRings: THREE.Line[] = [];
  private goldenRectangles: THREE.LineSegments;
  public isVisible: boolean = true;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'GoldenSpiralOverlay';

    // 1. Procedural 3D Logarithmic Golden Spiral (r = a * phi^(theta / (pi/2)))
    const points: THREE.Vector3[] = [];
    const turns = 4.5;
    const maxTheta = turns * Math.PI * 2;
    const steps = 300;
    const a = 1.618;
    const growthFactor = Math.log(PHI) / (Math.PI / 2);

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * maxTheta;
      const r = a * Math.exp(growthFactor * theta);
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = Math.sin(theta * 2) * (r * 0.08); // Subtle 3D wave
      points.push(new THREE.Vector3(x, y, z));
    }

    const spiralGeo = new THREE.BufferGeometry().setFromPoints(points);
    const spiralMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b, // Golden Amber
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    this.spiralLine = new THREE.Line(spiralGeo, spiralMat);
    this.group.add(this.spiralLine);

    // 2. Concentric Fibonacci Radii Harmonic Rings (F_5=5, F_6=8, F_7=13, F_8=21, F_9=34, F_10=55, F_11=89)
    const activeFib = [8, 13, 21, 34, 55, 89];
    activeFib.forEach((radius, idx) => {
      const ringPoints: THREE.Vector3[] = [];
      const segments = 96;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        ringPoints.push(
          new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle))
        );
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x06b6d4 : 0xf59e0b,
        transparent: true,
        opacity: 0.22,
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      this.fibonacciRings.push(ring);
      this.group.add(ring);
    });

    // 3. Golden Rectangles Coordinate Plane Wireframe (Aspect 1 : 1.618)
    const rectGeo = new THREE.BufferGeometry();
    const rectPoints: THREE.Vector3[] = [];
    const rectSizes = [13, 21, 34, 55];

    rectSizes.forEach((w) => {
      const h = w / PHI;
      // Draw rectangle outline
      rectPoints.push(new THREE.Vector3(-w / 2, 0, -h / 2));
      rectPoints.push(new THREE.Vector3(w / 2, 0, -h / 2));

      rectPoints.push(new THREE.Vector3(w / 2, 0, -h / 2));
      rectPoints.push(new THREE.Vector3(w / 2, 0, h / 2));

      rectPoints.push(new THREE.Vector3(w / 2, 0, h / 2));
      rectPoints.push(new THREE.Vector3(-w / 2, 0, h / 2));

      rectPoints.push(new THREE.Vector3(-w / 2, 0, h / 2));
      rectPoints.push(new THREE.Vector3(-w / 2, 0, -h / 2));
    });

    rectGeo.setFromPoints(rectPoints);
    const rectMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
    });
    this.goldenRectangles = new THREE.LineSegments(rectGeo, rectMat);
    this.group.add(this.goldenRectangles);
  }

  public update(delta: number) {
    // Slow hypnotic cosmic precession matching PHI harmonics
    this.group.rotation.y += delta * 0.02 * (1 / PHI);
  }

  public toggle(visible?: boolean) {
    this.isVisible = visible !== undefined ? visible : !this.isVisible;
    this.group.visible = this.isVisible;
    return this.isVisible;
  }
}
