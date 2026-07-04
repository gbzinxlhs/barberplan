"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  FileText,
} from "lucide-react";
import { BarberPole, Mustache } from "@/components/barber-icons";
import { Button } from "@/components/ui/button";

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

export default function TenantAdminAppointments() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [nfseEmitting, setNfseEmitting] = useState<string | null>(null);
  const pageSize = 20;

  async function loadAppointments(p?: number) {
    if (!tenantSlug) return;
    const currentPage = p ?? page;
    setLoading(true);
    const res = await fetch(`/api/appointments?tenant=${tenantSlug}&page=${currentPage}&pageSize=${pageSize}`);
    const data = await res.json();
    setAppointments(data.appointments || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setPage(currentPage);
    setLoading(false);
  }

  useEffect(() => {
    if (tenantSlug) loadAppointments(1);
  }, [tenantSlug]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAppointments(page);
  }

  async function emitirNfse(appointmentId: string) {
    setNfseEmitting(appointmentId);
    try {
      const res = await fetch("/api/nfse/emitir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      if (res.ok) loadAppointments(page);
    } catch {}
    setNfseEmitting(null);
  }

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
        <Button variant="outline" size="sm" onClick={() => loadAppointments(page)} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Atualizar
        </Button>
      </div>

      {!loading && total > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-xs text-zinc-500">
          <span className="font-medium text-zinc-700">{total} total</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />{confirmed} confirmados</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />{pending} pendentes</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-400" />{completed} finalizados</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />{cancelled} cancelados</span>
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
            <span>Horário</span><span>Data</span><span>Cliente</span><span>Status</span><span className="text-right">Ações</span>
          </div>
          <div className="grid gap-3 p-3 sm:p-0 sm:divide-y sm:divide-zinc-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="lg:grid lg:grid-cols-[80px_120px_1fr_160px_200px] lg:gap-3 lg:px-5 lg:py-4 lg:hover:bg-zinc-50 lg:items-center bg-white rounded-xl border border-zinc-200 sm:border-0 sm:rounded-none p-4 sm:p-0 space-y-3 sm:space-y-0 shadow-sm sm:shadow-none">
                <div className="flex items-center justify-between sm:block">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                    <Clock className="size-3.5 text-zinc-400" />
                    {format(new Date(apt.startTime), "HH:mm")}
                    <span className="text-xs text-zinc-400 font-normal">- {format(new Date(apt.endTime), "HH:mm")}</span>
                  </div>
                  <span className="text-xs text-zinc-500 sm:hidden flex items-center gap-1">
                    <Calendar className="size-3 text-zinc-400" />
                    {format(new Date(apt.startTime), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="hidden sm:block text-sm text-zinc-500">
                  {format(new Date(apt.startTime), "dd/MM/yyyy")}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <User className="size-3.5 text-zinc-400 shrink-0" />{apt.customer.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                    <span className="text-xs text-zinc-400 flex items-center gap-1"><Phone className="size-3 shrink-0" />{apt.customer.phone}</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1"><Scissors className="size-3 shrink-0" />{apt.service.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:block gap-2">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[apt.status] || "bg-zinc-100 text-zinc-600"}`}>
                    {statusLabel[apt.status] || apt.status}
                  </span>
                  {(apt.status === "completed" || apt.status === "cancelled") && (
                    <span className="sm:hidden text-xs text-zinc-400 italic">{apt.status === "completed" ? "Finalizado" : "Cancelado"}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 pt-1 sm:pt-0 sm:justify-end flex-wrap">
                  {apt.status === "confirmed" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "completed")} className="text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex-1 sm:flex-none">
                        <CheckCircle2 className="size-3.5 mr-1" />Finalizar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "cancelled")} className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-none">
                        <XCircle className="size-3.5 mr-1" />Cancelar
                      </Button>
                    </>
                  )}
                  {apt.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "confirmed")} className="text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex-1 sm:flex-none">
                        <CheckCircle2 className="size-3.5 mr-1" />Confirmar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "cancelled")} className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-none">
                        <XCircle className="size-3.5 mr-1" />Cancelar
                      </Button>
                    </>
                  )}
                  {apt.status === "completed" && (
                    <>
                      {apt.nfseId ? (
                        <span className="inline-flex items-center gap-1 text-xs text-violet-600 font-medium px-2 py-1 bg-violet-50 rounded-full border border-violet-200">
                          <FileText className="size-3" />NF-e {apt.nfseNumero}
                        </span>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => emitirNfse(apt.id)} disabled={nfseEmitting === apt.id} className="text-xs h-8 border-violet-200 text-violet-700 hover:bg-violet-50 flex-1 sm:flex-none">
                          <FileText className="size-3.5 mr-1" />{nfseEmitting === apt.id ? "Emitindo..." : "NFS-e"}
                        </Button>
                      )}
                      <span className="hidden sm:inline text-xs text-zinc-400 px-3 italic">Finalizado</span>
                    </>
                  )}
                  {apt.status === "cancelled" && (
                    <span className="hidden sm:inline text-xs text-zinc-400 px-3 italic">Cancelado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <p className="text-xs text-zinc-400">
            {total} agendamento{total !== 1 ? "s" : ""} no total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadAppointments(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => loadAppointments(p)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                  p === page
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => loadAppointments(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
