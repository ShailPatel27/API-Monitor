import { Queue } from "bullmq";
import { connection } from "./connection";

export const monitorQueue = new Queue("monitor", {
  connection,
});
