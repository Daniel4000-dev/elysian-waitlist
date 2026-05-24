export const DESIGN_TOKENS = {
  colors: {
    lightMode: {
      background: "#FFFFFF",
      textPrimary: "#000000",
      textMuted: "rgba(0, 0, 0, 0.60)",
    },
    darkMode: {
      background: "#0B0B0B",
      textPrimary: "#FFFFFF",
      textMuted: "rgba(255, 255, 255, 0.60)",
    },
    accents: {
      cream: "#F9F6F0",
    }
  },
  spacing: {
    sectionPadding: "clamp(4rem, 8vw, 12rem)",
    elementGap: "1.5rem",
  },
  typography: {
    fontFamily: "var(--font-sfpro)", // In real implementation we'll use a local or google font
    trackingTight: "-0.04em",
    trackingTighter: "-0.06em",
  }
} as const;
