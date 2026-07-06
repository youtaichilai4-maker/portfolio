"use client";

// Small "signature visual" diagrams for experiences that don't have a real
// screenshot (THz-LTEM keeps its own waveform plot image). Shared wireframe
// aesthetic: 1px strokes, thz-cyan/thz-amber on transparent, mono labels,
// viewBox 200x120 — same stroke weight and label style across all three so
// they read as one system.
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

const CYAN = "#7FE3FF";
const AMBER = "#F5A524";
const MUTED = "#6B7280";
const MONO_FONT = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";

const EASE = [0.22, 1, 0.36, 1] as const;

function useDrawIn() {
    const reduced = useReducedMotion();
    if (reduced) return {};
    return {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 1.1, ease: EASE },
    };
}

function useFadeIn(delay = 0) {
    const reduced = useReducedMotion();
    if (reduced) return {};
    return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.7, delay, ease: EASE },
    };
}

// Pineal — a markdown source assembling into a slide frame.
export function PinealVisual() {
    const draw = useDrawIn();
    const fade = useFadeIn(0.4);
    return (
        <svg
            viewBox="0 0 200 120"
            className="w-full h-auto"
            role="img"
            aria-label="markdown ファイルからスライドのレイアウトが自動で組み上がる様子を示す模式図"
        >
            {/* source file */}
            <rect x="8" y="34" width="42" height="50" rx="2" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.8" />
            <line x1="15" y1="45" x2="43" y2="45" stroke={CYAN} strokeWidth="1" opacity="0.5" />
            <line x1="15" y1="53" x2="37" y2="53" stroke={CYAN} strokeWidth="1" opacity="0.5" />
            <line x1="15" y1="61" x2="41" y2="61" stroke={CYAN} strokeWidth="1" opacity="0.5" />
            <line x1="15" y1="69" x2="31" y2="69" stroke={CYAN} strokeWidth="1" opacity="0.5" />
            <text x="29" y="98" textAnchor="middle" fontSize="7" fill={CYAN} fontFamily={MONO_FONT} opacity="0.8">
                .md
            </text>

            {/* dashed arrow */}
            <motion.path d="M52 58 H88" stroke={AMBER} strokeWidth="1" strokeDasharray="3 3" fill="none" {...draw} />
            <path d="M88 58 L82 54 M88 58 L82 62" stroke={AMBER} strokeWidth="1" fill="none" />

            {/* slide frame */}
            <rect x="94" y="20" width="98" height="74" rx="2" fill="none" stroke={CYAN} strokeWidth="1.2" />
            <rect x="102" y="28" width="82" height="10" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.7" />
            <motion.g {...fade}>
                <rect x="102" y="44" width="36" height="34" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.6" />
                <rect x="142" y="44" width="42" height="15" fill="none" stroke={AMBER} strokeWidth="1" opacity="0.95" />
                <rect x="142" y="63" width="42" height="15" fill="none" stroke={CYAN} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            </motion.g>

            <text x="100" y="112" textAnchor="middle" fontSize="7" fill={MUTED} fontFamily={MONO_FONT}>
                slide.md → render()
            </text>
        </svg>
    );
}

// KK-Generation — a floor-plan fragment with detection bounding boxes.
export function KkGenerationVisual() {
    const draw = useDrawIn();
    const fade = useFadeIn(0.35);
    const dots: JSX.Element[] = [];
    for (let x = 12; x <= 188; x += 22) {
        for (let y = 12; y <= 96; y += 21) {
            dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill={MUTED} opacity="0.35" />);
        }
    }
    return (
        <svg
            viewBox="0 0 200 120"
            className="w-full h-auto"
            role="img"
            aria-label="建築図面の壁線を検出し、梁・柱の候補領域をバウンディングボックスで示す模式図"
        >
            {dots}
            <motion.path
                d="M20 18 H150 V58 H180 V100 H20 Z"
                fill="none"
                stroke={CYAN}
                strokeWidth="1.4"
                {...draw}
            />
            <line x1="90" y1="18" x2="90" y2="58" stroke={CYAN} strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="58" x2="90" y2="58" stroke={CYAN} strokeWidth="1" opacity="0.5" />

            <motion.g {...fade}>
                <rect x="30" y="24" width="52" height="10" fill="none" stroke={AMBER} strokeDasharray="3 2" strokeWidth="1" />
                <text x="56" y="21" textAnchor="middle" fontSize="7" fill={AMBER} fontFamily={MONO_FONT}>
                    beam
                </text>

                <rect x="142" y="66" width="14" height="14" fill="none" stroke={AMBER} strokeDasharray="3 2" strokeWidth="1" />
                <text x="149" y="90" textAnchor="middle" fontSize="7" fill={AMBER} fontFamily={MONO_FONT}>
                    column
                </text>

                <rect x="96" y="72" width="40" height="10" fill="none" stroke={AMBER} strokeDasharray="3 2" strokeWidth="1" />
                <text x="116" y="97" textAnchor="middle" fontSize="7" fill={AMBER} fontFamily={MONO_FONT}>
                    wall
                </text>
            </motion.g>

            <text x="100" y="112" textAnchor="middle" fontSize="7" fill={MUTED} fontFamily={MONO_FONT}>
                detect(plan) → bbox
            </text>
        </svg>
    );
}

// PaperLens — lines of text with a highlighted span and a translation popover.
export function PaperLensVisual() {
    const fade = useFadeIn(0);
    const popover = useFadeIn(0.3);
    const lineWidths = [118, 150, 92, 128, 68];
    return (
        <svg
            viewBox="0 0 200 120"
            className="w-full h-auto"
            role="img"
            aria-label="英文の一部をハイライトし、その場に翻訳を表示するポップオーバーを示す模式図"
        >
            {lineWidths.map((w, i) => (
                <motion.rect
                    key={i}
                    x="10"
                    y={12 + i * 13}
                    width={w}
                    height="6"
                    rx="3"
                    fill="none"
                    stroke={CYAN}
                    strokeWidth="1"
                    opacity={i === 2 ? 1 : 0.45}
                    {...(i === 2 ? {} : fade)}
                />
            ))}
            {/* highlighted span inside the middle line */}
            <rect x="44" y="38" width="42" height="6" rx="3" fill="rgba(245,165,36,0.16)" stroke={AMBER} strokeWidth="1" />

            <motion.g {...popover}>
                <path d="M58 50 L66 58 L74 50" fill="none" stroke={AMBER} strokeWidth="1" />
                <rect x="26" y="58" width="98" height="26" rx="4" fill="#0B0D10" stroke={AMBER} strokeWidth="1" />
                <text x="75" y="74" textAnchor="middle" fontSize="7" fill="#E5E7EB" fontFamily={MONO_FONT}>
                    速度低下の要因
                </text>
            </motion.g>

            <text x="100" y="112" textAnchor="middle" fontSize="7" fill={MUTED} fontFamily={MONO_FONT}>
                select → translate() → popover
            </text>
        </svg>
    );
}
