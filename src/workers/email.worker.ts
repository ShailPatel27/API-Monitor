// src/workers/email.worker.ts
import { Worker } from "bullmq";
import { connection } from "../queue/connection";
import { sendMail } from "../email";

console.log("Email retry worker started");

new Worker(
  "email-retry",
  async job => {
    const { message, url } = job.data;

    console.log("Retrying email for", url);

    await sendMail(message);

    console.log("Retry success:", url);
  },
  {
    connection,
  }
);
