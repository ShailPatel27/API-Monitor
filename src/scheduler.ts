// src/scheduler.ts

import { Queue } from "bullmq";
import { connection } from "./queue/connection";

const monitorQueue = new Queue("monitor", { connection });

async function schedule() {
  await monitorQueue.add(
    "run-monitor",
    {},
    {
      repeat: {
        every: 6 * 60 * 60 * 1000, // every 6 hours
      },
    }
  );

  console.log("Monitor scheduled every 6 hours");
}

schedule();
