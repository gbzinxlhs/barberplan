"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { BarberPole, Mustache, Razor, ScissorsIcon } from "@/components/barber-icons";
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Users,
  DollarSign,
  Scissors,
  Sparkles,
} from "lucide-react";
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

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-500", icon: "text-blue-500" },
  amber: { bg: "bg-amber-500", icon: "text-amber-500" },
  emerald: { bg: "bg-emerald-500", icon: "text-emerald-500" },
  red: { bg: "bg-red-500", icon: "text-red-500" },
  purple: { bg: "bg-purple-500", icon: "text-purple-500" },
  orange: { bg: "bg-orange-500", icon: "text-orange-500" },
};

const quickLinks = [
  { href: "agendamentos", label: "Agendamentos", icon: Calendar, desc: "Gerencie horários e confirmações", color: "purple" },
  { href: "servicos", label: "Serviços", icon: Scissors, desc: "Preços, durações e categorias", color: "emerald" },
  { href: "barbeiros", label: "Barbeiros", icon: Users, desc: "Equipe e escala", color: "blue" },
  { href: "financeiro", label: "Financeiro", icon: DollarSign, desc: "Faturamento e relatórios", color: "orange" },
];

export default function TenantAdminDashboard() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const { user } = useSaasUser();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");
  const basePath = `/${tenantSlug}/admin`;

  useEffect(() => {
    if (!tenantSlug) return;
    fetch(`/api/appointments?tenant=${tenantSlug}&date=${today}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
        setLoading(false);
      });
  }, [today, tenantSlug]);

  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;
  const pending = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
        <Razor className="absolute top-60 left-1/4 w-12 text-zinc-900" />
        <ScissorsIcon className="absolute top-32 right-1/3 w-16 text-zinc-900" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <Link
          href={`${basePath}/agendamentos`}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Calendar className="size-4" />
          Novo Agendamento
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={Calendar} label="Hoje" value={appointments.length} color="blue" trend={appointments.length > 0 ? `${confirmed + completed} ativos` : "0"} />
        <SummaryCard icon={Clock} label="Pendentes" value={pending} color="amber" trend={`${pending > 0 ? `${pending} aguardam` : "nenhum"}`} />
        <SummaryCard icon={CheckCircle2} label="Confirmados" value={confirmed} color="emerald" trend={`${((confirmed / (appointments.length || 1)) * 100).toFixed(0)}% do total`} />
        <SummaryCard icon={XCircle} label="Cancelados" value={cancelled} color="red" trend={cancelled > 0 ? `${((cancelled / (appointments.length || 1)) * 100).toFixed(0)}%` : "0%"} />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-zinc-900">Agenda de Hoje</h2>
          </div>
          <Link href={`${basePath}/agendamentos`} className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-zinc-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="size-10 text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">Nenhum agendamento para hoje</p>
              <p className="text-xs text-zinc-300 mt-1">Os agendamentos aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((apt) => (
                <div key={apt.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center min-w-[52px]">
                      <span className="text-sm font-bold text-zinc-800">{format(new Date(apt.startTime), "HH:mm")}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{format(new Date(apt.startTime), "hh:mm")}</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-200" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{apt.customer.name}</p>
                      <p className="text-xs text-zinc-400">{apt.service.name}<span className="mx-1">·</span>{apt.barber.name}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle[apt.status] || "bg-zinc-100 text-zinc-600"}`}>
                    {statusLabel[apt.status] || apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-zinc-900 mb-4">Navegação Rápida</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          const c = colorMap[link.color];
          return (
            <Link key={link.href} href={`${basePath}/${link.href}`} className="group bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <Icon className="size-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">{link.label}</h3>
              <p className="text-xs text-zinc-400 mt-1">{link.desc}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]">
        <ScissorsIcon className="w-20 h-auto text-zinc-900" />
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: number; color: string; trend: string }) {
  const c = colorMap[color];
  return (
    <div className="group bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className="size-4 text-white" />
        </div>
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{trend}</p>
    </div>
  );
}
