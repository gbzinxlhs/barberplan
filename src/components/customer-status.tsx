"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function CustomerStatus({ tenantSlug, primaryColor }: { tenantSlug: string; primaryColor: string }) {
  const [customer, setCustomer] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(`customer_${tenantSlug}`);
    if (stored) {
      try { setCustomer(JSON.parse(stored)); } catch {}
    }
  }, [tenantSlug]);

  if (customer) {
    return (
      <button
        onClick={() => router.push(`/${tenantSlug}/meus-agendamentos`)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{ backgroundColor: primaryColor + "20", color: primaryColor }}
      >
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: primaryColor, color: "#fff" }}>
          {customer.name[0]}
        </span>
        {customer.name.split(" ")[0]}
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push(`/${tenantSlug}/agendar`)}
      className="text-xs text-zinc-400 hover:text-white transition-colors"
    >
      Entrar
    </button>
  );
}
