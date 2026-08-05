import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "guest" | "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // For demonstration/mock purposes, check local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("omsun_auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  const login = (email: string, role: UserRole) => {
    // Mock user data
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name: email.split("@")[0] ?? "Customer", // Simple mock name
      email,
      role,
    };
    setUser(mockUser);
    localStorage.setItem("omsun_auth_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("omsun_auth_user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
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
