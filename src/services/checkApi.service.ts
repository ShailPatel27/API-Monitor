// src/services/checkApi.service.ts
import axios, { AxiosError } from "axios";
import { logResult, Result } from "../database";

export type CheckResult = {
  status: Result;
  code?: number;
  statusText?: string;
};

/**
 * Normalize URL:
 * - If protocol exists → return as-is
 * - Else → try https first
 */
function withHttps(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function withHttp(url: string) {
  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}

/**
 * Detect TLS / SSL errors that justify http fallback
 */
function isTlsError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  const code = (error as AxiosError).code;

  return (
    code === "ERR_TLS_CERT_ALTNAME_INVALID" ||
    code === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "CERT_HAS_EXPIRED" ||
    code === "ERR_SSL_WRONG_VERSION_NUMBER" ||
    code === "ECONNRESET"
  );
}

export async function checkApi(
  project: string,
  url: string
): Promise<CheckResult> {
  const httpsUrl = withHttps(url);

  try {
    const response = await axios.get(httpsUrl, {
      timeout: 10_000,
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      await logResult(
        project,
        url, // original URL
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
  } catch (err) {
    // 🔁 TLS failure → retry with HTTP
    if (isTlsError(err)) {
      try {
        const httpUrl = withHttp(url);

        const response = await axios.get(httpUrl, {
          timeout: 10_000,
          validateStatus: () => true,
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
        // fall through to network error
      }
    }

    // ❌ DNS / Network / Total failure
    await logResult(project, url, "Network or DNS Error");

    return {
      status: "Network or DNS Error",
    };
  }
}
