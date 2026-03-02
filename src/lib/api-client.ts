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

export async function uploadFile<T>(
  path: string,
  fileUri: string,
  fieldName: string = "file"
): Promise<T> {
  const token = await getToken();

  const fileName = fileUri.split("/").pop() || "photo.jpg";
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

  const formData = new FormData();
  formData.append(fieldName, {
    uri: fileUri,
    type: mimeType,
    name: fileName,
  } as unknown as Blob);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

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

  return response.json();
}
