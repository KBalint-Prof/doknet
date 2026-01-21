import { NextResponse } from "next/server";
import { db } from "@/app/api/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    if (isNaN(idNum)) return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });

    
    const { title, date, description } = await req.json();
    if (!title || !date) return NextResponse.json({ error: "Hiányzó adat" }, { status: 400 });

    
    await db.query("UPDATE events SET title = ?, date = ?, description = ? WHERE id = ?", [title, date, description || "", idNum]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    if (isNaN(idNum)) return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });

    await db.query("DELETE FROM events WHERE id = ?", [idNum]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}