"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { Store, User, Calendar, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TenantAdminClients() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/saas-users/list");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  const planStyle = (plan: string) => {
    if (plan === "free") return "bg-zinc-100 text-zinc-500 border-zinc-200";
    if (plan === "starter_trial") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const planLabel = (plan: string) => {
    if (plan === "free") return "Grátis";
    if (plan === "starter_trial") return "Trial Starter";
    return plan;
  };

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Clientes</h1>
          <p className="text-sm text-zinc-500 mt-1">{users.length} cliente{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadUsers} className="gap-1.5">
          <RefreshCw className="size-3.5" />Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Contato</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Plano</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Barbearia</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Expira em</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-zinc-400 text-sm">Carregando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-zinc-400 text-sm">Nenhum cliente encontrado</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">{u.name[0]}{u.surname[0]}</div>
                        <p className="text-sm font-medium text-zinc-900">{u.name} {u.surname}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-zinc-600">{u.email}</p>
                      <p className="text-xs text-zinc-400">{u.phone}</p>
                    </td>
                    <td className="px-5 py-4"><span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${planStyle(u.plan)}`}>{planLabel(u.plan)}</span></td>
                    <td className="px-5 py-4">
                      {u.tenant ? (
                        <div className="flex items-center gap-1.5"><Store className="size-3.5 text-zinc-400" /><span className="text-sm text-zinc-700">{u.tenant.name || u.tenant.slug}</span></div>
                      ) : <span className="text-sm text-zinc-400">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-600">{u.planExpiresAt ? format(new Date(u.planExpiresAt), "dd/MM/yyyy") : "—"}</td>
                    <td className="px-5 py-4 text-sm text-zinc-400">{format(new Date(u.createdAt), "dd/MM/yyyy")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]"><ScissorsIcon className="w-16 h-auto text-zinc-900" /></div>
    </div>
  );
}
