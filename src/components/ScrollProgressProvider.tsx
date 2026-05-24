"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import Lenis from "lenis";

interface ScrollProgressContextValue {
  /** Normalized scroll progress from 0 to 1 */
  progress: number;
  /** Current scroll position in pixels */
  scrollY: number;
  /** Total scrollable height */
  totalHeight: number;
}

const ScrollProgressContext = createContext<ScrollProgressContextValue>({
  progress: 0,
  scrollY: 0,
  totalHeight: 0,
});

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}

export default function ScrollProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const updateProgress = useCallback(() => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentY = window.scrollY;
    const pct = scrollableHeight > 0 ? currentY / scrollableHeight : 0;
    setProgress(Math.min(Math.max(pct, 0), 1));
    setScrollY(currentY);
    setTotalHeight(scrollableHeight);
  }, []);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update progress on each Lenis scroll
    lenis.on("scroll", () => {
      updateProgress();
    });

    // Initial calculation
    setTimeout(updateProgress, 100);

    // Recalculate on resize
    window.addEventListener("resize", updateProgress);

    return () => {
      lenis.destroy();
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  return (
    <ScrollProgressContext.Provider
      value={{ progress, scrollY, totalHeight }}
    >
      {children}
    </ScrollProgressContext.Provider>
  );
}
