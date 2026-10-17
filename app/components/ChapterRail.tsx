"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
    { id: "cover", label: "cover" },
    { id: "intro", label: "intro" },
    { id: "hero", label: "profile" },
    { id: "about", label: "about" },
    { id: "skills", label: "skills" },
    { id: "experiences", label: "exp" },
];

export default function ChapterRail() {
    const [active, setActive] = useState("cover");
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // pick the entry with the largest intersection ratio in the top half
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target?.id) {
                    setActive(visible[0].target.id);
                }
            },
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: "-25% 0px -50% 0px",
            }
        );
        SECTIONS.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Thin top progress bar */}
            <motion.div
                aria-hidden
                style={{ scaleX: progress, transformOrigin: "0% 50%" }}
                className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-thz-cyan via-thz-amber to-thz-cyan origin-left"
            />

            {/* Right-side chapter rail (desktop only) */}
            <nav
                aria-label="Chapters"
                className="fixed right-2 lg:right-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 pointer-events-auto"
            >
                {SECTIONS.map((s, i) => {
                    const isActive = active === s.id;
                    return (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            aria-current={isActive ? "true" : undefined}
                            className="group relative flex items-center gap-3 justify-end"
                        >
                            {/* Label sits ABOVE the dot as a small right-anchored
                                tooltip — not to its left — so it never grows
                                into the content column, only into the thin
                                edge margin the dot/number already sit in. */}
                            <span
                                className={`absolute right-0 bottom-[calc(100%+6px)] font-mono text-[10px] tracking-[0.15em] whitespace-nowrap rounded px-2 py-1 border transition-all duration-300 ${
                                    isActive
                                        ? "text-thz-cyan bg-slate-ink/95 border-slate-line opacity-100 translate-y-0 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                                        : "text-zinc-500 bg-slate-ink/95 border-transparent opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:border-slate-line group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                                }`}
                            >
                                {s.label}
                            </span>
                            <div className="relative h-px flex items-center justify-end">
                                <span
                                    className={`h-px transition-all duration-300 ${
                                        isActive
                                            ? "w-10 bg-thz-amber"
                                            : "w-5 bg-slate-line group-hover:bg-thz-cyan group-hover:w-7"
                                    }`}
                                />
                            </div>
                            <span
                                className={`font-mono text-[10px] w-7 text-right transition-colors duration-300 ${
                                    isActive
                                        ? "text-thz-amber"
                                        : "text-zinc-600 group-hover:text-thz-cyan"
                                }`}
                            >
                                {String(i).padStart(2, "0")}
                            </span>
                        </a>
                    );
                })}
            </nav>
        </>
    );
}
