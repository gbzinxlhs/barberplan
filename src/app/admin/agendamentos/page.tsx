"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Phone,
  Scissors,
  User,
  RefreshCw,
} from "lucide-react";
import { BarberPole, Mustache } from "@/components/barber-icons";
import { Button } from "@/components/ui/button";
import { useSaasUser } from "@/contexts/saas-user";

const statusStyle: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const statusLabel: Record<string, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  cancelled: "Cancelado",
  completed: "Finalizado",
};

export default function AdminAppointments() {
  const { tenant } = useSaasUser();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantSlug = tenant?.slug;

  async function loadAppointments() {
    if (!tenantSlug) return;
    setLoading(true);
    const res = await fetch(`/api/appointments?tenant=${tenantSlug}`);
    const data = await res.json();
    setAppointments(data.appointments || []);
    setLoading(false);
  }

  useEffect(() => {
    if (tenantSlug) loadAppointments();
  }, [tenantSlug]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAppointments();
  }

  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Agendamentos</h1>
          <p className="text-sm text-zinc-500 mt-1">Todos os agendamentos em ordem cronológica</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAppointments} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Atualizar
        </Button>
      </div>

      {/* summary bar */}
      {!loading && total > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-xs text-zinc-500">
          <span className="font-medium text-zinc-700">{total} total</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {confirmed} confirmados
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {pending} pendentes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            {completed} finalizados
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {cancelled} cancelados
          </span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-zinc-200 animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="text-center py-16">
            <Calendar className="size-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-sm text-zinc-500 font-medium">Nenhum agendamento encontrado</p>
            <p className="text-xs text-zinc-400 mt-1">Os agendamentos aparecerão aqui</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="hidden lg:grid lg:grid-cols-[80px_120px_1fr_160px_200px] text-xs text-zinc-400 font-medium uppercase tracking-wider px-5 py-3 bg-zinc-50 border-b border-zinc-100">
            <span>Horário</span>
            <span>Data</span>
            <span>Cliente</span>
            <span>Status</span>
            <span className="text-right">Ações</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="grid lg:grid-cols-[80px_120px_1fr_160px_200px] gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors items-center"
              >
                <div className="flex sm:block items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                    <Clock className="size-3.5 text-zinc-400" />
                    {format(new Date(apt.startTime), "HH:mm")}
                  </div>
                  <span className="text-xs text-zinc-400">
                    {format(new Date(apt.endTime), "HH:mm")}
                  </span>
                </div>

                <div className="text-sm text-zinc-500 flex items-center gap-2">
                  <Calendar className="size-3.5 text-zinc-400 lg:hidden" />
                  {format(new Date(apt.startTime), "dd/MM/yyyy")}
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <User className="size-3.5 text-zinc-400" />
                    {apt.customer.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Phone className="size-3" />
                      {apt.customer.phone}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Scissors className="size-3" />
                      {apt.service.name}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[apt.status] || "bg-zinc-100 text-zinc-600"}`}>
                    {statusLabel[apt.status] || apt.status}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1.5">
                  {apt.status === "confirmed" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(apt.id, "completed")}
                        className="text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="size-3.5 mr-1" />
                        Finalizar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(apt.id, "cancelled")}
                        className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="size-3.5 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  {apt.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(apt.id, "confirmed")}
                        className="text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="size-3.5 mr-1" />
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(apt.id, "cancelled")}
                        className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="size-3.5 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  {(apt.status === "completed" || apt.status === "cancelled") && (
                    <span className="text-xs text-zinc-400 px-3 italic">
                      {apt.status === "completed" ? "Finalizado" : "Cancelado"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <p className="text-xs text-zinc-400 mt-4 text-center">
          {appointments.length} agendamento{appointments.length !== 1 ? "s" : ""} no total
        </p>
      )}
    </div>
  );
}
