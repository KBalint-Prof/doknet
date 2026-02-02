import { NextResponse } from "next/server";

import { ResultSetHeader } from "mysql2";
import { db } from "../db";

export async function POST(req: Request) {
  try {
    const { title, content, cover_img, user_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "A cím és a tartalom is kötelező!" },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO news (title, content, cover_img, user_id) VALUES (?, ?, ?, ?)",
      [title, content, cover_img ?? null, user_id],
    );

    return NextResponse.json({
      message: "Sikeres mentés!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Hiba a mentés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { news_id, title, content, cover_img, user_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "A cím és a tartalom is kötelező!" },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE news SET title = ?, content = ?, cover_img = ?, modified_by = ?,modified_at = NOW() WHERE id = ? AND is_deleted = 0 ",
      [title, content, cover_img ?? null, user_id, news_id],
    );

    return NextResponse.json({
      message: "Sikeres mentés!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Hiba a mentés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
