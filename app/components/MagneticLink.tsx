"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function MagneticLink({
    href,
    children,
    strength = 12,
    className = "",
}: {
    href: string;
    children: ReactNode;
    strength?: number;
    className?: string;
}) {
    const reduced = useReducedMotion();
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xs = useSpring(x, { stiffness: 180, damping: 16, mass: 0.3 });
    const ys = useSpring(y, { stiffness: 180, damping: 16, mass: 0.3 });

    const handleMove = (e: React.MouseEvent) => {
        if (reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set(((e.clientX - cx) / rect.width) * strength);
        y.set(((e.clientY - cy) / rect.height) * strength);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    if (reduced) {
        return (
            <a href={href} className={className}>
                {children}
            </a>
        );
    }

    return (
        <motion.a
            ref={ref}
            href={href}
            style={{ x: xs, y: ys }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={className}
        >
            {children}
        </motion.a>
    );
}
