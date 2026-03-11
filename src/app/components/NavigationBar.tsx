"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import Image from "next/image";

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setHamburgerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <nav className={`navbar ${isDark ? "dark" : ""}`}>
      <div className="nav-left">
        <a href="/" className="logo">
          <div className="logo-img">
            <Image
              src="/logo/doklogo4.png"
              alt="DÖKnet Logo"
              width={42}
              height={42}
              className="logo-desktop"
            />
          </div>
          <span className="logo-text">DÖKnet</span>
        </a>

        <div className="nav-links">
          <a href="/calendar">Naptár</a>
          <a href="/gallery">Galéria</a>

          {ctx?.user &&
            ["admin", "teacher", "president"].includes(
              (ctx.user as any).role,
            ) && (
              <>
                <a href="/news-editor">Hírszerkesztő</a>
              </>
            )}
          {ctx?.user &&
            ["admin", "teacher", "president", "member"].includes(
              (ctx.user as any).role,
            ) && (
              <>
                <a href="/vote">Szavazás</a>
                <a href="/chat">Chat</a>
              </>
            )}
        </div>
      </div>

      <div
        className="hamburger"
        onClick={() => setHamburgerOpen(!hamburgerOpen)}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="m2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5" />
        </svg>
      </div>
      {hamburgerOpen && (
        <div className="mobile-menu">
          <a href="/calendar">Naptár</a>
          <a href="/gallery">Galéria</a>
          {ctx?.user &&
            ["admin", "teacher", "president"].includes(
              (ctx.user as any).role,
            ) && (
              <>
                <a href="/news-editor">Hírszerkesztő</a>
              </>
            )}
          {ctx?.user &&
            ["admin", "teacher", "president", "member"].includes(
              (ctx.user as any).role,
            ) && (
              <>
                <a href="/vote">Szavazás</a>
                <a href="/chat">Chat</a>
              </>
            )}
        </div>
      )}

      <div className="nav-right">
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
          <div className="login-register">
            <a href="/login">Bejelentkezés</a>
            <a href="/register">Regisztráció</a>
          </div>
        )}
      </div>
    </nav>
  );
}
