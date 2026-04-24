"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Color = [number, number, number];
const CYAN: Color = [127, 227, 255];
const AMBER: Color = [245, 165, 36];
const WHITE_HOT: Color = [255, 255, 255];

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    tx: number;
    ty: number;
    arrived: boolean;
    delay: number;
    size: number;
    color: Color;
    origin: "left" | "right" | "top";
};

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export default function CoverHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const [ready, setReady] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        // Safety fallback — guarantee caption/scroll-indicator reveal even if
        // the particle arrival threshold is not reached cleanly. Also fires
        // immediately when reduced-motion is active so the caption shows.
        const fallback = setTimeout(() => setReady(true), reduced ? 0 : 4200);
        return () => clearTimeout(fallback);
    }, [reduced]);

    useEffect(() => {
        if (reduced) return;
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId = 0;
        let cancelled = false;

        async function run() {
            if (document.fonts?.ready) {
                try {
                    await document.fonts.ready;
                } catch {}
            }
            if (cancelled) return;

            const rect = wrap!.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const W = Math.max(1, Math.floor(rect.width));
            const H = Math.max(1, Math.floor(rect.height));

            canvas!.width = W * dpr;
            canvas!.height = H * dpr;
            canvas!.style.width = `${W}px`;
            canvas!.style.height = `${H}px`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Offscreen for sampling glyph pixels
            const offs = document.createElement("canvas");
            offs.width = W * dpr;
            offs.height = H * dpr;
            const octx = offs.getContext("2d")!;
            octx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const fontSize = Math.min(240, Math.max(56, W * 0.135));
            const fontFamily = measureRef.current
                ? getComputedStyle(measureRef.current).fontFamily
                : '"Fraunces", Georgia, serif';
            octx.font = `800 ${fontSize}px ${fontFamily}`;
            octx.textBaseline = "middle";
            octx.fillStyle = "#fff";

            const text = "Physics × ML";
            const metrics = octx.measureText(text);
            const totalW = metrics.width;
            const textX = (W - totalW) / 2;
            const textY = H / 2;

            octx.fillText(text, textX, textY);

            const img = octx.getImageData(0, 0, offs.width, offs.height).data;

            // Boundaries for color assignment based on x-position
            const widthPhysicsOnly = octx.measureText("Physics").width;
            const widthUpToX = octx.measureText("Physics × ").width;
            const splitLeft = textX + widthPhysicsOnly + fontSize * 0.1;
            const splitRight = textX + widthUpToX - fontSize * 0.05;

            const targets: Array<{ x: number; y: number; zone: "physics" | "cross" | "ml" }> = [];
            const step = Math.max(4, Math.round(5 * dpr));
            for (let y = 0; y < offs.height; y += step) {
                for (let x = 0; x < offs.width; x += step) {
                    const idx = (y * offs.width + x) * 4;
                    if (img[idx + 3] > 128) {
                        const px = x / dpr;
                        const py = y / dpr;
                        const zone =
                            px < splitLeft ? "physics" : px > splitRight ? "ml" : "cross";
                        targets.push({ x: px, y: py, zone });
                    }
                }
            }

            if (targets.length === 0) return;

            const particles: Particle[] = targets.map((t) => {
                let sx = 0;
                let sy = 0;
                let color: Color;
                let origin: Particle["origin"];
                const vband = H * 0.4;
                if (t.zone === "physics") {
                    color = CYAN;
                    origin = "left";
                    sx = -60 - Math.random() * W * 0.4;
                    sy = t.y + (Math.random() - 0.5) * vband;
                } else if (t.zone === "ml") {
                    color = AMBER;
                    origin = "right";
                    sx = W + 60 + Math.random() * W * 0.4;
                    sy = t.y + (Math.random() - 0.5) * vband;
                } else {
                    // "×" — amber, drops in from slightly above
                    color = AMBER;
                    origin = "top";
                    sx = t.x + (Math.random() - 0.5) * 40;
                    sy = t.y - 120 - Math.random() * 160;
                }
                return {
                    x: sx,
                    y: sy,
                    vx: 0,
                    vy: 0,
                    tx: t.x,
                    ty: t.y,
                    arrived: false,
                    delay: Math.random() * 1800,
                    size: 0.7 + Math.random() * 1.0,
                    color,
                    origin,
                };
            });

            const startTime = performance.now();
            let allArrivedTime = 0;

            function frame() {
                if (cancelled) return;
                const now = performance.now();
                const elapsed = now - startTime;

                ctx!.globalCompositeOperation = "source-over";
                ctx!.fillStyle = "rgba(11,13,16,0.28)";
                ctx!.fillRect(0, 0, W, H);

                let arrived = 0;
                for (const p of particles) {
                    if (elapsed < p.delay) continue;
                    const localT = Math.min(
                        1,
                        (elapsed - p.delay) / 2600
                    );

                    if (!p.arrived) {
                        const dx = p.tx - p.x;
                        const dy = p.ty - p.y;
                        const dist = Math.hypot(dx, dy);

                        const curlY =
                            Math.sin(p.y * 0.012 + elapsed * 0.0009) * 0.25 *
                            (p.origin === "left" ? 1 : p.origin === "right" ? -1 : 0.4);
                        const curlX =
                            Math.cos(p.x * 0.008 + elapsed * 0.0011) * 0.08;

                        const pull = 0.05 + localT * 0.2;
                        p.vx += dx * pull * 0.06 + curlX;
                        p.vy += dy * pull * 0.06 + curlY;
                        p.vx *= 0.91;
                        p.vy *= 0.91;

                        p.x += p.vx;
                        p.y += p.vy;

                        if (dist < 3 && localT > 0.55) {
                            p.arrived = true;
                            p.x = p.tx;
                            p.y = p.ty;
                        }
                    } else {
                        p.x =
                            p.tx + Math.sin(elapsed * 0.003 + p.tx * 0.11) * 0.25;
                        p.y =
                            p.ty + Math.cos(elapsed * 0.0026 + p.ty * 0.11) * 0.25;
                    }

                    if (p.arrived) arrived++;

                    // Pure color (no white-hot washing) — just vary alpha for the trails
                    const r = p.color[0];
                    const g = p.color[1];
                    const b = p.color[2];
                    const alpha = p.arrived ? 0.78 : 0.3 + localT * 0.55;

                    if (!p.arrived) {
                        ctx!.globalCompositeOperation = "lighter";
                    } else {
                        ctx!.globalCompositeOperation = "source-over";
                    }
                    ctx!.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
                    ctx!.beginPath();
                    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx!.fill();

                    if (!p.arrived && p.vx * p.vx + p.vy * p.vy > 0.4) {
                        ctx!.globalCompositeOperation = "lighter";
                        ctx!.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha * 0.4})`;
                        ctx!.lineWidth = p.size * 0.85;
                        ctx!.beginPath();
                        ctx!.moveTo(p.x, p.y);
                        ctx!.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
                        ctx!.stroke();
                    }
                }

                ctx!.globalCompositeOperation = "source-over";

                if (arrived / particles.length >= 0.9 && !allArrivedTime) {
                    allArrivedTime = elapsed;
                    setReady(true);
                }

                rafId = requestAnimationFrame(frame);
            }

            rafId = requestAnimationFrame(frame);
        }

        run();

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
        };
    }, [reduced]);

    return (
        <section
            ref={wrapRef}
            className="relative w-full h-screen bg-slate-ink overflow-hidden"
        >
            {/* Background equations & decorative sketches */}
            <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
                {/* Top row equations */}
                <span className="absolute top-[8%] left-[6%] text-zinc-500/40 font-serif italic text-lg md:text-xl">
                    ∂n/∂t = D∇²n + μE·∇n − n/τ + G
                </span>
                <span className="absolute top-[16%] left-[52%] text-zinc-500/30 font-serif italic text-lg">
                    μE
                </span>
                <span className="absolute top-[12%] right-[28%] text-zinc-500/30 font-serif italic text-sm">
                    E = hν
                </span>
                <span className="absolute top-[8%] right-[8%] text-zinc-500/25 font-serif italic text-sm">
                    ∂n/∂t
                </span>

                {/* Bottom row equations */}
                <span className="absolute bottom-[14%] left-[22%] text-zinc-500/35 font-serif italic text-lg">
                    D∇²n
                </span>
                <span className="absolute bottom-[14%] left-[42%] text-zinc-500/30 font-serif italic text-lg">
                    n(x, t)
                </span>
                <span className="absolute bottom-[14%] right-[30%] text-zinc-500/35 font-serif italic text-lg">
                    ∇·J = q
                </span>
                <span className="absolute bottom-[8%] left-[32%] text-zinc-500/30 font-serif italic text-sm">
                    n²τ
                </span>
                <span className="absolute bottom-[8%] left-[44%] text-zinc-500/30 font-serif italic text-sm">
                    ∫ f(x) e⁻ⁱᵏˣ dx
                </span>
                <span className="absolute bottom-[8%] right-[18%] text-zinc-500/30 font-serif italic text-sm">
                    J = qμnE − qD∇n
                </span>

                {/* Top-right sine waveform */}
                <svg
                    className="absolute top-[14%] right-[10%] text-zinc-500/30"
                    width="160"
                    height="40"
                    viewBox="0 0 160 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    <path d="M 0,20 Q 10,0 20,20 T 40,20 T 60,20 T 80,20 T 100,20 T 120,20 T 140,20 T 160,20" />
                </svg>

                {/* Bottom-left damped oscillation */}
                <svg
                    className="absolute bottom-[18%] left-[6%] text-zinc-500/30"
                    width="180"
                    height="60"
                    viewBox="0 0 180 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    <path d="M 0,30 Q 5,5 10,30 Q 15,50 20,30 Q 25,15 30,30 Q 35,42 40,30 Q 45,22 50,30 Q 55,35 60,30 Q 65,28 70,30 L 180,30" />
                </svg>

                {/* Bottom-right Gaussian */}
                <svg
                    className="absolute bottom-[6%] right-[8%] text-zinc-500/30"
                    width="120"
                    height="50"
                    viewBox="0 0 120 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    <path d="M 0,45 C 20,45 35,45 55,5 C 75,45 90,45 120,45" />
                    <line x1="0" y1="45" x2="120" y2="45" strokeDasharray="2 2" />
                    <line x1="20" y1="45" x2="20" y2="47" />
                    <line x1="40" y1="45" x2="40" y2="47" />
                    <line x1="60" y1="45" x2="60" y2="47" />
                    <line x1="80" y1="45" x2="80" y2="47" />
                    <line x1="100" y1="45" x2="100" y2="47" />
                </svg>
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
            />

            {/* Hidden measurement span — reads the resolved font-family via CSS var */}
            <span
                ref={measureRef}
                aria-hidden="true"
                className="absolute opacity-0 pointer-events-none font-display"
                style={{ top: 0, left: 0, fontWeight: 800 }}
            >
                m
            </span>

            <h1 className="sr-only">Physics × ML — Yuta Akase</h1>

            {/* Subtle caption (fades in when title has settled) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute bottom-[18%] sm:bottom-[14%] left-0 right-0 text-center space-y-2 px-4"
            >
                <p className="font-display text-lg md:text-xl text-thz-amber/80 tracking-tight italic">
                    Yuta Akase
                </p>
                <p className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-[0.25em] uppercase">
                    Kyoto University · M1 · Kawayama Lab
                </p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={
                    ready
                        ? { opacity: 1, y: [0, 6, 0] }
                        : { opacity: 0, y: 0 }
                }
                transition={{
                    opacity: { duration: 1, delay: 1.2 },
                    y: {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2,
                    },
                }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500"
            >
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase">
                    scroll
                </span>
                <span className="text-xs">↓</span>
            </motion.div>
        </section>
    );
}
