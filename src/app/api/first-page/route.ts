import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return Response.json({
    message: "First page message from backend",
  });
}
