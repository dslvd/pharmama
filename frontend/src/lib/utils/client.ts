import { err, ok, Result } from "./errorHandling";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<Result<T>> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();
    const capitalize = (message: string) =>
      message.charAt(0).toUpperCase() + message.slice(1);

    if (!res.ok) {
      const message = Array.isArray(data.message)
        ? data.message.join(", ")
        : typeof data.message === "string"
          ? data.message
          : `API error: ${res.status} ${res.statusText}`;

      return err(capitalize(message));
    }

    return ok(data as T);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Unknown network error");
  }
}
