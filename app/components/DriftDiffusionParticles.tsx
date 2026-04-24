"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    settled: boolean;
    targetX: number;
    targetY: number;
};

const CYAN: [number, number, number] = [127, 227, 255];
const AMBER: [number, number, number] = [245, 165, 36];

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number) {
    return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

export default function DriftDiffusionParticles({
    className = "",
    density = 1,
}: {
    className?: string;
    density?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let dpr = 1;

        const particles: Particle[] = [];
        const maxParticles = Math.floor(180 * density);

        function resize() {
            if (!canvas || !ctx) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        function spawn(): Particle {
            const fromLeft = Math.random() < 0.92;
            const y = Math.random() * height;
            const x = fromLeft ? -20 : Math.random() * width * 0.15;
            // Targets cluster around the center-right (where settled text lives)
            const targetX = width * (0.35 + Math.random() * 0.5);
            const targetY = y + (Math.random() - 0.5) * height * 0.3;
            const maxLife = 120 + Math.random() * 120;
            return {
                x,
                y,
                vx: 1.2 + Math.random() * 1.8,
                vy: (Math.random() - 0.5) * 0.4,
                life: 0,
                maxLife,
                size: 0.8 + Math.random() * 1.4,
                settled: false,
                targetX,
                targetY,
            };
        }

        // Flow-field: gentle curvature that mimics drift-diffusion streamlines
        function flow(x: number, y: number, t: number) {
            const nx = x / width;
            const ny = y / height;
            // slight sinusoidal curl; bias toward +x
            const ax = 0.02 * Math.sin(ny * 6 + t * 0.0008);
            const ay = 0.04 * Math.sin(nx * 5 + t * 0.0011) * (0.5 - ny);
            return [ax, ay];
        }

        let rafId = 0;
        let lastT = performance.now();

        function frame(now: number) {
            const dt = Math.min(32, now - lastT);
            lastT = now;

            if (!canvas || !ctx) return;
            // Fade with slight bias so trails linger but clear eventually
            ctx.fillStyle = "rgba(11, 13, 16, 0.18)";
            ctx.fillRect(0, 0, width, height);

            // Spawn
            while (particles.length < maxParticles) {
                particles.push(spawn());
            }

            ctx.globalCompositeOperation = "lighter";

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life += dt * 0.06;

                const [ax, ay] = flow(p.x, p.y, now);
                p.vx += ax;
                p.vy += ay;

                // Mild damping
                p.vx *= 0.985;
                p.vy *= 0.985;

                // Attraction toward target (simulates settling)
                const t = Math.min(1, p.life / p.maxLife);
                const pull = t * t * 0.08;
                p.vx += (p.targetX - p.x) * pull * 0.01;
                p.vy += (p.targetY - p.y) * pull * 0.01;

                p.x += p.vx;
                p.y += p.vy;

                // Color transition cyan -> amber as it settles
                const [r, g, b] = lerpColor(CYAN, AMBER, t);
                const alpha = (1 - Math.abs(t - 0.5) * 1.6) * 0.9; // brightest mid-life

                ctx.beginPath();
                ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${Math.max(0, alpha)})`;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Short trailing line
                if (p.vx * p.vx + p.vy * p.vy > 0.1) {
                    ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${Math.max(0, alpha) * 0.35})`;
                    ctx.lineWidth = p.size * 0.7;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
                    ctx.stroke();
                }

                if (p.life >= p.maxLife || p.x > width + 30 || p.y < -30 || p.y > height + 30) {
                    particles.splice(i, 1);
                }
            }

            ctx.globalCompositeOperation = "source-over";
            rafId = requestAnimationFrame(frame);
        }

        rafId = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
        };
    }, [density, reduced]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none ${className}`}
            aria-hidden="true"
        />
    );
}
