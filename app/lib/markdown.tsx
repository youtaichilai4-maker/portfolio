"use client";

import { ReactNode } from "react";
import { CodeLine, EmitBand, ParticleDirective } from "../components/SplitPane";

// One markdown document drives both panes: the left pane shows its source
// line-by-line, the right pane renders the same blocks. Block ids are the
// 1-based line number where the block starts, so hovering a source line can
// light up the rendered block it produced (and vice versa).

export type MdBlock =
    | { kind: "h1"; text: string; line: number; end: number }
    | { kind: "h2"; text: string; line: number; end: number }
    | { kind: "h3"; text: string; line: number; end: number }
    | { kind: "p"; text: string; line: number; end: number }
    | { kind: "ul"; items: string[]; line: number; end: number }
    | { kind: "img"; alt: string; src: string; line: number; end: number }
    | {
          kind: "details";
          summary: string;
          blocks: MdBlock[];
          line: number;
          end: number;
      };

export type MdDoc = { lines: string[]; bodyStart: number; blocks: MdBlock[] };

const IMG_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const SUMMARY_RE = /^<summary>(.*)<\/summary>$/;

function parseRange(lines: string[], from: number, to: number): MdBlock[] {
    const blocks: MdBlock[] = [];
    let i = from;
    while (i < to) {
        const ln = lines[i].trim();
        const line = i + 1;
        if (ln === "" || ln.startsWith("<!--")) {
            i++;
            continue;
        }
        const heading = ln.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
            const kind = (["h1", "h2", "h3"] as const)[heading[1].length - 1];
            blocks.push({ kind, text: heading[2], line, end: line });
            i++;
            continue;
        }
        const img = ln.match(IMG_RE);
        if (img) {
            blocks.push({ kind: "img", alt: img[1], src: img[2], line, end: line });
            i++;
            continue;
        }
        if (ln === "<details>") {
            let j = i + 1;
            let summary = "";
            while (j < to && lines[j].trim() !== "</details>") j++;
            let innerFrom = i + 1;
            const sm = lines[innerFrom]?.trim().match(SUMMARY_RE);
            if (sm) {
                summary = sm[1];
                innerFrom++;
            }
            blocks.push({
                kind: "details",
                summary,
                blocks: parseRange(lines, innerFrom, j),
                line,
                end: Math.min(j + 1, to),
            });
            i = j + 1;
            continue;
        }
        if (ln.startsWith("- ")) {
            const items: string[] = [];
            while (i < to && lines[i].trim().startsWith("- ")) {
                items.push(lines[i].trim().slice(2));
                i++;
            }
            blocks.push({ kind: "ul", items, line, end: i });
            continue;
        }
        // Paragraph: consecutive plain lines, joined with a line break.
        const buf: string[] = [];
        while (i < to) {
            const t = lines[i].trim();
            if (
                t === "" ||
                /^#{1,3}\s/.test(t) ||
                t.startsWith("- ") ||
                t.startsWith("<") ||
                IMG_RE.test(t)
            )
                break;
            buf.push(t);
            i++;
        }
        blocks.push({ kind: "p", text: buf.join("\n"), line, end: i });
    }
    return blocks;
}

export function parseDoc(source: string): MdDoc {
    const lines = source.split("\n");
    let bodyStart = 0;
    if (lines[0]?.trim() === "---") {
        const close = lines.findIndex((l, idx) => idx > 0 && l.trim() === "---");
        if (close > 0) bodyStart = close + 1;
    }
    return { lines, bodyStart, blocks: parseRange(lines, bodyStart, lines.length) };
}

/** Block id (start line) for every source line that belongs to a block. */
function lineOwners(blocks: MdBlock[], out = new Map<number, number>()) {
    for (const b of blocks) {
        if (b.kind === "details") {
            out.set(b.line, b.line);
            lineOwners(b.blocks, out);
            continue;
        }
        for (let n = b.line; n <= b.end; n++) out.set(n, b.line);
    }
    return out;
}

// ---------------------------------------------------------------------------
// Inline: **bold** and `code`
// ---------------------------------------------------------------------------

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export function renderInline(text: string): ReactNode[] {
    return text
        .split(INLINE_RE)
        .filter((p) => p.length > 0)
        .map((p, i) => {
            if (p.startsWith("**") && p.endsWith("**")) {
                return (
                    <strong key={i} className="font-semibold text-thz-amber">
                        {p.slice(2, -2)}
                    </strong>
                );
            }
            if (p.startsWith("`") && p.endsWith("`")) {
                return (
                    <code
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#14171C] border border-slate-line font-mono text-[0.85em] text-thz-cyan"
                    >
                        {p.slice(1, -1)}
                    </code>
                );
            }
            return <span key={i}>{p}</span>;
        });
}

function highlightInline(text: string): ReactNode[] {
    return text
        .split(INLINE_RE)
        .filter((p) => p.length > 0)
        .map((p, i) => {
            if (p.startsWith("**") && p.endsWith("**")) {
                return (
                    <span key={i}>
                        <span className="text-zinc-500">**</span>
                        <span className="text-thz-amber">{p.slice(2, -2)}</span>
                        <span className="text-zinc-500">**</span>
                    </span>
                );
            }
            if (p.startsWith("`") && p.endsWith("`")) {
                return (
                    <span key={i} className="text-thz-cyan/90">
                        {p}
                    </span>
                );
            }
            return <span key={i}>{p}</span>;
        });
}

// ---------------------------------------------------------------------------
// Source (left pane) highlighting
// ---------------------------------------------------------------------------

function highlightLine(raw: string, inFrontmatter: boolean): ReactNode | null {
    const ln = raw.trimEnd();
    if (ln === "") return null;
    if (ln.trim() === "---") return <span className="text-zinc-500">---</span>;
    if (ln.startsWith("@particles")) {
        const density = ln.match(/density=([\d.]+)/)?.[1];
        return <ParticleDirective density={density ? Number(density) : undefined} />;
    }
    if (ln.startsWith("<!--")) return <EmitBand />;
    if (inFrontmatter) {
        const kv = ln.match(/^([\w-]+):\s*(.*)$/);
        if (kv) {
            return (
                <>
                    <span className="text-thz-cyan">{kv[1]}</span>
                    <span className="text-zinc-500">: </span>
                    <span className="text-thz-amber">{kv[2]}</span>
                </>
            );
        }
    }
    const heading = ln.match(/^(#{1,3}\s)(.+)$/);
    if (heading) {
        return (
            <>
                <span className="text-thz-cyan">{heading[1]}</span>
                <span className="text-zinc-100 font-semibold">{heading[2]}</span>
            </>
        );
    }
    const img = ln.trim().match(IMG_RE);
    if (img) {
        return (
            <>
                <span className="text-zinc-500">![</span>
                <span className="text-zinc-300">{img[1]}</span>
                <span className="text-zinc-500">](</span>
                <span className="text-thz-cyan/80 underline decoration-dotted">{img[2]}</span>
                <span className="text-zinc-500">)</span>
            </>
        );
    }
    if (ln.trim().startsWith("<")) {
        const sm = ln.trim().match(SUMMARY_RE);
        if (sm) {
            return (
                <>
                    <span className="text-rose-300/80">&lt;summary&gt;</span>
                    <span className="text-zinc-300">{sm[1]}</span>
                    <span className="text-rose-300/80">&lt;/summary&gt;</span>
                </>
            );
        }
        return <span className="text-rose-300/80">{ln.trim()}</span>;
    }
    const bullet = ln.match(/^(\s*-\s)(.+)$/);
    if (bullet) {
        return (
            <>
                <span className="text-thz-cyan">{bullet[1]}</span>
                <span className="text-zinc-300">{highlightInline(bullet[2])}</span>
            </>
        );
    }
    return <span className="text-zinc-300">{highlightInline(ln)}</span>;
}

export function sourceLines(doc: MdDoc): CodeLine[] {
    const owners = lineOwners(doc.blocks);
    return doc.lines.map((raw, i) => ({
        n: i + 1,
        render: highlightLine(raw, i > 0 && i < doc.bodyStart - 1),
        block: owners.get(i + 1),
    }));
}

/** Find the n-th body block of a kind (optionally the one right after an h2 with that text). */
export function findBlock<K extends MdBlock["kind"]>(
    doc: MdDoc,
    kind: K,
    afterHeading?: string
): Extract<MdBlock, { kind: K }> | undefined {
    const bs = doc.blocks;
    if (afterHeading) {
        const h = bs.findIndex((b) => b.kind === "h2" && b.text === afterHeading);
        if (h < 0) return undefined;
        return bs.slice(h + 1).find((b) => b.kind === kind) as
            | Extract<MdBlock, { kind: K }>
            | undefined;
    }
    return bs.find((b) => b.kind === kind) as Extract<MdBlock, { kind: K }> | undefined;
}
