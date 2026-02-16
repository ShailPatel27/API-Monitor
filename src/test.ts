import "dotenv/config";
import mysql from "mysql2/promise";

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  
  const [rows] = await conn.query("SELECT 1 AS ok");
  console.log(rows);
  await conn.end();
})();
