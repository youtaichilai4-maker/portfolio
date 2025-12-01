import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ["var(--font-jetbrains-mono)", "Courier New", "monospace"],
            },
            colors: {
                "neon-cyan": "#06b6d4",
                "neon-purple": "#8b5cf6",
                "deep-black": "#030712",
            },
            backgroundImage: {
                "circuit-grid": "linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)",
            },
            backgroundSize: {
                "circuit-grid": "50px 50px",
            },
            animation: {
                "glow": "glow 2s ease-in-out infinite alternate",
                "float": "float 6s ease-in-out infinite",
                "grid-pulse": "grid-pulse 4s ease-in-out infinite",
                "mesh-move": "mesh-move 20s ease-in-out infinite",
            },
            keyframes: {
                glow: {
                    "0%": { "text-shadow": "0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #06b6d4" },
                    "100%": { "text-shadow": "0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4, 0 0 40px #8b5cf6" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                "grid-pulse": {
                    "0%, 100%": { opacity: "0.3" },
                    "50%": { opacity: "0.6" },
                },
                "mesh-move": {
                    "0%, 100%": {
                        transform: "translate(0, 0) scale(1)",
                        opacity: "1",
                    },
                    "33%": {
                        transform: "translate(2%, 2%) scale(1.05)",
                        opacity: "0.8",
                    },
                    "66%": {
                        transform: "translate(-2%, -2%) scale(0.95)",
                        opacity: "0.9",
                    },
                },
            },
        },
    },
    plugins: [],
};
export default config;


