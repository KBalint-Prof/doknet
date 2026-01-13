import { NextResponse } from "next/server";

import { ResultSetHeader } from "mysql2";
import { db } from "../db";

export async function POST(req: Request) {
  try {
    const { news_id, content, user_id } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "A komment küldéséhez kötelező a tartalom!" },
        { status: 400 }
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO comments (news_id, content, user_id) VALUES (?, ?, ?)",
      [news_id, content, user_id]
    );

    return NextResponse.json({
      message: "Sikeres komment!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Hiba a komment küldése során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
