import mysql, { Pool } from "mysql2/promise";

declare global {
  var pool: Pool | undefined;
}

let pool: Pool;

if (!global.pool) {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test2",
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
  });
  global.pool = pool;
  console.log("✅ MySQL pool created (global)");
} else {
  pool = global.pool;
}

export const db = pool;
