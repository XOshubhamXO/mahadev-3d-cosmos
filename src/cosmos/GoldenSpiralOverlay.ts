import * as THREE from 'three';
import { PHI } from '../data/agents';

export class GoldenSpiralOverlay {
  public group: THREE.Group;
  private spiralLine: THREE.Line;
  private goldenRectangles: THREE.LineSegments;
  public isVisible: boolean = true;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'GoldenSpiralOverlay';

    // 1. Procedural 3D Logarithmic Golden Spiral (r = a * phi^(theta / (pi/2)))
    const points: THREE.Vector3[] = [];
    const turns = 4.2;
    const maxTheta = turns * Math.PI * 2;
    const steps = 360;
    const a = 1.618;
    const growthFactor = Math.log(PHI) / (Math.PI / 2);

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * maxTheta;
      const r = a * Math.exp(growthFactor * theta);
      if (r > 68) break; // Keep spiral within outermost Loka radius
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = Math.sin(theta * 2) * (r * 0.05); // Subtle harmonic undulation
      points.push(new THREE.Vector3(x, y, z));
    }

    const spiralGeo = new THREE.BufferGeometry().setFromPoints(points);
    const spiralMat = new THREE.LineBasicMaterial({
      color: 0xe6ca85, // Champagne Gold
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    this.spiralLine = new THREE.Line(spiralGeo, spiralMat);
    this.group.add(this.spiralLine);

    // 2. Subtle Golden Rectangles Frame (Aspect Ratio 1 : 1.618)
    const rectGeo = new THREE.BufferGeometry();
    const rectPoints: THREE.Vector3[] = [];
    const rectSizes = [21, 34, 55];

    rectSizes.forEach((w) => {
      const h = w / PHI;
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
      opacity: 0.12,
    });
    this.goldenRectangles = new THREE.LineSegments(rectGeo, rectMat);
    this.group.add(this.goldenRectangles);
  }

  public update(delta: number) {
    // Slow, stately cosmic precession
    this.group.rotation.y += delta * 0.015 * (1 / PHI);
  }

  public toggle(visible?: boolean) {
    if (visible !== undefined) {
      this.isVisible = visible;
    } else {
      this.isVisible = !this.isVisible;
    }
    this.group.visible = this.isVisible;
    return this.isVisible;
  }
}
