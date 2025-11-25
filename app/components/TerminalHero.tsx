"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const terminalLines = [
    "> Initializing Yuta_Portfolio.exe...",
    "> Loading module: Semiconductor_Physics... OK",
    "> Loading module: Machine_Learning... OK",
    "> Access granted.",
];

export default function TerminalHero({ onComplete }: { onComplete: () => void }) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isComplete) return;

        const currentLine = terminalLines[currentLineIndex];
        if (!currentLine) {
            setIsComplete(true);
            setTimeout(() => {
                onComplete();
            }, 1000);
            return;
        }

        // タイピング速度を制御
        const typingSpeed = 50; // ミリ秒
        const cursorBlinkSpeed = 530; // ミリ秒

        // カーソルの点滅
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, cursorBlinkSpeed);

        // テキストのタイピング
        if (currentText.length < currentLine.length) {
            const typingTimeout = setTimeout(() => {
                setCurrentText(currentLine.slice(0, currentText.length + 1));
            }, typingSpeed);

            return () => {
                clearTimeout(typingTimeout);
                clearInterval(cursorInterval);
            };
        } else {
            // 行が完了したら、次の行へ（少し待ってから）
            const nextLineTimeout = setTimeout(() => {
                setCurrentLineIndex((prev) => prev + 1);
                setCurrentText("");
            }, 800);

            return () => {
                clearTimeout(nextLineTimeout);
                clearInterval(cursorInterval);
            };
        }
    }, [currentText, currentLineIndex, isComplete, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-8 z-20"
        >
            <div className="glass-card rounded-lg p-4 md:p-6 font-mono text-sm md:text-base max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-gray-400 text-xs ml-2">terminal</span>
                </div>
                <div className="space-y-1">
                    {terminalLines.slice(0, currentLineIndex).map((line, index) => (
                        <div key={index} className="text-neon-cyan">
                            {line}
                        </div>
                    ))}
                    {currentLineIndex < terminalLines.length && (
                        <div className="text-neon-cyan">
                            {currentText}
                            <span className={showCursor ? "opacity-100" : "opacity-0"}>▊</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

