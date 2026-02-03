import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "../db";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Minden mező kitöltése kötelező!" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT id, username, email, password, role FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Nincs ilyen felhasználó!" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Hibás jelszó!" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Sikeres belépés!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (err) {
    console.error("Hiba a bejelentkezés során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}