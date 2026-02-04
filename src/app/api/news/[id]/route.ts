import { NextResponse } from 'next/server';

import { ResultSetHeader } from 'mysql2';
import { db } from '../../db';

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
       WHERE news.id = ? AND news.is_deleted = 0
       LIMIT 1`,
      [id],
    );

    if ((news as any[]).length === 0) {
      return NextResponse.json(
        { message: 'Hír nem található' },
        { status: 404 },
      );
    }

    const [comments] = await db.query(
      `SELECT
        comments.id,
        comments.content,
        comments.created_at,
        users.username AS author_name
       FROM comments
       LEFT JOIN users ON users.id = comments.user_id
       WHERE comments.news_id = ?
       ORDER BY comments.created_at DESC`,
      [id],
    );

    const [reaction_types] = await db.query(`SELECT * FROM reaction_types`);

    const [reactions] = await db.query(
      `SELECT
        news_reactions.id,
        news_reactions.user_id,
        reaction_types.id AS reaction_type_id,
        reaction_types.key,
        reaction_types.label,
        reaction_types.icon,
        reaction_types.sort_order
       FROM news_reactions
       INNER JOIN reaction_types ON reaction_types.id = news_reactions.reaction_type_id
       WHERE news_reactions.news_id = ?
       ORDER BY reaction_types.sort_order ASC`,
      [id],
    );

    (news as any)[0].comments = comments;
    (news as any)[0].reactions = reactions;

    return NextResponse.json({ news, reaction_types });
  } catch (err) {
    console.error('Hiba a lekérdezés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, cover_img, user_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'A cím és a tartalom is kötelező!' },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO news (title, content, cover_img, user_id) VALUES (?, ?, ?, ?)',
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
