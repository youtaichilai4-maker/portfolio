"use client";

import { motion } from "framer-motion";

export default function QuantumWavesBackground() {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {/* Wave 1 - Cyan, top-left to bottom-right */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
                style={{
                    background: "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
                }}
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, 80, -30, 0],
                    scale: [1, 1.2, 0.9, 1],
                    opacity: [0.15, 0.25, 0.18, 0.15],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Wave 2 - Purple, bottom-right to top-left */}
            <motion.div
                className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
                style={{
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
                    right: 0,
                    bottom: 0,
                }}
                animate={{
                    x: [0, -120, 60, 0],
                    y: [0, -100, 40, 0],
                    scale: [1, 0.8, 1.3, 1],
                    opacity: [0.18, 0.28, 0.15, 0.18],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Wave 3 - Cyan-Purple mix, center */}
            <motion.div
                className="absolute w-[900px] h-[900px] rounded-full blur-3xl opacity-15"
                style={{
                    background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
                animate={{
                    scale: [1, 1.4, 0.7, 1],
                    opacity: [0.12, 0.22, 0.08, 0.12],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Wave 4 - Cyan, top-right */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-18"
                style={{
                    background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)",
                    top: "10%",
                    right: "15%",
                }}
                animate={{
                    x: [0, 80, -40, 0],
                    y: [0, 60, -20, 0],
                    scale: [1, 1.1, 0.95, 1],
                    opacity: [0.15, 0.24, 0.12, 0.15],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                }}
            />

            {/* Wave 5 - Purple, bottom-left */}
            <motion.div
                className="absolute w-[750px] h-[750px] rounded-full blur-3xl opacity-16"
                style={{
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)",
                    bottom: "15%",
                    left: "10%",
                }}
                animate={{
                    x: [0, -90, 50, 0],
                    y: [0, -70, 30, 0],
                    scale: [1, 0.9, 1.2, 1],
                    opacity: [0.14, 0.23, 0.10, 0.14],
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
            />

            {/* Interference Pattern - Subtle overlay */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at 30% 40%, rgba(6, 182, 212, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
                }}
                animate={{
                    opacity: [0.3, 0.5, 0.4, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}

