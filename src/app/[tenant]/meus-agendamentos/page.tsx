"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mustache, Comb, BarberPole } from "@/components/barber-icons";
import { Calendar, Clock, Scissors, User, XCircle } from "lucide-react";

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentMethod?: string;
  service: { name: string; price: number };
  barber: { name: string };
}

export default function MyAppointments() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenant as string;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`customer_${tenantSlug}`);
    if (!stored) {
      setLoading(false);
      return;
    }
    const c = JSON.parse(stored);
    setCustomerName(c.name);
    fetch(`/api/customers/${c.id}/appointments`)
      .then((r) => r.json())
      .then((data) => {
        setAppointments(data.appointments || []);
        setLoading(false);
      });
  }, [tenantSlug]);

  async function cancelAppointment(id: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    setAppointments(appointments.filter((a) => a.id !== id));
  }

  const statusLabel: Record<string, string> = {
    confirmed: "Confirmado",
    pending: "Pendente",
    completed: "Finalizado",
  };

  const statusStyle: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  function logout() {
    localStorage.removeItem(`customer_${tenantSlug}`);
    router.push(`/${tenantSlug}/agendar`);
  }

  if (!loading && !customerName) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
          <Mustache className="w-12 mx-auto opacity-20 text-white mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Nenhum Cliente Logado</h2>
          <p className="text-zinc-400 text-sm mb-6">Faça um agendamento para acessar seus dados</p>
          <button
            onClick={() => router.push(`/${tenantSlug}/agendar`)}
            className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: "#22c55e" }}
          >
            Agendar Horário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015] hidden sm:block">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-white" />
        <Comb className="absolute bottom-20 left-12 w-16 text-white" />
      </div>

      <header className="border-b border-zinc-800 relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Meus Agendamentos</h1>
          <button onClick={logout} className="text-xs text-zinc-500 hover:text-white transition-colors">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {customerName && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white">
              {customerName[0]}
            </div>
            <div>
              <p className="text-white font-medium">{customerName}</p>
              <p className="text-xs text-zinc-500">{appointments.length} agendamento{appointments.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="size-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-sm text-zinc-500">Nenhum agendamento encontrado</p>
            <button
              onClick={() => router.push(`/${tenantSlug}/agendar`)}
              className="mt-4 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#22c55e" }}
            >
              Novo Agendamento
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex flex-col items-center min-w-[52px]">
                      <span className="text-lg font-bold text-white">
                        {format(new Date(apt.startTime), "HH:mm")}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {format(new Date(apt.startTime), "dd/MM")}
                      </span>
                    </div>
                    <div className="w-px h-10 bg-zinc-800" />
                    <div>
                      <p className="text-sm font-medium text-white">{apt.service.name}</p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <User className="size-3" />
                        {apt.barber.name}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[apt.status] || "bg-zinc-800 text-zinc-400"}`}>
                    {statusLabel[apt.status] || apt.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    {apt.paymentMethod && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {apt.paymentMethod === "pix" ? "Pix" : apt.paymentMethod === "dinheiro" ? "Dinheiro" : "Cartão"}
                      </span>
                    )}
                    <span className="font-semibold text-white">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(apt.service.price)}
                    </span>
                  </div>
                  {(apt.status === "confirmed" || apt.status === "pending") && (
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      <XCircle className="size-3" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <button
                onClick={() => router.push(`/${tenantSlug}/agendar`)}
                className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: "#22c55e" }}
              >
                Novo Agendamento
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
