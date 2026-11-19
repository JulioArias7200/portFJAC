import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  duration?: number;
  variant?: "default" | "square" | "circle" | string;
}

export function AnimatedThemeToggler({
  className,
  duration = 450,
  variant = "default",
  ...props
}: AnimatedThemeTogglerProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return !document.documentElement.classList.contains("light");
    }
    return true;
  });

  useEffect(() => {
    const syncWithDOM = () => {
      const isDocDark = !document.documentElement.classList.contains("light");
      setIsDark(isDocDark);
    };

    syncWithDOM();
    window.addEventListener("themechange", syncWithDOM);
    return () => {
      window.removeEventListener("themechange", syncWithDOM);
    };
  }, []);

  const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Leemos el estado real del DOM directamente en cada clic para garantizar respuesta inmediata
    const isCurrentlyDark = !document.documentElement.classList.contains("light");
    const nextDark = !isCurrentlyDark;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const updateDOM = () => {
      setIsDark(nextDark);
      if (nextDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
      window.dispatchEvent(new Event("themechange"));
    };

    // Fallback if browser does not support View Transitions API
    if (!("startViewTransition" in document)) {
      updateDOM();
      return;
    }

    // @ts-ignore - document.startViewTransition is native in modern browsers
    const transition = document.startViewTransition(updateDOM);

    try {
      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch {
      // Fallback in case transition gets aborted
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={cn(
        "relative p-2 border border-white/10 bg-slate-900/80 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all shadow-md active:scale-95 shrink-0",
        variant === "square" ? "rounded-lg" : variant === "circle" ? "rounded-full" : "rounded-xl",
        className
      )}
      {...props}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

export default AnimatedThemeToggler;
