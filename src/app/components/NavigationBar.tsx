"use client";

import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import Image from "next/image";

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";

  return (
    <nav className={`navbar ${isDark ? "dark" : ""}`}>
      <div
        className="nav-left"
        style={{ display: "flex", gap: "35px", alignItems: "center" }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <div style={{ position: "relative", width: "42px", height: "42px" }}>
            <Image
              src="/logo/doklogo2.png"
              alt="DÖKnet Logo"
              fill
              style={{
                objectFit: "contain",
                mixBlendMode: isDark ? "normal" : "multiply",
              }}
            />
          </div>
          <span
            style={{
              color: isDark ? "#fff" : "#000",
              fontWeight: 800,
              fontSize: "1.3rem",
              letterSpacing: "-0.5px",
            }}
          >
            DÖKnet
          </span>
        </a>

        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/calendar">Naptár</a>
          <a href="/gallery">Galéria</a>

          {ctx?.user &&
            ["admin", "teacher", "president"].includes(
              (ctx.user as any).role,
            ) && (
              <>
                <a href="/news-editor">Szerkesztő</a>
                <a href="/vote">Szavazás</a>
              </>
            )}

          {ctx?.user && <a href="/chat">Chat</a>}
        </div>
      </div>

      <div
        className="nav-right"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <button onClick={ctx?.toggleTheme} className="theme-toggle">
          {isDark ? "☀️" : "🌙"}
        </button>

        {ctx?.user && (ctx.user as any).role === "admin" && (
          <a href="/admin">Admin Panel</a>
        )}

        <span className="username">{ctx?.user?.username || "Vendég"}</span>

        {ctx?.user ? (
          <button
            onClick={() => {
              ctx?.setUser(null);
              localStorage.removeItem("user");
              toast.info("Kijelentkeztél.", {
                style: { marginTop: "4.5rem" },
              });
            }}
          >
            Kijelentkezés
          </button>
        ) : (
          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <a href="/login">Bejelentkezés</a>
            <a href="/register">Regisztráció</a>
          </div>
        )}
      </div>
    </nav>
  );
}
