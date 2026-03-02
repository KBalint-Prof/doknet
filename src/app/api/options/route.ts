import { ResultSetHeader } from "mysql2";
import { db } from "../db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id, vote_id, option_id } = await req.json();

    let id = null;

    if (!user_id) {
      return NextResponse.json(
        { error: "A reakció küldéséhez kötelező a bejelentkezés!" },
        { status: 400 },
      );
    }

    const [alreadyExitsResult] = await db.query(
      `SELECT * FROM vote_votes WHERE user_id = ? AND vote_id = ?`,
      [user_id, vote_id],
    );

    //@ts-ignore
    const alreadyExists = alreadyExitsResult.length > 0;

    const alreadyExistsSame =
      alreadyExists &&
      //@ts-ignore
      (alreadyExitsResult[0] as any).option_id === option_id;

    if (alreadyExistsSame) {
      const [result] = await db.query<ResultSetHeader>(
        "DELETE FROM vote_votes WHERE user_id = ? AND vote_id = ?",
        [user_id, vote_id],
      );
    } else if (alreadyExists) {
      const [result] = await db.query<ResultSetHeader>(
        "UPDATE vote_votes SET user_id = ?, vote_id = ?, option_id = ? WHERE user_id = ? AND vote_id = ?",
        [user_id, vote_id, option_id, user_id, vote_id],
      );
      id = result.insertId;
    } else {
      const [result] = await db.query<ResultSetHeader>(
        "INSERT INTO vote_votes (user_id, vote_id, option_id) VALUES (?, ?, ?)",
        [user_id, vote_id, option_id],
      );

      id = result.insertId;
    }

    return NextResponse.json({
      message: "Sikeres reakció!",
      id: id,
    });
  } catch (err) {
    console.error("Hiba a reakció küldése során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
