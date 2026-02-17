// src/routes/apis.ts
import { Router } from "express";
import { addApi, deleteApi, getApis } from "../database";
import { rescheduleMonitor } from "../queue/rescheduleMonitor";

const router = Router();

/**
 * GET /apis
 */
router.get("/", async (_, res) => {
  const apis = await getApis();
  res.json(apis);
});

/**
 * POST /apis
 * body: { project: string, url: string }
 *
 * When a new API is added:
 * - Insert into DB
 * - Reset monitor scheduler so 6h starts from NOW
 */
router.post("/", async (req, res) => {
  const { project, url } = req.body;

  if (!project || !url) {
    return res.status(400).json({
      error: "project and url are required",
    });
  }

  await addApi(project, url);

  // 🔁 RESET MONITOR TIMER
  await rescheduleMonitor();

  res.sendStatus(201);
});

/**
 * DELETE /apis/:id
 */
router.delete("/:id", async (req, res) => {
  await deleteApi(Number(req.params.id));
  res.sendStatus(204);
});

export default router;
