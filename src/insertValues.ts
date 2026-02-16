import "dotenv/config";
import mysql from "mysql2/promise";
import crypto from "crypto";

function hashUrl(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex");
}

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("MySQL connected");

  const data = [
    {
      url: "https://www.google.com",
      email: "shailpatel2709@gmail.com",
    },
    {
      url: "https://www.google.com/shail",
      email: "shailpatel2709@gmail.com",
    },
    {
      url: "https://www.lenex.dev",
      email: "shailpatel2709@gmail.com",
    },
  ];

  for (const item of data) {
    const urlHash = hashUrl(item.url);

    try {
      await conn.execute(
        `
        INSERT INTO monitored_apis (url, url_hash, email)
        VALUES (?, ?, ?)
        `,
        [item.url, urlHash, item.email]
      );

      console.log("Inserted:", item.url);
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log("Already exists (skipped):", item.url);
      } else {
        throw err;
      }
    }
  }

  await conn.end();
  console.log("Done");
})();
