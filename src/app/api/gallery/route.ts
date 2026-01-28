import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { db } from "../db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM gallery ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const now = new Date();
    const dateDir = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadDir = path.join(process.cwd(), "public/gallery", dateDir);
    await fs.mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      await fs.writeFile(path.join(uploadDir, safeName), buffer);
      const dbPath = `/gallery/${dateDir}/${safeName}`;
      await db.query("INSERT INTO gallery (image_path) VALUES (?)", [dbPath]);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json(); // Most már több ID-t várunk
    if (!ids || !Array.isArray(ids)) return NextResponse.json({ error: "Érvénytelen ID-k" }, { status: 400 });

    for (const id of ids) {
      const [rows]: any = await db.query("SELECT image_path FROM gallery WHERE id = ?", [id]);
      if (rows.length > 0) {
        const filePath = path.join(process.cwd(), "public", rows[0].image_path);
        try { await fs.unlink(filePath); } catch (e) {}
      }
      await db.query("DELETE FROM gallery WHERE id = ?", [id]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}