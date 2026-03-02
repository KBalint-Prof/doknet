"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  const fetchNewsList = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hiba történt.");
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

  if (loading) return <p>Hírek betöltése…</p>;

  return (
    /* GRID elrendezés: 2 egyenlő oszlop */
    <div 
      style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", 
        gap: "25px", 
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      {newsList.map((news) => {
        const plainText = news.content.replace(/<[^>]+>/g, "").slice(0, 250) + "...";

        return (
          <Link
            key={news.id}
            href={`/news/${news.id}`}
            style={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #e0e0e0",
              borderRadius: "15px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "transform 0.2s ease"
            }}
          >
            {/* Borítókép fix magassággal */}
            {news.cover_img && (
              <div style={{ width: "100%", height: "240px" }}>
                <img
                  src={news.cover_img}
                  alt="Borító"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Szöveges rész */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
              <h2 style={{ margin: "0 0 12px 0", fontSize: "1.4rem", color: "#222" }}>
                {news.title}
              </h2>
              <p style={{ margin: "0 0 20px 0", color: "#555", lineHeight: "1.5", flex: 1 }}>
                {plainText}
              </p>
              
              {/* Információs sáv alul */}
              <div style={{ 
                marginTop: "auto", 
                paddingTop: "15px", 
                borderTop: "1px solid #f0f0f0", 
                display: "flex", 
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "#999"
              }}>
                <span>{new Date(news.created_at).toLocaleDateString("hu-HU")}</span>
                <span style={{ fontWeight: "600", color: "#666" }}>
                  {news.author_name ?? "Admin"}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}