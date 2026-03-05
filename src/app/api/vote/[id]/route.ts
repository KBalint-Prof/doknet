import { NextResponse } from 'next/server';

import { ResultSetHeader } from 'mysql2';
import { db } from '../../db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const [votes] = await db.query(
      `SELECT
        votes.id,
        votes.title,
        votes.description,
        votes.created_at,
        votes.is_active,
        users.username AS author_name
       FROM votes 
       LEFT JOIN users ON users.id = votes.user_id
       WHERE votes.id = ?`,
      [id],
    );

    const [vote_options] = await db.query(`SELECT * FROM vote_options`);

    const [options] = await db.query(
      `SELECT
        vote_votes.id,
        vote_votes.user_id,
        vote_options.id AS vote_option_id,
        vote_options.option_text
       FROM vote_votes
       INNER JOIN vote_options ON vote_options.id = vote_votes.option_id
       WHERE vote_votes.vote_id = ?
       ORDER BY vote_options.id ASC`,
      [id],
    );

    (votes as any)[0].options = options;

    if ((votes as any[]).length === 0) {
      return NextResponse.json(
        { message: 'Szavazás nem található' },
        { status: 404 },
      );
    }
    return NextResponse.json({ votes, vote_options });
  } catch (err) {
    console.error('Hiba a lekérdezés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, user_id } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'A cím és a leírás is kötelező!' },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO votes (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, user_id],
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
