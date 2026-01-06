import Image from "next/image";
import styles from "./page.module.css";

import Link from "next/link";
import { db } from "./api/db";
import Carousel from "./components/Carousel";

export default async function HomePage() {
  const [rows] = await db.query(
    "SELECT news.id, news.title, news.content, news.cover_img, news.created_at, users.username AS author_name FROM news LEFT JOIN users ON users.id = news.user_id ORDER BY news.created_at DESC"
  );

  const newsList = rows as {
    id: number;
    title: string;
    content: string;
    cover_img: string | null;
    created_at: string;
    author_name: string;
  }[];

  return (
    <main style={{ padding: "2rem" }}>
      <Carousel />
      <h1>Hírek</h1>

      {newsList.map((news) => {
        const plainText =
          news.content.replace(/<[^>]+>/g, "").slice(0, 150) + "...";

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
              <div
                style={{
                  flex: "0 0 260px",
                  maxWidth: "100%",
                }}
              >
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

                <p style={{ margin: 0, color: "#444" }}>{plainText}</p>
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
    </main>
  );
}
