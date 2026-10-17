"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Scroll-linked stage: a block rises in as it enters, then shrinks and dims
// ("flows away") as its bottom edge scrolls past the top of the viewport.
// Scaling is anchored to the bottom edge so it never opens a gap with the
// next block. Mobile uses half the amplitude.
const LEAVE_SCALE = 0.12;
const LEAVE_FADE = 0.65;
const ENTER_RISE_PX = 36;

export default function ScrollStage({
    children,
    className = "",
    id,
}: {
    children: ReactNode;
    className?: string;
    id?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const [amp, setAmp] = useState(1);

    useEffect(() => {
        const update = () => setAmp(window.innerWidth < 768 ? 0.5 : 1);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const { scrollYProgress: enter } = useScroll({
        target: ref,
        offset: ["start end", "start 0.6"],
    });
    const { scrollYProgress: leave } = useScroll({
        target: ref,
        offset: ["end 0.85", "end start"],
    });

    const scale = useTransform(leave, (l) => 1 - l * LEAVE_SCALE * amp);
    const opacity = useTransform([enter, leave], ([e, l]: number[]) =>
        Math.min(0.25 + 0.75 * e, 1 - l * LEAVE_FADE)
    );
    const y = useTransform(enter, (e) => (1 - e) * ENTER_RISE_PX * amp);
    const radius = useTransform(leave, (l) => `${l * 28 * amp}px`);

    if (reduced) {
        return (
            <div id={id} className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            id={id}
            style={{
                scale,
                opacity,
                y,
                borderRadius: radius,
                transformOrigin: "50% 100%",
            }}
            className={`relative overflow-hidden will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
}
