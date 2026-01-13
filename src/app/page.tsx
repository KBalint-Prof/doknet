"use client";

import Link from "next/link";
import Carousel from "./components/Carousel";
import { useEffect, useState } from "react";
import NewsList from "./components/NewsList";

interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
}

export default function HomePage() {
  const [newsList, setNewsList] = useState<NewsType[]>([]);

  const fetchNewsList = async () => {
    try {
      const res = await fetch("/api/news");

      const data = await res.json();
      console.log("NEWS LIST:", data);
      if (!res.ok)
        throw new Error(data.error || "Hiba történt a komment mentése során.");

      setNewsList(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNewsList();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <Carousel />

      <h1>Hírek</h1>

      <NewsList />
    </main>
  );
}
