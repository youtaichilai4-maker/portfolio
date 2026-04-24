"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Tilt3D({
    children,
    maxTilt = 10,
    scale = 1.02,
    glare = true,
    className = "",
}: {
    children: ReactNode;
    maxTilt?: number;
    scale?: number;
    glare?: boolean;
    className?: string;
}) {
    const reduced = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);

    const spring = { stiffness: 180, damping: 20, mass: 0.4 };
    const rotateX = useSpring(useTransform(my, [0, 1], [maxTilt, -maxTilt]), spring);
    const rotateY = useSpring(useTransform(mx, [0, 1], [-maxTilt, maxTilt]), spring);
    const glareX = useTransform(mx, (v) => `${v * 100}%`);
    const glareY = useTransform(my, (v) => `${v * 100}%`);
    const glareOpacity = useMotionValue(0);
    const glareOpacitySpring = useSpring(glareOpacity, { stiffness: 180, damping: 20 });

    const handleMove = (e: React.MouseEvent) => {
        if (reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
        glareOpacity.set(1);
    };

    const handleLeave = () => {
        mx.set(0.5);
        my.set(0.5);
        glareOpacity.set(0);
    };

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            whileHover={{ scale }}
            transition={{ type: "spring", ...spring }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 1100,
            }}
            className={`relative ${className}`}
        >
            {children}
            {glare && (
                <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{
                        opacity: glareOpacitySpring,
                        background: useTransform(
                            [glareX, glareY] as const,
                            ([x, y]) =>
                                `radial-gradient(300px circle at ${x} ${y}, rgba(127,227,255,0.18), transparent 50%)`
                        ),
                    }}
                />
            )}
        </motion.div>
    );
}
