export default function TestPage() {
  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: "#030712", 
      color: "white", 
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h1 style={{ color: "#06b6d4", fontSize: "3rem", marginBottom: "1rem" }}>
        テストページ
      </h1>
      <p style={{ fontSize: "1.5rem", color: "#06b6d4", marginBottom: "1rem" }}>
        Yuta Akase
      </p>
      <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
        Physics-Informed AI Engineer
      </p>
      <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
        Kyoto University | Semiconductor Physics & ML
      </p>
      <div style={{ 
        padding: "20px", 
        backgroundColor: "rgba(6, 182, 212, 0.1)", 
        borderRadius: "8px",
        border: "1px solid rgba(6, 182, 212, 0.3)"
      }}>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
          このページが表示されれば、基本的なHTMLとスタイルは動作しています。
        </p>
      </div>
    </div>
  );
}


