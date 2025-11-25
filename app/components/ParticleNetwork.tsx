"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseRadius: number;
}

export default function ParticleNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // キャンバスサイズを設定
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // パーティクルを初期化
        const particleCount = 50;
        const particles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                radius: 2 + Math.random() * 2,
                baseRadius: 2 + Math.random() * 2,
            });
        }

        particlesRef.current = particles;

        // マウス位置を更新
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // アニメーションループ
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;
            const attractionRadius = 180;
            const connectionDistance = 140;

            // パーティクルを更新
            particles.forEach((particle) => {
                // マウスへの引力を計算
                const dx = mousePos.x - particle.x;
                const dy = mousePos.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < attractionRadius && distance > 0) {
                    // 引力の強さ（距離に反比例）- より弱く、滑らかに
                    const force = (attractionRadius - distance) / attractionRadius;
                    const attractionStrength = 0.008 * force; // 0.02から0.008に減らしてより穏やかに

                    particle.vx += (dx / distance) * attractionStrength;
                    particle.vy += (dy / distance) * attractionStrength;
                }

                // 速度を適用
                particle.x += particle.vx;
                particle.y += particle.vy;

                // 境界で跳ね返る（より滑らかに）
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -0.6;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -0.6;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                }

                // 速度の減衰（より強く減衰させて落ち着いた動きに）
                particle.vx *= 0.95;
                particle.vy *= 0.95;

                // マウスに近い場合、パーティクルを大きくする（より控えめに）
                const mouseDistance = Math.sqrt(
                    Math.pow(mousePos.x - particle.x, 2) + Math.pow(mousePos.y - particle.y, 2)
                );
                if (mouseDistance < attractionRadius) {
                    particle.radius = particle.baseRadius * (1 + (attractionRadius - mouseDistance) / attractionRadius * 0.3);
                } else {
                    particle.radius = particle.baseRadius;
                }
            });

            // 接続線を描画
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[j].x - particles[i].x;
                    const dy = particles[j].y - particles[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.3;
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // パーティクルを描画
            particles.forEach((particle) => {
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.radius * 3
                );
                gradient.addColorStop(0, "rgba(6, 182, 212, 0.8)");
                gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.4)");
                gradient.addColorStop(1, "rgba(6, 182, 212, 0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
                ctx.fill();

                // パーティクルのコア
                ctx.fillStyle = "rgba(6, 182, 212, 0.6)";
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [mousePos]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ background: "transparent", zIndex: -1 }}
        />
    );
}

