import { Router } from "express";
import { monitorQueue } from "../queue/monitor.queue";
import { rescheduleMonitor } from "../queue/rescheduleMonitor";

const router = Router();

/**
 * POST /monitor/run
 * Run immediately + reschedule
 */
router.post("/run", async (_, res) => {
  await rescheduleMonitor();
  res.json({ success: true });
});

/**
 * GET /monitor/next
 * Returns next scheduled repeat run timestamp
 */
router.get("/next", async (_, res) => {
  const repeatableJobs = await monitorQueue.getRepeatableJobs();

  // ✅ IMPORTANT: repeatable jobs have NO id
  // Identify by job NAME
  const repeatJob = repeatableJobs.find(
    job => job.name === "monitor-job"
  );

  if (!repeatJob || !repeatJob.next) {
    return res.json({ nextRunAt: null });
  }

  res.json({
    nextRunAt: repeatJob.next,
  });
});

export default router;
