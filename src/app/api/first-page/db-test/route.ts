import type { NextRequest } from "next/server";
import { db } from "../../db";

export async function GET(request: NextRequest) {
  const [rows] = await db.query("SELECT * FROM `test_table`;");

  return Response.json({
    data: rows,
  });
}
