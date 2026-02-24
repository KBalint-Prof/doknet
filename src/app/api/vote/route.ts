import { NextResponse } from 'next/server';
import { db } from '../db';

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        polls.id,
        polls.title,
        polls.description,
        polls.created_at,
        polls.modified_at,
        users.username AS author_name,
        mu.username AS modified_by_name
       FROM polls 
       LEFT JOIN users ON users.id = polls.user_id
       LEFT JOIN users mu ON mu.id = polls.modified_by
       Where polls.is_active = 0
       ORDER BY polls.created_at DESC`,
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Hiba a lekérdezés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}
