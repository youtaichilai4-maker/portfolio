"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { EXPERIENCES } from "../data";
import ParticleTitle from "./ParticleTitle";
import SplitPane, {
    BrowserChrome,
    CodeLine,
    EmitBand,
    ParticleDirective,
} from "./SplitPane";
import TitleWithEquations from "./TitleWithEquations";

const fileNames: Record<string, string> = {
    Research: "research/thz-ltem.md",
    Internship: "intern.md",
    "Personal Dev": "personal/paperlens.md",
};

const slugMap: Record<string, string> = {
    "THz-LTEM 逆問題 — 半導体物性の定量推定": "research/thz-ltem.md",
    "Pineal — HR SaaS & 社内ツールの自発的立ち上げ": "intern/pineal.md",
    "KK-Generation — 曖昧な要求を仕様にし、横断で届けた経験": "intern/kk-generation.md",
    "PaperLens — 自分の課題を起点に世に出した SaaS": "personal/paperlens.md",
};

// "Signature equation" shown faintly behind each pane's title — thematic
// tagline for the experience.
const signatureEq: Record<string, string> = {
    "THz-LTEM 逆問題 — 半導体物性の定量推定":
        "∂n/∂t = D∇²n + μE·∇n − n/τ + G",
    "Pineal — HR SaaS & 社内ツールの自発的立ち上げ":
        "output = render(source_of_truth)",
    "KK-Generation — 曖昧な要求を仕様にし、横断で届けた経験":
        "shape = postprocess(mask) → bbox | line",
    "PaperLens — 自分の課題を起点に世に出した SaaS":
        "UX = f(speed, privacy, cost)",
};

type Exp = (typeof EXPERIENCES)[number];

function buildExperienceLines(exp: Exp): CodeLine[] {
    const lines: CodeLine[] = [];
    let n = 1;

    lines.push({ n: n++, render: <span className="text-zinc-500">---</span> });
    lines.push({
        n: n++,
        render: (
            <>
                <span className="text-thz-cyan">type</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;{exp.type}&quot;</span>
            </>
        ),
    });
    lines.push({
        n: n++,
        render: (
            <>
                <span className="text-thz-cyan">title</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;{exp.title}&quot;</span>
            </>
        ),
    });
    lines.push({
        n: n++,
        render: <ParticleDirective density={0.75} />,
    });
    lines.push({ n: n++, render: <span className="text-zinc-500">---</span> });
    lines.push({ n: n++, render: <EmitBand /> });
    lines.push({ n: n++, render: null });

    lines.push({
        n: n++,
        render: (
            <>
                <span className="text-thz-cyan">## </span>
                <span className="text-zinc-100">Overview</span>
            </>
        ),
    });
    lines.push({ n: n++, render: null });

    // Word-aware wrapping so broken lines don't cut mid-word.
    const wrapText = (text: string, width: number): string[] => {
        const segments = text.split(/([、。 ]|\s+)/u).filter((s) => s.length > 0);
        const out: string[] = [];
        let current = "";
        for (const seg of segments) {
            if (current.length + seg.length > width && current.length > 0) {
                out.push(current.trimEnd());
                current = seg.trimStart();
            } else {
                current += seg;
            }
        }
        if (current.length > 0) out.push(current.trimEnd());
        return out;
    };
    wrapText(exp.desc, 44).forEach((chunk) => {
        lines.push({
            n: n++,
            render: <span className="text-zinc-300">{chunk}</span>,
        });
    });
    lines.push({ n: n++, render: null });

    lines.push({
        n: n++,
        render: (
            <>
                <span className="text-thz-cyan">## </span>
                <span className="text-zinc-100">Stack</span>
            </>
        ),
    });
    exp.tech.forEach((t) => {
        lines.push({
            n: n++,
            render: (
                <>
                    <span className="text-thz-cyan">- </span>
                    <span className="text-zinc-300">{t}</span>
                </>
            ),
        });
    });
    lines.push({ n: n++, render: null });

    if (exp.achievements && exp.achievements.length > 0) {
        lines.push({
            n: n++,
            render: (
                <>
                    <span className="text-thz-cyan">## </span>
                    <span className="text-zinc-100">Outcomes</span>
                </>
            ),
        });
        exp.achievements.forEach((a) => {
            wrapText(a, 42).forEach((chunk, i) => {
                lines.push({
                    n: n++,
                    render: (
                        <>
                            <span className="text-thz-cyan">
                                {i === 0 ? "- " : "  "}
                            </span>
                            <span className="text-zinc-300">{chunk}</span>
                        </>
                    ),
                });
            });
        });
    }

    // Pad a few blank lines at the end — visual "file has room to grow"
    for (let i = 0; i < 4; i++) {
        lines.push({ n: n++, render: null });
    }
    return lines;
}

function renderInline(text: string, keyBase: number): JSX.Element[] {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts
        .filter((p) => p.length > 0)
        .map((p, i) => {
            if (p.startsWith("**") && p.endsWith("**")) {
                return (
                    <strong
                        key={`${keyBase}-${i}`}
                        className="font-semibold text-thz-amber"
                    >
                        {p.slice(2, -2)}
                    </strong>
                );
            }
            return <span key={`${keyBase}-${i}`}>{p}</span>;
        });
}

function renderDetails(details: string | undefined) {
    if (!details) return null;
    const lines = details.split("\n");
    const out: JSX.Element[] = [];
    let key = 0;
    let listBuf: string[] = [];

    const flushList = () => {
        if (listBuf.length === 0) return;
        out.push(
            <ol
                key={`list-${key++}`}
                className="list-decimal pl-6 space-y-1.5 my-2 marker:text-thz-cyan/60 marker:font-mono"
            >
                {listBuf.map((item, i) => (
                    <li
                        key={i}
                        className="text-sm text-zinc-300 leading-relaxed pl-1"
                    >
                        {renderInline(item, key * 100 + i)}
                    </li>
                ))}
            </ol>
        );
        listBuf = [];
    };

    for (const raw of lines) {
        const ln = raw.trimEnd();
        const numbered = ln.match(/^\s*(\d+)\.\s+(.+)$/);
        const dashBullet = ln.match(/^\s*-\s+(.+)$/);

        if (ln.trim().startsWith("■")) {
            flushList();
            out.push(
                <h4
                    key={key++}
                    className="font-display text-base font-semibold text-thz-cyan mt-4 mb-1 tracking-tight"
                >
                    {ln.replace(/^\s*■\s*/, "")}
                </h4>
            );
        } else if (ln.trim().startsWith("【") && ln.trim().endsWith("】")) {
            flushList();
            out.push(
                <h5
                    key={key++}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-thz-cyan/70 mt-3 mb-1"
                >
                    {ln.trim().replace(/^【|】$/g, "")}
                </h5>
            );
        } else if (numbered) {
            listBuf.push(numbered[2]);
        } else if (dashBullet) {
            flushList();
            out.push(
                <div
                    key={key++}
                    className="flex items-start gap-2 text-sm text-zinc-300 leading-relaxed pl-1"
                >
                    <span className="mt-1.5 block w-1 h-1 rounded-full bg-thz-cyan/60 shrink-0" />
                    <span className="flex-1">
                        {renderInline(dashBullet[1], key)}
                    </span>
                </div>
            );
        } else if (ln === "") {
            flushList();
        } else {
            flushList();
            out.push(
                <p
                    key={key++}
                    className="text-sm text-zinc-300 leading-relaxed"
                >
                    {renderInline(ln, key)}
                </p>
            );
        }
    }
    flushList();
    return <div className="space-y-1">{out}</div>;
}

function ExperiencePane({
    exp,
    index,
    total,
}: {
    exp: Exp;
    index: number;
    total: number;
}) {
    const filename = slugMap[exp.title] ?? "experience.md";
    const chapter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: 0.7,
                delay: Math.min(index * 0.05, 0.2),
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative px-3 sm:px-4"
        >
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
                    {filename}
                </span>
            </div>
            <BrowserChrome url={`akase.dev/${filename}`}>
                <SplitPane
                    filename={filename}
                    codeLines={buildExperienceLines(exp)}
                    minHeight="auto"
                    particleDensity={0.75}
                    rendered={
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-md bg-thz-cyan/10 border border-thz-cyan/30 text-thz-cyan text-[11px] font-mono tracking-wider uppercase">
                                    {exp.type}
                                </span>
                                <span className="text-zinc-500 text-xs font-mono">
                                    {filename}
                                </span>
                            </div>

                            <div className="relative">
                                {signatureEq[exp.title] && (
                                    <span
                                        aria-hidden
                                        className="absolute -top-5 left-0 font-serif italic text-zinc-500 whitespace-nowrap text-base md:text-xl pointer-events-none"
                                        style={{ opacity: 0.14 }}
                                    >
                                        {signatureEq[exp.title]}
                                    </span>
                                )}
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
                            </div>

                            <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl">
                                {exp.desc}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {exp.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="px-2 py-0.5 rounded-md border border-slate-line bg-[#14171C] text-[11px] font-mono text-zinc-300"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {exp.achievements && exp.achievements.length > 0 && (
                                <div className="rounded-lg border border-thz-cyan/20 bg-thz-cyan/[0.03] p-4">
                                    <div className="font-mono text-[10px] text-thz-cyan tracking-[0.2em] uppercase mb-2">
                                        // outcomes
                                    </div>
                                    <ul className="space-y-1.5">
                                        {exp.achievements.map((a, ai) => (
                                            <li
                                                key={ai}
                                                className="flex items-start gap-2 text-sm text-zinc-300"
                                            >
                                                <span className="mt-1.5 block w-1 h-1 rounded-full bg-thz-amber shrink-0" />
                                                <span className="leading-relaxed">
                                                    {a}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {exp.details && (
                                <div className="rounded-lg border border-slate-line bg-[#14171C]/60 p-4">
                                    <div className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-2">
                                        // details
                                    </div>
                                    {renderDetails(exp.details)}
                                </div>
                            )}

                            {exp.images && exp.images.length > 0 && (
                                <div className="grid grid-cols-1 gap-3">
                                    {exp.images.map((image, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden rounded-lg border border-slate-line bg-black/40"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={image.src}
                                                alt={
                                                    image.alt ??
                                                    `${exp.title} image ${i + 1}`
                                                }
                                                className="w-full h-auto object-contain"
                                            />
                                            {image.alt && (
                                                <div className="px-3 py-1.5 text-xs text-zinc-400 border-t border-slate-line">
                                                    {image.alt}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {exp.link && (
                                <a
                                    href={exp.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-thz-cyan hover:text-thz-amber transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>{exp.linkLabel ?? "サイトを見る"}</span>
                                </a>
                            )}
                        </div>
                    }
                />
            </BrowserChrome>
        </motion.div>
    );
}

export default function Experiences() {
    return (
        <section id="experiences" className="relative bg-slate-ink">
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
            <div className="flex flex-col gap-10 pb-16">
                {EXPERIENCES.map((exp, i) => (
                    <ExperiencePane
                        key={exp.title}
                        exp={exp}
                        index={i}
                        total={EXPERIENCES.length}
                    />
                ))}
            </div>
        </section>
    );
}
