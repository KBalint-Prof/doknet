import { NextResponse } from "next/server";

import { ResultSetHeader } from "mysql2";
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
        users.username AS author_name
       FROM news 
       LEFT JOIN users ON users.id = news.user_id 
       WHERE news.id = ?`,
      [id],
    );

    return NextResponse.json({ news });
  } catch (err) {
    console.error("Hiba a lekérdezés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
