// routes/logs.ts
import { Router } from "express";
import { getLogs } from "../database";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const logs = await getLogs();
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});


export default router;
