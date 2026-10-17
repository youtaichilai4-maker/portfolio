"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Layers, LucideIcon } from "lucide-react";
import { SKILLS, SkillItem } from "../data";
import { parseDoc, sourceLines } from "../lib/markdown";
import { Linked } from "./MdRender";
import SplitPane, { BrowserChrome } from "./SplitPane";
import TitleWithEquations from "./TitleWithEquations";

const iconMap: Record<string, LucideIcon> = {
    Cpu,
    Database,
    Layers,
};

const doc = parseDoc(
    [
        "---",
        'section: "skills"',
        "@particles(density=0.5)",
        "---",
        "<!-- emit -->",
        "",
        "## Skills",
        "",
        ...SKILLS.flatMap((s) => [
            `### ${s.category}`,
            ...s.items.map((i) => `- ${i.name}`),
            "",
        ]),
    ].join("\n")
);
const lines = sourceLines(doc);

// Block ids for each category: [heading line, list line], in SKILLS order.
const categoryIds = doc.blocks
    .map((b, i) => (b.kind === "h3" ? [b.line, doc.blocks[i + 1]?.line] : null))
    .filter((x): x is number[] => x !== null);

// Chip with a hover/focus popover saying where the skill was used.
function SkillChip({ item }: { item: SkillItem }) {
    return (
        <span
            tabIndex={0}
            className="group relative inline-flex outline-none"
        >
            <span className="px-3 py-1.5 rounded-md border border-slate-line/80 bg-[#0F1216] text-xs md:text-[13px] font-mono text-zinc-200 transition-all duration-200 group-hover:border-thz-cyan/60 group-hover:text-thz-cyan group-hover:shadow-[0_0_16px_rgba(127,227,255,0.25)] group-focus:border-thz-cyan/60">
                {item.name}
            </span>
            <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 bottom-[calc(100%+8px)] z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-thz-amber/40 bg-slate-ink/95 px-2.5 py-1 font-mono text-[10px] text-thz-amber opacity-0 shadow-[0_6px_20px_rgba(0,0,0,0.6)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0"
            >
                {item.usedIn}
            </span>
        </span>
    );
}

export default function Skills() {
    return (
        <section id="skills" className="relative bg-slate-ink scroll-mt-24">
            <TitleWithEquations
                palette="skills"
                chapter="§ skills.md"
                subtitle={
                    <p className="font-mono text-xs text-zinc-500 tracking-wider">
                        // tools I reach for when solving problems — hover to see where
                    </p>
                }
            >
                Skills
            </TitleWithEquations>
            <div className="px-3 sm:px-4 pb-12">
                <BrowserChrome url="akase.dev/skills.md">
                    <SplitPane
                        filename="skills.md"
                        codeLines={lines}
                        minHeight="760px"
                        particleDensity={0.5}
                        rendered={
                            <div className="flex flex-col gap-4 h-full">
                                {SKILLS.map((skill, index) => {
                                    const Icon = iconMap[skill.icon];
                                    const [headId, listId] = categoryIds[index] ?? [];
                                    return (
                                        <motion.div
                                            key={skill.category}
                                            initial={{ opacity: 0, y: 18 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: false, margin: "-50px" }}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="flex-1 flex"
                                        >
                                            <Linked
                                                id={listId}
                                                className="flex-1 flex flex-col justify-center rounded-xl border border-slate-line/70 bg-[#14171C]/90 p-5 md:p-7 transition-colors duration-300 hover:border-thz-cyan/40"
                                            >
                                                <Linked id={headId}>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="font-mono text-[10px] text-zinc-500">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        {Icon && (
                                                            <Icon className="w-5 h-5 text-thz-cyan" />
                                                        )}
                                                        <h3 className="font-display text-xl md:text-2xl font-semibold text-thz-amber tracking-tight">
                                                            {skill.category}
                                                        </h3>
                                                    </div>
                                                </Linked>
                                                <div className="flex flex-wrap gap-2">
                                                    {skill.items.map((item) => (
                                                        <SkillChip key={item.name} item={item} />
                                                    ))}
                                                </div>
                                            </Linked>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        }
                    />
                </BrowserChrome>
            </div>
        </section>
    );
}
