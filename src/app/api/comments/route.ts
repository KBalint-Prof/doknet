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
  }
}
