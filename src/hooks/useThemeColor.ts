"use client";

import { useMemo } from "react";
import { useScrollProgress } from "@/components/ScrollProgressProvider";
import { ScrollTimeline } from "@/enums/scroll.enum";
import { DESIGN_TOKENS } from "@/design-system";

export interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  textMutedColor: string;
  /** 'light' | 'dark' | 'cream' */
  theme: "light" | "dark" | "cream";
}

/**
 * Linearly interpolates between two hex colors.
 */
function lerpColor(colorA: string, colorB: string, t: number): string {
  const parse = (hex: string) => {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      bl: parseInt(clean.substring(4, 6), 16),
    };
  };

  const ca = parse(colorA);
  const cb = parse(colorB);

  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.bl + (cb.bl - ca.bl) * t);

  return `rgb(${r}, ${g}, ${bl})`;
}

/**
 * Maps a scroll progress value (0–1) to the appropriate theme colors.
 * Uses the ScrollTimeline enum to determine which section we're in.
 */
export function useThemeColor(): ThemeColors {
  const { progress } = useScrollProgress();

  return useMemo(() => {
    const { lightMode, darkMode } = DESIGN_TOKENS.colors;
    const cream = DESIGN_TOKENS.colors.accents.cream;

    // Light mode: 0.00 – 0.60 (Hero + AppReveal)
    // Transition to dark: 0.55 – 0.65
    // Dark mode: 0.60 – 0.90 (DarkStorytelling + Philosophy)
    // Transition to cream: 0.85 – 0.95
    // Cream: 0.90 – 1.00 (Waitlist)

    if (progress < ScrollTimeline.AppRevealEnd - 0.05) {
      // Pure light mode
      return {
        backgroundColor: lightMode.background,
        textColor: lightMode.textPrimary,
        textMutedColor: lightMode.textMuted,
        theme: "light",
      };
    }

    if (
      progress >= ScrollTimeline.AppRevealEnd - 0.05 &&
      progress < ScrollTimeline.DarkStoryStart + 0.05
    ) {
      // Transition from light to dark
      const t =
        (progress - (ScrollTimeline.AppRevealEnd - 0.05)) /
        (ScrollTimeline.DarkStoryStart + 0.05 - (ScrollTimeline.AppRevealEnd - 0.05));
      const clampedT = Math.min(Math.max(t, 0), 1);

      return {
        backgroundColor: lerpColor(lightMode.background, darkMode.background, clampedT),
        textColor: lerpColor(lightMode.textPrimary, darkMode.textPrimary, clampedT),
        textMutedColor: clampedT < 0.5 ? lightMode.textMuted : darkMode.textMuted,
        theme: clampedT < 0.5 ? "light" : "dark",
      };
    }

    if (
      progress >= ScrollTimeline.DarkStoryStart + 0.05 &&
      progress < ScrollTimeline.WaitlistStart - 0.05
    ) {
      // Pure dark mode
      return {
        backgroundColor: darkMode.background,
        textColor: darkMode.textPrimary,
        textMutedColor: darkMode.textMuted,
        theme: "dark",
      };
    }

    if (
      progress >= ScrollTimeline.WaitlistStart - 0.05 &&
      progress < ScrollTimeline.WaitlistStart + 0.05
    ) {
      // Transition from dark to cream
      const t =
        (progress - (ScrollTimeline.WaitlistStart - 0.05)) /
        (ScrollTimeline.WaitlistStart + 0.05 - (ScrollTimeline.WaitlistStart - 0.05));
      const clampedT = Math.min(Math.max(t, 0), 1);

      return {
        backgroundColor: lerpColor(darkMode.background, cream, clampedT),
        textColor: lerpColor(darkMode.textPrimary, lightMode.textPrimary, clampedT),
        textMutedColor: clampedT < 0.5 ? darkMode.textMuted : lightMode.textMuted,
        theme: clampedT < 0.5 ? "dark" : "cream",
      };
    }

    // Pure cream (waitlist section)
    return {
      backgroundColor: cream,
      textColor: lightMode.textPrimary,
      textMutedColor: lightMode.textMuted,
      theme: "cream",
    };
  }, [progress]);
}
