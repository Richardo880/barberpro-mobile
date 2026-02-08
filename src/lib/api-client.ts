import { API_BASE_URL } from "@/src/constants/config";
import { getToken, clearAuth } from "./auth-storage";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

interface ApiClientOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, { headers, ...rest });

  if (response.status === 401) {
    await clearAuth();
    throw new AuthError("Sesión expirada");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Error de red",
    }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  if (!text) return {} as T;

  return JSON.parse(text);
}
