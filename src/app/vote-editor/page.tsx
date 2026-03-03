"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../context/GlobalContext";
import VoteEditor from "../components/VoteEditor";

const allowed_roles = ["admin", "teacher", "president"];

interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
}

export default function HomePage() {
  const router = useRouter();
  const ctx = useContext(GlobalContext);

  if (!ctx?.user || !allowed_roles.includes((ctx.user as any).role)) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", padding: "20px" }}>
        <h2 style={{ color: "#8b1e3f" }}>
          🔒 Nincs jogosultságod a szavazásszerkesztő használatához.
        </h2>
        <button onClick={() => (window.location.href = "/")}>
          Vissza a főoldalra
        </button>
      </div>
    );
  }

  return <VoteEditor />;
}
