"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { EXPERIENCES } from "../data";

export default function Experiences() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    const toggleExpanded = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <motion.section
            ref={sectionRef}
            style={{ opacity }}
            id="experiences"
            className="py-20 px-4 relative"
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mb-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-glow inline-block">
                        Experiences
                    </h2>
                    {/* Decorative lines */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent"
                    />
                </motion.div>

                <div className="space-y-8">
                    {EXPERIENCES.map((exp, index) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <motion.div
                                key={exp.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: -5 }}
                                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.15,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{
                                    scale: 1.01,
                                    transition: { duration: 0.3 },
                                }}
                                className="glass-card rounded-2xl overflow-hidden relative group"
                            >
                                {/* Animated border on hover */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `linear-gradient(${index % 2 === 0 ? "135deg" : "45deg"
                                            }, transparent, rgba(6, 182, 212, 0.1), transparent)`,
                                        backgroundSize: "200% 200%",
                                    }}
                                    animate={{
                                        backgroundPosition: ["0% 0%", "200% 200%"],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                {/* クリック可能なヘッダー部分 */}
                                <div
                                    onClick={() => toggleExpanded(index)}
                                    className="p-6 md:p-8 cursor-pointer select-none relative z-10"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            className="px-4 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-sm font-semibold border border-neon-cyan/30 relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-neon-cyan/10"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: "100%" }}
                                                transition={{ duration: 0.5 }}
                                            />
                                            <span className="relative z-10">{exp.type}</span>
                                        </motion.span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white flex-1">
                                            {exp.title}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronDown className="w-6 h-6 text-neon-cyan" />
                                        </motion.div>
                                    </div>

                                    <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                                        {exp.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.tech.map((tech, techIndex) => (
                                            <motion.span
                                                key={tech}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    delay: index * 0.15 + techIndex * 0.05,
                                                    duration: 0.3,
                                                }}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-sm border border-neon-purple/30 cursor-default"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>

                                    {exp.link && (
                                        <motion.a
                                            href={exp.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            className="mt-4 inline-flex items-center gap-2 text-neon-cyan underline underline-offset-4 decoration-neon-cyan/50 hover:decoration-neon-cyan"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>{exp.linkLabel ?? "サイトを見る"}</span>
                                        </motion.a>
                                    )}
                                </div>

                                {/* 展開される詳細部分 */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden relative z-10"
                                        >
                                            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-neon-cyan/20">
                                                <motion.div
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1, duration: 0.4 }}
                                                    className="pt-6 space-y-4"
                                                >
                                                    <h4 className="text-xl font-bold text-neon-cyan mb-3">
                                                        詳細情報
                                                    </h4>
                                                    <p className="text-gray-300 leading-relaxed">
                                                        {exp.details}
                                                    </p>

                                                    {exp.achievements && exp.achievements.length > 0 && (
                                                        <motion.div
                                                            initial={{ y: 10, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.2, duration: 0.4 }}
                                                            className="mt-6 p-4 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20 relative overflow-hidden"
                                                        >
                                                            <motion.div
                                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent"
                                                                animate={{
                                                                    x: ["-100%", "200%"],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                    repeatDelay: 3,
                                                                    ease: "easeInOut",
                                                                }}
                                                            />
                                                            <p className="text-sm text-neon-cyan font-semibold mb-3 relative z-10">
                                                                主な成果
                                                            </p>
                                                            <ul className="space-y-2 relative z-10">
                                                                {exp.achievements.map((achievement, idx) => (
                                                                    <motion.li
                                                                        key={idx}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: 0.3 + idx * 0.1, duration: 0.3 }}
                                                                        className="flex items-start gap-2 text-gray-300 text-sm"
                                                                    >
                                                                        <motion.span
                                                                            className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0"
                                                                            animate={{ scale: [1, 1.2, 1] }}
                                                                            transition={{
                                                                                duration: 2,
                                                                                repeat: Infinity,
                                                                                delay: idx * 0.2,
                                                                            }}
                                                                        />
                                                                        <span className="leading-relaxed">{achievement}</span>
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Corner accent */}
                                <div
                                    className={`absolute ${index % 2 === 0 ? "top-0 left-0" : "top-0 right-0"
                                        } w-12 h-12 border-t-2 ${index % 2 === 0 ? "border-l-2 border-neon-cyan/30" : "border-r-2 border-neon-purple/30"
                                        } opacity-50 ${index % 2 === 0 ? "rounded-tl-2xl" : "rounded-tr-2xl"
                                        }`}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
