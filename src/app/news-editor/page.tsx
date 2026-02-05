"use client";

import { useContext } from "react";
import NewsEditor from "../components/NewsEditor";
import { GlobalContext } from "../context/GlobalContext";

const allowed_roles = ["admin", "teacher", "president"];

export default function NewsPage() {
  const ctx = useContext(GlobalContext);

  if (!ctx?.user) {
    return (
      <>
        <div style={{ padding: "2rem", color: "red" }}>
          Bejelentkezés szükséges az oldal megtekintéséhez.
        </div>
        <button onClick={() => (window.location.href = "/login")}>
          Bejelentkezés
        </button>
      </>
    );
  }

  if (!allowed_roles.includes((ctx.user as any).role)) {
    return (
      <>
        <div style={{ padding: "2rem", color: "red" }}>
          Nincs jogosultságod a hírszerkesztő használatához.
        </div>
        <button onClick={() => (window.location.href = "/")}>
          Vissza a főoldalra
        </button>
      </>
    );
  }
  return <NewsEditor />;
}
