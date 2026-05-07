"use client";

import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { NewsType } from "./page";
import { toast } from "react-toastify";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSave();
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setContent("");

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
      setContent("");
      getNewsById();
      toast.success("Komment közzétéve!", {
        style: { marginTop: "4.5rem" },
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Hiba a kommentelés során!", {
        style: { marginTop: "4.5rem" },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
      {ctx?.user ? (
        <>
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
            type="submit"
            disabled={saving}
          >
            {saving ? "Kommentelés folyamatban..." : "Komment"}
          </button>
        </>
      ) : (
        <p
          style={{
            color: "#777",
            fontStyle: "italic",
            marginBottom: "2rem",
          }}
        >
          Kommenteléshez be kell jelentkezned.
        </p>
      )}
      <div style={{ marginTop: "2rem" }}>
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
    </form>
  );
}
