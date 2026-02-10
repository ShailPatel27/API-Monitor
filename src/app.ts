// import "dotenv/config";
// import { config } from "./config/config";
// import { logResult } from "./database";
// import { sendMail } from "./email";

// console.log("Script started\n");
// async function run() {

//     if (
//         !process.env.USER_EMAIL ||
//         !process.env.USER_PASS ||
//         !process.env.RECIEVER_EMAIL
//     ) {
//         throw new Error("Email credentials are missing in .env");
//     }

//     const controller = new AbortController()

//     const timeout = setTimeout(() => {
//         controller.abort();
//     }, config.timeoutMs);

//     try {
//         const response = await fetch(config.url, { signal: controller.signal });

//         if (response.status === 200) {
//             console.log(`Status: ${response.statusText}`);
//             logResult(config.url, "Success", response.status, response.statusText);
//         }
//         else {
//             console.log(`ERROR! \nStatus: ${response.status} (${response.statusText})`);
//             logResult(config.url, "Failure", response.status, response.statusText);

//             await sendMail(
//                 `<strong>URL:</strong> ${config.url}<br><strong>Status:</strong> ${response.status} (${response.statusText})`
//             )
//         }
//     }
//     catch (error) {
//         console.log("Request Failed, Network or DNS Error");
//         logResult(config.url, "Network or DNS Error");

//         await sendMail(
//             `<strong>URL:</strong> ${config.url} <br>Network or DNS Error`
//         )
//     }
//     finally {
//         clearTimeout(timeout);
//     }

//     console.log("\nScript Executed")
// }

// run();

import express from "express";
import path from "path";
// import { runMonitor } from "./services/monitor.service";

console.log("APP.TS LOADED", process.cwd());

const app = express();

app.use(express.json());

const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.post("/check", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const response = await fetch(url);
    res.json({ message: `Status: ${response.status}` });
  } catch {
    res.json({ message: "Request failed" });
  }
});

// app.post("/run-monitor", async (req, res) => {
//   const result = await runMonitor();
//   res.json(result);
// });

export default app;
