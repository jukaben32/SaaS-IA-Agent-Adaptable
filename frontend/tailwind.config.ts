import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0B3D2E",
          light: "#12503D",
          dark: "#082A20",
        },
        sand: "#F7F5EF",
        ink: "#1A1A18",
        muted: "#6B6B63",
        line: "#E8E4D9",
        accent: {
          DEFAULT: "#16A34A",
          dark: "#0F7A38",
        },
        clay: "#D97757",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,61,46,0.04), 0 4px 16px rgba(11,61,46,0.06)",
      },
      keyframes: {
        pulseLive: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.4)" },
        },
      },
      animation: {
        "pulse-live": "pulseLive 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
