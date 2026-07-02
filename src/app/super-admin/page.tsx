"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import {
  Store,
  User,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  Globe,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { useSuperAdmin } from "@/contexts/super-admin";

const planStyle = (plan: string) => {
  if (plan === "free") return "bg-zinc-800 text-zinc-400 border-zinc-700";
  if (plan === "starter_trial") return "bg-blue-900/30 text-blue-400 border-blue-800";
  if (plan === "starter") return "bg-emerald-900/30 text-emerald-400 border-emerald-800";
  if (plan === "pro") return "bg-purple-900/30 text-purple-400 border-purple-800";
  return "bg-zinc-800 text-zinc-400 border-zinc-700";
};

const planLabel = (plan: string) => {
  if (plan === "free") return "Grátis";
  if (plan === "starter_trial") return "Trial Starter";
  if (plan === "starter") return "Starter";
  if (plan === "pro") return "Pro";
  return plan;
};

function isPlanActive(plan: string, planExpiresAt: string | null) {
  if (plan === "free") return false;
  if (!planExpiresAt) return true;
  return new Date(planExpiresAt) > new Date();
}

export default function SuperAdminDashboard() {
  const { token } = useSuperAdmin();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTenants() {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/tenants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTenants(data.tenants || []);
    } catch {
      setTenants([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (token) loadTenants();
  }, [token]);

  const totalTenants = tenants.length;
  const totalSaasUsers = tenants.reduce((acc, t) => acc + (t.saasUsers?.length || 0), 0);
  const activePlans = tenants.filter((t) =>
    t.saasUsers?.some((u: any) => isPlanActive(u.plan, u.planExpiresAt))
  ).length;

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-white" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-white" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <button
          onClick={loadTenants}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <RefreshCw className="size-3.5" />
          Atualizar
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Store className="size-4 text-primary" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalTenants}</p>
          <p className="text-xs text-zinc-500 mt-1">barbearias cadastradas</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="size-4 text-blue-400" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Usuários</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalSaasUsers}</p>
          <p className="text-xs text-zinc-500 mt-1">contas SAAS</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CreditCard className="size-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Planos Ativos</span>
          </div>
          <p className="text-2xl font-bold text-white">{activePlans}</p>
          <p className="text-xs text-zinc-500 mt-1">barbearias com plano pago</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Store className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-white">Todas as Barbearias</h2>
          </div>
          <span className="text-xs text-zinc-500">{tenants.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/30">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Barbearia</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Subdomínio</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Comprador</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contato</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Plano</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Compra</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Expira</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-500 text-sm">
                    Nenhuma barbearia encontrada
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => {
                  const owner = tenant.saasUsers?.[0] || null;
                  const active = owner ? isPlanActive(owner.plan, owner.planExpiresAt) : false;

                  return (
                    <tr key={tenant.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                            {tenant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{tenant.name}</p>
                            <p className="text-xs text-zinc-500">criada em {format(new Date(tenant.createdAt), "dd/MM/yyyy")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Globe className="size-3.5 text-zinc-500" />
                          <span className="text-sm text-zinc-400">{tenant.subdomain}.barberplan-nine.vercel.app</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {owner ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                              {owner.name?.[0]}{owner.surname?.[0]}
                            </div>
                            <span className="text-sm text-zinc-300">{owner.name} {owner.surname}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {owner ? (
                          <div>
                            <p className="text-sm text-zinc-400">{owner.email}</p>
                            <p className="text-xs text-zinc-600">{owner.phone}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {owner ? (
                          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${planStyle(owner.plan)}`}>
                            {planLabel(owner.plan)}
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {owner ? format(new Date(owner.createdAt), "dd/MM/yyyy") : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {owner?.planExpiresAt ? format(new Date(owner.planExpiresAt), "dd/MM/yyyy") : "—"}
                      </td>
                      <td className="px-5 py-4">
                        {active ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle className="size-3" />
                            Ativo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <XCircle className="size-3" />
                            {owner?.plan === "free" ? "Grátis" : "Expirado"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]">
        <ScissorsIcon className="w-16 h-auto text-white" />
      </div>
    </div>
  );
}
