import Link from "next/link";

export default function NotFound() {
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
                <h2 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem", color: "#06b6d4" }}>
                    404
                </h2>
                <p style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#9ca3af" }}>
                    ページが見つかりません
                </p>
                <Link
                    href="/"
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#06b6d4",
                        color: "#030712",
                        fontWeight: "600",
                        borderRadius: "8px",
                        textDecoration: "none",
                        display: "inline-block"
                    }}
                >
                    ホームに戻る
                </Link>
            </div>
        </div>
    );
}
