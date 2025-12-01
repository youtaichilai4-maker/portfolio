"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // モバイルデバイスでは表示しない
        const isMobile = window.matchMedia("(hover: none) or (pointer: coarse)").matches;
        if (isMobile) return;

        setIsVisible(true);

        const updateCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.closest("[role='button']") ||
                target.style.cursor === "pointer"
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateCursor);
        document.addEventListener("mouseover", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", updateCursor);
            document.removeEventListener("mouseover", handleMouseEnter);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <div
                className={`custom-cursor ${isHovering ? "hover" : ""}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            />
            <div
                className="custom-cursor-dot"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            />
        </>
    );
}

