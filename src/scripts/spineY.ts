// src/scripts/spineY.ts
// SpineY Curved Per-Char Engine (-90° → 0°)

export interface SpineSection {
  id: string;
  label: string;
}

export const SPINE_SECTIONS: SpineSection[] = [
  { id: 'about', label: 'SOBRE MÍ' },
  { id: 'work', label: 'EXPERIENCIA' },
  { id: 'education', label: 'EDUCACIÓN' },
  { id: 'projects', label: 'PROYECTOS' },
  { id: 'hackathons', label: 'HACKATHONS' },
  { id: 'blog', label: 'BLOG' },
  { id: 'contact', label: 'CONTACTO' },
];

interface CharItem {
  el: HTMLElement;
  width: number;
  charIdx: number;
  smoothX: number;
  smoothY: number;
  smoothRot: number;
  smoothScale: number;
  initialized: boolean;
}

interface SpineItem {
  sec: SpineSection;
  anchor: HTMLAnchorElement;
  chars: CharItem[];
  totalWidth: number;
  sectionEl: HTMLElement | null;
  smoothTargetDock: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function initSpineY(): () => void {
  const overlay = document.getElementById('spine-char-overlay');
  if (!overlay) return () => {};

  overlay.innerHTML = '';

  const BASE_FONT_SIZE = 26;
  const SCALE_ACTIVE = 1.0;
  const SCALE_RAIL = 0.58;
  const SCALE_STACK = 0.46;

  // Medir ancho de cada carácter mediante Canvas 2D
  const measureCanvas = document.createElement('canvas');
  const ctx = measureCanvas.getContext('2d');
  if (ctx) {
    ctx.font = `800 ${BASE_FONT_SIZE}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  }

  const items: SpineItem[] = SPINE_SECTIONS.map((sec) => {
    const anchor = document.createElement('a');
    anchor.href = `#${sec.id}`;
    anchor.setAttribute('aria-label', `Ir a ${sec.label}`);
    anchor.className = 'pointer-events-auto absolute cursor-pointer z-50';
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetEl = document.getElementById(sec.id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
    overlay.appendChild(anchor);

    const rawChars = Array.from(sec.label);
    const chars: CharItem[] = rawChars.map((ch, charIdx) => {
      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.className = 'wordmark absolute top-0 left-0 whitespace-pre font-bold select-none tracking-tight pointer-events-none';
      span.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      span.style.fontSize = `${BASE_FONT_SIZE}px`;
      span.style.lineHeight = '1';
      span.style.willChange = 'transform, opacity';
      span.textContent = ch;
      overlay.appendChild(span);

      const rawW = ctx ? ctx.measureText(ch).width : BASE_FONT_SIZE * 0.6;
      const width = ch === ' ' ? BASE_FONT_SIZE * 0.35 : Math.max(9, rawW * 1.05);

      return {
        el: span,
        width,
        charIdx,
        smoothX: 0,
        smoothY: 0,
        smoothRot: 0,
        smoothScale: SCALE_STACK,
        initialized: false,
      };
    });

    const totalWidth = chars.reduce((acc, c) => acc + c.width, 0);

    return {
      sec,
      anchor,
      chars,
      totalWidth,
      sectionEl: document.getElementById(sec.id),
      smoothTargetDock: 0,
    };
  });

  // Si las fuentes web cargan después, recalcular anchos
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (ctx) {
        ctx.font = `800 ${BASE_FONT_SIZE}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      }
      items.forEach((item) => {
        let newTotal = 0;
        item.chars.forEach((c) => {
          const ch = c.el.textContent || '';
          const rawW = ctx ? ctx.measureText(ch).width : BASE_FONT_SIZE * 0.6;
          c.width = ch === ' ' ? BASE_FONT_SIZE * 0.35 : Math.max(9, rawW * 1.05);
          newTotal += c.width;
        });
        item.totalWidth = newTotal;
      });
    });
  }

  let animationFrameId: number | null = null;
  let isDestroyed = false;

  function renderFrame() {
    if (isDestroyed) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Desactivar render en móviles (< 768px)
    if (vw < 768) {
      items.forEach((item) => {
        item.anchor.style.display = 'none';
        item.chars.forEach((c) => {
          c.el.style.display = 'none';
        });
      });
      animationFrameId = requestAnimationFrame(renderFrame);
      return;
    } else {
      items.forEach((item) => {
        item.anchor.style.display = 'block';
        item.chars.forEach((c) => {
          c.el.style.display = 'block';
        });
      });
    }

    const isDark = !document.documentElement.classList.contains('light');
    const computed = getComputedStyle(document.documentElement);
    const tokenCyan = computed.getPropertyValue('--accent-cyan').trim() || (isDark ? '#06b6d4' : '#0284c7');
    const tokenText = computed.getPropertyValue('--text-primary').trim() || (isDark ? '#cbd5e1' : '#0f172a');

    const isTablet = vw >= 768 && vw < 1024;
    const rightEdge = isTablet ? vw - 44 : vw - 48;
    const railX = vw - 20; // Centro exacto del carril de 40px (w-10)
    const topBaseY = isTablet ? 64 : 72;
    const bottomBaseY = vh - 36;
    const stackStepY = isTablet ? 15 : 18;

    // Detección de proximidad al final del documento para acople suave de la última sección
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const remainingScroll = Math.max(0, maxScroll - scrollTop);
    const bottomThreshold = Math.min(350, vh * 0.45);
    const bottomBoost = clamp01((bottomThreshold - remainingScroll) / Math.max(1, bottomThreshold));

    // Calcular progreso continuo P in [0, 2] por sección:
    // P = 0.0 -> Pila inferior horizontal (0°, escala 0.46)
    // P = 1.0 -> Riel vertical (-90°, escala 0.58)
    // P = 2.0 -> Pila superior horizontal (0°, escala 0.46 / 1.0 activo)
    const progresses = items.map((item, idx) => {
      if (!item.sectionEl) {
        item.sectionEl = document.getElementById(item.sec.id);
      }
      if (!item.sectionEl) return 0;

      const rect = item.sectionEl.getBoundingClientRect();

      // Etapa 1 (0 -> 1): Despega de la pila inferior (0°) al riel vertical (-90°)
      const stage1Start = vh * 1.48;
      const stage1End = vh * 0.85;
      const p1 = clamp01((stage1Start - rect.top) / Math.max(1, stage1Start - stage1End));

      // Etapa 2 (1 -> 2): Gira en abanico curvo hacia el stack superior (0°)
      const stage2Start = vh * 0.85;
      const stage2End = 80;
      const p2 = clamp01((stage2Start - rect.top) / Math.max(1, stage2Start - stage2End));

      const normalP = p1 + p2;
      const isLastSection = idx === items.length - 1;

      // Si es la última sección y se alcanza el fondo del scroll, se completa fluidamente a 2.0
      if (isLastSection && bottomBoost > 0) {
        return Math.max(normalP, lerp(normalP, 2.0, bottomBoost));
      }

      return normalP;
    });

    let cumulativeTopRows = 0;
    const bottomWeights = progresses.map((p) => clamp01(1 - p));
    let remainingBottomRows = bottomWeights.reduce((acc, w) => acc + w, 0);

    items.forEach((item, idx) => {
      const rawP = progresses[idx];
      item.smoothTargetDock += (rawP - item.smoothTargetDock) * 0.18;
      const P = item.smoothTargetDock;

      const pStage1 = clamp01(P);
      const pStage2 = clamp01(P - 1);

      const nextStage2 = idx < items.length - 1 ? clamp01(progresses[idx + 1] - 1) : 0;
      const activeProminence = clamp01(pStage2 * 1.4) * (1 - clamp01(nextStage2 * 1.35));

      // 1) Coordenadas Y de pila superior (0°)
      const topStackY = topBaseY + cumulativeTopRows * stackStepY;
      const finalTopY = topStackY + activeProminence * 16;
      cumulativeTopRows += clamp01(pStage2 * 1.25);

      // 2) Coordenadas Y de pila inferior (0°)
      const myBottomWeight = bottomWeights[idx];
      remainingBottomRows -= myBottomWeight;
      const bottomStackY = bottomBaseY - remainingBottomRows * stackStepY;

      // 3) Coordenada Y en el riel vertical (-90°)
      const totalRailH = item.totalWidth * SCALE_RAIL;
      const railCenterY = vh * 0.58;
      const startRailY = railCenterY + totalRailH / 2;

      const topHorizScale = lerp(SCALE_STACK, isTablet ? SCALE_ACTIVE * 0.82 : SCALE_ACTIVE, activeProminence);
      const totalTopW = item.totalWidth * topHorizScale;
      const startTopX = rightEdge - totalTopW;

      const totalBottomW = item.totalWidth * SCALE_STACK;
      const startBottomX = rightEdge - totalBottomW;

      let bottomCursor = 0;
      let railCursor = 0;
      let topCursor = 0;
      const N = item.chars.length;

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      item.chars.forEach((c, i) => {
        // La última letra (la más alta en -90°) lidera el giro
        const reverseOrder = (N - 1 - i) / Math.max(1, N - 1);
        const staggerSpan = 0.38;
        const charWindow = 1 - staggerSpan;
        const charStart = reverseOrder * staggerSpan;

        const t1 = easeInOutCubic(clamp01((pStage1 - charStart) / Math.max(0.05, charWindow)));
        const t2 = easeInOutCubic(clamp01((pStage2 - charStart) / Math.max(0.05, charWindow)));

        // Posición 0: Abajo en horizontal (0°)
        const botHalfW = (c.width * SCALE_STACK) / 2;
        const x0 = startBottomX + bottomCursor + botHalfW;
        const y0 = bottomStackY;
        bottomCursor += c.width * SCALE_STACK;

        // Posición 1: Riel vertical derecho (-90°)
        const railHalfW = (c.width * SCALE_RAIL) / 2;
        const x1 = railX;
        const y1 = startRailY - railCursor - railHalfW;
        railCursor += c.width * SCALE_RAIL;

        // Posición 2: Arriba en horizontal (0°)
        const topHalfW = (c.width * topHorizScale) / 2;
        const x2 = startTopX + topCursor + topHalfW;
        const y2 = finalTopY;
        topCursor += c.width * topHorizScale;

        let targetX: number, targetY: number, targetRot: number, targetScale: number;
        if (P <= 1) {
          // Fase 1: Abajo (0°) -> Riel vertical (-90°) con arco
          const arc1 = Math.sin(t1 * Math.PI) * (20 + (N - i) * 2.2);
          targetX = lerp(x0, x1, t1) - arc1;
          targetY = lerp(y0, y1, t1);
          targetRot = lerp(0, -90, t1);
          targetScale = lerp(SCALE_STACK, SCALE_RAIL, t1);
        } else {
          // Fase 2: Riel (-90°) -> Abanico curvo a horizontal (0°)
          const arc2 = Math.sin(t2 * Math.PI) * (34 + (N - i) * 3.8);
          targetX = lerp(x1, x2, t2) - arc2;
          targetY = lerp(y1, y2, t2);
          targetRot = lerp(-90, 0, t2);
          targetScale = lerp(SCALE_RAIL, topHorizScale, t2);
        }

        if (!c.initialized) {
          c.smoothX = targetX;
          c.smoothY = targetY;
          c.smoothRot = targetRot;
          c.smoothScale = targetScale;
          c.initialized = true;
        } else {
          c.smoothX += (targetX - c.smoothX) * 0.18;
          c.smoothY += (targetY - c.smoothY) * 0.18;
          c.smoothRot += (targetRot - c.smoothRot) * 0.18;
          c.smoothScale += (targetScale - c.smoothScale) * 0.18;
        }

        const swingGlow = P <= 1 ? Math.sin(t1 * Math.PI) * 0.45 : Math.sin(t2 * Math.PI) * 0.85;
        const isHighlight = activeProminence > 0.35;

        if (isHighlight) {
          c.el.style.color = tokenCyan; // Token de acento centralizado
          c.el.style.opacity = '1';
          c.el.style.textShadow = isDark
            ? '0 0 12px rgba(6, 182, 212, 0.6), 0 0 20px rgba(99, 102, 241, 0.4)'
            : '0 0 8px rgba(2, 132, 199, 0.25), 0 0 14px rgba(79, 70, 229, 0.2)';
        } else {
          c.el.style.color = tokenText; // Token de texto centralizado
          c.el.style.textShadow = 'none';
          const alpha = isDark
            ? lerp(0.35, 0.85, Math.max(activeProminence, swingGlow))
            : lerp(0.55, 0.95, Math.max(activeProminence, swingGlow));
          c.el.style.opacity = alpha.toFixed(3);
        }

        c.el.style.transform = `translate3d(${c.smoothX.toFixed(2)}px, ${c.smoothY.toFixed(2)}px, 0px) translate(-50%, -50%) rotate(${c.smoothRot.toFixed(2)}deg) scale(${c.smoothScale.toFixed(5)})`;

        minX = Math.min(minX, c.smoothX - 14);
        maxX = Math.max(maxX, c.smoothX + 14);
        minY = Math.min(minY, c.smoothY - 14);
        maxY = Math.max(maxY, c.smoothY + 14);
      });

      // Hitbox dinámico para el enlace interactivo
      item.anchor.style.left = `${minX.toFixed(1)}px`;
      item.anchor.style.top = `${minY.toFixed(1)}px`;
      item.anchor.style.width = `${Math.max(26, maxX - minX).toFixed(1)}px`;
      item.anchor.style.height = `${Math.max(20, maxY - minY).toFixed(1)}px`;
    });

    animationFrameId = requestAnimationFrame(renderFrame);
  }

  animationFrameId = requestAnimationFrame(renderFrame);

  return () => {
    isDestroyed = true;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    overlay.innerHTML = '';
  };
}
