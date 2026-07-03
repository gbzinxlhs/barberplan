"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Tenant {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
}

interface SaasUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  plan: string;
  planExpiresAt: string | null;
  tenantId: string | null;
  role?: string;
}

interface SaasUserContextType {
  user: SaasUser | null;
  tenant: Tenant | null;
  setUser: (user: SaasUser | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const SaasUserContext = createContext<SaasUserContextType>({
  user: null,
  tenant: null,
  setUser: () => {},
  setTenant: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function SaasUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<SaasUser | null>(null);
  const [tenant, setTenantState] = useState<Tenant | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/saas/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserState(data.user);
          if (data.tenant) setTenantState(data.tenant);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function setUser(user: SaasUser | null) {
    setUserState(user);
  }

  function setTenant(tenant: Tenant | null) {
    setTenantState(tenant);
  }

  async function logout() {
    await fetch("/api/auth/saas/logout", { method: "POST" });
    setUserState(null);
    setTenantState(null);
  }

  async function refreshUser() {
    try {
      const res = await fetch("/api/auth/saas/me");
      const data = await res.json();
      if (data.user) {
        setUserState(data.user);
        if (data.tenant) setTenantState(data.tenant);
      }
    } catch {}
  }

  return (
    <SaasUserContext.Provider value={{ user, tenant, setUser, setTenant, logout, refreshUser }}>
      {children}
    </SaasUserContext.Provider>
  );
}

export function useSaasUser() {
  return useContext(SaasUserContext);
}
