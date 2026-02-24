import { NextResponse } from 'next/server';

import { ResultSetHeader } from 'mysql2';
import { db } from '../db';

export async function POST(req: Request) {
  try {
    const { title, description, user_id, options } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'A cím és a leírás is kötelező!' },
        { status: 400 },
      );
    }

    if (!options || options.length < 2) {
      return NextResponse.json(
        { error: 'Legalább 2 opció szükséges!' },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO polls (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, user_id],
    );

    const pollId = result.insertId;

    for (const option of options) {
      if (option.trim() !== '') {
        await db.query(
          'INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)',
          [pollId, option],
        );
      }
    }

    return NextResponse.json({
      message: 'Sikeres mentés!',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Hiba a mentés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { poll_id, title, description, user_id, options } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'A cím és a leírás is kötelező!' },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE polls SET title = ?, description = ?, modified_at = NOW() WHERE id = ? AND is_active = 0 ',
      [title, description, user_id, poll_id],
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
