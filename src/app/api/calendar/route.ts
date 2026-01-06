import { NextResponse } from "next/server";
import { db } from "@/app/api/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, date } = await req.json();
    if (!title || !date) {
      return NextResponse.json({ error: "Hiányzó adat" }, { status: 400 });
    }

    const result: any = await db.query(
      "INSERT INTO events (title, date) VALUES (?, ?)",
      [title, date]
    );

    return NextResponse.json({ id: result.insertId, title, date }, { status: 201 });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}
