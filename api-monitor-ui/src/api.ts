import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3001",
});

/* ---------- APIS ---------- */

export async function getApis() {
  const res = await http.get("/apis");
  return res.data;
}

export async function addApi(project: string, url: string) {
  await http.post("/apis", { project, url });
}

export async function deleteApi(id: number) {
  await http.delete(`/apis/${id}`);
}

/* ---------- EMAILS ---------- */

export async function getEmails() {
  const res = await http.get("/emails");
  return res.data;
}

export async function addEmail(email: string, username?: string) {
  await http.post("/emails", { email, username });
}

export async function deleteEmail(id: number) {
  await http.delete(`/emails/${id}`);
}

/* ---------- LOGS ---------- */

export async function getLogs() {
  const res = await http.get("/logs");
  return res.data;
}

/* ---------- MONITOR ---------- */

/**
 * Runs monitor immediately and resets schedule
 */

export async function getNextMonitorRun() {
  const res = await http.get("/monitor/next");
  return res.data as { nextRunAt: number | null };
}

export async function runMonitorNow() {
  await http.post("/monitor/run");
}