import { NextResponse } from "next/server";
import { db } from "../db";

const ALLOWED_ROLES = ['member', 'president', 'teacher', 'admin'];

export async function GET() {
    try {
        const [rows] = await db.query(
            "SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50"
        );
        return NextResponse.json(rows);
    } catch (err) {
        return NextResponse.json({ error: "Hiba a chat lekérésekor" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, username, message, userRole } = await req.json();

        
        if (!userRole || !ALLOWED_ROLES.includes(userRole)) {
            return NextResponse.json(
                { error: "Nincs jogosultságod a chat használatához!" }, 
                { status: 403 }
            );
        }

        if (!message.trim()) {
            return NextResponse.json({ error: "Üres üzenet" }, { status: 400 });
        }

        await db.query(
            "INSERT INTO chat_messages (user_id, username, message) VALUES (?, ?, ?)",
            [userId, username, message]
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Chat API hiba:", err);
        return NextResponse.json({ error: "Szerver hiba" }, { status: 500 });
    }
}