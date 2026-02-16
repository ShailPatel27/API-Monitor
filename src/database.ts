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

function hashUrl(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex");
}

async function initDatabase() {
  try {
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

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS monitored_apis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(2048) NOT NULL,
        url_hash CHAR(64) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
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

export type Result = "Success" | "Failure" | "Network or DNS Error";

export type MonitoredApi = {
  id: number;
  url: string;
  email: string;
};

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

export async function addMonitoredApi(url: string, email: string) {
  const urlHash = hashUrl(url);

  await pool.execute(
    `
    INSERT INTO monitored_apis (url, url_hash, email)
    VALUES (?, ?, ?)
    `,
    [url, urlHash, email]
  );
}

export async function getMonitoredApis(): Promise<MonitoredApi[]> {
  const [rows] = await pool.execute(
    `SELECT id, url, email FROM monitored_apis`
  );
  return rows as MonitoredApi[];
}
