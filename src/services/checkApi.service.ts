// src/services/checkApi.service.ts
import axios from "axios";
import { logResult, Result } from "../database";

export type CheckResult = {
  status: Result;
  code?: number;
  statusText?: string;
};

export async function checkApi(
  project: string,
  url: string
): Promise<CheckResult> {
  try {
    const response = await axios.get(url, {
      timeout: 10_000,
      validateStatus: () => true, // allow 4xx / 5xx
    });

    if (response.status >= 200 && response.status < 300) {
      await logResult(
        project,
        url,
        "Success",
        response.status,
        response.statusText
      );

      return {
        status: "Success",
        code: response.status,
        statusText: response.statusText,
      };
    }

    await logResult(
      project,
      url,
      "Failure",
      response.status,
      response.statusText
    );

    return {
      status: "Failure",
      code: response.status,
      statusText: response.statusText,
    };
  } catch {
    await logResult(
      project,
      url,
      "Network or DNS Error"
    );

    return {
      status: "Network or DNS Error",
    };
  }
}
