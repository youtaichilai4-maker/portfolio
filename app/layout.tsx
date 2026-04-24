import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

const interTight = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-inter-tight",
    display: "swap",
});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
    axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
    title: "Yuta Akase | Physics × ML",
    description: "Bridging physics and machine learning to solve inverse problems in imaging and spectroscopy.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ja"
            className={`${jetbrainsMono.variable} ${interTight.variable} ${fraunces.variable}`}
        >
            <body className="antialiased">{children}</body>
        </html>
    );
}
