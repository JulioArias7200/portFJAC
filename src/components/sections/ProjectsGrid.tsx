import React, { useState } from "react";
import {
  ShoppingCart,
  Orbit,
  Activity,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

// ==============================================================
// 1. E-COMMERCE BACKGROUND: High-Velocity Web & Lighthouse HUD
// ==============================================================
const EcommerceBackground = () => (
  <div className="absolute inset-0 overflow-hidden p-6 flex flex-col justify-center">
    {/* Ambient radial glow */}
    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-44 bg-gradient-to-r from-emerald-500/25 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

    {/* Metric HUD Cards */}
    <div className="relative z-10 grid grid-cols-3 gap-3 max-w-lg mx-auto w-full pt-2">
      <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
        <div className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">LIGHTHOUSE</div>
        <div className="text-xl font-extrabold text-white">
          100<span className="text-xs text-emerald-400 font-medium">/100</span>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
        <div className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">LCP SPEED</div>
        <div className="text-xl font-extrabold text-white">
          0.18<span className="text-xs text-cyan-300 font-medium">s</span>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
        <div className="text-[10px] font-mono text-indigo-400 font-bold tracking-wider">BUNDLE JS</div>
        <div className="text-xl font-extrabold text-white">
          -78<span className="text-xs text-indigo-300 font-medium">%</span>
        </div>
      </div>
    </div>
  </div>
);

// ==============================================================
// 2. 3D ORBITS BACKGROUND: Concentric GLSL Rings & Coordinate HUD
// ==============================================================
const Orbit3DBackground = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
    {/* Electric cyan ambient halo */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-cyan-500/25 rounded-full blur-3xl" />

    <svg className="w-56 h-56 animate-[spin_35s_linear_infinite]" viewBox="0 0 200 200">
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="4 4"
        className="text-cyan-400/50"
      />
      <circle
        cx="100"
        cy="100"
        r="50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-indigo-400/60"
      />
      <circle
        cx="100"
        cy="100"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 3"
        className="text-white/40"
      />
      <circle cx="100" cy="25" r="4.5" className="fill-cyan-300 filter drop-shadow-[0_0_6px_#06b6d4]" />
      <circle cx="150" cy="100" r="3.5" className="fill-indigo-400 filter drop-shadow-[0_0_4px_#6366f1]" />
      <circle cx="80" cy="120" r="2.5" className="fill-white" />
    </svg>

    <div className="absolute bottom-4 right-4 font-mono text-[9px] text-cyan-300 bg-slate-950/90 px-2.5 py-1 rounded-md border border-cyan-500/40 shadow-md">
      WebGL // 60 FPS GLSL
    </div>
  </div>
);

// ==============================================================
// 3. IOT TELEMETRY BACKGROUND: High-Luminosity Waveform & Ping
// ==============================================================
const TelemetryBackground = () => (
  <div className="absolute inset-0 overflow-hidden p-6 flex flex-col justify-center">
    {/* Vibrant Indigo & Emerald Ambient Light */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-44 bg-gradient-to-tr from-indigo-500/30 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 space-y-3">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          WS LIVE
        </span>
        <span className="text-cyan-300 font-semibold bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
          LATENCY: 22ms
        </span>
      </div>

      {/* High-luminance visual frequency bars */}
      <div className="flex items-end gap-1.5 h-16 w-full pt-1">
        {[45, 80, 60, 95, 65, 90, 50, 100, 75, 85, 55, 70, 92, 78].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 rounded-t bg-gradient-to-t from-indigo-500/40 via-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
          />
        ))}
      </div>
    </div>
  </div>
);

// ==============================================================
// 4. AI VECTOR SEARCH BACKGROUND: Purple Neural Graph & Embeddings
// ==============================================================
const VectorSearchBackground = () => (
  <div className="absolute inset-0 overflow-hidden p-6 flex items-center justify-center">
    {/* Royal purple ambient halo */}
    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-72 h-44 bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 grid grid-cols-2 gap-3 max-w-md w-full">
      <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-lg shadow-purple-500/10 backdrop-blur-md">
        <div className="text-[10px] font-mono text-purple-400 font-bold">EMBEDDINGS DIM</div>
        <div className="text-sm font-extrabold text-white mt-0.5">1536 (Ada-002)</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
        <div className="text-[10px] font-mono text-emerald-400 font-bold">COSINE MATCH</div>
        <div className="text-sm font-extrabold text-white mt-0.5">0.9942 Score</div>
      </div>
      <div className="col-span-2 p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 flex items-center justify-between text-xs font-mono shadow-md">
        <span className="text-slate-300">Vector Store:</span>
        <span className="text-cyan-300 font-bold">Qdrant Cluster (500k Vecs)</span>
      </div>
    </div>
  </div>
);

// ==============================================================
// 5. CREATIVE SHOWCASE BACKGROUND: Cinematic Motion & SOTD
// ==============================================================
const CreativeShowcaseBackground = () => (
  <div className="absolute inset-0 overflow-hidden p-6 flex items-center justify-center">
    {/* Vibrant Pink / Purple Spotlight */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-44 bg-gradient-to-r from-pink-500/25 via-purple-500/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div className="flex-1 p-3 rounded-xl bg-gradient-to-r from-indigo-900/70 to-purple-900/70 border border-pink-500/40 shadow-lg shadow-pink-500/15 backdrop-blur-md">
        <div className="text-[10px] font-mono text-pink-300 font-bold tracking-wider">AWWWARDS</div>
        <div className="text-xs font-bold text-white mt-0.5">Site of the Day Nominee</div>
      </div>
      <div className="flex-1 p-3 rounded-xl bg-gradient-to-r from-purple-900/70 to-cyan-900/70 border border-cyan-500/40 shadow-lg shadow-cyan-500/15 backdrop-blur-md">
        <div className="text-[10px] font-mono text-cyan-300 font-bold tracking-wider">GSAP MOTION</div>
        <div className="text-xs font-bold text-white mt-0.5">Cinematic Timelines</div>
      </div>
    </div>
  </div>
);

// ==============================================================
// 6. PORTFOLIO TEMPLATE BACKGROUND: Developer Code Terminal
// ==============================================================
const TerminalBackground = () => (
  <div className="absolute inset-0 overflow-hidden p-5 flex items-center justify-center">
    {/* Blue & Cyan Ambient Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 w-full max-w-xs rounded-xl bg-slate-950/90 border border-white/15 p-3.5 text-[11px] font-mono space-y-2 shadow-xl">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] text-slate-400 ml-1.5">astro.config.mjs</span>
      </div>
      <div className="text-slate-300 font-medium">$ pnpm create astro@latest</div>
      <div className="text-cyan-300">&gt; Islands: Client-Visible</div>
      <div className="text-emerald-400 font-semibold">&gt; CPU Block: 0ms // 100 FPS</div>
    </div>
  </div>
);

// ==============================================================
// DATA DE PROYECTOS (BREAKPOINTS UNIFICADOS A col-span-1 lg:col-span-2)
// ==============================================================
const projectsData = [
  {
    name: "E-Commerce de Ultravelocidad",
    category: "astro",
    badge: "Astro + Islands",
    metric: "100/100 Core Vitals",
    description:
      "Plataforma de comercio electrónico con arquitectura de islas híbridas, carrito hidratado de forma diferida con client:visible y pagos integrados con Stripe.",
    tags: ["Astro", "Tailwind CSS", "Stripe API", "TypeScript"],
    href: "#",
    repoUrl: "https://github.com",
    year: "2026",
    className: "col-span-1 lg:col-span-2",
    Icon: ShoppingCart,
    background: <EcommerceBackground />,
  },
  {
    name: "Visualizador 3D de Órbitas",
    category: "creative",
    badge: "Three.js / WebGL",
    metric: "60 FPS Constantes",
    description:
      "Simulador interactivo en tiempo real con shaders GLSL personalizados, iluminación física y trayectorias orbitales proyectadas en Canvas.",
    tags: ["Three.js", "WebGL", "GLSL Shaders", "GSAP"],
    href: "#",
    repoUrl: "https://github.com",
    year: "2025",
    className: "col-span-1 lg:col-span-1",
    Icon: Orbit,
    background: <Orbit3DBackground />,
  },
  {
    name: "Dashboard IoT en Vivo",
    category: "fullstack",
    badge: "Fullstack & Sockets",
    metric: "<25ms Latencia",
    description:
      "Panel de control industrial con consumo de WebSockets binarios, renderizado de series temporales de alta velocidad y alertas automatizadas.",
    tags: ["React", "Node.js", "Canvas API", "Redis"],
    href: "#",
    repoUrl: "https://github.com",
    year: "2025",
    className: "col-span-1 lg:col-span-1",
    Icon: Activity,
    background: <TelemetryBackground />,
  },
  {
    name: "Motor de Búsqueda Vectorial",
    category: "fullstack",
    badge: "AI & RAG",
    metric: "500k Vectores",
    description:
      "Microservicio distribuido en Node.js y Qdrant con caché multinivel para recuperación aumentada de contexto en lenguaje natural.",
    tags: ["TypeScript", "Qdrant", "Redis", "Fastify"],
    href: "#",
    repoUrl: "https://github.com",
    year: "2026",
    className: "col-span-1 lg:col-span-2",
    Icon: Sparkles,
    background: <VectorSearchBackground />,
  },
  {
    name: "Showcase Creativo Awwwards",
    category: "creative",
    badge: "GSAP + ScrollTrigger",
    metric: "Microinteracciones",
    description:
      "Diseño experimental para agencia digital con distorsiones de imagen al hacer scroll, transiciones de pantalla cinemáticas y tipografía reactiva.",
    tags: ["Astro", "GSAP", "Vanilla JS", "Tailwind"],
    href: "#",
    repoUrl: "https://github.com",
    year: "2025",
    className: "col-span-1 lg:col-span-2",
    Icon: Layers,
    background: <CreativeShowcaseBackground />,
  },
  {
    name: "Plantilla de Portafolio JACDev",
    category: "astro",
    badge: "Astro + Three.js",
    metric: "Cero Bloqueo de CPU",
    description:
      "Esqueleto de portafolio para desarrolladores creativos que combina Three.js procedural y animaciones GSAP sin sacrificar el rendimiento SEO.",
    tags: ["Astro", "Three.js", "GSAP", "TypeScript"],
    href: "#",
    repoUrl: "https://github.com",
    year: "2026",
    className: "col-span-1 lg:col-span-1",
    Icon: Code2,
    background: <TerminalBackground />,
  },
];

const categories = [
  { id: "all", label: "Todos" },
  { id: "astro", label: "Astro" },
  { id: "creative", label: "Three.js & 3D" },
  { id: "fullstack", label: "Fullstack" },
];

export function ProjectsGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects =
    activeCategory === "all"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer font-semibold shadow-sm ${
                isActive
                  ? "bg-btn-primary text-btn-primary-fg shadow-[var(--btn-primary-shadow)] border border-accent-indigo/50"
                  : "bg-surface border border-border-subtle text-content-muted hover:text-content-primary hover:border-border-medium"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Bento Grid layout */}
      <BentoGrid>
        {filteredProjects.map((project) => (
          <BentoCard key={project.name} {...project} />
        ))}
      </BentoGrid>
    </div>
  );
}

export default ProjectsGrid;
