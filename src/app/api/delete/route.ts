import { NextResponse } from 'next/server';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2';

export async function PATCH(req: Request) {
  try {
    const { news_id, title, content, cover_img, user_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'A cím és a tartalom is kötelező!' },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE news SET is_deleted=1 WHERE id = ? AND is_deleted = 0 ',
      [title, content, cover_img ?? null, user_id, news_id],
    );

    return NextResponse.json({
      message: 'Sikeres törlés!',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Hiba a törlés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}
