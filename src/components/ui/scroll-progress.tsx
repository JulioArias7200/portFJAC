import { cn } from "@/lib/utils";
import { motion, useScroll, type HTMLMotionProps } from "motion/react";

interface ScrollProgressProps extends HTMLMotionProps<"div"> {
  className?: string;
}

export function ScrollProgress({ className, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-300 origin-left pointer-events-none",
        className
      )}
      {...props}
    />
  );
}
