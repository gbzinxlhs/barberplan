"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { TrendingUp, CalendarCheck, Target, DollarSign, ArrowUpRight } from "lucide-react";

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-500", icon: "text-blue-500" },
  emerald: { bg: "bg-emerald-500", icon: "text-emerald-500" },
  amber: { bg: "bg-amber-500", icon: "text-amber-500" },
  violet: { bg: "bg-violet-500", icon: "text-violet-500" },
};

const paymentLabels: Record<string, string> = {
  PIX: "Pix",
  DINHEIRO: "Dinheiro",
  CARTAO: "Cartão",
  CREDITO: "Crédito",
  DEBITO: "Débito",
  NFC: "NFC",
};

export default function TenantAdminFinancial() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantSlug) return;
    fetch(`/api/appointments?tenant=${tenantSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setAppointments(data.appointments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tenantSlug]);

  if (loading) {
    return <div className="p-6 flex items-center justify-center min-h-[40vh]"><div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const monthAppointments = appointments.filter((a: any) => {
    const d = new Date(a.startTime);
    return d >= monthStart && d <= monthEnd && a.status !== "cancelled";
  });

  const revenue = monthAppointments.reduce((sum: number, a: any) => sum + (a.service?.price || 0), 0);
  const count = monthAppointments.length;
  const avgTicket = count > 0 ? revenue / count : 0;

  const stats = [
    { label: "Faturamento Bruto", value: formatCurrency(revenue), icon: DollarSign, color: "emerald", change: `${count} agendamentos`, period: "este mês" },
    { label: "Agendamentos", value: String(count), icon: CalendarCheck, color: "blue", change: count > 0 ? "realizados" : "nenhum", period: "este mês" },
    { label: "Ticket Médio", value: formatCurrency(avgTicket), icon: Target, color: "amber", change: "por agendamento", period: "este mês" },
  ];

  const serviceMap: Record<string, { name: string; qty: number; total: number }> = {};
  monthAppointments.forEach((a: any) => {
    const name = a.service?.name || "Sem serviço";
    if (!serviceMap[name]) serviceMap[name] = { name, qty: 0, total: 0 };
    serviceMap[name].qty++;
    serviceMap[name].total += a.service?.price || 0;
  });
  const topServices = Object.values(serviceMap).sort((a, b) => b.total - a.total);
  const maxServiceTotal = topServices.length > 0 ? Math.max(...topServices.map((s) => s.total)) : 1;

  const recentTx = appointments
    .filter((a: any) => a.status !== "cancelled")
    .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 10)
    .map((a: any) => ({
      date: format(new Date(a.startTime), "dd/MM", { locale: ptBR }),
      customer: a.customer?.name || "—",
      service: a.service?.name || "—",
      method: a.paymentMethod ? (paymentLabels[a.paymentMethod] || a.paymentMethod) : "—",
      value: a.service?.price || 0,
    }));

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Financeiro</h1>
          <p className="text-sm text-zinc-500 mt-1">Resumo do período atual</p>
        </div>
      </div>

      {count === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <TrendingUp className="size-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">Nenhum agendamento neste mês</p>
          <p className="text-sm text-zinc-400 mt-1">Os dados financeiros aparecerão conforme os clientes agendarem.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              const c = colorMap[s.color];
              return (
                <div key={s.label} className="group bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}><Icon className="size-4 text-white" /></div>
                    <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium"><ArrowUpRight className="size-3" />{s.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
                  <p className="text-xs text-zinc-400 mt-1">{s.period}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-zinc-100"><h2 className="text-sm font-semibold text-zinc-900">Faturamento por Serviço</h2></div>
            <div className="p-6 space-y-3">
              {topServices.length === 0 ? (
                <p className="text-sm text-zinc-400">Nenhum serviço realizado no período.</p>
              ) : (
                topServices.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p><p className="text-xs text-zinc-400">{item.qty} agendamento{item.qty !== 1 ? "s" : ""}</p></div>
                      <span className="text-sm font-semibold text-zinc-900 ml-3">{formatCurrency(item.total)}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(item.total / maxServiceTotal) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100"><h2 className="text-sm font-semibold text-zinc-900">Transações Recentes</h2></div>
            <div className="overflow-x-auto">
              {recentTx.length === 0 ? (
                <div className="p-6 text-center text-sm text-zinc-400">Nenhuma transação recente.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50">
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Data</th>
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Cliente</th>
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Serviço</th>
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Forma</th>
                      <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTx.map((tx, i) => (
                      <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-zinc-500">{tx.date}</td>
                        <td className="px-5 py-3.5 text-sm font-medium text-zinc-900">{tx.customer}</td>
                        <td className="px-5 py-3.5 text-sm text-zinc-500">{tx.service}</td>
                        <td className="px-5 py-3.5 text-sm text-zinc-500"><span className="text-xs bg-zinc-100 px-2 py-0.5 rounded-full">{tx.method}</span></td>
                        <td className="px-5 py-3.5 text-sm text-right font-semibold text-zinc-900">{formatCurrency(tx.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-10 flex justify-center opacity-[0.03]"><ScissorsIcon className="w-20 h-auto text-zinc-900" /></div>
    </div>
  );
}
