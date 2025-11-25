"use client";

import { motion } from "framer-motion";
import { PROFILE } from "../data";

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan opacity-20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
            </div>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 max-w-4xl"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-bold mb-4 text-glow"
                >
                    {PROFILE.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-2xl md:text-3xl text-neon-cyan mb-2 font-semibold"
                >
                    {PROFILE.title}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-400 mb-6"
                >
                    {PROFILE.university}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-300 italic max-w-2xl mx-auto"
                >
                    {PROFILE.tagline}
                </motion.p>
            </motion.div>
        </section>
    );
}
