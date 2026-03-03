"use client";

import VoteEditor from "@/app/components/VoteEditor";
import { useParams } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import { useContext } from "react";

const allowed_roles = ["admin", "teacher", "president"];

export default function VoteEditorPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
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
