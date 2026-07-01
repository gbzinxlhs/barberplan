"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  async function loadAppointments(date: string) {
    setLoading(true);
    const res = await fetch(`/api/appointments?tenant=brooklyn&date=${date}`);
    const data = await res.json();
    setAppointments(data.appointments || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAppointments(selectedDate);
  }, [selectedDate]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAppointments(selectedDate);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Agendamentos</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-zinc-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Agendamentos de {format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-zinc-400 text-sm">Carregando...</p>
            ) : appointments.length === 0 ? (
              <p className="text-zinc-400 text-sm">Nenhum agendamento para esta data</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200"
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold text-zinc-900">
                          {format(new Date(apt.startTime), "HH:mm")}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {format(new Date(apt.endTime), "HH:mm")}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{apt.customer.name}</p>
                        <p className="text-sm text-zinc-500">{apt.customer.phone}</p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {apt.service.name} — {apt.barber.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusVariant[apt.status] || "default"}>
                        {statusLabel[apt.status] || apt.status}
                      </Badge>
                      <div className="flex gap-1">
                        {apt.status === "confirmed" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "completed")}>
                              Finalizar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(apt.id, "cancelled")}>
                              Cancelar
                            </Button>
                          </>
                        )}
                        {apt.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "confirmed")}>
                              Confirmar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(apt.id, "cancelled")}>
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <Link href="/admin/agendamentos" className="text-zinc-900 font-medium">Agendamentos</Link>
          <Link href="/admin/servicos" className="text-zinc-500 hover:text-zinc-900">Serviços</Link>
          <Link href="/admin/barbeiros" className="text-zinc-500 hover:text-zinc-900">Barbeiros</Link>
          <Link href="/admin/financeiro" className="text-zinc-500 hover:text-zinc-900">Financeiro</Link>
          <Link href="/admin/configuracoes" className="text-zinc-500 hover:text-zinc-900">Configurações</Link>
        </nav>
      </div>
    </header>
  );
}
