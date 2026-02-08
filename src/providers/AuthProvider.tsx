import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/src/constants/config";
import {
  saveToken,
  getToken,
  saveUser,
  getUser,
  clearAuth,
} from "@/src/lib/auth-storage";
import type { AuthUser } from "@/src/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const [token, savedUser] = await Promise.all([getToken(), getUser()]);
        if (token && savedUser) {
          setUser(savedUser);
        } else {
          await clearAuth();
        }
      } catch {
        await clearAuth();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/mobile-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Error de conexión",
      }));
      throw new Error(error.error || "Error al iniciar sesión");
    }

    const data = await response.json();
    await Promise.all([saveToken(data.token), saveUser(data.user)]);
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Error de conexión",
        }));
        throw new Error(error.error || "Error al registrarse");
      }

      // Auto-login after registration
      await login(data.email, data.password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    await clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
