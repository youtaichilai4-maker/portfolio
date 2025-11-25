"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PROFILE } from "../data";

const navItems = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experiences", href: "#experiences" },
];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);

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
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card py-4" : "py-6"
                }`}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <motion.a
                        href="#"
                        className="text-lg md:text-xl font-bold text-glow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {PROFILE.name}
                    </motion.a>

                    <div className="flex gap-4 md:gap-6">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.href}
                                href={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.1, color: "#06b6d4" }}
                                className="text-sm md:text-base text-gray-300 hover:text-neon-cyan transition-colors"
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
