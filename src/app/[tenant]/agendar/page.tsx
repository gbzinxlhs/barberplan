"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
}

interface Tenant {
  id: string;
  name: string;
  primaryColor: string;
  logo: string | null;
  whatsapp: string | null;
}

export default function BookingPage() {
  const params = useParams();
  const tenantSlug = params.tenant as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/tenants/${tenantSlug}`);
      const data = await res.json();
      setTenant(data.tenant);
      setServices(data.services);
      setBarbers(data.barbers);
      setLoading(false);
    }
    load();
  }, [tenantSlug]);

  useEffect(() => {
    if (selectedDate && selectedBarber && selectedService) {
      const times: string[] = [];
      const startHour = 9;
      const endHour = 18;
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        }
      }
      setAvailableTimes(times);
      setSelectedTime(null);
    }
  }, [selectedDate, selectedBarber, selectedService]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Carregando...</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Barbearia não encontrada</div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedService.duration);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantSlug,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        customerName,
        customerPhone,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }),
    });

    setSubmitting(false);
    if (res.ok) setSuccess(true);
  }

  const today = startOfDay(new Date());

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Agendamento Confirmado!</h2>
          <p className="text-zinc-400 mb-6">
            Seu horário foi reservado. Você receberá uma confirmação no WhatsApp.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setSelectedService(null);
              setSelectedBarber(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setCustomerName("");
              setCustomerPhone("");
              setSuccess(false);
            }}
            className="text-white px-6 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                {tenant.name[0]}
              </div>
            )}
            <span className="text-lg font-bold text-white">{tenant.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step
                    ? "text-white"
                    : "bg-zinc-800 text-zinc-500"
                }`}
                style={s <= step ? { backgroundColor: tenant.primaryColor } : {}}
              >
                {s}
              </div>
              {s < 4 && <div className={`flex-1 h-0.5 ${s < step ? "bg-amber-500" : "bg-zinc-800"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Escolha o Serviço</h2>
              <div className="grid gap-3">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    onClick={() => { setSelectedService(service); setStep(2); }}
                    className={`bg-zinc-900 border rounded-xl p-4 text-left transition-all hover:border-zinc-600 ${
                      selectedService?.id === service.id
                        ? "border-zinc-500"
                        : "border-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{service.name}</span>
                      <span className="text-sm font-bold" style={{ color: tenant.primaryColor }}>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(service.price)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{service.duration} min</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Escolha o Barbeiro</h2>
              <div className="grid gap-3">
                {barbers.map((barber) => (
                  <button
                    type="button"
                    key={barber.id}
                    onClick={() => { setSelectedBarber(barber); setStep(3); }}
                    className={`bg-zinc-900 border rounded-xl p-4 text-left transition-all hover:border-zinc-600 ${
                      selectedBarber?.id === barber.id
                        ? "border-zinc-500"
                        : "border-zinc-800"
                    }`}
                  >
                    <span className="text-white font-medium">{barber.name}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-zinc-400 text-sm mt-4 hover:text-white transition-colors"
              >
                ← Voltar
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Escolha a Data e Horário</h2>
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = addDays(today, i);
                  const isWeekend = date.getDay() === 0;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isWeekend}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-20 py-3 rounded-xl text-center transition-all ${
                        selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                          ? "text-white"
                          : isWeekend
                          ? "bg-zinc-900/50 text-zinc-700 cursor-not-allowed"
                          : "bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                      }`}
                      style={
                        selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                          ? { backgroundColor: tenant.primaryColor }
                          : {}
                      }
                    >
                      <div className="text-xs uppercase">
                        {format(date, "EEE", { locale: ptBR }).slice(0, 3)}
                      </div>
                      <div className="text-lg font-bold">{format(date, "dd")}</div>
                      <div className="text-xs">{format(date, "MMM", { locale: ptBR })}</div>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-sm transition-all ${
                        selectedTime === time
                          ? "text-white"
                          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                      }`}
                      style={
                        selectedTime === time
                          ? { backgroundColor: tenant.primaryColor }
                          : {}
                      }
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-zinc-400 text-sm hover:text-white transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!selectedTime}
                  className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Seus Dados</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600"
                    placeholder="(85) 99999-9999"
                  />
                </div>

                {selectedService && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-6">
                    <h3 className="text-white font-semibold mb-2">Resumo</h3>
                    <div className="space-y-1 text-sm text-zinc-400">
                      <p>Serviço: {selectedService.name}</p>
                      <p>Barbeiro: {selectedBarber?.name}</p>
                      <p>
                        Data:{" "}
                        {selectedDate &&
                          format(selectedDate, "dd/MM/yyyy")}
                      </p>
                      <p>Horário: {selectedTime}</p>
                      <p className="text-white font-bold mt-2">
                        Total:{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(selectedService.price)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-zinc-400 text-sm hover:text-white transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-white px-6 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 ml-auto"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  {submitting ? "Agendando..." : "Confirmar Agendamento"}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
