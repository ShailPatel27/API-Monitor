// api.ts
const API_BASE = "http://localhost:3001";

async function json<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export const api = {
  // APIS
  getApis: () => json("/apis"),
  addApi: (project: string, url: string) =>
    json("/apis", {
      method: "POST",
      body: JSON.stringify({ project, url }),
    }),
  deleteApi: (id: number) =>
    json(`/apis/${id}`, { method: "DELETE" }),

  // EMAILS
  getEmails: () => json("/emails"),
  addEmail: (email: string, username?: string) =>
    json("/emails", {
      method: "POST",
      body: JSON.stringify({ email, username }),
    }),
  deleteEmail: (id: number) =>
    json(`/emails/${id}`, { method: "DELETE" }),

  // LOGS
  getLogs: () => json("/logs"),
};
