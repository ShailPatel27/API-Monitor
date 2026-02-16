import { Router } from "express";
import { getLogs } from "../database";

const router = Router();

router.get("/", async (_, res) => {
  res.json(await getLogs());
});

export default router;
