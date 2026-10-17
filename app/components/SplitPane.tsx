"use client";

import { Code2 } from "lucide-react";
import dynamic from "next/dynamic";
import { MouseEvent, ReactNode, useRef, useState } from "react";

// WebGL/three.js only ever runs client-side — keep it out of the SSR bundle.
const DriftField = dynamic(() => import("./DriftField"), { ssr: false });

export type CodeLine = {
    n: number;
    render: ReactNode | null;
    /** Start line of the markdown block this line belongs to (hover-link id). */
    block?: number;
};

// Hover link between the source pane and the rendered pane. Both sides tag
// their elements with data-block; SplitPane toggles an .is-linked class on
// every element sharing the hovered id via event delegation — plain DOM, no
// React re-render per hover.
export function blockAttrs(id: number | undefined) {
    return id === undefined ? {} : { "data-block": id };
}

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

function SourceLine({ line }: { line: CodeLine }) {
    return (
        <div
            {...blockAttrs(line.block)}
            className="src-line flex gap-3 sm:gap-4 px-4 sm:px-6 border-l-2 border-transparent"
        >
            <span className="src-line-no w-6 text-right shrink-0 select-none text-zinc-600">
                {line.n}
            </span>
            <span className="whitespace-pre-wrap break-words min-w-0 flex-1">
                {line.render ?? " "}
            </span>
        </div>
    );
}

export function CodeLines({ lines }: { lines: CodeLine[] }) {
    return (
        <div className="relative font-mono text-[11px] sm:text-[12px] md:text-[13px] leading-7 py-4">
            {lines.map((line) => (
                <SourceLine key={line.n} line={line} />
            ))}
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
    rendered,
    minHeight = "640px",
    rightChildren,
    ambientParticles = true,
    particleDensity = 0.5,
}: {
    filename: string;
    codeLines: CodeLine[];
    rendered: ReactNode;
    minHeight?: string;
    rightChildren?: ReactNode;
    ambientParticles?: boolean;
    particleDensity?: number;
}) {
    const [mobileTab, setMobileTab] = useState<"preview" | "source">("preview");
    const rootRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<string | null>(null);

    const setLinked = (id: string | null) => {
        if (id === activeRef.current) return;
        const root = rootRef.current;
        if (!root) return;
        root.querySelectorAll(".is-linked").forEach((el) =>
            el.classList.remove("is-linked")
        );
        if (id !== null) {
            root.querySelectorAll(`[data-block="${id}"]`).forEach((el) =>
                el.classList.add("is-linked")
            );
        }
        activeRef.current = id;
    };
    const onPointerOver = (e: MouseEvent<HTMLDivElement>) => {
        const hit = (e.target as HTMLElement).closest("[data-block]");
        setLinked(hit?.getAttribute("data-block") ?? null);
    };

    return (
        <div
            ref={rootRef}
            onMouseOver={onPointerOver}
            onMouseLeave={() => setLinked(null)}
        >
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
                    {/* At lg the source is clipped to the rendered pane's
                        height (no inner scroll) and fades out at the bottom. */}
                    <div className="lg:absolute lg:inset-x-0 lg:top-10 lg:bottom-0 lg:overflow-hidden">
                        <CodeLines lines={codeLines} />
                        <div
                            aria-hidden
                            className="hidden lg:block absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-[#0B0D10] to-transparent"
                        />
                    </div>
                </div>

                {/* RIGHT — rendered view */}
                <div
                    className={`relative bg-[#0B0D10] overflow-hidden ${
                        mobileTab === "preview" ? "block" : "hidden"
                    } lg:block`}
                >
                    <EquationLayer />
                    {ambientParticles && (
                        <DriftField
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
