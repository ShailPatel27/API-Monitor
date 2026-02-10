import "dotenv/config";
import { redis, connectRedis } from "../redis";
import { sendMail } from "../email";
import { EmailRetryPayload } from "../types/emailRetry";

console.log("Email retry worker started");

async function retryEmails() {
  await connectRedis();

  const items = await redis.lRange("email_retry", 0, -1);

  for (const item of items) {
    const payload: EmailRetryPayload = JSON.parse(item);

    try {
      await sendMail(payload.message);
      await redis.lRem("email_retry", 1, item);
      console.log("Retry success:", payload.url);
    } catch {
      payload.attempts += 1;
      payload.lastAttempt = new Date().toISOString();

      await redis.lRem("email_retry", 1, item);
      await redis.rPush("email_retry", JSON.stringify(payload));

      console.log(
        `Retry failed (${payload.attempts}):`,
        payload.url
      );
    }
  }
}

retryEmails();
