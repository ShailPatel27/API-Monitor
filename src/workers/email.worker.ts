import { Worker } from "bullmq";
import { connection } from "../queue/connection";
import { sendMail } from "../email";

console.log("Email retry worker started");

new Worker(
  "email-retry",
  async job => {
    const { email, message, url } = job.data;

    console.log("Retrying email for", url);

    await sendMail(email, message);

    console.log("Retry success:", url);
  },
  { connection }
);
