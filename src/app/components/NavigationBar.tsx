"use client";

import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import Image from "next/image";

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";

  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: "10px",
    zIndex: 1000,
    margin: "10px 2rem",
    borderRadius: "50px",
    height: "65px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    // Glassmorphism hatás
    backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 8px 32px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  };

  const linkStyle: React.CSSProperties = {
    color: isDark ? "#ffffff" : "#333333",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "opacity 0.2s ease",
  };

  return (
    <nav className="navbar" style={navStyle}>
      {/* BAL OLDAL: LOGÓ ÉS MENÜ */}
      <div className="nav-left" style={{ display: "flex", gap: "35px", alignItems: "center" }}>
        
        {/* DÖKNET LOGÓ ÉS NÉV */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div style={{ position: "relative", width: "42px", height: "42px" }}>
            <Image 
              src="/logo/doklogo2.png" 
              alt="DÖKnet Logo" 
              fill 
              style={{ objectFit: "contain", mixBlendMode: isDark ? "normal" : "multiply" }} 
            />
          </div>
          <span style={{ 
            color: isDark ? "#fff" : "#000", 
            fontWeight: 800, 
            fontSize: "1.3rem",
            letterSpacing: "-0.5px"
          }}>
            DÖKnet
          </span>
        </a>

        {/* MENÜPONTOK (Emoji nélkül) */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/calendar" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>Naptár</a>
          <a href="/gallery" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>Galéria</a>
          
          {ctx?.user && ["admin", "teacher", "president"].includes((ctx.user as any).role) && (
            <>
              <a href="/news-editor" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>Szerkesztő</a>
              <a href="/vote" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>Szavazás</a>
            </>
          )}
          
          {ctx?.user && <a href="/chat" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>Chat</a>}
        </div>
      </div>

      {/* JOBB OLDAL: TÉMA ÉS USER */}
      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        <button
          onClick={ctx?.toggleTheme}
          style={{
            background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            border: "none",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: isDark ? "#ccc" : "#555" }}>
          {ctx?.user?.username || "Vendég"}
        </span>

        {ctx?.user ? (
          <button
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#ff4d4d",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onClick={() => {
              ctx?.setUser(null);
              localStorage.removeItem("user");
              toast.info("Kijelentkeztél.");
            }}
          >
            Kijelentkezés
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a href="/login" style={linkStyle}>Bejelentkezés</a>
            <a href="/register" style={{
              ...linkStyle,
              backgroundColor: isDark ? "#ffcc00" : "#333",
              color: isDark ? "#000" : "#fff",
              padding: "8px 18px",
              borderRadius: "20px"
            }}>
              Regisztráció
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}