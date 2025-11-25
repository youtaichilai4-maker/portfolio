"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#030712",
            color: "white",
            padding: "20px"
        }}>
            <div style={{ textAlign: "center", maxWidth: "600px" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", color: "#06b6d4" }}>
                    エラーが発生しました
                </h2>
                <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
                    {error.message || "予期しないエラーが発生しました"}
                </p>
                <button
                    onClick={reset}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#06b6d4",
                        color: "#030712",
                        fontWeight: "600",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    再試行
                </button>
            </div>
        </div>
    );
}
