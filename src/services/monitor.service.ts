// import { config } from "../config/config";
// import { logResult } from "../database";
// import { sendMail } from "../email";

// export async function runMonitor() {
//   if (
//     !process.env.USER_EMAIL ||
//     !process.env.USER_PASS ||
//     !process.env.RECIEVER_EMAIL
//   ) {
//     throw new Error("Email credentials are missing in .env");
//   }

//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

//   try {
//     const response = await fetch(config.url, { signal: controller.signal });

//     if (response.status === 200) {
//       logResult(config.url, "Success", response.status, response.statusText);
//       return { status: "Success", code: response.status };
//     }

//     logResult(config.url, "Failure", response.status, response.statusText);
//     await sendMail(
//       `<strong>URL:</strong> ${config.url}<br>
//        <strong>Status:</strong> ${response.status} (${response.statusText})`
//     );

//     return { status: "Failure", code: response.status };

//   } catch {
//     logResult(config.url, "Network or DNS Error");
//     await sendMail(
//       `<strong>URL:</strong> ${config.url}<br>
//        Network or DNS Error`
//     );

//     return { status: "Network Error" };

//   } finally {
//     clearTimeout(timeout);
//   }
// }
