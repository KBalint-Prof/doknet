"use client";

import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);

  // Változókhoz kötött stílusok a sötét mód támogatásához
  const navStyle = {
    backgroundColor: "var(--nav-bg, #ffffff)",
    color: "var(--text-color, #333)",
    borderBottom: "1px solid var(--border-color, #ddd)",
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 2rem",
  };

  const linkStyle = {
    color: "var(--text-color, #333)",
    textDecoration: "none",
    fontWeight: 500,
  };

  return (
    <nav className="navbar" style={navStyle}>
      <div className="nav-left" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <a href="/" style={linkStyle}>Főoldal</a>

        {ctx?.user &&
          ["admin", "teacher", "president"].includes((ctx.user as any).role) && (
            <a href="/news-editor" style={linkStyle}>Hírszerkesztő</a>
          )}

        <a href="/calendar" style={linkStyle}>Naptár</a>
        <a href="/gallery" style={linkStyle}>Galéria</a>

        {ctx?.user &&
          ["admin", "teacher", "president"].includes((ctx.user as any).role) && (
            <a href="/vote" style={linkStyle}>Szavazás</a>
          )}

        {ctx?.user && <a href="/chat" style={linkStyle}>Chat</a>}
      </div>

      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* TÉMA VÁLTÓ GOMB */}
        <button
          onClick={ctx?.toggleTheme}
          style={{
            background: "none",
            border: "1px solid var(--border-color, #ccc)",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            backgroundColor: "rgba(128,128,128,0.1)"
          }}
          title={ctx?.theme === "light" ? "Sötét mód" : "Világos mód"}
        >
          {ctx?.theme === "light" ? "🌙" : "☀️"}
        </button>

        {ctx?.user && (ctx.user as any).role === "admin" && (
          <a href="/admin" style={linkStyle}>Admin Panel</a>
        )}

        <span className="username" style={{ fontWeight: 600, color: "var(--text-color)" }}>
          {ctx?.user?.username || "Vendég"}
        </span>

        {ctx?.user ? (
          <button
            className="logout-btn"
            onClick={() => {
              ctx?.setUser(null);
              localStorage.removeItem("user");
              toast.info("Kijelentkeztél.", {
                style: { marginTop: "3.5rem" },
              });
            }}
          >
            Kijelentkezés
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="/register" style={linkStyle}>Regisztráció</a>
            <a href="/login" style={linkStyle}>Bejelentkezés</a>
          </div>
        )}
      </div>
    </nav>
  );
}