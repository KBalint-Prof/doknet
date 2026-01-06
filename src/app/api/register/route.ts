import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";
import { db } from "../db";

export async function POST(req: Request) {
  try {
    const { email, username, password, eduID } = await req.json();

    if (!email || !username || !password || !eduID) {
      return NextResponse.json(
        { error: "MInden mező kitöltése kötelező!" },
        { status: 400 }
      );
    }

    const [existingUser]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Ez az email már regisztrálva van!" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO users (email, username, password, eduID) VALUES (?, ?, ?, ?)",
      [email, username, hashedPassword, eduID]
    );

    return NextResponse.json({
      message: "Sikeres regisztráció!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Hiba a regiszráció során:", err);
    return NextResponse.json({ error: "Adatbázis hiba!" }, { status: 500 });
  }
}
