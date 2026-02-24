"use client";

import NewsEditor from "@/app/components/NewsEditor";
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
  return <NewsEditor id={id} />;
}
