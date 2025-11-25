"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { EXPERIENCES } from "../data";

export default function Experiences() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpanded = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section id="experiences" className="py-20 px-4 relative">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-12 text-glow text-center"
                >
                    Experiences
                </motion.h2>

                <div className="space-y-8">
                    {EXPERIENCES.map((exp, index) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <motion.div
                                key={exp.title}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                            >
                                {/* クリック可能なヘッダー部分 */}
                                <div
                                    onClick={() => toggleExpanded(index)}
                                    className="p-6 md:p-8 cursor-pointer select-none"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <span className="px-4 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-sm font-semibold border border-neon-cyan/30">
                                            {exp.type}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white flex-1">
                                            {exp.title}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronDown className="w-6 h-6 text-neon-cyan" />
                                        </motion.div>
                                    </div>

                                    <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                                        {exp.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.tech.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-sm border border-neon-purple/30"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 展開される詳細部分 */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-neon-cyan/20">
                                                <div className="pt-6 space-y-4">
                                                    <h4 className="text-xl font-bold text-neon-cyan mb-3">
                                                        詳細情報
                                                    </h4>
                                                    <p className="text-gray-300 leading-relaxed">
                                                        {exp.details}
                                                    </p>

                                                    {exp.achievements && exp.achievements.length > 0 && (
                                                        <div className="mt-6 p-4 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
                                                            <p className="text-sm text-neon-cyan font-semibold mb-3">
                                                                主な成果
                                                            </p>
                                                            <ul className="space-y-2">
                                                                {exp.achievements.map((achievement, idx) => (
                                                                    <li
                                                                        key={idx}
                                                                        className="flex items-start gap-2 text-gray-300 text-sm"
                                                                    >
                                                                        <span className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                                                                        <span className="leading-relaxed">{achievement}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
