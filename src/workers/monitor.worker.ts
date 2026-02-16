// src/workers/monitor.worker.ts
import "dotenv/config";
import crypto from "crypto";
import { Worker } from "bullmq";
import {
  databaseReady,
  getApis,
  getEmails,
} from "../database";
import { checkApi } from "../services/checkApi.service";
import { sendMail } from "../email";
import { emailQueue } from "../queue/email.queue";
import { connection } from "../queue/connection";

console.log("Monitor worker started (runs every 1 minute)");

function safeJobId(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

new Worker(
  "monitor",
  async () => {
    await databaseReady;

    const apis = await getApis();
    const emails = await getEmails();

    if (emails.length === 0) {
      console.warn("No emails configured — skipping notifications");
      return;
    }

    for (const api of apis) {
      const result = await checkApi(api.url);

      if (result.status === "Success") continue;

      const statusMessage =
        result.status === "Failure"
          ? `${result.code ?? ""} ${result.statusText ?? ""}`.trim()
          : "Network / DNS Error";

      const message = `
        <strong>URL:</strong> ${api.url}<br>
        <strong>Status:</strong> ${statusMessage}
      `;

      for (const email of emails) {
        try {
          await sendMail(email.email, message);
          console.log("Mail sent:", api.url, "→", email.email);
        } catch {
          await emailQueue.add(
            "send-email",
            {
              url: api.url,
              email: email.email,
              message,
            },
            {
              jobId: safeJobId(`${api.url}:${email.email}`),
              attempts: 5,
              backoff: {
                type: "fixed",
                delay: 10_000, // ⏱ retry every 10s (testing)
              },
              removeOnComplete: true,
            }
          );

          console.log(
            "Mail failed, queued:",
            api.url,
            "→",
            email.email
          );
        }
      }
    }

    console.log("Monitor run finished");
  },
  { connection }
);
