import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        fg: "#ffffff",
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,.25)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "Segoe UI", "Helvetica", "Arial"]
      }
    },
  },
  plugins: [],
} satisfies Config
