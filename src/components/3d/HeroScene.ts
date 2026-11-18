import * as THREE from 'three';

export interface HeroSceneOptions {
  particleCount?: number;
  maxDistance?: number;
  interactiveRadius?: number;
}

export class HeroScene {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId: number | null = null;
  private isVisible: boolean = true;

  // 3D Objects
  private particlesMesh!: THREE.Points;
  private linesMesh!: THREE.LineSegments;
  private particlePositions!: Float32Array;
  private particleVelocities: { x: number; y: number; z: number }[] = [];
  private particleCount: number;
  private maxDistance: number;

  // Interactivity
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private boundOnMouseMove!: (e: MouseEvent) => void;
  private boundOnResize!: () => void;
  private observer!: IntersectionObserver;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, options: HeroSceneOptions = {}) {
    this.container = container;
    this.canvas = canvas;
    this.particleCount = options.particleCount || (window.innerWidth < 768 ? 70 : 140);
    this.maxDistance = options.maxDistance || 3.8;

    this.init();
  }

  private init(): void {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.z = 10;

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Particles & Connecting Geometry
    this.createParticles();

    // 4. Listeners
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    window.addEventListener('mousemove', this.boundOnMouseMove);
    window.addEventListener('resize', this.boundOnResize);

    // 5. Visibility optimization (pauses animation when out of view)
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.animationFrameId) {
            this.animate();
          }
        });
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.container);

    // Start loop
    this.animate();
  }

  private createParticles(): void {
    const positions = new Float32Array(this.particleCount * 3);
    const range = 14;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * range;
      positions[i3 + 1] = (Math.random() - 0.5) * range;
      positions[i3 + 2] = (Math.random() - 0.5) * range;

      this.particleVelocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.012,
        z: (Math.random() - 0.5) * 0.012,
      });
    }

    this.particlePositions = positions;

    // Points
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      color: new THREE.Color('#6366f1'),
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.particlesMesh = new THREE.Points(pointsGeo, pointsMat);
    this.scene.add(this.particlesMesh);

    // Connecting Lines
    const maxLineSegments = (this.particleCount * (this.particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    this.scene.add(this.linesMesh);
  }

  private onMouseMove(e: MouseEvent): void {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    this.mouse.targetX = (e.clientX - halfWidth) / halfWidth;
    this.mouse.targetY = -(e.clientY - halfHeight) / halfHeight;
  }

  private onResize(): void {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private animate(): void {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    // Smooth cursor interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Gentle camera parallax
    this.camera.position.x = this.mouse.x * 1.5;
    this.camera.position.y = this.mouse.y * 1.5;
    this.camera.lookAt(0, 0, 0);

    // Subtle scene rotation
    this.particlesMesh.rotation.y += 0.001;
    this.linesMesh.rotation.y += 0.001;

    // Update particles position & velocities
    const positions = this.particlePositions;
    const count = this.particleCount;
    const limit = 7.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const v = this.particleVelocities[i];

      positions[i3] += v.x;
      positions[i3 + 1] += v.y;
      positions[i3 + 2] += v.z;

      // Bounce at boundary
      if (Math.abs(positions[i3]) > limit) v.x *= -1;
      if (Math.abs(positions[i3 + 1]) > limit) v.y *= -1;
      if (Math.abs(positions[i3 + 2]) > limit) v.z *= -1;
    }

    this.particlesMesh.geometry.attributes.position.needsUpdate = true;

    // Calculate dynamic connections
    const linePositions = this.linesMesh.geometry.attributes.position.array as Float32Array;
    const lineColors = this.linesMesh.geometry.attributes.color.array as Float32Array;
    let lineIndex = 0;
    const maxDist = this.maxDistance;

    const baseColor = new THREE.Color('#06b6d4');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x1 = positions[i3];
      const y1 = positions[i3 + 1];
      const z1 = positions[i3 + 2];

      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        const x2 = positions[j3];
        const y2 = positions[j3 + 1];
        const z2 = positions[j3 + 2];

        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          const alpha = 1 - dist / maxDist;

          linePositions[lineIndex * 6] = x1;
          linePositions[lineIndex * 6 + 1] = y1;
          linePositions[lineIndex * 6 + 2] = z1;

          linePositions[lineIndex * 6 + 3] = x2;
          linePositions[lineIndex * 6 + 4] = y2;
          linePositions[lineIndex * 6 + 5] = z2;

          // Color with alpha intensity
          lineColors[lineIndex * 6] = baseColor.r * alpha * 0.45;
          lineColors[lineIndex * 6 + 1] = baseColor.g * alpha * 0.45;
          lineColors[lineIndex * 6 + 2] = baseColor.b * alpha * 0.45;

          lineColors[lineIndex * 6 + 3] = baseColor.r * alpha * 0.45;
          lineColors[lineIndex * 6 + 4] = baseColor.g * alpha * 0.45;
          lineColors[lineIndex * 6 + 5] = baseColor.b * alpha * 0.45;

          lineIndex++;
        }
      }
    }

    this.linesMesh.geometry.setDrawRange(0, lineIndex * 2);
    this.linesMesh.geometry.attributes.position.needsUpdate = true;
    this.linesMesh.geometry.attributes.color.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('resize', this.boundOnResize);
    this.observer.disconnect();

    this.particlesMesh.geometry.dispose();
    (this.particlesMesh.material as THREE.Material).dispose();

    this.linesMesh.geometry.dispose();
    (this.linesMesh.material as THREE.Material).dispose();

    this.renderer.dispose();
  }
}
