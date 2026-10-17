"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EXPERIENCES, Experience } from "../data";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { findBlock, MdDoc, parseDoc, sourceLines } from "../lib/markdown";
import { AuthVisual, PinealVisual } from "./ExperienceVisuals";
import MdRender, { Linked } from "./MdRender";
import ParticleTitle from "./ParticleTitle";
import ScrollStage from "./ScrollStage";
import SplitPane, { BrowserChrome } from "./SplitPane";
import TitleWithEquations from "./TitleWithEquations";

type Accent = "cyan" | "amber";

// Per-panel accent emphasis — alternates cyan-led / amber-led so the
// panels read as a progression rather than identical copies.
function accentTokens(accent: Accent) {
    if (accent === "cyan") {
        return {
            badge: "bg-thz-cyan/10 border-thz-cyan/30 text-thz-cyan",
            cardBorder: "border-thz-cyan/20 bg-thz-cyan/[0.03]",
            cardLabel: "text-thz-cyan",
            bullet: "bg-thz-amber",
            toggleAccent: "text-thz-cyan hover:text-thz-amber",
        };
    }
    return {
        badge: "bg-thz-amber/10 border-thz-amber/30 text-thz-amber",
        cardBorder: "border-thz-amber/20 bg-thz-amber/[0.03]",
        cardLabel: "text-thz-amber",
        bullet: "bg-thz-cyan",
        toggleAccent: "text-thz-amber hover:text-thz-cyan",
    };
}

const DETAILS_SUMMARY = "read the full story";

// The whole experience as one markdown file — the left pane shows exactly
// this, the right pane renders the same blocks.
function experienceDoc(exp: Experience): MdDoc {
    const visual = exp.images?.[0]
        ? `![${exp.images[0].alt}](${exp.images[0].src})`
        : exp.visual
          ? `![signature](visual:${exp.visual})`
          : null;
    return parseDoc(
        [
            "---",
            `type: "${exp.type}"`,
            `title: "${exp.title}"`,
            "@particles(density=0.75)",
            "---",
            "<!-- emit -->",
            "",
            `# ${exp.title}`,
            "",
            exp.desc,
            "",
            "## Stack",
            ...exp.tech.map((t) => `- ${t}`),
            "",
            "## Outcomes",
            ...exp.achievements.map((a) => `- ${a}`),
            "",
            ...(visual ? [visual, ""] : []),
            "<details>",
            `<summary>${DETAILS_SUMMARY}</summary>`,
            "",
            exp.details,
            "",
            "</details>",
        ].join("\n")
    );
}

// Collapsed-by-default "read the full story" panel. The details stay
// mounted (collapsed via height) so search engines / AI screeners can still
// read them — only the visual height animates.
function DetailsToggle({ doc, accent }: { doc: MdDoc; accent: Accent }) {
    const [open, setOpen] = useState(false);
    const reduced = useReducedMotion();
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    const tokens = accentTokens(accent);
    const details = findBlock(doc, "details");

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setHeight(el.scrollHeight));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    if (!details) return null;
    return (
        <Linked id={details.line} className="border border-slate-line bg-[#14171C]/60 rounded-lg">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors ${tokens.toggleAccent}`}
            >
                <span>
                    {open ? `// collapse the full story` : `// ${details.summary}`}
                </span>
                <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? height : 0 }}
                transition={
                    reduced ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                }
                className="overflow-hidden"
            >
                <div ref={contentRef} className="px-4 pb-5 pt-1">
                    <MdRender blocks={details.blocks} size="sm" />
                </div>
            </motion.div>
        </Linked>
    );
}

function SignatureVisual({ doc }: { doc: MdDoc }) {
    const img = findBlock(doc, "img");
    if (!img) return null;
    if (img.src.startsWith("visual:")) {
        const kind = img.src.slice("visual:".length);
        const visual =
            kind === "auth" ? <AuthVisual /> : kind === "pineal" ? <PinealVisual /> : null;
        if (!visual) return null;
        return (
            <Linked id={img.line} className="rounded-lg border border-slate-line bg-[#0B0D10]/60 p-3">
                {visual}
            </Linked>
        );
    }
    return (
        <Linked id={img.line} className="overflow-hidden rounded-lg border border-slate-line bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="w-full h-auto object-contain" />
        </Linked>
    );
}

function ExperiencePane({
    exp,
    index,
    total,
    panelId,
}: {
    exp: Experience;
    index: number;
    total: number;
    panelId: string;
}) {
    const doc = experienceDoc(exp);
    const chapter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    const accent: Accent = index % 2 === 0 ? "cyan" : "amber";
    const tokens = accentTokens(accent);
    const titleId = findBlock(doc, "h1")?.line;
    const descId = findBlock(doc, "p")?.line;
    const stackId = findBlock(doc, "ul", "Stack")?.line;
    const outcomesId = findBlock(doc, "ul", "Outcomes")?.line;

    return (
        <ScrollStage id={panelId} className="px-3 sm:px-4 scroll-mt-24">
            <div className="max-w-[1440px] mx-auto mb-3 flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-thz-cyan tracking-[0.3em] uppercase">
                    {chapter}
                </span>
                <span className="h-px flex-1 bg-slate-line" />
                <span className="font-mono text-[10px] text-zinc-500 tracking-[0.15em] uppercase">
                    {exp.type}
                </span>
                <span className="hidden md:inline h-px w-10 bg-slate-line" />
                <span className="hidden md:inline font-mono text-[10px] text-zinc-500 tracking-[0.15em]">
                    {exp.slug}
                </span>
            </div>
            <BrowserChrome url={`akase.dev/${exp.slug}`}>
                <SplitPane
                    filename={exp.slug}
                    codeLines={sourceLines(doc)}
                    minHeight="auto"
                    particleDensity={0.75}
                    rendered={
                        <div className="flex flex-col gap-5">
                            <Linked id={titleId} className="relative pt-4">
                                <span
                                    aria-hidden
                                    className="absolute -top-1 left-0 font-serif italic text-zinc-500 whitespace-nowrap text-base md:text-xl pointer-events-none"
                                    style={{ opacity: 0.14 }}
                                >
                                    {exp.signature}
                                </span>
                                <ParticleTitle
                                    text={exp.title}
                                    fontSize={32}
                                    fontWeight={600}
                                    sampleStep={3}
                                    assembleDuration={2000}
                                    trigger="view"
                                    as="h3"
                                    textClassName="!leading-[1.2]"
                                />
                            </Linked>

                            <Linked id={descId}>
                                <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl">
                                    {exp.desc}
                                </p>
                            </Linked>

                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5 items-start">
                                <div className="flex flex-col gap-4 min-w-0">
                                    <Linked id={stackId} className="flex flex-wrap gap-1.5">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-md border text-[11px] font-mono tracking-wider uppercase ${tokens.badge}`}
                                        >
                                            {exp.type}
                                        </span>
                                        {exp.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="px-2 py-0.5 rounded-md border border-slate-line bg-[#14171C] text-[11px] font-mono text-zinc-300 transition-colors hover:border-thz-cyan/50 hover:text-thz-cyan"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </Linked>

                                    <Linked
                                        id={outcomesId}
                                        className={`rounded-lg border p-4 ${tokens.cardBorder}`}
                                    >
                                        <div
                                            className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-2 ${tokens.cardLabel}`}
                                        >
                                            // outcomes
                                        </div>
                                        <ul className="space-y-1.5">
                                            {exp.achievements.map((a, ai) => (
                                                <motion.li
                                                    key={ai}
                                                    initial={{ opacity: 0, x: -6 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: false, margin: "-40px" }}
                                                    transition={{ duration: 0.4, delay: 0.08 * ai }}
                                                    className="flex items-start gap-2 text-sm text-zinc-300"
                                                >
                                                    <span
                                                        className={`mt-1.5 block w-1 h-1 rounded-full shrink-0 ${tokens.bullet}`}
                                                    />
                                                    <span className="leading-relaxed">{a}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </Linked>
                                </div>

                                <SignatureVisual doc={doc} />
                            </div>

                            <DetailsToggle doc={doc} accent={accent} />
                        </div>
                    }
                />
            </BrowserChrome>
        </ScrollStage>
    );
}

function ExperienceTimeline({
    items,
}: {
    items: { id: string; type: string; name: string }[];
}) {
    const [active, setActive] = useState(items[0]?.id);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target?.id) {
                    setActive(visible[0].target.id);
                }
            },
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: "-15% 0px -60% 0px",
            }
        );
        items.forEach((it) => {
            const el = document.getElementById(it.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [items]);

    return (
        <nav
            aria-label="Experiences timeline"
            className="max-w-[1440px] mx-auto mb-8 flex flex-wrap items-center gap-2"
        >
            {items.map((it, i) => {
                const isActive = active === it.id;
                return (
                    <a
                        key={it.id}
                        href={`#${it.id}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-300 ${
                            isActive
                                ? "border-thz-cyan/50 bg-thz-cyan/10 text-thz-cyan shadow-[0_0_18px_rgba(127,227,255,0.18)]"
                                : "border-slate-line text-zinc-500 hover:border-thz-cyan/30 hover:text-zinc-300"
                        }`}
                    >
                        <span className={isActive ? "text-thz-amber" : "text-zinc-600"}>
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{it.type}</span>
                        <span className="text-zinc-700" aria-hidden>
                            ·
                        </span>
                        <span className="text-zinc-400">{it.name}</span>
                    </a>
                );
            })}
        </nav>
    );
}

export default function Experiences() {
    const timelineItems = EXPERIENCES.map((exp, i) => ({
        id: `exp-panel-${i}`,
        type: exp.type,
        name: exp.short,
    }));

    return (
        <section id="experiences" className="relative bg-slate-ink scroll-mt-24">
            <TitleWithEquations
                palette="experiences"
                chapter="§ experiences/"
                subtitle={
                    <p className="font-mono text-xs text-zinc-500 tracking-wider">
                        // each experience is its own markdown file
                    </p>
                }
            >
                Experiences
            </TitleWithEquations>
            <div className="px-3 sm:px-4">
                <ExperienceTimeline items={timelineItems} />
            </div>
            <div className="flex flex-col gap-10 pb-16">
                {EXPERIENCES.map((exp, i) => (
                    <ExperiencePane
                        key={exp.slug}
                        exp={exp}
                        index={i}
                        total={EXPERIENCES.length}
                        panelId={`exp-panel-${i}`}
                    />
                ))}
            </div>
        </section>
    );
}
