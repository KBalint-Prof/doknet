import { db } from "../../../db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ test_id: string }> }
) {
  const { test_id } = await params;

  const [rows] = await db.query(
    `SELECT * FROM test_table where test_table_id = ${test_id};`
  );

  return Response.json({
    data: rows,
  });
}
