"use client";

import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { NewsType } from "./page";

export default function Comments({
  news,
  getNewsById,
}: {
  news: NewsType;
  getNewsById: () => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const ctx = useContext(GlobalContext);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      console.log(ctx?.user?.id);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          content,
          news_id: news.id,
          user_id: ctx?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a komment mentése során.");

      setMessage(`Sikeres mentés! (ID: ${data.id})`);
      getNewsById();
    } catch (err: any) {
      console.error(err);
      setMessage("Hiba a mentés során!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h3>Komment:</h3>

      <input
        style={{ width: "30%" }}
        type="text"
        placeholder="Írd be a kommentet..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        style={{ marginLeft: "1rem" }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Kommentelés folyamatban..." : "Komment"}
      </button>

      {news.comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: "1rem" }}>
          <p>{comment.content}</p>
          <small style={{ color: "#666" }}>
            {comment.author_name} -{" "}
            {new Date(comment.created_at).toLocaleString("hu-HU")}
          </small>
        </div>
      ))}
    </div>
  );
}
