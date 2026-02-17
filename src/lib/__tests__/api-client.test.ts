import * as SecureStore from "expo-secure-store";
import { apiClient, AuthError } from "../api-client";

const mockFetch = global.fetch as jest.Mock;

describe("apiClient", () => {
  it("attaches Bearer token from secure store", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("test-token");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ data: 1 })),
    });

    await apiClient("/api/test");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("skips auth header when skipAuth is true", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ data: 1 })),
    });

    await apiClient("/api/test", { skipAuth: true });

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it("does not set auth header when no token is stored", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ data: 1 })),
    });

    await apiClient("/api/test");

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it("throws AuthError and clears auth on 401", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("token");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    try {
      await apiClient("/api/test");
      fail("Should have thrown");
    } catch (err: any) {
      expect(err).toBeInstanceOf(AuthError);
      expect(err.message).toBe("Sesión expirada");
    }
    // clearAuth should have been called (it deletes token + user)
    expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
  });

  it("parses server error message on non-OK response", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Campo inválido" }),
    });

    await expect(apiClient("/api/test")).rejects.toThrow("Campo inválido");
  });

  it("falls back to Error {status} on unparseable error body", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("parse error")),
    });

    await expect(apiClient("/api/test")).rejects.toThrow("Error de red");
  });

  it("returns {} for empty body (204)", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      text: () => Promise.resolve(""),
    });

    const result = await apiClient("/api/test");
    expect(result).toEqual({});
  });

  it("returns parsed JSON on success", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ users: [{ id: "1" }] })),
    });

    const result = await apiClient("/api/users");
    expect(result).toEqual({ users: [{ id: "1" }] });
  });
});
