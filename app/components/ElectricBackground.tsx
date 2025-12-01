"use client";

import { useEffect, useRef } from "react";

export default function ElectricBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        // 電流のノード（接続点）
        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
        }

        const nodes: Node[] = [];
        const nodeCount = 30;
        const connectionDistance = 200;

        // ノードを初期化
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            });
        }

        // 電流パスを保存
        const electricPaths: Array<{
            from: Node;
            to: Node;
            progress: number;
            speed: number;
            opacity: number;
        }> = [];

        // アニメーションループ
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ノードを更新
            nodes.forEach((node) => {
                node.x += node.vx;
                node.y += node.vy;

                // 境界で跳ね返る
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // 範囲内に保つ
                node.x = Math.max(0, Math.min(canvas.width, node.x));
                node.y = Math.max(0, Math.min(canvas.height, node.y));
            });

            // 接続を検出して電流パスを作成
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x;
                    const dy = nodes[j].y - nodes[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        // 既存のパスをチェック
                        const existingPath = electricPaths.find(
                            (p) =>
                                (p.from === nodes[i] && p.to === nodes[j]) ||
                                (p.from === nodes[j] && p.to === nodes[i])
                        );

                        if (!existingPath && Math.random() < 0.02) {
                            // 新しい電流パスを作成
                            electricPaths.push({
                                from: nodes[i],
                                to: nodes[j],
                                progress: 0,
                                speed: 0.02 + Math.random() * 0.03,
                                opacity: 0.6 + Math.random() * 0.4,
                            });
                        }

                        // 接続線を描画（薄く）
                        const opacity = (1 - distance / connectionDistance) * 0.1;
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // 電流パスを描画
            electricPaths.forEach((path, index) => {
                path.progress += path.speed;

                if (path.progress >= 1) {
                    electricPaths.splice(index, 1);
                    return;
                }

                const currentX = path.from.x + (path.to.x - path.from.x) * path.progress;
                const currentY = path.from.y + (path.to.y - path.from.y) * path.progress;

                // 電流の光る点を描画
                const gradient = ctx.createRadialGradient(
                    currentX,
                    currentY,
                    0,
                    currentX,
                    currentY,
                    15
                );
                gradient.addColorStop(0, `rgba(6, 182, 212, ${path.opacity})`);
                gradient.addColorStop(0.5, `rgba(6, 182, 212, ${path.opacity * 0.5})`);
                gradient.addColorStop(1, "rgba(6, 182, 212, 0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(currentX, currentY, 15, 0, Math.PI * 2);
                ctx.fill();

                // 電流の軌跡を描画
                ctx.strokeStyle = `rgba(6, 182, 212, ${path.opacity * 0.3})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(path.from.x, path.from.y);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ background: "transparent" }}
        />
    );
}


