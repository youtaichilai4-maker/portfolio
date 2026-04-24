"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Layers, LucideIcon } from "lucide-react";
import { SKILLS } from "../data";
import SplitPane, {
    BrowserChrome,
    CodeLine,
    EmitBand,
    ParticleDirective,
} from "./SplitPane";
import TitleWithEquations from "./TitleWithEquations";

const iconMap: Record<string, LucideIcon> = {
    Cpu,
    Database,
    Layers,
};

function buildSkillsLines(): CodeLine[] {
    const lines: CodeLine[] = [];
    let n = 1;
    lines.push({ n: n++, render: <span className="text-zinc-500">---</span> });
    lines.push({
        n: n++,
        render: (
            <>
                <span className="text-thz-cyan">section</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;skills&quot;</span>
            </>
        ),
    });
    lines.push({
        n: n++,
        render: <ParticleDirective density={0.5} />,
    });
    lines.push({ n: n++, render: <span className="text-zinc-500">---</span> });
    lines.push({ n: n++, render: <EmitBand /> });
    lines.push({ n: n++, render: null });
    lines.push({
        n: n++,
        render: (
            <>
                <span className="text-thz-cyan">## </span>
                <span className="text-zinc-100">Skills</span>
            </>
        ),
    });
    lines.push({ n: n++, render: null });

    SKILLS.forEach((s) => {
        lines.push({
            n: n++,
            render: (
                <>
                    <span className="text-thz-cyan">### </span>
                    <span className="text-zinc-100">{s.category}</span>
                </>
            ),
        });
        s.items.forEach((item) => {
            lines.push({
                n: n++,
                render: (
                    <>
                        <span className="text-thz-cyan">- </span>
                        <span className="text-zinc-300">{item}</span>
                    </>
                ),
            });
        });
        lines.push({ n: n++, render: null });
    });

    // pad
    while (lines.length < 26) {
        lines.push({ n: n++, render: null });
    }
    return lines;
}

const skillsLines = buildSkillsLines();

export default function Skills() {
    return (
        <section id="skills" className="relative bg-slate-ink">
            <TitleWithEquations
                palette="skills"
                chapter="§ skills.md"
                subtitle={
                    <p className="font-mono text-xs text-zinc-500 tracking-wider">
                        // tools I reach for when solving problems
                    </p>
                }
            >
                Skills
            </TitleWithEquations>
            <div className="px-3 sm:px-4 pb-12">
            <BrowserChrome>
                <SplitPane
                    filename="skills.md"
                    codeLines={skillsLines}
                    minHeight="640px"
                    particleDensity={0.5}
                    rendered={
                        <div className="flex flex-col gap-6 h-full">
                            <div className="grid grid-cols-1 gap-4">
                                {SKILLS.map((skill, index) => {
                                    const Icon = iconMap[skill.icon];
                                    return (
                                        <motion.div
                                            key={skill.category}
                                            initial={{ opacity: 0, y: 18 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="rounded-xl border border-slate-line/70 bg-[#14171C] p-5"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                {Icon && (
                                                    <Icon className="w-5 h-5 text-thz-cyan" />
                                                )}
                                                <h3 className="font-display text-xl font-semibold text-thz-amber tracking-tight">
                                                    {skill.category}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {skill.items.map((item) => (
                                                    <span
                                                        key={item}
                                                        className="px-2.5 py-1 rounded-md border border-slate-line/70 bg-[#14171C] text-xs font-mono text-zinc-300"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                />
            </BrowserChrome>
            </div>
        </section>
    );
}
