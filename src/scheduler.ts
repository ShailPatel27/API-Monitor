import { monitorQueue } from "./queue/monitor.queue";

(async () => {
  const repeatableJobs = await monitorQueue.getRepeatableJobs();

  if (repeatableJobs.length === 0) {
    await monitorQueue.add(
      "monitor-job",
      {},
      {
        jobId: "monitor-repeat",
        repeat: {
          every: 6 * 60 * 60 * 1000 // ⏱ 6 hours
        },
        removeOnComplete: true
      }
    );

    console.log("Monitor job scheduled");
  } else {
    console.log("Monitor job already scheduled");
  }

  process.exit(0);
})();
