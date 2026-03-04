import { NextResponse } from "next/server";
import { db } from "../db";
import { ResultSetHeader } from "mysql2";

export async function PATCH(req: Request) {
  try {
    const { vote_id } = await req.json();

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE votes SET is_active=1 WHERE id = ? AND is_active = 0 ",
      [vote_id],
    );

    return NextResponse.json({
      message: "Sikeres lezárás!",
    });
  } catch (err) {
    console.error("Hiba a lezárás során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
