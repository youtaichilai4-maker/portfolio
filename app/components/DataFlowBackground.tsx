"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface DataPoint {
    id: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    duration: number;
    delay: number;
    size: number;
}

export default function DataFlowBackground() {
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

    useEffect(() => {
        // マウント時にウィンドウサイズを取得
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // データポイントのパスを定義（グリッドに沿った経路）
    const dataPoints: DataPoint[] = useMemo(() => [
        // 水平方向の流れ（左から右）
        { id: 1, startX: -100, startY: 100, endX: dimensions.width + 100, endY: 100, duration: 15, delay: 0, size: 6 },
        { id: 2, startX: -100, startY: 300, endX: dimensions.width + 100, endY: 300, duration: 20, delay: 2, size: 5 },
        { id: 3, startX: -100, startY: 500, endX: dimensions.width + 100, endY: 500, duration: 18, delay: 5, size: 6 },
        { id: 4, startX: -100, startY: 700, endX: dimensions.width + 100, endY: 700, duration: 19, delay: 3, size: 5 },
        { id: 5, startX: -100, startY: 900, endX: dimensions.width + 100, endY: 900, duration: 17, delay: 1, size: 6 },

        // 水平方向の流れ（右から左）
        { id: 12, startX: dimensions.width + 100, startY: 200, endX: -100, endY: 200, duration: 22, delay: 1, size: 5 },
        { id: 13, startX: dimensions.width + 100, startY: 400, endX: -100, endY: 400, duration: 19, delay: 4, size: 6 },
        { id: 14, startX: dimensions.width + 100, startY: 600, endX: -100, endY: 600, duration: 21, delay: 2, size: 5 },
        { id: 15, startX: dimensions.width + 100, startY: 800, endX: -100, endY: 800, duration: 20, delay: 6, size: 6 },

        // 垂直方向の流れ（上から下）
        { id: 6, startX: 200, startY: -100, endX: 200, endY: dimensions.height + 100, duration: 18, delay: 1, size: 5 },
        { id: 7, startX: 500, startY: -100, endX: 500, endY: dimensions.height + 100, duration: 21, delay: 5, size: 6 },
        { id: 8, startX: 800, startY: -100, endX: 800, endY: dimensions.height + 100, duration: 19, delay: 2, size: 5 },
        { id: 9, startX: 1100, startY: -100, endX: 1100, endY: dimensions.height + 100, duration: 20, delay: 7, size: 6 },

        // 斜め方向の流れ
        { id: 10, startX: -50, startY: -50, endX: dimensions.width + 50, endY: dimensions.height + 50, duration: 25, delay: 0, size: 4 },
        { id: 11, startX: dimensions.width + 50, startY: -50, endX: -50, endY: dimensions.height + 50, duration: 28, delay: 8, size: 4 },
    ], [dimensions]);

    return (
        // 修正1: z-indexをz-0に変更し、circuit-bgクラスを削除（背景はlayout.tsxで適用済み）
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {dataPoints.map((point) => {
                const dx = point.endX - point.startX;
                const dy = point.endY - point.startY;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const isHorizontal = Math.abs(dx) > Math.abs(dy);

                return (
                    <motion.div
                        key={point.id}
                        className="absolute"
                        style={{
                            width: `${point.size}px`,
                            height: `${point.size}px`,
                            borderRadius: "50%",
                            // 色を濃くして視認性を高める
                            background: "radial-gradient(circle, rgba(6, 182, 212, 1) 0%, rgba(6, 182, 212, 0.9) 50%, rgba(6, 182, 212, 0) 100%)",
                            boxShadow: `0 0 ${point.size * 4}px rgba(6, 182, 212, 1), 0 0 ${point.size * 8}px rgba(6, 182, 212, 0.8), 0 0 ${point.size * 15}px rgba(6, 182, 212, 0.5)`,
                        }}
                        initial={{
                            x: point.startX,
                            y: point.startY,
                            opacity: 0,
                        }}
                        animate={{
                            x: point.endX,
                            y: point.endY,
                            opacity: [0, 1, 1, 0], // フェードイン・アウト
                        }}
                        transition={{
                            duration: point.duration,
                            delay: point.delay,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {/* トレイル（尾ひれ）部分 */}
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: isHorizontal ? `${Math.min(distance * 0.2, 150)}px` : `${point.size}px`,
                                height: isHorizontal ? `${point.size}px` : `${Math.min(distance * 0.2, 150)}px`,
                                // 修正2: transformを一括指定（translateとrotateをまとめる）
                                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                                transformOrigin: "center center",
                                background: isHorizontal
                                    ? "linear-gradient(90deg, rgba(6,182,212,0) 0%, rgba(6,182,212,0.5) 100%)"
                                    : "linear-gradient(180deg, rgba(6,182,212,0) 0%, rgba(6,182,212,0.5) 100%)",
                                // 向きを反転（進行方向の後ろに尾を引くように）
                                marginLeft: isHorizontal ? `-${Math.min(distance * 0.1, 75)}px` : 0,
                                marginTop: !isHorizontal ? `-${Math.min(distance * 0.1, 75)}px` : 0,
                                filter: "blur(4px)",
                            }}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}

