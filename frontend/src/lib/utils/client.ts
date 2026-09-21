import { err, ok, Result } from "./errorHandling";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("token");

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<Result<T>> {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // expired/invalid token -> kick to login (the `token` check avoids a loop on bad login)
    if (res.status === 401 && token) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }

    const data = await res.json().catch(() => null);
    const capitalize = (m: string) => m.charAt(0).toUpperCase() + m.slice(1);

    if (!res.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : typeof data?.message === "string"
          ? data.message
          : `API error: ${res.status} ${res.statusText}`;

      return err(capitalize(message));
    }

    return ok(data as T);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Unknown network error");
  }
}
