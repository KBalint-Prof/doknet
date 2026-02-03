import { NextResponse } from "next/server";
import { db } from "@/app/api/db";


const hasPermission = (role: string) => ['president', 'teacher', 'admin'].includes(role);

export async function GET() {
  try {
    
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
    
    const { title, date, description, userRole } = await req.json();

    
    if (!userRole || !hasPermission(userRole)) {
      return NextResponse.json(
        { error: "Nincs jogosultságod esemény létrehozásához!" }, 
        { status: 403 }
      );
    }

    if (!title || !date) {
      return NextResponse.json(
        { error: "Hiányzó adat (cím vagy dátum)" }, 
        { status: 400 }
      );
    }

    
    const [result]: any = await db.query(
      "INSERT INTO events (title, date, description) VALUES (?, ?, ?)",
      [title, date, description || ""]
    );

    return NextResponse.json(
      { id: result.insertId, title, date, description }, 
      { status: 201 }
    );
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}