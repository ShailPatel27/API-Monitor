import { logResult } from "../database";
import { sendMail } from "../email";

export async function checkApi(
  url: string,
  email?: string,
  timeoutMs = 10000
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (response.status === 200) {
      logResult(url, "Success", response.status, response.statusText);
      return { status: "Success", code: response.status };
    }

    logResult(url, "Failure", response.status, response.statusText);

    if (email) {
      await sendMail(
        `<strong>URL:</strong> ${url}<br>
         <strong>Status:</strong> ${response.status} (${response.statusText})`
      );
    }

    return { status: "Failure", code: response.status };

  } catch {
    logResult(url, "Network or DNS Error");

    if (email) {
      await sendMail(
        `<strong>URL:</strong> ${url}<br>
         Network or DNS Error`
      );
    }

    return { status: "Network Error" };

  } finally {
    clearTimeout(timeout);
  }
}
