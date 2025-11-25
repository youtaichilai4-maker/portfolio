import type { Metadata } from "next";
import "./globals.css";

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
        <html lang="ja">
            <body className="circuit-bg antialiased">{children}</body>
        </html>
    );
}
