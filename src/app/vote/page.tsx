"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../context/GlobalContext";
import { useParams } from "next/navigation";
import VoteList from "../components/VoteList";

const allowed_roles = ["admin", "teacher", "president"];

interface VoteType {
  id: number;
  title: string;
  description: string;
  created_at: string;
  author_name: string;
}

export default function HomePage() {
  const router = useRouter();
  const ctx = useContext(GlobalContext);
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  if (!ctx?.user || !allowed_roles.includes((ctx.user as any).role)) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", padding: "20px" }}>
        <h2 style={{ color: "#8b1e3f" }}>
          🔒 Nincs jogosultságod a szavazás funkció használatához.
        </h2>
        <button onClick={() => (window.location.href = "/")}>
          Vissza a főoldalra
        </button>
      </div>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Szavazások</h1>
      {ctx?.user &&
        ["admin", "teacher", "president"].includes((ctx.user as any).role) && (
          <button
            style={{ marginBottom: "1rem" }}
            onClick={() => router.push("/vote-editor/")}
          >
            Új szavazás
          </button>
        )}
      <VoteList />
    </main>
  );
}
