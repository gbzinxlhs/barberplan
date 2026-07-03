"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Clock, CheckCircle, Sun, Moon, Sunset } from "lucide-react";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";

const dayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const defaultForm = [
  { dayOfWeek: 0, startTime: "09:00", endTime: "13:00", isWorkingDay: false },
  { dayOfWeek: 1, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 2, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 3, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 4, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 5, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isWorkingDay: true },
];

export default function TenantAdminHorarios() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const [tenant, setTenant] = useState<any>(null);
  const [hours, setHours] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!tenantSlug) return;
    fetch(`/api/tenants/${tenantSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tenant) {
          setTenant(data.tenant);
          if (data.tenant.workingHours?.length > 0) {
            setHours(
              defaultForm.map((d) => {
                const existing = data.tenant.workingHours.find((w: any) => w.dayOfWeek === d.dayOfWeek);
                return existing ? { ...d, ...existing } : d;
              })
            );
          }
        }
        setLoading(false);
      });
  }, [tenantSlug]);

  function toggleDay(index: number) {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, isWorkingDay: !h.isWorkingDay } : h))
    );
  }

  function updateTime(index: number, field: "startTime" | "endTime", value: string) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  async function handleSave() {
    if (!tenant?.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/working-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenant.id, hours }),
      });
      const data = await res.json();
      if (data.hours) {
        setHours(
          defaultForm.map((d) => {
            const existing = data.hours.find((w: any) => w.dayOfWeek === d.dayOfWeek);
            return existing ? { ...d, ...existing } : d;
          })
        );
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center min-h-[40vh]"><div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Horários de Funcionamento</h1>
          <p className="text-sm text-zinc-500 mt-1">Defina os dias e horários de abertura da barbearia</p>
        </div>
      </div>

      <div className="max-w-xl bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {hours.map((h, i) => (
            <div
              key={h.dayOfWeek}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                h.isWorkingDay
                  ? "border-zinc-200 bg-zinc-50/50"
                  : "border-zinc-100 bg-zinc-50/30 opacity-60"
              }`}
            >
              <button
                onClick={() => toggleDay(i)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  h.isWorkingDay
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "bg-zinc-200 text-zinc-400"
                }`}
              >
                {h.isWorkingDay ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{dayLabels[h.dayOfWeek]}</p>
                <div className="flex items-center gap-2 mt-1">
                  {h.isWorkingDay ? (
                    <>
                      <input
                        type="time"
                        value={h.startTime}
                        onChange={(e) => updateTime(i, "startTime", e.target.value)}
                        className="w-28 border border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                      />
                      <span className="text-xs text-zinc-400">até</span>
                      <input
                        type="time"
                        value={h.endTime}
                        onChange={(e) => updateTime(i, "endTime", e.target.value)}
                        className="w-28 border border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                      />
                    </>
                  ) : (
                    <span className="text-sm text-zinc-400">Fechado</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleDay(i)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  h.isWorkingDay
                    ? "text-red-500 hover:bg-red-50"
                    : "text-primary hover:bg-primary/5"
                }`}
              >
                {h.isWorkingDay ? "Fechar" : "Abrir"}
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200 px-6 py-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-zinc-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
          >
            <Clock className="size-4" />
            {saving ? "Salvando..." : "Salvar Horários"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle className="size-3" />
              Horários salvos!
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]">
        <ScissorsIcon className="w-16 h-auto text-white" />
      </div>
    </div>
  );
}
