"use client";

import Comments from "@/app/news/[id]/Comments";
import Reactions from "@/app/news/[id]/Reactions";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Delete from "./Delete";
import { toast } from "react-toastify";
import { GlobalContext } from "../../context/GlobalContext";

export interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
  modified_at: string | null;
  modified_by_name: string | null;
  comments: {
    id: number;
    content: string;
    created_at: string;
    author_name: string;
  }[];
  reactions: {
    reaction_type_id: number;
    key: string;
    icon: string;
    user_id: number;
  }[];
}

export interface ReactionTypeType {
  id: number;
  key: string;
  icon: string;
  sort_order: number;
}

export default function NewsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const ctx = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<NewsType | null>(null);
  const [reactionTypes, setReactionTypes] = useState<ReactionTypeType[]>([]);
  const [notExists, setNotExists] = useState(false);

  const router = useRouter();

  const getNewsById = async () => {
    try {
      const result = await fetch(`/api/news/${id}`);
      const data = await result.json();

      console.log("NEWS BY ID:", data);

      if (result.status === 404) {
        setNotExists(true);
        return;
      }

      setNews(data.news[0]);

      setReactionTypes(data.reaction_types);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/delete/`, {
        method: "PATCH",
        body: JSON.stringify({ news_id: id, is_deleted: 1 }),
      });

      if (!res.ok) throw new Error("Törlés sikertelen");

      toast.success("Sikeres törlés!", {
        style: { marginTop: "4.5rem" },
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Nem sikerült törölni a hírt.");
    }
  };

  useEffect(() => {
    getNewsById();
  }, [id]);

  if (notExists) {
    return (
      <main style={{ padding: "2rem" }}>
        <div style={{ color: "red", marginBottom: "1rem" }}>
          Ez a hír nem létezik vagy már törölve lett.
        </div>
        <button onClick={() => router.push("/")}>Vissza a főoldalra</button>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      {!news && <div>Betöltés...</div>}

      {news && (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={news.cover_img ?? ""}
              alt="Borítókép"
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "25rem",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h1 style={{ fontFamily: "Arial", margin: 0 }}>{news.title}</h1>

            {ctx?.user &&
              ["admin", "teacher", "president"].includes(
                (ctx.user as any).role,
              ) && (
                <>
                  <button onClick={() => router.push("/news-editor/" + id)}>
                    Szerkesztés
                  </button>
                  <button onClick={() => setIsOpen(true)}>🗑️</button>
                </>
              )}
          </div>

          <article
            className="news-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{ marginTop: "1rem", fontSize: "1.2rem", lineHeight: "1.6" }}
          ></article>

          <div
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ddd",
              paddingTop: "1rem",
            }}
          ></div>

          <small
            style={{
              marginTop: "0.75rem",
              color: "#777",
              display: "grid",
              gridTemplateColumns: "1fr 5fr",
              gap: "0.25rem 0.75rem",
              lineHeight: 1.4,
              fontSize: "0.8rem",
            }}
          >
            <span>
              Közzétéve:{" "}
              <time dateTime={news.created_at}>
                {new Date(news.created_at).toLocaleString("hu-HU")}
              </time>
            </span>

            {news.modified_at && (
              <span>
                Utoljára módosítva:{" "}
                <strong style={{ fontWeight: 500 }}>
                  {new Date(news.modified_at).toLocaleString("hu-HU")}
                </strong>{" "}
              </span>
            )}

            <span>
              Közzétette:{" "}
              <strong style={{ fontWeight: 500 }}>
                {news.author_name ?? "Ismeretlen"}
              </strong>
            </span>

            {news.modified_by_name && (
              <span>
                Utoljára módosította:{" "}
                <strong style={{ fontWeight: 500 }}>
                  {news.modified_by_name ?? "Ismeretlen"}
                </strong>{" "}
              </span>
            )}
          </small>
          <div
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ddd",
              paddingTop: "1rem",
            }}
          ></div>
          <Reactions
            news={news}
            reactionTypes={reactionTypes}
            getNewsById={getNewsById}
          />
          <Comments news={news} getNewsById={getNewsById} />
          <Delete
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleDelete}
            title="Hír törlése"
            description="Biztosan törölni szeretnéd ezt a hírt? Ez nem visszavonható."
          />
        </>
      )}
    </main>
  );
}
