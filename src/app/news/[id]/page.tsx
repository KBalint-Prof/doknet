import { db } from "@/app/api/db";

export default async function NewsPage({ params }: any) {
  const resolvedParams = await params;

  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Hibás ID: {resolvedParams.id}</div>;
  }

  const [rows] = await db.query("SELECT * FROM news WHERE id = ?", [id]);

  if (!rows || (rows as any[]).length === 0) {
    return <div>Nem található ilyen hír.</div>;
  }

  const news = (rows as any)[0] as {
    id: number;
    content: string;
    title: string;
    created_at: string;
  };

  return (
    <main style={{ padding: "2rem" }}>
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
    </main>
  );
}
