import "dotenv/config";
import { monitorQueue } from "./queue/monitor.queue";

(async () => {
  const repeatableJobs = await monitorQueue.getRepeatableJobs();

  if (repeatableJobs.length === 0) {
    console.log("No repeatable jobs found");
    process.exit(0);
  }

  for (const job of repeatableJobs) {
    await monitorQueue.removeRepeatableByKey(job.key);

    console.log(
      "Removed repeatable job:",
      {
        id: job.id,
        key: job.key,
        nextRunAt: job.next
          ? new Date(job.next).toLocaleString()
          : "unknown",
      }
    );
  }

  console.log("Cleanup done — all repeatable monitor jobs removed");
  process.exit(0);
})();
