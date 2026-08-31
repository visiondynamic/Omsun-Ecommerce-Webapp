import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "./api";

export type UserRole = "guest" | "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
  }) => Promise<{ error?: string; user?: User }>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("omsun_auth_user");
        const token = localStorage.getItem("omsun_token");
        if (storedUser && token) {
          const parsed = JSON.parse(storedUser) as User;
          setUser(parsed);
          try {
            const me = await api.getMe();
            const freshUser: User = {
              id: me.id,
              name: me.name,
              email: me.email,
              role: me.role as UserRole,
              avatar: me.avatar || null,
            };
            setUser(freshUser);
            localStorage.setItem("omsun_auth_user", JSON.stringify(freshUser));
          } catch {
            api.logout();
            localStorage.removeItem("omsun_auth_user");
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Failed to init auth", e);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      const u: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role as UserRole,
        avatar: data.user.avatar || null,
      };
      setUser(u);
      localStorage.setItem("omsun_auth_user", JSON.stringify(u));
      return { user: u };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "Login failed" };
    }
  }, []);

  const register = useCallback(
    async (body: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
      company?: string;
    }) => {
      try {
        const data = await api.register(body);
        const u: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as UserRole,
          avatar: null,
        };
        setUser(u);
        localStorage.setItem("omsun_auth_user", JSON.stringify(u));
        return { user: u };
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "Registration failed" };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    localStorage.removeItem("omsun_auth_user");
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem("omsun_auth_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
