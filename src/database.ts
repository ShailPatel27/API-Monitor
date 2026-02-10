// import Database from "better-sqlite3";
import "dotenv/config";
import mysql from "mysql2/promise";

// const db = new Database("logs.db");
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

async function initDatabase() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            url TEXT NOT NULL,
            result ENUM('Success', 'Failure', 'Network or DNS Error') NOT NULL,
            status_code INT NULL,
            status_text VARCHAR(255) NULL,
            checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
  `);

    // db.prepare(`
    // CREATE TABLE IF NOT EXISTS logs(
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     url TEXT NOT NULL,
    //     result TEXT CHECK(result IN ('Success', 'Failure', 'Network or DNS Error')),
    //     status_code INTEGER,
    //     status_text TEXT,
    //     checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    // )
    // `).run();

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS monitored_apis (
            id INT AUTO_INCREMENT PRIMARY KEY,
            url TEXT NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // db.prepare(`
    // CREATE TABLE IF NOT EXISTS monitored_apis (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     url TEXT NOT NULL UNIQUE,
    //     email TEXT NOT NULL,
    //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    // )
    // `).run();

    console.log("MySQL tables ensured");
}

export const databaseReady = initDatabase();

// initDatabase().catch(err => {
//     console.error("Database init failed:", err);
//     process.exit(1);
// });

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

    //     db.prepare(`
    //     INSERT INTO logs (url, result, status_code, status_text)
    //     VALUES (?, ?, ?, ?)
    // `).run(url, result, statusCode ?? null, statusText ?? null);
}

export async function getMonitoredApis(): Promise<MonitoredApi[]> {
    const [rows] = await pool.execute(
        `SELECT id, url, email FROM monitored_apis`
    );
    return rows as MonitoredApi[];
}
// export function getMonitoredApis(): MonitoredApi[] {
//     return db
//         .prepare(`SELECT id, url, email FROM monitored_apis`)
//         .all() as MonitoredApi[];
// }
