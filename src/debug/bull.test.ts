// src/debug/bull.test.ts
import { Queue } from "bullmq";
import { connection } from "../queue/connection";

(async () => {
  const q = new Queue("test-queue", { connection });

  await q.add("test-job", { ok: true });

  console.log("Job added successfully");
  process.exit(0);
})();
