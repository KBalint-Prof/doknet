import { NextResponse } from 'next/server';
import { db } from '../db';

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        votes.id,
        votes.title,
        votes.description,
        votes.created_at,
        votes.modified_at,
        users.username AS author_name
       FROM votes 
       LEFT JOIN users ON users.id = votes.user_id
       Where votes.is_active = 0
       ORDER BY votes.created_at DESC`,
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Hiba a lekérdezés során:', err);
    return NextResponse.json({ error: 'Adatbázis hiba!' }, { status: 500 });
  }
}
