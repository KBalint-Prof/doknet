import { NextResponse } from 'next/server';

import { ResultSetHeader } from 'mysql2';
import { db } from '../db';

export async function POST(req: Request) {
  try {
    const { title, content, cover_img, user_id } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'A komment küldéséhez kötelező a tartalom!' },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE news SET title = ?, content = ?, cover_img = ?, user_id = ? WHERE id = ?',
      [title, content, cover_img ?? null, user_id],
    );

    return NextResponse.json({
      message: 'Sikeres mentés!',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Hiba a mentés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}
