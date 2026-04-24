"use client";

import { PROFILE } from "../data";
import SplitPane, {
    BrowserChrome,
    CodeLine,
    EmitBand,
    ParticleDirective,
} from "./SplitPane";
import TitleWithEquations from "./TitleWithEquations";

const aboutLines: CodeLine[] = [
    { n: 1, render: <span className="text-zinc-500">---</span> },
    {
        n: 2,
        render: (
            <>
                <span className="text-thz-cyan">section</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;about&quot;</span>
            </>
        ),
    },
    { n: 3, render: <ParticleDirective density={0.5} /> },
    { n: 4, render: <span className="text-zinc-500">---</span> },
    { n: 5, render: <EmitBand /> },
    { n: 6, render: null },
    {
        n: 7,
        render: (
            <>
                <span className="text-thz-cyan">## </span>
                <span className="text-zinc-100">About</span>
            </>
        ),
    },
    { n: 8, render: null },
    {
        n: 9,
        render: (
            <span className="text-zinc-300">
                ドメイン知識と実装力の両方で課題を解き、
            </span>
        ),
    },
    {
        n: 10,
        render: (
            <span className="text-zinc-300">
                社会に届けるエンジニアを目指しています。
            </span>
        ),
    },
    { n: 11, render: null },
    {
        n: 12,
        render: (
            <span className="text-zinc-300">
                - 研究: 物理シミュレーション × ML の逆問題
            </span>
        ),
    },
    {
        n: 13,
        render: (
            <span className="text-zinc-300">
                - インターン: バックエンド / ML プロダクト
            </span>
        ),
    },
    {
        n: 14,
        render: (
            <span className="text-zinc-300">
                - 個人開発: SaaS の設計からデプロイまで
            </span>
        ),
    },
    { n: 15, render: null },
    {
        n: 16,
        render: (
            <>
                <span className="text-thz-cyan">focus</span>
                <span className="text-zinc-500">: </span>
                <span className="text-thz-amber">&quot;inverse problems&quot;</span>
            </>
        ),
    },
    { n: 17, render: null },
    { n: 18, render: null },
    { n: 19, render: null },
];

export default function About() {
    return (
        <section id="about" className="relative bg-slate-ink">
            <TitleWithEquations
                palette="about"
                chapter="§ about.md"
                subtitle={
                    <p className="font-mono text-xs text-zinc-500 tracking-wider">
                        // who I am, what I work on
                    </p>
                }
            >
                About
            </TitleWithEquations>
            <div className="px-3 sm:px-4 pb-12">
                <BrowserChrome>
                    <SplitPane
                        filename="about.md"
                        codeLines={aboutLines}
                        minHeight="560px"
                        particleDensity={0.5}
                        rendered={
                            <div className="flex flex-col gap-6 h-full">
                                <div className="rounded-xl border border-slate-line/70 bg-[#14171C] p-6 md:p-8 max-w-xl">
                                    <p className="font-sans text-base md:text-lg leading-relaxed text-zinc-300">
                                        {PROFILE.about}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 max-w-xl mt-auto">
                                    <div className="rounded-lg border border-slate-line/70 bg-[#14171C] p-4">
                                        <div className="text-xs text-thz-cyan font-mono mb-1">
                                            Focus
                                        </div>
                                        <div className="text-sm text-zinc-200">
                                            Inverse problems in imaging & spectroscopy
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-line/70 bg-[#14171C] p-4">
                                        <div className="text-xs text-thz-cyan font-mono mb-1">
                                            Stack
                                        </div>
                                        <div className="text-sm text-zinc-200">
                                            PyTorch · Next.js · python-pptx · FastAPI
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </BrowserChrome>
            </div>
        </section>
    );
}
