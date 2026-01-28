import mysql from 'mysql2/promise';
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'doknetdb', // Ez a fontos!
  waitForConnections: true,
  connectionLimit: 10,
});