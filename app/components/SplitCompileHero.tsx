"use client";

import { motion } from "framer-motion";
import ParticleTitle from "./ParticleTitle";
import SplitPane, {
    BrowserChrome,
    CodeLine,
    EmitBand,
    ParticleDirective,
} from "./SplitPane";
import Tilt3D from "./Tilt3D";

const heroLines: CodeLine[] = [
    { n: 1, render: <span className="text-zinc-500">---</span> },
    {
        n: 2,
        render: (
            <>
                <span className="text-thz-cyan">name</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;Yuta Akase&quot;</span>
            </>
        ),
    },
    {
        n: 3,
        render: (
            <>
                <span className="text-thz-cyan">role</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;Physics × ML&quot;</span>
            </>
        ),
    },
    {
        n: 4,
        render: <ParticleDirective density={1.1} />,
    },
    { n: 5, render: <span className="text-zinc-500">---</span> },
    { n: 6, render: <EmitBand /> },
    { n: 7, render: null },
    {
        n: 8,
        render: (
            <>
                <span className="text-thz-cyan"># </span>
                <span className="text-zinc-100">Yuta Akase</span>
            </>
        ),
    },
    { n: 9, render: null },
    {
        n: 10,
        render: (
            <span className="text-zinc-300">
                I build bridges between physics and machine learning
            </span>
        ),
    },
    {
        n: 11,
        render: (
            <span className="text-zinc-300">
                to solve inverse problems in imaging and spectroscopy.
            </span>
        ),
    },
    { n: 12, render: null },
    {
        n: 13,
        render: (
            <>
                <span className="text-thz-cyan">- </span>
                <span className="text-zinc-400">Research</span>
                <span className="text-zinc-500">: </span>
                <span className="text-zinc-300">THz-LTEM inverse problem</span>
            </>
        ),
    },
    {
        n: 14,
        render: (
            <>
                <span className="text-thz-cyan">- </span>
                <span className="text-zinc-400">Pineal — Slide Studio</span>
            </>
        ),
    },
    {
        n: 15,
        render: (
            <>
                <span className="text-thz-cyan">- </span>
                <span className="text-zinc-400">KK-Generation — 柱梁検出</span>
            </>
        ),
    },
    {
        n: 16,
        render: (
            <>
                <span className="text-thz-cyan">- </span>
                <span className="text-zinc-400">PaperLens</span>
                <span className="inline-block w-[7px] h-[14px] align-middle bg-thz-cyan/80 ml-1 animate-pulse" />
            </>
        ),
    },
    { n: 17, render: null },
    { n: 18, render: null },
    { n: 19, render: null },
];

export default function SplitCompileHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-slate-ink overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                }}
            />

            <BrowserChrome>
                <SplitPane
                    filename="profile.md"
                    codeLines={heroLines}
                    staggerOnMount={true}
                    minHeight="720px"
                    particleDensity={1.1}
                    rendered={
                        <div className="flex flex-col gap-8 h-full">
                            <ParticleTitle
                                text="Yuta Akase"
                                fontSize={88}
                                fontWeight={700}
                                assembleDuration={2600}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.9,
                                    delay: 2.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="relative rounded-xl border border-slate-line/70 bg-[#14171C]/85 backdrop-blur-[2px] p-6 md:p-8 max-w-xl"
                            >
                                <p className="font-sans text-lg md:text-xl leading-relaxed">
                                    <span className="text-thz-amber">
                                        I build bridges between physics and machine learning
                                    </span>
                                    <br />
                                    <span className="text-thz-cyan">
                                        to solve inverse problems
                                    </span>
                                    <span className="text-zinc-300">
                                        {" "}
                                        in imaging and spectroscopy.
                                    </span>
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2, delay: 3.2 }}
                                className="grid grid-cols-2 gap-4 md:gap-5 mt-auto"
                            >
                                {[
                                    {
                                        label: "Research",
                                        title: "THz-LTEM Inverse Problem",
                                        note: "Drift-Diffusion · Monte Carlo · PyTorch",
                                    },
                                    {
                                        label: "Internship",
                                        title: "Pineal",
                                        note: "HR SaaS · 社内ツールの自発的立ち上げ",
                                    },
                                    {
                                        label: "Internship",
                                        title: "KK-Generation",
                                        note: "ML × E2E · 曖昧な要求を仕様に",
                                    },
                                    {
                                        label: "Personal",
                                        title: "PaperLens",
                                        note: "自分の課題起点で 3 ヶ月で公開",
                                    },
                                ].map((card) => (
                                    <Tilt3D
                                        key={card.title}
                                        maxTilt={8}
                                        scale={1.04}
                                        className="rounded-lg"
                                    >
                                        <div className="relative rounded-lg border border-slate-line bg-[#14171C] h-28 md:h-32 p-4 overflow-hidden transition-colors hover:border-thz-cyan/40">
                                            <div className="text-[10px] font-mono text-thz-cyan tracking-widest uppercase mb-1">
                                                {card.label}
                                            </div>
                                            <div className="text-sm md:text-base font-display font-semibold text-thz-amber tracking-tight leading-tight mb-1.5">
                                                {card.title}
                                            </div>
                                            <div className="text-[11px] font-mono text-zinc-400 leading-snug">
                                                {card.note}
                                            </div>
                                            <div
                                                aria-hidden
                                                className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-inset ring-white/5"
                                            />
                                        </div>
                                    </Tilt3D>
                                ))}
                            </motion.div>
                        </div>
                    }
                />
            </BrowserChrome>
        </section>
    );
}
