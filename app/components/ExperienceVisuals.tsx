"use client";

// Small "signature visual" diagrams for experiences that don't have a real
// screenshot (THz-LTEM / KK-Generation keep their own images). Shared
// wireframe aesthetic: 1px strokes, thz-cyan/thz-amber on transparent, mono
// labels, viewBox 200x120 — same stroke weight and label style so they read
// as one system.
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
        viewport: { once: false, margin: "-40px" },
        transition: { duration: 1.1, ease: EASE },
    };
}

function useFadeIn(delay = 0) {
    const reduced = useReducedMotion();
    if (reduced) return {};
    return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: false, margin: "-40px" },
        transition: { duration: 0.7, delay, ease: EASE },
    };
}

// Pineal — LLM output split into automatic checks and human review, merged
// into one explainable report.
export function PinealVisual() {
    const draw = useDrawIn();
    const fade = useFadeIn(0.4);
    return (
        <svg
            viewBox="0 0 200 120"
            className="w-full h-auto"
            role="img"
            aria-label="LLM の出力を機械検査と人手レビューに分けて評価し、説明可能なレポートにまとめる模式図"
        >
            <rect x="8" y="44" width="38" height="26" rx="2" fill="none" stroke={CYAN} strokeWidth="1" />
            <text x="27" y="60" textAnchor="middle" fontSize="7" fill={CYAN} fontFamily={MONO_FONT}>
                LLM
            </text>

            <motion.path d="M46 52 L70 34 M46 62 L70 80" stroke={AMBER} strokeWidth="1" strokeDasharray="3 3" fill="none" {...draw} />

            <rect x="72" y="22" width="56" height="22" rx="2" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.8" />
            <text x="100" y="36" textAnchor="middle" fontSize="7" fill={CYAN} fontFamily={MONO_FONT}>
                auto checks
            </text>
            <rect x="72" y="70" width="56" height="22" rx="2" fill="none" stroke={CYAN} strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
            <text x="100" y="84" textAnchor="middle" fontSize="7" fill={CYAN} fontFamily={MONO_FONT}>
                human review
            </text>

            <motion.path d="M128 34 L152 52 M128 80 L152 62" stroke={AMBER} strokeWidth="1" strokeDasharray="3 3" fill="none" {...draw} />
            <motion.g {...fade}>
                <rect x="154" y="42" width="38" height="30" rx="2" fill="none" stroke={AMBER} strokeWidth="1.2" />
                <text x="173" y="60" textAnchor="middle" fontSize="7" fill={AMBER} fontFamily={MONO_FONT}>
                    report
                </text>
            </motion.g>

            <text x="100" y="112" textAnchor="middle" fontSize="7" fill={MUTED} fontFamily={MONO_FONT}>
                quality = auto + human
            </text>
        </svg>
    );
}

// Auth / RBA — every login passes a risk check; risky ones branch into a
// step-up (additional) authentication before the session is issued.
export function AuthVisual() {
    const draw = useDrawIn();
    const fade = useFadeIn(0.45);
    return (
        <svg
            viewBox="0 0 200 120"
            className="w-full h-auto"
            role="img"
            aria-label="ログインのリスクを判定し、リスクが高い場合だけ追加認証を挟んでからセッションを発行する流れの模式図"
        >
            <rect x="6" y="46" width="36" height="22" rx="2" fill="none" stroke={CYAN} strokeWidth="1" />
            <text x="24" y="60" textAnchor="middle" fontSize="7" fill={CYAN} fontFamily={MONO_FONT}>
                login
            </text>

            <motion.path d="M42 57 H64" stroke={CYAN} strokeWidth="1" fill="none" {...draw} />
            {/* risk diamond */}
            <path d="M82 39 L100 57 L82 75 L64 57 Z" fill="none" stroke={AMBER} strokeWidth="1.2" />
            <text x="82" y="60" textAnchor="middle" fontSize="7" fill={AMBER} fontFamily={MONO_FONT}>
                risk
            </text>

            {/* low risk: straight through */}
            <motion.path d="M100 57 H156" stroke={CYAN} strokeWidth="1" fill="none" {...draw} />
            <text x="128" y="53" textAnchor="middle" fontSize="6" fill={MUTED} fontFamily={MONO_FONT}>
                low
            </text>

            {/* high risk: step-up branch */}
            <motion.g {...fade}>
                <path d="M82 75 V92 H112" stroke={AMBER} strokeWidth="1" strokeDasharray="3 2" fill="none" />
                <text x="90" y="88" fontSize="6" fill={AMBER} fontFamily={MONO_FONT}>
                    high
                </text>
                <rect x="112" y="82" width="44" height="20" rx="2" fill="none" stroke={AMBER} strokeWidth="1" />
                <text x="134" y="95" textAnchor="middle" fontSize="7" fill={AMBER} fontFamily={MONO_FONT}>
                    step-up
                </text>
                <path d="M156 92 H172 V68" stroke={AMBER} strokeWidth="1" strokeDasharray="3 2" fill="none" />
            </motion.g>

            <rect x="156" y="46" width="38" height="22" rx="2" fill="none" stroke={CYAN} strokeWidth="1.2" />
            <text x="175" y="60" textAnchor="middle" fontSize="7" fill={CYAN} fontFamily={MONO_FONT}>
                session
            </text>

            <text x="100" y="114" textAnchor="middle" fontSize="7" fill={MUTED} fontFamily={MONO_FONT}>
                risk(login) → step-up auth
            </text>
        </svg>
    );
}
