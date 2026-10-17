"use client";

import { ABOUT_MD } from "../data";
import { parseDoc, sourceLines } from "../lib/markdown";
import MdRender from "./MdRender";
import SplitPane, { BrowserChrome } from "./SplitPane";
import TitleWithEquations from "./TitleWithEquations";

const doc = parseDoc(`---
section: "about"
focus: "inverse problems"
@particles(density=0.5)
---
<!-- emit -->

${ABOUT_MD}`);
const lines = sourceLines(doc);

export default function About() {
    return (
        <section id="about" className="relative bg-slate-ink scroll-mt-24">
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
                <BrowserChrome url="akase.dev/about.md">
                    <SplitPane
                        filename="about.md"
                        codeLines={lines}
                        minHeight="620px"
                        particleDensity={0.5}
                        rendered={<MdRender blocks={doc.blocks} sectionCards />}
                    />
                </BrowserChrome>
            </div>
        </section>
    );
}
