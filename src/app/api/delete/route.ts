import { NextResponse } from "next/server";
import { db } from "../db";
import { ResultSetHeader } from "mysql2";

export async function PATCH(req: Request) {
  try {
    const { news_id } = await req.json();

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE news SET is_deleted=1 WHERE id = ? AND is_deleted = 0 ",
      [news_id],
    );

    return NextResponse.json({
      message: "Sikeres törlés!",
    });
  } catch (err) {
    console.error("Hiba a törlés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
