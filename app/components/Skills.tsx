"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, Database, Layers, LucideIcon } from "lucide-react";
import { useRef } from "react";
import { SKILLS } from "../data";

const iconMap: Record<string, LucideIcon> = {
    Cpu,
    Database,
    Layers,
};

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <motion.section
            ref={sectionRef}
            style={{ opacity }}
            id="skills"
            className="py-20 px-4 relative"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mb-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow inline-block">
                        Skills
                    </h2>
                    {/* Decorative lines */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SKILLS.map((skill, index) => {
                        const Icon = iconMap[skill.icon];
                        return (
                            <motion.div
                                key={skill.category}
                                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    transition: { duration: 0.3 },
                                }}
                                className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                            >
                                {/* Hover glow effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `radial-gradient(circle at center, ${
                                            index === 0
                                                ? "rgba(6, 182, 212, 0.1)"
                                                : index === 1
                                                ? "rgba(139, 92, 246, 0.1)"
                                                : "rgba(6, 182, 212, 0.1)"
                                        }, transparent)`,
                                    }}
                                />

                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    {Icon && (
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.2 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                        >
                                            <Icon className="w-8 h-8 text-neon-cyan" />
                                        </motion.div>
                                    )}
                                    <h3 className="text-2xl font-bold text-neon-cyan">
                                        {skill.category}
                                    </h3>
                                </div>
                                <ul className="space-y-2 relative z-10">
                                    {skill.items.map((item, itemIndex) => (
                                        <motion.li
                                            key={item}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.15 + itemIndex * 0.08,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            whileHover={{ x: 4, color: "#06b6d4" }}
                                            className="text-gray-300 flex items-center gap-2 transition-colors cursor-default"
                                        >
                                            <motion.span
                                                className="w-2 h-2 bg-neon-purple rounded-full"
                                                whileHover={{ scale: 1.5 }}
                                            />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Corner accent */}
                                <div
                                    className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 ${
                                        index === 0
                                            ? "border-neon-cyan/30"
                                            : index === 1
                                            ? "border-neon-purple/30"
                                            : "border-neon-cyan/30"
                                    } opacity-50 rounded-tr-2xl`}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
