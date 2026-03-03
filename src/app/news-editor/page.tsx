"use client";

import { useContext } from "react";
import NewsEditor from "../components/NewsEditor";
import { GlobalContext } from "../context/GlobalContext";

const allowed_roles = ["admin", "teacher", "president"];

export default function NewsPage() {
  const ctx = useContext(GlobalContext);

  if (!ctx?.user || !allowed_roles.includes((ctx.user as any).role)) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", padding: "20px" }}>
        <h2 style={{ color: "#8b1e3f" }}>
          🔒 Nincs jogosultságod a hírszerkesztő használatához.
        </h2>
        <button onClick={() => (window.location.href = "/")}>
          Vissza a főoldalra
        </button>
      </div>
    );
  }
  return <NewsEditor />;
}
