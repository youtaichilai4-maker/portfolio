"use client";

import { motion } from "framer-motion";
import { INTRO } from "../data";
import { EquationBackdrop } from "./TitleWithEquations";

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, margin: "-60px" },
    transition: { duration: 0.8, delay, ease: EASE },
});

// Full-page "about me", read like a book's afterword — calm prose at one
// comfortable size, no editor chrome, no particle title.
export default function Intro() {
    return (
        <section
            id="intro"
            className="relative min-h-screen flex items-center bg-slate-ink scroll-mt-24 px-5 sm:px-10 lg:px-16 py-24"
        >
            <EquationBackdrop palette="about" />
            <div className="relative w-full max-w-3xl mx-auto">
                <motion.div {...reveal(0)} className="mb-10 flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-thz-cyan tracking-[0.3em] uppercase">
                        {INTRO.label}
                    </span>
                    <span className="h-px flex-1 bg-slate-line" />
                </motion.div>

                <div className="space-y-7 font-sans text-base sm:text-lg md:text-xl leading-[2] text-zinc-300 [word-break:auto-phrase] [text-wrap:pretty]">
                    <motion.h2 {...reveal(0.1)} className="font-semibold text-zinc-50">
                        {INTRO.heading}
                    </motion.h2>
                    <ul className="space-y-4">
                        {INTRO.bullets.map((item, i) => (
                            <motion.li
                                key={item}
                                {...reveal(0.15 + i * 0.07)}
                                className="group flex items-start gap-4"
                            >
                                <span className="mt-[0.85em] block w-1.5 h-1.5 rounded-full bg-thz-cyan/70 shrink-0 transition-colors group-hover:bg-thz-amber" />
                                <span className="flex-1 transition-colors group-hover:text-zinc-50">
                                    {item}
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                    <motion.p
                        {...reveal(0.7)}
                        className="pt-4 border-l-2 border-thz-amber pl-5 text-thz-amber"
                    >
                        {INTRO.closing}
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
