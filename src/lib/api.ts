import "server-only";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("API_BASE_URL is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? (payload.message as string | string[])
        : "The API request failed.";
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message.join(" ") : message,
    );
  }

  return payload as T;
}