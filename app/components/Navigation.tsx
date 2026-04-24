"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { PROFILE } from "../data";
import MagneticLink from "./MagneticLink";

const navItems = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experiences", href: "#experiences" },
];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
    const navBlur = useTransform(scrollY, [0, 100], [0, 10]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
                opacity: navOpacity,
                backdropFilter: `blur(${navBlur}px)`,
            }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "py-3 bg-slate-ink/70 border-b border-slate-line backdrop-blur-md"
                    : "py-5"
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center gap-3">
                    <MagneticLink
                        href="#cover"
                        strength={8}
                        className="font-mono text-xs sm:text-sm text-thz-amber hover:text-thz-cyan transition-colors inline-block whitespace-nowrap"
                    >
                        {PROFILE.name.toLowerCase().replace(" ", "_")}
                    </MagneticLink>

                    <div className="flex gap-3 sm:gap-6">
                        {navItems.map((item) => (
                            <MagneticLink
                                key={item.href}
                                href={item.href}
                                strength={10}
                                className="font-mono text-[10px] sm:text-xs md:text-sm text-zinc-400 hover:text-thz-cyan transition-colors inline-block whitespace-nowrap"
                            >
                                {item.label.toLowerCase()}.md
                            </MagneticLink>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
