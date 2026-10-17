"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { MdBlock, renderInline } from "../lib/markdown";
import ParticleTitle from "./ParticleTitle";
import { blockAttrs } from "./SplitPane";

// Wraps one rendered block so it lights up together with its source lines.
export function Linked({
    id,
    children,
    className = "",
}: {
    id: number | undefined;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div {...blockAttrs(id)} className={`linkable relative rounded-md ${className}`}>
            {children}
        </div>
    );
}

export function Paragraph({ text, className }: { text: string; className: string }) {
    const parts = text.split("\n");
    return (
        <p className={className}>
            {parts.map((part, i) => (
                <span key={i}>
                    {renderInline(part)}
                    {i < parts.length - 1 && <br />}
                </span>
            ))}
        </p>
    );
}

export function BulletList({ items, dot = "bg-thz-cyan/60" }: { items: string[]; dot?: string }) {
    return (
        <ul className="space-y-1.5">
            {items.map((item, i) => (
                <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-300 leading-relaxed pl-1"
                >
                    <span className={`mt-2 block w-1 h-1 rounded-full shrink-0 ${dot}`} />
                    <span className="flex-1">{renderInline(item)}</span>
                </li>
            ))}
        </ul>
    );
}

const reveal = (i: number) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, margin: "-60px" },
    transition: { duration: 0.6, delay: Math.min(i * 0.08, 0.5), ease: [0.22, 1, 0.36, 1] },
});

/** Prose rendering — used for intro / about bodies and experience details. */
export default function MdRender({
    blocks,
    size = "base",
    sectionCards = false,
}: {
    blocks: MdBlock[];
    size?: "base" | "sm";
    /** Render each "### heading + body" group as its own card. */
    sectionCards?: boolean;
}) {
    const pClass =
        size === "sm"
            ? "text-sm text-zinc-300 leading-relaxed"
            : "text-[15px] md:text-base text-zinc-300 leading-[1.95]";

    // Group blocks: anything before the first h3 is the lead, then one group per h3.
    const lead: MdBlock[] = [];
    const groups: { head: MdBlock; body: MdBlock[] }[] = [];
    for (const b of blocks) {
        if (b.kind === "h3") groups.push({ head: b, body: [] });
        else if (groups.length) groups[groups.length - 1].body.push(b);
        else lead.push(b);
    }

    const renderBlock = (b: MdBlock, i: number, inCard = false): ReactNode => {
        switch (b.kind) {
            case "h1":
            case "h2":
                return (
                    <Linked key={b.line} id={b.line}>
                        <ParticleTitle
                            text={b.text}
                            fontSize={b.kind === "h1" ? 44 : 40}
                            fontWeight={600}
                            sampleStep={3}
                            assembleDuration={1800}
                            trigger="view"
                            as="h3"
                        />
                    </Linked>
                );
            case "h3":
                return (
                    <Linked key={b.line} id={b.line}>
                        <h4 className="font-display text-base md:text-lg font-semibold text-thz-cyan tracking-tight">
                            {b.text}
                        </h4>
                    </Linked>
                );
            case "p": {
                const isLead = !inCard && sectionCards && i === 1;
                return (
                    <Linked key={b.line} id={b.line}>
                        <Paragraph
                            text={b.text}
                            className={
                                isLead
                                    ? "font-sans text-lg md:text-xl leading-relaxed text-zinc-100"
                                    : pClass
                            }
                        />
                    </Linked>
                );
            }
            case "ul":
                return (
                    <Linked key={b.line} id={b.line}>
                        <BulletList items={b.items} />
                    </Linked>
                );
            default:
                return null;
        }
    };

    if (sectionCards) {
        return (
            <div className="flex flex-col gap-5 h-full">
                {lead.map((b, i) => (
                    <motion.div key={b.line} {...reveal(i)}>
                        {renderBlock(b, i)}
                    </motion.div>
                ))}
                <div className="flex flex-col gap-3 flex-1">
                    {groups.map((g, gi) => (
                        <motion.div
                            key={g.head.line}
                            {...reveal(gi + lead.length)}
                            className="flex-1 rounded-xl border border-slate-line/70 bg-[#14171C]/90 p-5 md:p-6 flex flex-col gap-2 transition-colors duration-300 hover:border-thz-cyan/40"
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-thz-amber">
                                    {String(gi + 1).padStart(2, "0")}
                                </span>
                                {renderBlock(g.head, 0, true)}
                            </div>
                            {g.body.map((b, bi) => renderBlock(b, bi, true))}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={size === "sm" ? "space-y-2" : "space-y-5"}>
            {[...lead, ...groups.flatMap((g) => [g.head, ...g.body])].map((b, i) => (
                <motion.div
                    key={b.line}
                    {...reveal(i)}
                    className={b.kind === "h3" && i > 0 ? "pt-2" : ""}
                >
                    {renderBlock(b, i)}
                </motion.div>
            ))}
        </div>
    );
}
