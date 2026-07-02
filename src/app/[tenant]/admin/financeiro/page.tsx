"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { TrendingUp, CalendarCheck, Target, Percent, DollarSign, ArrowUpRight } from "lucide-react";

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-500", icon: "text-blue-500" },
  emerald: { bg: "bg-emerald-500", icon: "text-emerald-500" },
  amber: { bg: "bg-amber-500", icon: "text-amber-500" },
  violet: { bg: "bg-violet-500", icon: "text-violet-500" },
};

export default function TenantAdminFinancial() {
  const [period] = useState("month");

  const stats = [
    { label: "Faturamento Bruto", value: formatCurrency(12450), icon: DollarSign, color: "emerald", change: "+12%", period: "este mês" },
    { label: "Agendamentos", value: "187", icon: CalendarCheck, color: "blue", change: "+8%", period: "este mês" },
    { label: "Ticket Médio", value: formatCurrency(66.58), icon: Target, color: "amber", change: "+5%", period: "por agendamento" },
    { label: "Comissão (30%)", value: formatCurrency(3735), icon: Percent, color: "violet", change: "R$ 3.735", period: "total" },
  ];

  const topServices = [
    { name: "Corte + Barba + Sobrancelha", qty: 45, total: 4275 },
    { name: "Corte + Barboterapia", qty: 38, total: 3420 },
    { name: "Corte + Sobrancelha", qty: 52, total: 3380 },
    { name: "Selagem", qty: 12, total: 720 },
    { name: "Limpeza de Pele", qty: 8, total: 400 },
  ];

  const topBarbers = [
    { name: "João", appointments: 65, commission: 1245 },
    { name: "Carlos", appointments: 62, commission: 1245 },
    { name: "Pedro", appointments: 60, commission: 1245 },
  ];

  const recentTx = [
    { date: "01/07", customer: "Gabriel S.", service: "Corte + Barboterapia", method: "Cartão", value: 90 },
    { date: "01/07", customer: "Lucas M.", service: "Corte + Sobrancelha", method: "Débito", value: 65 },
    { date: "30/06", customer: "Rafael P.", service: "Selagem", method: "NFC", value: 60 },
    { date: "30/06", customer: "Thiago A.", service: "Corte + Barba + Sobrancelha", method: "Crédito", value: 95 },
    { date: "29/06", customer: "Felipe N.", service: "Luzes + Corte", method: "Débito", value: 190 },
  ];

  const maxServiceTotal = Math.max(...topServices.map(s => s.total));

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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100"><h2 className="text-sm font-semibold text-zinc-900">Faturamento por Serviço</h2></div>
          <div className="p-6 space-y-3">
            {topServices.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p><p className="text-xs text-zinc-400">{item.qty} agendamentos</p></div>
                  <span className="text-sm font-semibold text-zinc-900 ml-3">{formatCurrency(item.total)}</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(item.total / maxServiceTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100"><h2 className="text-sm font-semibold text-zinc-900">Comissão por Barbeiro</h2></div>
          <div className="p-6 space-y-4">
            {topBarbers.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600">{item.name[0]}</div>
                  <div><p className="text-sm font-medium text-zinc-900">{item.name}</p><p className="text-xs text-zinc-400">{item.appointments} atendimentos</p></div>
                </div>
                <span className="text-sm font-semibold text-zinc-900">{formatCurrency(item.commission)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100"><h2 className="text-sm font-semibold text-zinc-900">Transações Recentes</h2></div>
        <div className="overflow-x-auto">
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
        </div>
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]"><ScissorsIcon className="w-20 h-auto text-zinc-900" /></div>
    </div>
  );
}
