"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "../data";

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

    return (
        <motion.section
            ref={sectionRef}
            style={{ opacity, y }}
            id="about"
            className="py-20 px-4 relative"
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow inline-block">
                        About
                    </h2>
                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-neon-cyan to-transparent"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden group"
                >
                    {/* Animated border gradient */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent)",
                            backgroundSize: "200% 100%",
                        }}
                        animate={{
                            backgroundPosition: ["0% 0%", "200% 0%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <p className="text-lg md:text-xl leading-relaxed text-gray-300 relative z-10">
                        {PROFILE.about}
                    </p>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/30 opacity-50" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-purple/30 opacity-50" />
                </motion.div>
            </div>
        </motion.section>
    );
}
