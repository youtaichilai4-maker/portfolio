"use client";

import { motion } from "framer-motion";
import { HERO, PROFILE } from "../data";
import { findBlock, parseDoc, sourceLines } from "../lib/markdown";
import { Linked } from "./MdRender";
import ParticleTitle from "./ParticleTitle";
import SplitPane, { BrowserChrome } from "./SplitPane";
import Tilt3D from "./Tilt3D";

const doc = parseDoc(
    [
        "---",
        `name: "${PROFILE.name}"`,
        `role: "${HERO.role}"`,
        "@particles(density=1.1)",
        "---",
        "<!-- emit -->",
        "",
        `# ${PROFILE.name}`,
        "",
        ...HERO.lead,
        "",
        ...HERO.cards.map((c) => `- **${c.label}** · ${c.title} — ${c.note}`),
    ].join("\n")
);
const heroLines = sourceLines(doc);
const titleId = findBlock(doc, "h1")?.line;
const leadId = findBlock(doc, "p")?.line;
const cardsId = findBlock(doc, "ul")?.line;

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, margin: "-80px" },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function SplitCompileHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-10 sm:py-16 bg-slate-ink overflow-hidden">
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
                    minHeight="720px"
                    particleDensity={1.1}
                    rendered={
                        <div className="flex flex-col gap-8 h-full">
                            <Linked id={titleId}>
                                <ParticleTitle
                                    text={PROFILE.name}
                                    fontSize={88}
                                    fontWeight={700}
                                    assembleDuration={2600}
                                    trigger="view"
                                />
                            </Linked>

                            <motion.div {...fadeUp(1.6)} className="max-w-xl">
                                <Linked
                                    id={leadId}
                                    className="rounded-xl border border-slate-line/70 bg-[#14171C]/85 backdrop-blur-[2px] p-6 md:p-8"
                                >
                                    <p className="font-sans text-lg md:text-xl leading-relaxed">
                                        <span className="text-thz-amber">{HERO.lead[0]}</span>
                                        <br />
                                        <span className="text-thz-cyan">{HERO.lead[1]}</span>
                                    </p>
                                </Linked>
                            </motion.div>

                            <motion.div {...fadeUp(2)} className="mt-auto">
                            <Linked
                                id={cardsId}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5"
                            >
                                {HERO.cards.map((card) => (
                                    <Tilt3D
                                        key={card.title}
                                        maxTilt={8}
                                        scale={1.04}
                                        className="rounded-lg"
                                    >
                                        <div className="relative rounded-lg border border-slate-line bg-[#14171C] h-28 md:h-32 p-4 overflow-hidden transition-all duration-300 hover:border-thz-cyan/50 hover:shadow-[0_0_28px_rgba(127,227,255,0.15)]">
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
                            </Linked>
                            </motion.div>
                        </div>
                    }
                />
            </BrowserChrome>
        </section>
    );
}
