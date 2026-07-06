"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function SmoothScroll() {
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) return;

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1,
        });

        let rafId = requestAnimationFrame(function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        });

        function handleAnchorClick(e: MouseEvent) {
            const anchor = (e.target as HTMLElement)?.closest?.(
                "a[href^='#']"
            ) as HTMLAnchorElement | null;
            if (!anchor) return;
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            // No manual offset — Lenis reads each target's own
            // `scroll-margin-top` (our existing `scroll-mt-24`) the same
            // way native CSS scroll-behavior did.
            lenis.scrollTo(target as HTMLElement);
        }
        document.addEventListener("click", handleAnchorClick);

        return () => {
            document.removeEventListener("click", handleAnchorClick);
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [reduced]);

    return null;
}
