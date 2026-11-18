import * as THREE from 'three';

export interface HeroSceneOptions {
  radius?: number;
  detail?: number;
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
  private mainGroup!: THREE.Group;
  private wireMesh!: THREE.LineSegments;
  private nodesInstancedMesh!: THREE.InstancedMesh;

  // Rotation & Scroll Physics
  private baseRotationSpeed = 0.0006;
  private currentRotationSpeed = 0.0006;
  private targetRotationSpeed = 0.0006;
  private lastScrollY = 0;

  // Interactivity & Observers
  private boundOnScroll!: () => void;
  private boundOnResize!: () => void;
  private boundOnThemeChange!: () => void;
  private observer!: IntersectionObserver;
  private themeObserver!: MutationObserver;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, options: HeroSceneOptions = {}) {
    this.container = container;
    this.canvas = canvas;

    this.init();
  }

  private init(): void {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
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

    // 3. Create Geodesic Wireframe Polyhedron with Circular Nodes
    this.createGeodesicSphere();

    // 4. Initial Theme Colors
    this.updateThemeColors();

    // 5. Event Listeners
    this.boundOnScroll = this.onScroll.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnThemeChange = this.updateThemeColors.bind(this);

    window.addEventListener('scroll', this.boundOnScroll, { passive: true });
    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('themechange', this.boundOnThemeChange);

    // Watch for class changes on <html> (dark / light switch)
    this.themeObserver = new MutationObserver(() => {
      this.updateThemeColors();
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    this.lastScrollY = window.scrollY || window.pageYOffset || 0;

    // 6. Visibility optimization (pauses animation when hero leaves viewport)
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

    // Start render loop
    this.animate();
  }

  private isDarkMode(): boolean {
    return !document.documentElement.classList.contains('light');
  }

  private updateThemeColors(): void {
    if (!this.wireMesh || !this.nodesInstancedMesh) return;

    const dark = this.isDarkMode();

    // In Dark Mode: Crisp white lines and bright glowing spheres
    // In Light Mode: Deep slate/indigo lines and vibrant indigo spheres for high contrast
    const wireColor = dark ? 0xffffff : 0x334155;
    const wireOpacity = dark ? 0.85 : 0.75;
    const nodeColor = dark ? 0xffffff : 0x4f46e5;

    const wireMat = this.wireMesh.material as THREE.LineBasicMaterial;
    wireMat.color.setHex(wireColor);
    wireMat.opacity = wireOpacity;

    const nodeMat = this.nodesInstancedMesh.material as THREE.MeshBasicMaterial;
    nodeMat.color.setHex(nodeColor);
  }

  private createGeodesicSphere(): void {
    this.mainGroup = new THREE.Group();

    const width = window.innerWidth;
    const isDesktop = width >= 1024;
    const isMobile = width < 768;

    //------------------- Tamaño de circunferencia------------------------
    const radius = isDesktop ? 6 : (isMobile ? 5 : 3.4);

    // Base Geodesic Icosahedron (detail 1 matches the reference photo)
    const baseGeo = new THREE.IcosahedronGeometry(radius, 1);

    // A. Wireframe Edges
    const wireGeo = new THREE.WireframeGeometry(baseGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    this.wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    this.mainGroup.add(this.wireMesh);

    // B. Circular 3D Nodes at each vertex (Instanced Spheres for perfect circles)
    const posAttribute = baseGeo.attributes.position;
    const uniquePositions: THREE.Vector3[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = posAttribute.getZ(i);
      const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePositions.push(new THREE.Vector3(x, y, z));
      }
    }

    const sphereRadius = isMobile ? 0.08 : 0.12;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    this.nodesInstancedMesh = new THREE.InstancedMesh(
      sphereGeo,
      sphereMat,
      uniquePositions.length
    );

    const matrix = new THREE.Matrix4();
    uniquePositions.forEach((pos, index) => {
      matrix.setPosition(pos.x, pos.y, pos.z);
      this.nodesInstancedMesh.setMatrixAt(index, matrix);
    });

    this.nodesInstancedMesh.instanceMatrix.needsUpdate = true;
    this.mainGroup.add(this.nodesInstancedMesh);

    // -----------------------------Posicion movil y desktop-----------------------------
    if (isDesktop) {
      this.mainGroup.position.x = -4.4;
      this.mainGroup.position.y = 0;
    } else {
      this.mainGroup.position.x = -3;
      this.mainGroup.position.y = .5;
    }
    // -----------------------------Posicion movil y desktop-----------------------------

    // Fixed clean perspective without mouse disturbances
    this.mainGroup.rotation.x = 0.25;
    this.mainGroup.rotation.z = -0.15;

    this.scene.add(this.mainGroup);
  }

  private onScroll(): void {
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    const delta = Math.abs(currentScroll - this.lastScrollY);
    this.lastScrollY = currentScroll;

    // Dynamically boost horizontal clockwise rotation based on scroll intensity
    const boost = Math.min(delta * 0.0018, 0.06);
    this.targetRotationSpeed = this.baseRotationSpeed + boost;
  }

  private onResize(): void {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update horizontal offset according to screen width
    const isDesktop = width >= 1024;
    if (this.mainGroup) {
      if (isDesktop) {
        this.mainGroup.position.x = -2.4;
        this.mainGroup.position.y = 0;
      } else {
        this.mainGroup.position.x = 0;
        this.mainGroup.position.y = 0.8;
      }
    }
  }

  private animate(): void {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    // Smooth physics: lerp acceleration and deceleration back to base idle speed
    this.currentRotationSpeed += (this.targetRotationSpeed - this.currentRotationSpeed) * 0.12;
    this.targetRotationSpeed += (this.baseRotationSpeed - this.targetRotationSpeed) * 0.04;

    // Horizontal clockwise rotation around Y axis
    this.mainGroup.rotation.y += this.currentRotationSpeed;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('scroll', this.boundOnScroll);
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('themechange', this.boundOnThemeChange);
    this.themeObserver.disconnect();
    this.observer.disconnect();

    this.wireMesh.geometry.dispose();
    (this.wireMesh.material as THREE.Material).dispose();

    this.nodesInstancedMesh.geometry.dispose();
    (this.nodesInstancedMesh.material as THREE.Material).dispose();

    this.scene.remove(this.mainGroup);
    this.renderer.dispose();
  }
}
