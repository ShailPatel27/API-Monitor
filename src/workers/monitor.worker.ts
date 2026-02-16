// src/workers/monitor.worker.ts
import "dotenv/config";
import { databaseReady, getMonitoredApis } from "../database";
import { checkApi } from "../services/checkApi.service";
import { sendMail } from "../email";
import { emailQueue } from "../queue/email.queue";

console.log("Monitor worker started");

async function runMonitor() {
  await databaseReady;

  const apis = await getMonitoredApis();

  for (const api of apis) {
    const result = await checkApi(api.url);

    if (result.status === "Success") {
      continue;
    }

    let statusMessage: string;

    if (result.status === "Failure") {
      statusMessage = `${result.code} ${result.statusText}`;
    } else {
      statusMessage = "Network / DNS Error";
    }

    const message = `
      <strong>URL:</strong> ${api.url}<br>
      <strong>Status:</strong> ${statusMessage}
    `;

    try {
      // ✅ FIRST attempt: send immediately
      await sendMail(message);
      console.log("Mail sent:", api.url);
    } catch (err) {
      // ❌ Only queue if sending FAILED
      await emailQueue.add(
        "send-email",
        {
          url: api.url,
          email: api.email,
          message,
        },
        {
          jobId: api.url, // prevent duplicates
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 60_000, // 1 minute
          },
          removeOnComplete: true,
        }
      );

      console.log("Mail failed, queued:", api.url);
    }
  }

  console.log("Monitor run finished");
}

runMonitor();
