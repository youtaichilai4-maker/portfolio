"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const CYAN: [number, number, number] = [127, 227, 255];
const AMBER: [number, number, number] = [245, 165, 36];

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

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
};

export default function ParticleTitle({
    text,
    className = "",
    fontSize = 88,
    fontWeight = 700,
    sampleStep = 4,
    assembleDuration = 2400,
}: {
    text: string;
    className?: string;
    fontSize?: number;
    fontWeight?: number;
    sampleStep?: number;
    assembleDuration?: number;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [settled, setSettled] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) {
            setSettled(true);
            return;
        }
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const textEl = textRef.current;
        if (!wrap || !canvas || !textEl) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId = 0;
        let cancelled = false;

        async function run() {
            // Wait for webfonts (Inter Tight) to load so the sampled glyph shapes are correct.
            if (document.fonts?.ready) {
                try {
                    await document.fonts.ready;
                } catch {}
            }
            if (cancelled) return;

            const rect = wrap!.getBoundingClientRect();
            const textRect = textEl!.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const W = Math.max(1, Math.floor(rect.width));
            const H = Math.max(1, Math.floor(rect.height));

            canvas!.width = W * dpr;
            canvas!.height = H * dpr;
            canvas!.style.width = `${W}px`;
            canvas!.style.height = `${H}px`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Offscreen to sample glyph pixels
            const offs = document.createElement("canvas");
            offs.width = W * dpr;
            offs.height = H * dpr;
            const octx = offs.getContext("2d")!;
            octx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const fontFamily =
                getComputedStyle(textEl!).fontFamily ||
                '"Fraunces", Georgia, serif';
            octx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            octx.textBaseline = "top";
            octx.fillStyle = "#fff";

            // Draw at the same position the visible <span> would occupy within the wrap
            const drawX = textRect.left - rect.left;
            const drawY = textRect.top - rect.top + fontSize * 0.08;
            octx.fillText(text, drawX, drawY);

            const img = octx.getImageData(0, 0, offs.width, offs.height).data;

            const targets: Array<{ x: number; y: number }> = [];
            const step = sampleStep * dpr;
            for (let y = 0; y < offs.height; y += step) {
                for (let x = 0; x < offs.width; x += step) {
                    const idx = (y * offs.width + x) * 4;
                    if (img[idx + 3] > 128) {
                        targets.push({ x: x / dpr, y: y / dpr });
                    }
                }
            }

            if (targets.length === 0) return;

            const particles: Particle[] = targets.map(() => ({
                x: -60 - Math.random() * W * 0.4,
                y: Math.random() * H,
                vx: 0,
                vy: 0,
                tx: 0,
                ty: 0,
                arrived: false,
                delay: Math.random() * assembleDuration * 0.55,
                size: 0.6 + Math.random() * 0.9,
            }));
            // assign shuffled targets
            const shuffled = targets.slice().sort(() => Math.random() - 0.5);
            for (let i = 0; i < particles.length; i++) {
                particles[i].tx = shuffled[i].x;
                particles[i].ty = shuffled[i].y;
            }

            const startTime = performance.now();

            function frame() {
                if (cancelled) return;
                const now = performance.now();
                const elapsed = now - startTime;

                // Fading tail
                ctx!.globalCompositeOperation = "source-over";
                ctx!.fillStyle = "rgba(11,13,16,0.22)";
                ctx!.fillRect(0, 0, W, H);

                ctx!.globalCompositeOperation = "lighter";

                let arrived = 0;
                for (const p of particles) {
                    if (elapsed < p.delay) continue;

                    const localT = Math.min(
                        1,
                        (elapsed - p.delay) / (assembleDuration * 0.7)
                    );

                    if (!p.arrived) {
                        const dx = p.tx - p.x;
                        const dy = p.ty - p.y;
                        const dist = Math.hypot(dx, dy);

                        // Drift-diffusion curl
                        const curlX = Math.sin(p.y * 0.012 + elapsed * 0.0009) * 0.35;
                        const curlY = Math.cos(p.x * 0.012 + elapsed * 0.0011) * 0.18;

                        const pull = 0.02 + localT * 0.12;
                        p.vx += dx * pull * 0.05 + curlX;
                        p.vy += dy * pull * 0.05 + curlY;
                        p.vx *= 0.86;
                        p.vy *= 0.86;

                        p.x += p.vx;
                        p.y += p.vy;

                        if (dist < 3 && localT > 0.6) {
                            p.arrived = true;
                            p.x = p.tx;
                            p.y = p.ty;
                        }
                    } else {
                        // Gentle Brownian wobble
                        p.x = p.tx + Math.sin(elapsed * 0.003 + p.tx * 0.12) * 0.35;
                        p.y = p.ty + Math.cos(elapsed * 0.0025 + p.ty * 0.12) * 0.35;
                    }

                    if (p.arrived) arrived++;

                    const t = p.arrived ? 1 : localT;
                    const r = lerp(CYAN[0], AMBER[0], t);
                    const g = lerp(CYAN[1], AMBER[1], t);
                    const b = lerp(CYAN[2], AMBER[2], t);
                    const alpha = p.arrived ? 0.95 : 0.45 + localT * 0.55;

                    ctx!.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
                    ctx!.beginPath();
                    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx!.fill();

                    // Trail while in transit
                    if (!p.arrived && p.vx * p.vx + p.vy * p.vy > 0.4) {
                        ctx!.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha * 0.4})`;
                        ctx!.lineWidth = p.size * 0.8;
                        ctx!.beginPath();
                        ctx!.moveTo(p.x, p.y);
                        ctx!.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                        ctx!.stroke();
                    }
                }

                ctx!.globalCompositeOperation = "source-over";

                const done =
                    (arrived / particles.length >= 0.9 && elapsed > assembleDuration * 0.8) ||
                    elapsed > assembleDuration + 800;

                if (done) {
                    setSettled(true);
                    // stop once fade-out has completed
                    if (elapsed > assembleDuration + 2000) {
                        return;
                    }
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
    }, [text, fontSize, fontWeight, sampleStep, assembleDuration, reduced]);

    return (
        <div
            ref={wrapRef}
            className={`relative ${className}`}
            style={{
                fontFamily: "var(--font-fraunces), Fraunces, Georgia, serif",
                minHeight: `${Math.round(fontSize * 1.25)}px`,
            }}
        >
            <span
                ref={textRef}
                aria-hidden={!settled}
                className="inline-block font-display tracking-tight text-thz-amber leading-[1.05]"
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight: 700,
                    opacity: settled ? 1 : 0,
                    transition: "opacity 0.7s ease",
                    textShadow: "0 0 28px rgba(245,165,36,0.28)",
                    letterSpacing: "-0.02em",
                }}
            >
                {text}
            </span>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: settled ? 0 : 1,
                    transition: "opacity 0.9s ease",
                }}
                aria-hidden="true"
            />
            <h1 className="sr-only">{text}</h1>
        </div>
    );
}
