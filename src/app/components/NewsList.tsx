"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { GlobalContext } from "../context/GlobalContext";

interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
}

export default function NewsList() {
  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";

  const fetchNewsList = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Hiba történt a hírek betöltésekor.");
      }

      setNewsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsList();
  }, []);

  if (loading) {
    return <p>Hírek betöltése…</p>;
  }

  return (
    <>
      {newsList.map((news) => {
        const plainText =
          news.content.replace(/<[^>]+>/g, "").slice(0, 600) + "...";

        return (
          <Link
            key={news.id}
            href={`/news/${news.id}`}
            style={{
              display: "flex",
              gap: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "10px",
              marginBottom: "1rem",
              textDecoration: "none",
              color: "inherit",
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            {news.cover_img && (
              <div style={{ flex: "0 0 260px", maxWidth: "100%" }}>
                <img
                  src={news.cover_img}
                  alt="Borítókép"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 0.5rem 0" }}>{news.title}</h2>
                <p style={{ margin: 0, color: isDark ? "#fff" : "#444" }}>
                  {plainText}
                </p>
              </div>

              <small
                style={{
                  marginTop: "0.75rem",
                  color: "#777",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  lineHeight: 1.4,
                }}
              >
                <span>
                  Közzétéve:{" "}
                  <time dateTime={news.created_at}>
                    {new Date(news.created_at).toLocaleString("hu-HU")}
                  </time>
                </span>

                <span>
                  Közzétette:{" "}
                  <strong style={{ fontWeight: 500 }}>
                    {news.author_name ?? "Ismeretlen"}
                  </strong>
                </span>
              </small>
            </div>
          </Link>
        );
      })}
    </>
  );
}
