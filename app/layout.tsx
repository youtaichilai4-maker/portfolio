import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Yuta Akase | Physics-Informed AI Engineer",
    description: "Bridging the gap between Physical Realities and Digital Intelligence.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" className={jetbrainsMono.variable}>
            <body className="circuit-bg antialiased">{children}</body>
        </html>
    );
}
