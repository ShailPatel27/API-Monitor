// src/services/checkApi.service.ts
import { logResult } from "../database";

export type CheckResult =
  | {
      status: "Success";
      code: number;
      statusText: string;
    }
  | {
      status: "Failure";
      code: number;
      statusText: string;
    }
  | {
      status: "Network or DNS Error";
    };

export async function checkApi(
  url: string,
  timeoutMs = 10_000
): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (response.ok) {
      await logResult(url, "Success", response.status, response.statusText);
      return {
        status: "Success",
        code: response.status,
        statusText: response.statusText,
      };
    }

    await logResult(url, "Failure", response.status, response.statusText);
    return {
      status: "Failure",
      code: response.status,
      statusText: response.statusText,
    };
  } catch {
    await logResult(url, "Network or DNS Error");
    return {
      status: "Network or DNS Error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
