import { NextResponse } from "next/server";
import { db } from "../../db";


export async function GET() {
  try {
    const [rows] = await db.query("SELECT id, username, email, role FROM users");
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "Hiba az adatok lekérésekor" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, newRole, adminRole } = body;

    
    if (adminRole !== 'admin') {
      return NextResponse.json({ error: "Nincs jogosultságod!" }, { status: 403 });
    }

    
    const [result]: any = await db.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [newRole, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sikeres módosítás!" });
  } catch (err) {
    console.error("Admin API hiba:", err);
    return NextResponse.json({ error: "Adatbázis hiba történt" }, { status: 500 });
  }
}