"use client";

import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);
  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/">Főoldal</a>
        {/* <a href="/news">Hírszerkesztő</a> */}
        {ctx?.user &&
          ["admin", "teacher", "president"].includes(
            (ctx.user as any).role,
          ) && <a href="/news-editor">Hírszerkesztő</a>}
        <a href="/calendar">Naptár</a>
        <a href="/gallery">Galéria</a>
        {ctx?.user &&
          ["admin", "teacher", "president"].includes(
            (ctx.user as any).role,
          ) && <a href="/vote">Szavazás</a>}
        {ctx?.user && <a href="/chat">Chat</a>}
      </div>

      <div className="nav-right">
        {ctx?.user && (ctx.user as any).role === "admin" && (
          <a href="/admin">Admin Panel</a>
        )}

        <span className="username">{ctx?.user?.username || "Vendég"}</span>

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
          <>
            <a href="/register">Regisztráció</a>
            <a href="/login">Bejelentkezés</a>
          </>
        )}
      </div>
    </nav>
  );
}
