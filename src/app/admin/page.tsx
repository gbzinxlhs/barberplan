"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<string, "success" | "warning" | "destructive" | "default"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
  completed: "default",
};

const statusLabel: Record<string, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  cancelled: "Cancelado",
  completed: "Finalizado",
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    fetch(`/api/appointments?tenant=brooklyn&date=${today}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
        setLoading(false);
      });
  }, [today]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Agendamentos Hoje", value: appointments.length, color: "bg-blue-500" },
            { label: "Confirmados", value: appointments.filter((a) => a.status === "confirmed").length, color: "bg-green-500" },
            { label: "Finalizados", value: appointments.filter((a) => a.status === "completed").length, color: "bg-zinc-500" },
            { label: "Cancelados", value: appointments.filter((a) => a.status === "cancelled").length, color: "bg-red-500" },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div>
                    <p className="text-sm text-zinc-500">{item.label}</p>
                    <p className="text-2xl font-bold text-zinc-900">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agenda de Hoje</CardTitle>
            <Link href="/admin/agendamentos" className="text-sm text-zinc-500 hover:text-zinc-900">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-zinc-400 text-sm">Carregando...</p>
            ) : appointments.length === 0 ? (
              <p className="text-zinc-400 text-sm">Nenhum agendamento para hoje</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-zinc-700 min-w-[60px]">
                        {format(new Date(apt.startTime), "HH:mm")}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{apt.customer.name}</p>
                        <p className="text-xs text-zinc-400">
                          {apt.service.name} — {apt.barber.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusVariant[apt.status] || "default"}>
                      {statusLabel[apt.status] || apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link href="/admin/agendamentos">
            <Card className="hover:border-zinc-300 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📅 Gerenciar Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Visualize, confirme e gerencie todos os agendamentos.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/servicos">
            <Card className="hover:border-zinc-300 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✂️ Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Gerencie serviços, preços e durações.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/barbeiros">
            <Card className="hover:border-zinc-300 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💈 Barbeiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Cadastre e gerencie os barbeiros da unidade.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/financeiro">
            <Card className="hover:border-zinc-300 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💰 Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Relatórios de faturamento e comissões.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminHeader() {
  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-sm font-bold text-white">
            B
          </div>
          <span className="text-lg font-bold text-zinc-900">BarberPlan</span>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">Admin</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/admin" className="text-zinc-900 font-medium">Dashboard</Link>
          <Link href="/admin/agendamentos" className="text-zinc-500 hover:text-zinc-900">Agendamentos</Link>
          <Link href="/admin/servicos" className="text-zinc-500 hover:text-zinc-900">Serviços</Link>
          <Link href="/admin/barbeiros" className="text-zinc-500 hover:text-zinc-900">Barbeiros</Link>
          <Link href="/admin/financeiro" className="text-zinc-500 hover:text-zinc-900">Financeiro</Link>
          <Link href="/admin/configuracoes" className="text-zinc-500 hover:text-zinc-900">Configurações</Link>
        </nav>
      </div>
    </header>
  );
}
