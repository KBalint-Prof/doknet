"use client";

import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
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
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";

  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // SZÍNPALETTA - A kért egyedi címszínnel
  
  const colors = {
    // Ez az általad kért szín a címeknek
    titlePrimary: "rgba(177, 41, 98, 0.45)", 
    // Hover esetén felerősítjük, hogy olvashatóbb legyen az interakciókor
    titleHover: "rgb(150, 31, 81)", 
    
    text: isDark ? "#cccccc" : "#444444",
    cardBg: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "#eeeeee",
  };

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

  if (loading) {
    return <p style={{ textAlign: "center", color: colors.text, marginTop: "2rem" }}>Hírek betöltése…</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem 0" }}>
      {newsList.map((news) => {
        const plainText = news.content.replace(/<[^>]+>/g, "").slice(0, 180) + "...";
        const isHovered = hoveredId === news.id;

        return (
          <Link
            key={news.id}
            href={`/news/${news.id}`}
            onMouseEnter={() => setHoveredId(news.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex",
              gap: "1.5rem",
              padding: "1.2rem",
              background: colors.cardBg,
              // A szegély is finoman átveszi a kért színt hovernél
              border: `1px solid ${isHovered ? colors.titlePrimary : colors.border}`,
              borderRadius: "20px",
              textDecoration: "none",
              transition: "all 0.3s ease",
              transform: isHovered ? "translateY(-5px)" : "translateY(0)",
              boxShadow: isHovered ? "0 10px 25px rgba(0,0,0,0.1)" : "0 4px 6px rgba(0,0,0,0.02)",
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            {/* Kép */}
            {news.cover_img && (
              <div style={{ flex: "0 0 220px", maxWidth: "100%", overflow: "hidden", borderRadius: "14px" }}>
                <img
                  src={news.cover_img}
                  alt="Borítókép"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}
                />
              </div>
            )}

            {/* Szöveg */}
            <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* A CÍM A KÉRT EGYEDI SZÍNNEL */}
                <h2 style={{ 
                  margin: "0 0 0.5rem 0", 
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: isHovered ? colors.titleHover : colors.titlePrimary,
                  transition: "color 0.3s ease",
                  letterSpacing: "-0.02em"
                }}>
                  {news.title}
                </h2>
                
                <p style={{ 
                  margin: 0, 
                  color: colors.text, 
                  lineHeight: "1.5", 
                  fontSize: "0.95rem" 
                }}>
                  {plainText}
                </p>
              </div>

              {/* Meta adatok */}
              <div style={{
                  marginTop: "1rem",
                  paddingTop: "0.8rem",
                  borderTop: `1px solid ${colors.border}`,
                  display: "flex",
                  gap: "15px",
                  fontSize: "0.85rem",
                  color: colors.text,
                  opacity: 0.7
                }}>
                <span>📅 {new Date(news.created_at).toLocaleDateString("hu-HU")}</span>
                <span>✍️ {news.author_name ?? "Admin"}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}