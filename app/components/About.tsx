"use client";

import { motion } from "framer-motion";
import { PROFILE } from "../data";

export default function About() {
    return (
        <section id="about" className="py-20 px-4 relative">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-8 text-glow"
                >
                    About
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-card rounded-2xl p-8 md:p-12"
                >
                    <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                        {PROFILE.about}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
