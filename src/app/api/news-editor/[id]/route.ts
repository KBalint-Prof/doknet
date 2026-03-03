import { NextResponse } from "next/server";

import { db } from "../../db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const [news] = await db.query(
      `SELECT
        news.id,
        news.title,
        news.content,
        news.cover_img,
        news.created_at,
        news.modified_at,
        users.username AS author_name,
        mu.username AS modified_by_name
       FROM news 
       LEFT JOIN users ON users.id = news.user_id 
       LEFT JOIN users mu ON mu.id = news.modified_by
       WHERE news.id = ? AND news.is_deleted = 0`,
      [id],
    );

    return NextResponse.json({ news });
  } catch (err) {
    console.error("Hiba a lekérdezés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
