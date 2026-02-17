import "dotenv/config";
import { monitorQueue } from "./monitor.queue";

const MONITOR_INTERVAL_MS =
  Number(process.env.MONITOR_INTERVAL_MS) ||
  6 * 60 * 60 * 1000;

/**
 * Runs monitor immediately and schedules the next repeat
 * strictly AFTER this run.
 */
export async function rescheduleMonitor() {
  // 1️⃣ Remove ALL existing repeatable jobs
  const repeatables = await monitorQueue.getRepeatableJobs();
  for (const job of repeatables) {
    await monitorQueue.removeRepeatableByKey(job.key);
  }

  // 2️⃣ Run immediately (one-off job)
  await monitorQueue.add(
    "monitor-job",
    {},
    {
      jobId: `monitor-now-${Date.now()}`,
      removeOnComplete: true, // ✅ OK for one-off
    }
  );

  // 3️⃣ Schedule next repeat from NOW
  await monitorQueue.add(
    "monitor-job",
    {},
    {
      jobId: "monitor-repeat",
      repeat: {
        every: MONITOR_INTERVAL_MS,
      },
      // ❌ DO NOT set removeOnComplete here
    }
  );

  console.log(
    "Monitor ran immediately. Next run in",
    MONITOR_INTERVAL_MS / 1000 / 60,
    "minutes"
  );
}
