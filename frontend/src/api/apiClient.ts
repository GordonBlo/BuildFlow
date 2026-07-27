import { API_BASE_URL } from "../config/apiConfig";

export class ApiError extends Error {
  readonly status: number;
  readonly responseBody?: unknown;

  constructor(status: number, message: string, responseBody?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!responseText) {
    return undefined;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
}

function getErrorMessage(status: number, statusText: string, body: unknown): string {
  if (typeof body === "object" && body !== null) {
    if ("detail" in body && typeof body.detail === "string") {
      return body.detail;
    }

    if ("message" in body && typeof body.message === "string") {
      return body.message;
    }
  }

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  return statusText || `Request failed with status ${status}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options.headers);

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return undefined as T;
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getErrorMessage(response.status, response.statusText, responseBody),
      responseBody,
    );
  }

  return responseBody as T;
}
