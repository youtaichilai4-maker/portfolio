"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { ReactNode, useState } from "react";
import DriftDiffusionParticles from "./DriftDiffusionParticles";

export type CodeLine = {
    n: number;
    render: ReactNode | null;
};

// Styled inline directive — "this file emits particles into the rendered pane"
export function ParticleDirective({
    flow = "drift-diffusion",
    palette = "cyan → amber",
    density,
}: {
    flow?: string;
    palette?: string;
    density?: string | number;
}) {
    return (
        <span className="relative">
            <span className="text-thz-cyan">@particles</span>
            <span className="text-zinc-500">(</span>
            <span className="text-zinc-400">flow</span>
            <span className="text-zinc-500">=</span>
            <span
                className="text-thz-amber"
                style={{ textShadow: "0 0 10px rgba(245,165,36,0.45)" }}
            >
                &quot;{flow}&quot;
            </span>
            <span className="text-zinc-500">, </span>
            <span className="text-zinc-400">palette</span>
            <span className="text-zinc-500">=</span>
            <span
                className="text-thz-amber"
                style={{ textShadow: "0 0 10px rgba(245,165,36,0.45)" }}
            >
                &quot;{palette}&quot;
            </span>
            {density !== undefined && (
                <>
                    <span className="text-zinc-500">, </span>
                    <span className="text-zinc-400">density</span>
                    <span className="text-zinc-500">=</span>
                    <span className="text-thz-amber">{density}</span>
                </>
            )}
            <span className="text-zinc-500">)</span>
            <span className="inline-flex items-center gap-1 ml-2 align-middle">
                <span
                    className="w-1.5 h-1.5 rounded-full bg-thz-cyan animate-pulse"
                    style={{ boxShadow: "0 0 8px rgba(127,227,255,0.9)" }}
                />
                <span className="text-zinc-600 text-[10px] tracking-wider">
                    ▸ emit
                </span>
            </span>
        </span>
    );
}

// Horizontal "emission" band — looks like particles flowing out of the code
export function EmitBand() {
    return (
        <span className="inline-flex items-center gap-[2px] align-middle">
            <span className="text-zinc-600">// </span>
            <span
                className="text-thz-cyan"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
            >
                ░
            </span>
            <span
                className="text-thz-cyan/80"
                style={{ animation: "pulse 2s ease-in-out infinite 0.2s" }}
            >
                ▒
            </span>
            <span
                className="text-thz-cyan/60"
                style={{ animation: "pulse 2s ease-in-out infinite 0.4s" }}
            >
                ▓
            </span>
            <span className="text-thz-amber/80 ml-1">▸▸▸</span>
            <span className="text-zinc-500 text-[10px] ml-2 tracking-wider">
                rendering into pane →
            </span>
        </span>
    );
}

export function EquationLayer() {
    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        >
            <span className="absolute top-[6%] left-[12%] text-zinc-700/30 text-sm italic font-serif">
                ∂n/∂t
            </span>
            <span className="absolute top-[8%] left-[40%] text-zinc-700/30 text-sm italic font-serif">
                D∇²n
            </span>
            <span className="absolute top-[60%] left-[8%] text-zinc-700/25 text-sm italic font-serif">
                μE·∇n
            </span>
            <span className="absolute bottom-[10%] right-[16%] text-zinc-700/30 text-sm italic font-serif">
                D∇²n
            </span>
            <span className="absolute top-[18%] right-[10%] text-zinc-700/25 text-sm italic font-serif">
                ∂n/∂t
            </span>
        </div>
    );
}

export function CodeLines({
    lines,
    staggerOnMount = false,
}: {
    lines: CodeLine[];
    staggerOnMount?: boolean;
}) {
    return (
        <div className="relative font-mono text-[11px] sm:text-[12px] md:text-[13px] leading-7 py-4 overflow-x-auto">
            {lines.map((line, i) => {
                const content = (
                    <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 lg:min-w-max">
                        <span className="text-zinc-600 w-6 text-right shrink-0 select-none">
                            {line.n}
                        </span>
                        <span className="whitespace-pre-wrap break-words lg:whitespace-pre min-w-0 flex-1">
                            {line.render ?? " "}
                        </span>
                    </div>
                );

                if (staggerOnMount) {
                    return (
                        <motion.div
                            key={line.n}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.35,
                                delay: 0.05 * i,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {content}
                        </motion.div>
                    );
                }

                return (
                    <motion.div
                        key={line.n}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.35,
                            delay: 0.04 * i,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {content}
                    </motion.div>
                );
            })}
        </div>
    );
}

export function BrowserChrome({
    url = "akase.dev",
    children,
}: {
    url?: string;
    children: ReactNode;
}) {
    return (
        <div className="w-full max-w-[1440px] mx-auto rounded-lg md:rounded-xl overflow-hidden border border-slate-line shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] bg-slate-ink">
            <div className="flex items-center gap-3 px-4 h-10 bg-[#14171C] border-b border-slate-line">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/90" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
                    <div className="w-3 h-3 rounded-full bg-green-500/90" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="px-4 py-1 rounded-md bg-[#0B0D10] border border-slate-line/70 text-xs text-zinc-400 font-mono">
                        🔒 {url}
                    </div>
                </div>
                <div className="w-12" />
            </div>
            {children}
        </div>
    );
}

export default function SplitPane({
    filename,
    codeLines,
    staggerOnMount = false,
    rendered,
    minHeight = "640px",
    rightChildren,
    ambientParticles = true,
    particleDensity = 0.5,
}: {
    filename: string;
    codeLines: CodeLine[];
    staggerOnMount?: boolean;
    rendered: ReactNode;
    minHeight?: string;
    rightChildren?: ReactNode;
    ambientParticles?: boolean;
    particleDensity?: number;
}) {
    const [mobileTab, setMobileTab] = useState<"preview" | "source">("preview");

    return (
        <div>
            {/* Mobile/tablet tabs — preview is default, source shows the code
                pane. Hidden at lg+, where the side-by-side grid is unchanged. */}
            <div
                role="tablist"
                aria-label="View"
                className="flex items-center gap-1 px-3 pt-2 bg-[#14171C] border-b border-slate-line/70 lg:hidden"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={mobileTab === "preview"}
                    onClick={() => setMobileTab("preview")}
                    className={`px-3 py-1.5 rounded-t-md font-mono text-xs tracking-wide border border-b-0 transition-colors ${
                        mobileTab === "preview"
                            ? "bg-[#0B0D10] border-slate-line text-thz-cyan"
                            : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                    preview
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mobileTab === "source"}
                    onClick={() => setMobileTab("source")}
                    className={`px-3 py-1.5 rounded-t-md font-mono text-xs tracking-wide border border-b-0 transition-colors ${
                        mobileTab === "source"
                            ? "bg-[#0B0D10] border-slate-line text-thz-cyan"
                            : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                    source
                </button>
            </div>

            <div
                className="grid grid-cols-1 lg:grid-cols-2"
                style={{ minHeight }}
            >
                {/* LEFT — code editor */}
                <div
                    className={`relative bg-[#0B0D10] border-b lg:border-b-0 lg:border-r border-slate-line ${
                        mobileTab === "source" ? "block" : "hidden"
                    } lg:block`}
                >
                    <EquationLayer />
                    <div className="flex items-center gap-3 px-4 h-10 border-b border-slate-line/70">
                        <div className="w-4 h-4 flex flex-col justify-between">
                            <span className="block w-full h-[2px] bg-zinc-500" />
                            <span className="block w-full h-[2px] bg-zinc-500" />
                            <span className="block w-full h-[2px] bg-zinc-500" />
                        </div>
                        <span className="font-mono text-xs text-zinc-400">
                            {filename}
                        </span>
                    </div>
                    <CodeLines lines={codeLines} staggerOnMount={staggerOnMount} />
                </div>

                {/* RIGHT — rendered view */}
                <div
                    className={`relative bg-[#0B0D10] overflow-hidden ${
                        mobileTab === "preview" ? "block" : "hidden"
                    } lg:block`}
                >
                    <EquationLayer />
                    {ambientParticles && (
                        <DriftDiffusionParticles
                            className="absolute inset-0 w-full h-full"
                            density={particleDensity}
                        />
                    )}
                    {rightChildren}
                    {/* subtle right-edge amber glow suggesting "settled" field */}
                    <div
                        aria-hidden
                        className="absolute inset-y-0 right-0 w-1/3 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse at 100% 50%, rgba(245,165,36,0.06), transparent 60%)",
                        }}
                    />
                    <button
                        type="button"
                        aria-label="View source"
                        className="absolute top-3 right-4 z-20 text-zinc-500 hover:text-thz-cyan transition-colors"
                    >
                        <Code2 className="w-5 h-5" />
                    </button>
                    <div className="relative z-10 px-5 sm:px-8 md:px-12 py-8 md:py-10 h-full">
                        {rendered}
                    </div>
                </div>
            </div>
        </div>
    );
}
