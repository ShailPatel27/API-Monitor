import "dotenv/config";
import { databaseReady, getMonitoredApis } from "../database";
import { checkApi } from "../services/checkApi.service";
import { sendMail } from "../email";
import { redis, connectRedis } from "../redis";
import { EmailRetryPayload } from "../types/emailRetry";


console.log("Script started");

async function runMonitor() {
  await databaseReady;
  await connectRedis();

  const apis = await getMonitoredApis();

  for (const api of apis) {
    const result = await checkApi(api.url);

    if (result.status === "Success") continue;

    const retryPayload: EmailRetryPayload = {
      url: api.url,
      email: api.email,
      message: `
        <strong>URL:</strong> ${api.url}<br>
        <strong>Status:</strong> ${result.status}
      `,
      attempts: 1,
      lastAttempt: new Date().toISOString()
    };

    try {
      await sendMail(retryPayload.message);
      console.log("Mail sent:", api.url);
    } catch {

      await redis.rPush("email_retry", JSON.stringify(retryPayload));
      console.log("Mail failed, queued:", api.url);
    }
  }

  console.log("Script Executed");
}

runMonitor();
