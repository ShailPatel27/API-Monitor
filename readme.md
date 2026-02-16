# 🚨 API Monitor & Alert System

A full-stack API monitoring system that periodically checks registered APIs, logs their status, and sends email alerts on failures with retry support using **BullMQ + Redis**.

Includes a **React dashboard**, **Express backend**, **MySQL database**, and **background workers**.

---

## ✨ Features

- Monitor multiple APIs at fixed intervals (BullMQ scheduled jobs)
- Persist API check results in MySQL (`logs` table)
- Email notifications on API failures
- Automatic email retry with backoff (BullMQ + Redis)
- Manage monitored APIs and recipient emails via UI
- View historical API logs
- Cleanup utility to remove duplicate schedules
- One-command startup for backend + workers + UI

---

## 🏗️ Architecture Overview

<pre>
React (Vite)
↓ HTTP
Express API (Node.js)
↓
MySQL (logs, monitored_apis, emails)
↓
BullMQ (monitor queue, email-retry queue)
↓
Redis
↓
Background Workers
</pre>

---

## 🗂️ Project Structure

<pre>
project/
├── api-monitor-ui/ # React frontend (Vite)
├── src/
│ ├── routes/ # Express API routes
│ ├── workers/ # BullMQ workers
│ ├── queue/ # BullMQ queues & connection
│ ├── services/ # API check logic
│ ├── database.ts # MySQL access layer
│ ├── email.ts # Email service
│ ├── scheduler.ts # BullMQ scheduler
│ └── cleanup.ts # Removes old repeat jobs
├── dist/ # Compiled output
├── package.json
└── README.md
</pre>

---

## 🧠 Core Concepts Used

- BullMQ repeatable jobs for scheduling (no cron dependency)
- Redis-backed retry queues for email delivery
- Worker separation (monitor worker & email worker)
- Idempotent scheduling (cleanup script prevents duplicates)
- Safe job IDs (hashed to avoid BullMQ restrictions)

---

## 🛠️ Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- MySQL (`mysql2`)
- BullMQ
- Redis
- Nodemailer

### Frontend
- React
- Vite
- Axios
- TypeScript

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

<pre>
#Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=api_monitor

#Redis
REDIS_URL=redis://127.0.0.1:6379

#Email (example: Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
</pre>

---

## 🚀 Getting Started

### 1. Install dependencies

```npm install
cd api-monitor-ui
npm install```


---

### 2. Build backend

```npm run build```


---

### 3. (Optional) Clean old schedules

Run once if you previously tested scheduling logic.

```npm run clean```


---

### 4. Start everything (recommended)

```npm run start-all```


This launches:
- Express API
- BullMQ scheduler
- Monitor worker
- Email worker
- React UI

---

## 📆 Job Scheduling Logic

| Task | Interval |
|----|----|
| API monitoring | Every 6 hours |
| Email retry | Every 1 hour |
| Backoff | Fixed delay |

All scheduling is handled by **BullMQ repeatable jobs**, not `setInterval`.

---

## 📬 Email Retry Behavior

- First attempt is sent immediately on API failure
- On failure, email is queued in `email-retry`
- Retries automatically using BullMQ
- Failed jobs can be inspected in Redis:

<pre>bull:email-retry:*</pre>


---

## 🖥️ UI Features

- Add / delete monitored APIs
- Add / delete email recipients
- View API logs in table format
- Delete confirmation dialogs
- Clean, table-based layout

---

## 🧪 Useful Scripts

npm run build # Compile TypeScript
npm run start-all # Start backend + workers + UI
npm run clean # Remove repeatable BullMQ jobs
npm run server # Start only Express API
npm run workers # Start only workers


---

## 📌 Notes

- Redis must be running before starting workers
- Duplicate schedules are prevented via cleanup logic
- UI and backend are fully decoupled
- Designed for easy extension (auth, projects, etc.)

---

## 📄 License

MIT

---

## 👤 Author

Shail

This project demonstrates:
- Background job processing
- Reliable scheduling
- Distributed retry systems
- Production-style backend architecture