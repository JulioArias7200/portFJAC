import React, { type ComponentType, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[27rem] [grid-auto-flow:dense]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: ComponentType<{ className?: string }>;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
  metric?: string;
  tags?: string[];
  repoUrl?: string;
  year?: string;
  category?: string;
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href = "#",
  cta = "Live Demo",
  badge,
  metric,
  tags = [],
  repoUrl,
  year,
  category,
}: BentoCardProps) {
  return (
    <div
      data-category={category}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300",
        // Ambient background gradient with surface depth
        "bg-gradient-to-b from-[#15192c] via-[#0f121e] to-[#0a0c16]",
        // Border lighting: top border reflects light, smooth borders around
        "border border-white/10 border-t-white/25 hover:border-indigo-500/50 shadow-xl hover:shadow-indigo-500/10",
        // Light mode support
        "html.light:bg-white html.light:border-slate-200/80 html.light:shadow-md",
        className
      )}
    >
      {/* ============================================================== */}
      {/* 1. UPPER DISPLAY SHOWCASE (52% Height) - Visual & Background */}
      {/* ============================================================== */}
      <div className="relative h-52 w-full overflow-hidden border-b border-white/5 bg-slate-950/40">
        {/* Background graphic */}
        <div className="absolute inset-0 pointer-events-none">
          {background}
        </div>

        {/* Soft bottom vignette to gracefully bridge into content */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f121e] to-transparent pointer-events-none" />

        {/* Top Badges & Metric HUD */}
        <div className="relative z-10 p-5 flex items-center justify-between text-[11px] font-mono pointer-events-none">
          {badge ? (
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 text-indigo-300 shadow-md backdrop-blur-md font-semibold tracking-wide">
              {badge}
            </span>
          ) : (
            <span />
          )}
          {metric && (
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold shadow-md backdrop-blur-md">
              {metric}
            </span>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. LOWER EDITORIAL ZONE (48% Height) - Crisp, High-Contrast    */}
      {/* ============================================================== */}
      <div className="relative p-6 flex flex-col justify-between flex-1 z-10">
        {/* Title and Icon */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-all duration-300 shrink-0 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
              {name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags and Action Bar */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          {/* Tech Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/90 border border-white/10 text-slate-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2">
            {href && (
              <a
                href={href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <span>{cta}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-white/15 text-slate-300 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Subtle hover spotlight effect */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-indigo-500/[0.04] to-cyan-500/[0.04]" />
    </div>
  );
}

export default BentoGrid;
