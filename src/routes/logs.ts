import { Router } from "express";
import { getLogs } from "../database";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const logs = await getLogs(limit);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
