// src/database.ts
import "dotenv/config";
import mysql from "mysql2/promise";
import crypto from "crypto";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

/* ---------- utils ---------- */

function hashUrl(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex");
}

/* ---------- init ---------- */

async function initDatabase() {
  try {
    // LOGS (UNCHANGED)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(2048) NOT NULL,
        result ENUM('Success', 'Failure', 'Network or DNS Error') NOT NULL,
        status_code INT NULL,
        status_text VARCHAR(255) NULL,
        checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // MONITORED APIS (NO EMAIL)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS monitored_apis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(2048) NOT NULL,
        url_hash CHAR(64) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // EMAILS
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("MySQL tables ensured");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

export const databaseReady = initDatabase();

/* ---------- types ---------- */

export type Result = "Success" | "Failure" | "Network or DNS Error";

export type ApiRow = {
  id: number;
  url: string;
};

export type EmailRow = {
  id: number;
  email: string;
  username?: string;
};

/* ---------- LOGS API (READ ONLY) ---------- */

export async function getLogs(limit = 100) {
  const [rows] = await pool.execute(
    `
    SELECT id, url, result, status_code, status_text, checked_at
    FROM logs
    ORDER BY checked_at DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows;
}

export async function logResult(
  url: string,
  result: Result,
  statusCode?: number,
  statusText?: string
) {
  await pool.execute(
    `
    INSERT INTO logs (url, result, status_code, status_text)
    VALUES (?, ?, ?, ?)
    `,
    [url, result, statusCode ?? null, statusText ?? null]
  );
}

/* ---------- APIS API ---------- */

export async function addApi(url: string) {
  const urlHash = hashUrl(url);

  await pool.execute(
    `
    INSERT INTO monitored_apis (url, url_hash)
    VALUES (?, ?)
    `,
    [url, urlHash]
  );
}

export async function deleteApi(id: number) {
  await pool.execute(
    `DELETE FROM monitored_apis WHERE id = ?`,
    [id]
  );
}

export async function getApis(): Promise<ApiRow[]> {
  const [rows] = await pool.execute(
    `SELECT id, url FROM monitored_apis`
  );

  return rows as ApiRow[];
}

/* ---------- EMAILS API ---------- */

export async function addEmail(email: string, username?: string) {
  await pool.execute(
    `
    INSERT INTO emails (email, username)
    VALUES (?, ?)
    `,
    [email, username ?? null]
  );
}

export async function deleteEmail(id: number) {
  await pool.execute(
    `DELETE FROM emails WHERE id = ?`,
    [id]
  );
}

export async function getEmails(): Promise<EmailRow[]> {
  const [rows] = await pool.execute(
    `SELECT id, email, username FROM emails`
  );

  return rows as EmailRow[];
}
