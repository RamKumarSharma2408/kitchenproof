import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Token-mapped colors (dark-organic) ──────────────
        bg:           "var(--bg)",
        surface:      "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        "text-base":  "var(--text)",
        "text-muted": "var(--text-muted)",
        accent:       "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        warning:      "var(--warning)",
        danger:       "var(--danger)",
        info:         "var(--info)",
        "border-subtle":  "var(--border-subtle)",
        "border-strong":  "var(--border-strong)",
        "focus-ring": "var(--focus-ring)",

        // ── Legacy palette — keep for components not yet migrated ──
        forest: {
          DEFAULT: "#1F3D2E",
          dark:    "#122A1F",
          light:   "#2B5240",
        },
        brand: {
          50:  "#F0F6F2",
          100: "#DCE9E0",
          200: "#B8D4C2",
          300: "#8CBA9D",
          400: "#5D9C75",
          500: "#3B8155",
          600: "#2B6843",
          700: "#1E4F32",
          800: "#163E27",
          900: "#0F2E1D",
          950: "#081C11",
        },
        amber: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        crimson: {
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
        },
      },
      fontFamily: {
        sans:  ["var(--font-source-sans)", "Source Sans 3", "Segoe UI", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "Cambria", "serif"],
        mono:  ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle:   "0 1px 3px 0 rgba(0,0,0,0.3)",
        card:     "0 2px 8px 0 rgba(0,0,0,0.35), 0 1px 2px 0 rgba(0,0,0,0.2)",
        elevated: "0 8px 24px -4px rgba(0,0,0,0.5), 0 2px 6px -1px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
