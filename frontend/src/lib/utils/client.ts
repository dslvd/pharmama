import { err, ok, Result } from "./errorHandling";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<Result<T>> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });

    if (!res.ok) {
      return err(`API error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as T;
    return ok(data);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Unknown network error");
  }
}
