"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
    { id: "cover", label: "cover" },
    { id: "hero", label: "profile.md" },
    { id: "about", label: "about.md" },
    { id: "skills", label: "skills.md" },
    { id: "experiences", label: "experiences/" },
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
                className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 pointer-events-auto"
            >
                {SECTIONS.map((s, i) => {
                    const isActive = active === s.id;
                    return (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            aria-current={isActive ? "true" : undefined}
                            className="group flex items-center gap-3 justify-end"
                        >
                            <span
                                className={`font-mono text-[11px] tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                                    isActive
                                        ? "text-thz-cyan opacity-100 translate-x-0"
                                        : "text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
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
