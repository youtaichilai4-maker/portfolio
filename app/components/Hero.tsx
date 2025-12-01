"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { PROFILE } from "../data";
import TerminalHero from "./TerminalHero";

export default function Hero() {
    const [showMainContent, setShowMainContent] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

    return (
        <motion.section
            ref={sectionRef}
            style={{ opacity, scale, y }}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
        >
            {/* Background gradient orbs with enhanced animation */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan opacity-20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple opacity-20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                {/* Additional accent orb */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-cyan opacity-10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 30, -30, 0],
                        y: [0, -30, 30, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Terminal Hero */}
            <AnimatePresence>
                {!showMainContent && (
                    <TerminalHero onComplete={() => setShowMainContent(true)} />
                )}
            </AnimatePresence>

            {/* Main content with staggered reveal */}
            <AnimatePresence>
                {showMainContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center z-10 max-w-4xl relative"
                    >
                        {/* Decorative accent lines */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            className="absolute -left-8 md:-left-16 top-1/2 w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                        />
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            className="absolute -right-8 md:-right-16 top-1/2 w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent"
                        />

                        <motion.h1
                            initial={{ opacity: 0, y: 20, letterSpacing: "-0.1em" }}
                            animate={{ opacity: 1, y: 0, letterSpacing: "-0.02em" }}
                            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-6xl md:text-8xl font-bold mb-4 text-glow relative inline-block"
                        >
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                {PROFILE.name.split(" ")[0]}
                            </motion.span>
                            {" "}
                            <motion.span
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                {PROFILE.name.split(" ")[1]}
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-2xl md:text-3xl text-neon-cyan mb-2 font-semibold tracking-tight"
                        >
                            {PROFILE.title}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-lg md:text-xl text-gray-400 mb-6 font-light"
                        >
                            {PROFILE.university}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-xl md:text-2xl text-gray-300 italic max-w-2xl mx-auto leading-relaxed"
                        >
                            {PROFILE.tagline}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
