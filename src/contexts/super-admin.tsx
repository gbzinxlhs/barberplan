"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface SuperAdminUser {
  email: string;
  role: string;
}

interface SuperAdminContextType {
  user: SuperAdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const SuperAdminContext = createContext<SuperAdminContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => null,
  logout: () => {},
});

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("super_admin_token");
    if (storedToken) {
      fetch("/api/auth/super-admin/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          setToken(storedToken);
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem("super_admin_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/super-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Erro ao fazer login";
      localStorage.setItem("super_admin_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return null;
    } catch {
      return "Erro de conexão";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("super_admin_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <SuperAdminContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  return useContext(SuperAdminContext);
}
