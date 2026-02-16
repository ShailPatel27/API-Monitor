import { Worker } from "bullmq";
import { connection } from "../queue/connection";
import "../workers/monitor.worker";

new Worker("monitor", async () => {}, { connection });
