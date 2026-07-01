"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function AdminFinancial() {
  const [period] = useState("month");

  const stats = {
    revenue: 12450,
    appointments: 187,
    avgTicket: 66.58,
    commission: 3735,
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-8">Financeiro</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">Faturamento Bruto</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(stats.revenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">Agendamentos</p>
              <p className="text-2xl font-bold text-zinc-900">{stats.appointments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">Ticket Médio</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(stats.avgTicket)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">Comissão (30%)</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(stats.commission)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento por Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Corte + Barba + Sobrancelha", qty: 45, total: 4275 },
                  { name: "Corte + Barboterapia", qty: 38, total: 3420 },
                  { name: "Corte + Sobrancelha", qty: 52, total: 3380 },
                  { name: "Selagem", qty: 12, total: 720 },
                  { name: "Limpeza de Pele", qty: 8, total: 400 },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-400">{item.qty} agendamentos</p>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comissão por Barbeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "João", appointments: 65, commission: 1245 },
                  { name: "Carlos", appointments: 62, commission: 1245 },
                  { name: "Pedro", appointments: 60, commission: 1245 },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-400">{item.appointments} atendimentos</p>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">{formatCurrency(item.commission)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left p-3 text-sm font-medium text-zinc-500">Data</th>
                  <th className="text-left p-3 text-sm font-medium text-zinc-500">Cliente</th>
                  <th className="text-left p-3 text-sm font-medium text-zinc-500">Serviço</th>
                  <th className="text-left p-3 text-sm font-medium text-zinc-500">Forma</th>
                  <th className="text-right p-3 text-sm font-medium text-zinc-500">Valor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "01/07", customer: "Gabriel S.", service: "Corte + Barboterapia", method: "Cartão", value: 90 },
                  { date: "01/07", customer: "Lucas M.", service: "Corte + Sobrancelha", method: "Débito", value: 65 },
                  { date: "30/06", customer: "Rafael P.", service: "Selagem", method: "NFC", value: 60 },
                  { date: "30/06", customer: "Thiago A.", service: "Corte + Barba + Sobrancelha", method: "Crédito", value: 95 },
                  { date: "29/06", customer: "Felipe N.", service: "Luzes + Corte", method: "Débito", value: 190 },
                ].map((tx, i) => (
                  <tr key={i} className="border-b border-zinc-100">
                    <td className="p-3 text-sm text-zinc-500">{tx.date}</td>
                    <td className="p-3 text-sm text-zinc-900">{tx.customer}</td>
                    <td className="p-3 text-sm text-zinc-500">{tx.service}</td>
                    <td className="p-3 text-sm text-zinc-500">{tx.method}</td>
                    <td className="p-3 text-sm text-right font-medium">{formatCurrency(tx.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminHeader() {
  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-sm font-bold text-white">
              B
            </div>
          </Link>
          <span className="text-lg font-bold text-zinc-900">BarberPlan</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/admin" className="text-zinc-500 hover:text-zinc-900">Dashboard</Link>
          <Link href="/admin/agendamentos" className="text-zinc-500 hover:text-zinc-900">Agendamentos</Link>
          <Link href="/admin/servicos" className="text-zinc-500 hover:text-zinc-900">Serviços</Link>
          <Link href="/admin/barbeiros" className="text-zinc-500 hover:text-zinc-900">Barbeiros</Link>
          <Link href="/admin/financeiro" className="text-zinc-900 font-medium">Financeiro</Link>
          <Link href="/admin/configuracoes" className="text-zinc-500 hover:text-zinc-900">Configurações</Link>
        </nav>
      </div>
    </header>
  );
}
