import { NextResponse } from "next/server";
import { db } from "@/app/api/db";

// Segédfüggvény: Csak elnök, tanár vagy admin módosíthat/törölhet
const hasPermission = (role: string) => ['president', 'teacher', 'admin'].includes(role);

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    if (isNaN(idNum)) return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });

    const { title, date, description, userRole } = await req.json();

    // JOGOSULTSÁG ELLENŐRZÉSE
    if (!userRole || !hasPermission(userRole)) {
      return NextResponse.json({ error: "Nincs jogosultságod a módosításhoz!" }, { status: 403 });
    }

    if (!title || !date) {
      return NextResponse.json({ error: "Hiányzó adat (cím vagy dátum)" }, { status: 400 });
    }

    await db.query(
      "UPDATE events SET title = ?, date = ?, description = ? WHERE id = ?", 
      [title, date, description || "", idNum]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    if (isNaN(idNum)) return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });

    // A DELETE kérésnél is beolvassuk a body-t a rang ellenőrzéséhez
    const { userRole } = await req.json();

    // JOGOSULTSÁG ELLENŐRZÉSE
    if (!userRole || !hasPermission(userRole)) {
      return NextResponse.json({ error: "Nincs jogosultságod a törléshez!" }, { status: 403 });
    }

    await db.query("DELETE FROM events WHERE id = ?", [idNum]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Adatbázis hiba" }, { status: 500 });
  }
}