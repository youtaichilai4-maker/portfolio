import { PROFILE } from "../data";

export default function SimplePage() {
  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: "#030712", 
      color: "white", 
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h1 style={{ 
        color: "#06b6d4", 
        fontSize: "4rem", 
        marginBottom: "1rem",
        textShadow: "0 0 20px #06b6d4"
      }}>
        {PROFILE.name}
      </h1>
      <p style={{ fontSize: "2rem", color: "#06b6d4", marginBottom: "1rem" }}>
        {PROFILE.title}
      </p>
      <p style={{ color: "#9ca3af", marginBottom: "1rem", fontSize: "1.2rem" }}>
        {PROFILE.university}
      </p>
      <p style={{ color: "#d1d5db", marginTop: "2rem", fontSize: "1.3rem", fontStyle: "italic" }}>
        {PROFILE.tagline}
      </p>
      <div style={{ 
        marginTop: "3rem",
        padding: "30px", 
        backgroundColor: "rgba(3, 7, 18, 0.6)", 
        borderRadius: "16px",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        backdropFilter: "blur(10px)"
      }}>
        <h2 style={{ color: "#06b6d4", fontSize: "2rem", marginBottom: "1rem" }}>About</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#d1d5db" }}>
          {PROFILE.about}
        </p>
      </div>
    </div>
  );
}


