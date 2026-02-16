import { Router } from "express";
import { addApi, deleteApi, getApis } from "../database";

const router = Router();

router.get("/", async (_, res) => {
  res.json(await getApis());
});

router.post("/", async (req, res) => {
  await addApi(req.body.url);
  res.sendStatus(201);
});

router.delete("/:id", async (req, res) => {
  await deleteApi(Number(req.params.id));
  res.sendStatus(204);
});

export default router;
