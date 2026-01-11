<<<<<<< HEAD
import { db } from '@/app/api/db';
import Comments from '../../components/Comments';
=======
"use client";
>>>>>>> 4e105ad (Kommentek 3)

import Comments from "@/app/news/[id]/Comments";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

<<<<<<< HEAD
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Hibás ID: {resolvedParams.id}</div>;
  }

  const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [id]);

  if (!rows || (rows as any[]).length === 0) {
    return <div>Nem található ilyen hír.</div>;
  }

  const news = (rows as any)[0] as {
=======
export interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
  comments: {
>>>>>>> 4e105ad (Kommentek 3)
    id: number;
    content: string;
    created_at: string;
    author_name: string;
  }[];
}

export default function NewsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [news, setNews] = useState<NewsType | null>(null);

  const getNewsById = async () => {
    try {
      const result = await fetch(`/api/news/${id}`);
      const data = await result.json();

      console.log("NEWS BY ID:", data);

      if (!result.ok || data.length === 0)
        throw new Error(data.error || "Hiba történt a hír betöltése során.");

      setNews(data[0]);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNewsById();
  }, [id]);

  return (
<<<<<<< HEAD
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Arial', marginBottom: '1rem' }}>
        {news.title}
      </h1>
      <article
        className="news-content"
        dangerouslySetInnerHTML={{ __html: news.content }}
        style={{ marginTop: '1rem', fontSize: '1.2rem', lineHeight: '1.6' }}
      ></article>
      <small style={{ color: '#666' }}>
        Közzétéve: {new Date(news.created_at).toLocaleString('hu-HU')}
      </small>
      <Comments newsId={news.id} />{' '}
=======
    <main style={{ padding: "2rem" }}>
      {!news && <div>Betöltés...</div>}

      {news && (
        <>
          <h1 style={{ fontFamily: "Arial", marginBottom: "1rem" }}>
            {news.title}
          </h1>
          <article
            className="news-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{ marginTop: "1rem", fontSize: "1.2rem", lineHeight: "1.6" }}
          ></article>
          <small style={{ color: "#666" }}>
            Közzétéve: {new Date(news.created_at).toLocaleString("hu-HU")}
          </small>
          <Comments news={news} getNewsById={getNewsById} />
        </>
      )}
>>>>>>> 4e105ad (Kommentek 3)
    </main>
  );
}
