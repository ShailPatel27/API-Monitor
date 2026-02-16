import { monitorQueue } from "./queue/monitor.queue";

(async () => {
  const jobs = await monitorQueue.getRepeatableJobs();

  for (const job of jobs) {
    await monitorQueue.removeRepeatableByKey(job.key);
    console.log("Removed repeatable job:", job.key);
  }

  console.log("Cleanup done");
  process.exit(0);
})();
