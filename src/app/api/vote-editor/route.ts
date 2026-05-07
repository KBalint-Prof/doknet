import { NextResponse } from "next/server";

import { ResultSetHeader } from "mysql2";
import { db } from "../db";

export async function POST(req: Request) {
  try {
    const { title, description, user_id, options } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "A cím és a leírás is kötelező!" },
        { status: 400 },
      );
    }

    const validOptions = options.filter(
      (option: string) => option.trim() !== "",
    );

    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: "Legalább 2 kitöltött opció szükséges!" },
        { status: 400 },
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO votes (title, description, user_id) VALUES (?, ?, ?)",
      [title, description, user_id],
    );

    const voteId = result.insertId;

    for (const option of validOptions) {
      await db.query(
        "INSERT INTO vote_options (vote_id, option_text) VALUES (?, ?)",
        [voteId, option],
      );
    }

    return NextResponse.json({
      message: "Sikeres mentés!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Hiba a mentés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
