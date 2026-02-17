import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { AuthProvider, useAuth } from "../AuthProvider";

const mockFetch = global.fetch as jest.Mock;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
}

const mockUser = {
  id: "u1",
  email: "test@test.com",
  name: "Test",
  role: "CLIENT",
};

describe("AuthProvider", () => {
  it("restores session from SecureStore", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce("stored-token") // getToken
      .mockResolvedValueOnce(JSON.stringify(mockUser)); // getUser

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it("stays unauthenticated when no token stored", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce(null) // getToken
      .mockResolvedValueOnce(null); // getUser

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("login success stores token and user", async () => {
    // Initial restore: no session
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ token: "new-token", user: mockUser }),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login("test@test.com", "password123");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "barberpro_token",
      "new-token"
    );
  });

  it("login failure throws error", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Credenciales inválidas" }),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.login("bad@test.com", "wrong");
      })
    ).rejects.toThrow("Credenciales inválidas");

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logout clears state and storage", async () => {
    // Start with session
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce("token")
      .mockResolvedValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("barberpro_token");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("barberpro_user");
  });

  it("register calls endpoint then auto-logins", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    // Register response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    // Auto-login response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ token: "reg-token", user: mockUser }),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.register({
        name: "Test",
        email: "test@test.com",
        password: "Password1",
      });
    });

    // Register endpoint was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/register"),
      expect.objectContaining({ method: "POST" })
    );

    // Auto-login was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/mobile-login"),
      expect.objectContaining({ method: "POST" })
    );

    expect(result.current.isAuthenticated).toBe(true);
  });
});
