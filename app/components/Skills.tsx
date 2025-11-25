"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Layers, LucideIcon } from "lucide-react";
import { SKILLS } from "../data";

const iconMap: Record<string, LucideIcon> = {
    Cpu,
    Database,
    Layers,
};

export default function Skills() {
    return (
        <section id="skills" className="py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-12 text-glow text-center"
                >
                    Skills
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SKILLS.map((skill, index) => {
                        const Icon = iconMap[skill.icon];
                        return (
                            <motion.div
                                key={skill.category}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    {Icon && (
                                        <Icon className="w-8 h-8 text-neon-cyan" />
                                    )}
                                    <h3 className="text-2xl font-bold text-neon-cyan">
                                        {skill.category}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {skill.items.map((item, itemIndex) => (
                                        <motion.li
                                            key={item}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.2 + itemIndex * 0.1 }}
                                            className="text-gray-300 flex items-center gap-2"
                                        >
                                            <span className="w-2 h-2 bg-neon-purple rounded-full" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
