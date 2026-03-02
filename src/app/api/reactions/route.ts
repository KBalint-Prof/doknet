import { ResultSetHeader } from "mysql2";
import { db } from "../db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id, news_id, reaction_type_id } = await req.json();

    let id = null;

    if (!user_id) {
      return NextResponse.json(
        { error: "A reakció küldéséhez kötelező a bejelentkezés!" },
        { status: 400 },
      );
    }

    const [alreadyExitsResult] = await db.query(
      `SELECT * FROM news_reactions WHERE user_id = ? AND news_id = ?`,
      [user_id, news_id],
    );

    //@ts-ignore
    const alreadyExists = alreadyExitsResult.length > 0;

    const alreadyExistsSame =
      alreadyExists &&
      //@ts-ignore
      (alreadyExitsResult[0] as any).reaction_type_id === reaction_type_id;

    if (alreadyExistsSame) {
      const [result] = await db.query<ResultSetHeader>(
        "DELETE FROM news_reactions WHERE user_id = ? AND news_id = ?",
        [user_id, news_id],
      );
    } else if (alreadyExists) {
      const [result] = await db.query<ResultSetHeader>(
        "UPDATE news_reactions SET user_id = ?, news_id = ?, reaction_type_id = ? WHERE user_id = ? AND news_id = ?",
        [user_id, news_id, reaction_type_id, user_id, news_id],
      );
      id = result.insertId;
    } else {
      const [result] = await db.query<ResultSetHeader>(
        "INSERT INTO news_reactions (user_id, news_id, reaction_type_id) VALUES (?, ?, ?)",
        [user_id, news_id, reaction_type_id],
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
