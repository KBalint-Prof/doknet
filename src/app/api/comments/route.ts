<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { db } from '../db';

export async function POST(request: Request) {
  try {
    const { content, newsId, userId } = await request.json();

    // Validálás: ne küldjünk üres kommentet
    if (!content || !newsId || !userId) {
      return NextResponse.json({ error: 'Hiányzó adatok' }, { status: 400 });
    }

    const query = `
      INSERT INTO comments (content, news_id, user_id) 
      VALUES (?, ?, ?)
    `;

    // A te db-d már egy ígéretekkel teli (promise) pool
    const [result] = await db.execute(query, [content, newsId, userId]);

    return NextResponse.json(
      {
        message: 'Sikeres mentés!',
        id: (result as any).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Adatbázis hiba:', error);
    return NextResponse.json({ error: 'Szerverhiba történt' }, { status: 500 });
=======
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
>>>>>>> 4e105ad (Kommentek 3)
  }
}
