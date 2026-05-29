import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090b10",
        panel: "#10141d",
        panelSoft: "#151b27",
        line: "#252d3b",
        textSoft: "#9ba7b7",
        brand: "#2dd4bf",
        gold: "#f4c95d",
        danger: "#fb7185"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(45, 212, 191, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
