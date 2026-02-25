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
        polls.id,
        polls.title,
        polls.description,
        polls.created_at,
        polls.modified_at,
        users.username AS author_name,
       FROM polls 
       LEFT JOIN users ON users.id = polls.user_id
       WHERE polls.id = ? AND polls.is_active = 0
       LIMIT 1`,
      [id],
    );

    if ((news as any[]).length === 0) {
      return NextResponse.json(
        { message: "Hír nem található" },
        { status: 404 },
      );
    }

    return NextResponse.json({ news });
  } catch (err) {
    console.error("Hiba a lekérdezés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, cover_img, user_id } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "A cím és a leírás is kötelező!" },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO polls (title, description, user_id) VALUES (?, ?, ?)",
      [title, description, user_id],
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
