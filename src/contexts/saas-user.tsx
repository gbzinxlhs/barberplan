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
}

interface SaasUserContextType {
  user: SaasUser | null;
  tenant: Tenant | null;
  setUser: (user: SaasUser | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const SaasUserContext = createContext<SaasUserContextType>({
  user: null,
  tenant: null,
  setUser: () => {},
  setTenant: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function SaasUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<SaasUser | null>(null);
  const [tenant, setTenantState] = useState<Tenant | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("saas_user");
    if (storedUser) {
      try { setUserState(JSON.parse(storedUser)); } catch {}
    }
    const storedTenant = localStorage.getItem("saas_tenant");
    if (storedTenant) {
      try { setTenantState(JSON.parse(storedTenant)); } catch {}
    }
  }, []);

  function setUser(user: SaasUser | null) {
    setUserState(user);
    if (user) {
      localStorage.setItem("saas_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("saas_user");
    }
  }

  function setTenant(tenant: Tenant | null) {
    setTenantState(tenant);
    if (tenant) {
      localStorage.setItem("saas_tenant", JSON.stringify(tenant));
    } else {
      localStorage.removeItem("saas_tenant");
    }
  }

  function logout() {
    setUser(null);
    setTenant(null);
  }

  async function refreshUser() {
    const stored = localStorage.getItem("saas_user");
    if (!stored) return;
    try {
      const { email } = JSON.parse(stored);
      const res = await fetch(`/api/saas-users/me?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        if (data.tenant) setTenant(data.tenant);
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
