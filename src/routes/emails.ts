import { Router } from "express";
import { addEmail, deleteEmail, getEmails } from "../database";

const router = Router();

router.get("/", async (_, res) => {
  res.json(await getEmails());
});

router.post("/", async (req, res) => {
  await addEmail(req.body.email, req.body.username);
  res.sendStatus(201);
});

router.delete("/:id", async (req, res) => {
  await deleteEmail(Number(req.params.id));
  res.sendStatus(204);
});

export default router;
