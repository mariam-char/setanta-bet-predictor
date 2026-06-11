import type { Config } from "tailwindcss";

/**
 * Design tokens — Setanta Bet brand ("Stay in the Game").
 * Setanta black canvas, Setanta yellow primary, Setanta red secondary,
 * glassmorphism surfaces.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#0D0D0D", // page background — Setanta black
          900: "#141414",
          800: "#1C1C1E",
          700: "#26262A",
          600: "#323238",
        },
        volt: {
          DEFAULT: "#FFD200", // primary accent — Setanta yellow
          dim: "#CCA800",
          glow: "rgba(255,210,0,0.35)",
        },
        broadcast: {
          DEFAULT: "#FA5C5C", // secondary — Setanta red
          deep: "#B23B3B",
        },
        danger: "#FF3B57",
        gold: "#FFC83D",
        ink: {
          DEFAULT: "#F4F6FB",
          dim: "#9AA3B8",
          faint: "#5B6478",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
        chip: "0.75rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        voltGlow: "0 0 24px rgba(255,210,0,0.25)",
        lift: "0 16px 48px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "stadium-radial":
          "radial-gradient(1200px 600px at 50% -10%, rgba(250,92,92,0.12), transparent 60%), radial-gradient(900px 500px at 85% 110%, rgba(255,210,0,0.06), transparent 55%)",
        "pitch-lines":
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0 80px, rgba(255,255,255,0.035) 80px 160px)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        floatUp: "floatUp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
