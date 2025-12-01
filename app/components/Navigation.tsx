"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { PROFILE } from "../data";

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
                scrolled ? "glass-card py-4 shadow-lg shadow-neon-cyan/10" : "py-6"
            }`}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <motion.a
                        href="#"
                        className="text-lg md:text-xl font-bold text-glow relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {PROFILE.name}
                        {/* Underline effect */}
                        <motion.div
                            className="absolute bottom-0 left-0 w-0 h-px bg-neon-cyan"
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.a>

                    <div className="flex gap-4 md:gap-6">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.href}
                                href={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{ y: -2, color: "#06b6d4" }}
                                className="text-sm md:text-base text-gray-300 hover:text-neon-cyan transition-colors relative group"
                            >
                                {item.label}
                                {/* Hover underline */}
                                <motion.div
                                    className="absolute bottom-0 left-0 w-0 h-px bg-neon-cyan"
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
