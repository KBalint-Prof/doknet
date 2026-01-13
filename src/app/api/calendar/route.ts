// src\app\api\calendar route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/api/db";

export async function GET() {
  try {
    
    // Lekérdezzük a description mezőt is
    const [rows] = await db.query(
      "SELECT id, title, description, DATE_FORMAT(date, '%Y-%m-%d') as date FROM events ORDER BY date ASC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Fogadjuk a description mezőt is
    const { title, date, description } = await req.json();
    if (!title || !date) {
      return NextResponse.json({ error: "Hiányzó adat (cím vagy dátum)" }, { status: 400 });
    }

    // Beillesztjük a description mezőt is
    const [result]: any = await db.query(
      "INSERT INTO events (title, date, description) VALUES (?, ?, ?)",
      [title, date, description || ""] // Ha a leírás üres, üres stringet mentünk
    );

    return NextResponse.json({ id: result.insertId, title, date, description }, { status: 201 });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}