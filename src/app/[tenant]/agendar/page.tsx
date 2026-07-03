"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, addDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScissorsIcon, Comb, Mustache, BarberPole } from "@/components/barber-icons";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

interface Barber {
  id: string;
  name: string;
  bio?: string;
}

interface WorkingHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

interface Tenant {
  id: string;
  name: string;
  primaryColor: string;
  logo: string | null;
}

const categoryLabels: Record<string, string> = {
  corte: "Corte", barba: "Barba", combos: "Combos",
  depilacao: "Depilação", pele: "Pele", cabelo: "Cabelo", sobrancelha: "Sobrancelha",
};

const paymentMethods = [
  { value: "pix", label: "Pix", icon: "💳" },
  { value: "dinheiro", label: "Dinheiro", icon: "💵" },
  { value: "cartao", label: "Cartão", icon: "💳" },
];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenant as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logging, setLogging] = useState(false);

  const categories = [...new Set(services.map((s) => s.category))];

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/tenants/${tenantSlug}`);
      const data = await res.json();
      setTenant(data.tenant);
      setServices(data.services);
      setBarbers(data.barbers);
      setWorkingHours(data.workingHours || []);
      setLoading(false);
    }
    load();

    const stored = localStorage.getItem(`customer_${tenantSlug}`);
    if (stored) {
      try {
        const c = JSON.parse(stored);
        setCustomerId(c.id);
        setCustomerName(c.name);
        setCustomerPhone(c.phone);
        setStep(1);
      } catch {}
    }
  }, [tenantSlug]);

  useEffect(() => {
    if (!selectedDate || !selectedBarber || !tenant) return;
    const dow = selectedDate.getDay();
    const wh = workingHours.find((w) => w.dayOfWeek === dow);
    if (!wh || !wh.isWorkingDay) { setAvailableTimes([]); setBookedTimes([]); return; }

    const times: string[] = [];
    const [startH, startM] = wh.startTime.split(":").map(Number);
    const [endH, endM] = wh.endTime.split(":").map(Number);
    for (let m = startH * 60 + startM; m + (selectedService?.duration || 30) <= endH * 60 + endM; m += 30) {
      times.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    }
    setAvailableTimes(times);
    setSelectedTime(null);

    fetch(`/api/appointments?tenant=${tenantSlug}&date=${format(selectedDate, "yyyy-MM-dd")}&barberId=${selectedBarber.id}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedTimes((data.appointments || []).map((apt: any) => format(new Date(apt.startTime), "HH:mm")));
      });
  }, [selectedDate, selectedBarber, selectedService, tenantSlug, workingHours, tenant]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setLogging(true);
    const res = await fetch("/api/customers/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantSlug, name: customerName, phone: customerPhone }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(`customer_${tenantSlug}`, JSON.stringify({
        id: data.customer.id, name: data.customer.name, phone: data.customer.phone,
      }));
      setCustomerId(data.customer.id);
      setStep(1);
    }
    setLogging(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !paymentMethod) return;
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
        tenantSlug, barberId: selectedBarber.id, serviceId: selectedService.id,
        customerName, customerPhone,
        startTime: startTime.toISOString(), endTime: endTime.toISOString(), paymentMethod,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(`customer_${tenantSlug}`, JSON.stringify({
        id: data.customer.id, name: data.customer.name, phone: data.customer.phone,
      }));
      setCustomerId(data.customer.id);
    }
    setSubmitting(false);
    if (res.ok) setSuccess(true);
  }

  const today = startOfDay(new Date());
  const pc = tenant?.primaryColor || "#22c55e";

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 border-2 border-zinc-700 border-t-[#22c55e] rounded-full animate-spin" />
        <p className="text-sm text-zinc-500">Carregando...</p>
      </div>
    </div>
  );
  if (!tenant) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-zinc-400">Barbearia não encontrada</div>
    </div>
  );

  if (step === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
          <BarberPole className="absolute top-20 -right-6 w-20 h-48 text-white" />
          <Comb className="absolute bottom-20 left-8 w-16 text-white" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full relative z-10">
          <div className="flex items-center gap-3 mb-6">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: pc }}>
                {tenant.name[0]}
              </div>
            )}
            <span className="text-lg font-bold text-white">{tenant.name}</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Bem-vindo!</h2>
          <p className="text-sm text-zinc-400 mb-6">Informe seus dados para acessar o agendamento</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Nome</label>
              <input
                type="text" required value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">WhatsApp</label>
              <input
                type="tel" required value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                placeholder="(85) 99999-9999"
              />
            </div>
            <button
              type="submit" disabled={logging}
              className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: pc }}
            >
              {logging ? (
                <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Entrando...</>
              ) : (
                <>Entrar e Agendar</>
              )}
            </button>
          </form>
          {customerId && (
            <button
              onClick={() => router.push(`/${tenantSlug}/meus-agendamentos`)}
              className="w-full text-zinc-400 py-2 mt-2 text-sm hover:text-white transition-colors"
            >
              Meus Agendamentos
            </button>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
          <Mustache className="absolute w-16 opacity-[0.06] -bottom-4 -right-4 text-white pointer-events-none" />
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: pc }}>
            <svg className="size-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Agendamento Confirmado!</h2>
          <p className="text-zinc-400 text-sm mb-2">{selectedService?.name} com {selectedBarber?.name}</p>
          <p className="text-zinc-500 text-xs mb-6">
            {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
            {paymentMethod && <span className="block mt-1 capitalize">{paymentMethod === "pix" ? "Pix" : paymentMethod === "dinheiro" ? "Dinheiro" : "Cartão"}</span>}
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={() => router.push(`/${tenantSlug}/meus-agendamentos`)}
              className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: pc }}>
              Meus Agendamentos
            </button>
            <button onClick={() => {
              setStep(1); setSelectedCategory(null); setSelectedService(null); setSelectedBarber(null);
              setSelectedDate(null); setSelectedTime(null); setPaymentMethod(null); setSuccess(false);
            }} className="text-zinc-400 px-6 py-2.5 rounded-xl font-semibold text-sm hover:text-white transition-colors">
              Novo Agendamento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015] hidden sm:block">
        <BarberPole className="absolute top-20 -right-6 w-20 h-48 text-white" />
        <Comb className="absolute bottom-20 left-8 w-16 text-white" />
      </div>

      <header className="border-b border-zinc-800 relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: pc }}>
                {tenant.name[0]}
              </div>
            )}
            <span className="text-lg font-bold text-white">{tenant.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push(`/${tenantSlug}/meus-agendamentos`)}
              className="text-xs text-zinc-400 hover:text-white transition-colors">
              Meus Agendamentos
            </button>
            <button onClick={() => {
              localStorage.removeItem(`customer_${tenantSlug}`);
              setCustomerId(null); setCustomerName(""); setCustomerPhone(""); setStep(0);
            }} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s <= step ? "text-white" : "bg-zinc-800 text-zinc-500"}`}
                style={s <= step ? { backgroundColor: pc } : {}}>
                {s}
              </div>
              {s < 5 && <div className={`flex-1 h-0.5 transition-all ${s < step ? "" : "bg-zinc-800"}`} style={s < step ? { backgroundColor: pc } : {}} />}
            </div>
          ))}
        </div>

        {customerId && (
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
              {customerName[0]}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{customerName}</p>
              <p className="text-xs text-zinc-500">{customerPhone}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <ScissorsIcon className="w-5 h-auto" style={{ color: pc }} />
                <h2 className="text-xl font-bold text-white">Escolha o Serviço</h2>
              </div>
              {categories.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                  <button type="button" onClick={() => setSelectedCategory(null)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all shrink-0 ${selectedCategory === null ? "text-white border-transparent" : "text-zinc-500 border-zinc-700 hover:border-zinc-500"}`}
                    style={selectedCategory === null ? { backgroundColor: pc, borderColor: pc } : {}}>
                    Todos
                  </button>
                  {categories.map((cat) => (
                    <button key={cat} type="button" onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all shrink-0 ${selectedCategory === cat ? "text-white border-transparent" : "text-zinc-500 border-zinc-700 hover:border-zinc-500"}`}
                      style={selectedCategory === cat ? { backgroundColor: pc, borderColor: pc } : {}}>
                      {categoryLabels[cat] || cat}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid gap-2">
                {services.filter((s) => !selectedCategory || s.category === selectedCategory).map((service) => (
                  <button type="button" key={service.id} onClick={() => { setSelectedService(service); setStep(2); }}
                    className={`bg-zinc-900 border rounded-xl p-4 text-left transition-all hover:border-zinc-600 ${selectedService?.id === service.id ? "border-zinc-500" : "border-zinc-800"}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{service.name}</span>
                      <span className="text-sm font-bold" style={{ color: pc }}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.price)}
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
              <div className="flex items-center gap-2 mb-6">
                <Comb className="w-5 h-auto" style={{ color: pc }} />
                <h2 className="text-xl font-bold text-white">Escolha o Barbeiro</h2>
              </div>
              <div className="grid gap-2">
                {barbers.map((barber, idx) => {
                  const initials = barber.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                  const avColors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
                  return (
                    <button type="button" key={barber.id} onClick={() => { setSelectedBarber(barber); setStep(3); }}
                      className={`bg-zinc-900 border rounded-xl p-4 text-left transition-all hover:border-zinc-600 flex items-center gap-4 ${selectedBarber?.id === barber.id ? "border-zinc-500" : "border-zinc-800"}`}>
                      <div className={`w-10 h-10 rounded-full ${avColors[idx % avColors.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>{initials}</div>
                      <div>
                        <span className="text-white font-medium">{barber.name}</span>
                        {barber.bio && <p className="text-xs text-zinc-500 mt-0.5">{barber.bio}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-zinc-500 text-sm mt-4 hover:text-white transition-colors flex items-center gap-1">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Voltar
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: pc }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <h2 className="text-xl font-bold text-white">Data e Horário</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = addDays(today, i);
                  const dow = date.getDay();
                  const wh = workingHours.find((w) => w.dayOfWeek === dow);
                  const isClosed = !wh || !wh.isWorkingDay;
                  const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                  return (
                    <button key={i} type="button" disabled={isClosed} onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 min-w-[56px] w-auto px-1.5 sm:w-[72px] sm:px-3 py-3 rounded-xl text-center transition-all ${isSelected ? "text-white" : isClosed ? "bg-zinc-900/50 text-zinc-700 cursor-not-allowed" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
                      style={isSelected ? { backgroundColor: pc } : {}}>
                      <div className="text-[10px] uppercase tracking-wider">{format(date, "EEE", { locale: ptBR }).slice(0, 3)}</div>
                      <div className="text-base font-bold">{format(date, "dd")}</div>
                      <div className="text-[10px]">{format(date, "MMM", { locale: ptBR })}</div>
                    </button>
                  );
                })}
              </div>
              {selectedDate && (
                availableTimes.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-zinc-500 text-sm">Nenhum horário disponível nesta data</p>
                    <p className="text-zinc-600 text-xs mt-1">Selecione outro dia</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {availableTimes.map((time) => {
                      const isBooked = bookedTimes.includes(time);
                      return (
                        <button key={time} type="button" disabled={isBooked} onClick={() => setSelectedTime(time)}
                          className={`py-2.5 rounded-lg text-sm transition-all ${selectedTime === time ? "text-white" : isBooked ? "bg-zinc-900/50 text-zinc-700 cursor-not-allowed line-through" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
                          style={selectedTime === time ? { backgroundColor: pc } : {}}>
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )
              )}
              <div className="flex items-center justify-between mt-8">
                <button type="button" onClick={() => setStep(2)} className="text-zinc-500 text-sm hover:text-white transition-colors flex items-center gap-1">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Voltar
                </button>
                <button type="button" onClick={() => setStep(4)} disabled={!selectedTime}
                  className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: pc }}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: pc }}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <h2 className="text-xl font-bold text-white">Forma de Pagamento</h2>
              </div>
              <div className="grid gap-3">
                {paymentMethods.map((pm) => (
                  <button key={pm.value} type="button" onClick={() => setPaymentMethod(pm.value)}
                    className={`bg-zinc-900 border rounded-xl p-4 text-left transition-all hover:border-zinc-600 flex items-center gap-4 ${paymentMethod === pm.value ? "border-zinc-500" : "border-zinc-800"}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${paymentMethod === pm.value ? "text-white" : "text-zinc-500"}`}
                      style={paymentMethod === pm.value ? { backgroundColor: pc } : {}}>
                      {pm.icon}
                    </div>
                    <div>
                      <span className="text-white font-medium">{pm.label}</span>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {pm.value === "pix" ? "Pagamento online via Pix" : pm.value === "dinheiro" ? "Pague em dinheiro na barbearia" : "Pague com cartão na barbearia"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-8">
                <button type="button" onClick={() => setStep(3)} className="text-zinc-500 text-sm hover:text-white transition-colors flex items-center gap-1">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Voltar
                </button>
                <button type="button" onClick={() => setStep(5)} disabled={!paymentMethod}
                  className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: pc }}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: pc }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h2 className="text-xl font-bold text-white">Confirmar Agendamento</h2>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="text-sm text-zinc-400 space-y-2">
                  <div className="flex justify-between"><span className="text-zinc-500">Cliente</span><span className="text-white">{customerName}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Serviço</span><span className="text-white">{selectedService?.name}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Barbeiro</span><span className="text-white">{selectedBarber?.name}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Data</span><span className="text-white">{selectedDate && format(selectedDate, "dd/MM/yyyy")}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Horário</span><span className="text-white">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Pagamento</span><span className="text-white capitalize">{paymentMethod === "pix" ? "Pix" : paymentMethod === "dinheiro" ? "Dinheiro" : "Cartão"}</span></div>
                  <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between">
                    <span className="text-zinc-500">Valor</span>
                    <span className="font-bold" style={{ color: pc }}>
                      {selectedService && new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(selectedService.price)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <button type="button" onClick={() => setStep(4)} className="text-zinc-500 text-sm hover:text-white transition-colors flex items-center gap-1">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Voltar
                </button>
                <button type="submit" disabled={submitting}
                  className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2" style={{ backgroundColor: pc }}>
                  {submitting ? (
                    <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Agendando...</>
                  ) : (
                    <><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>Confirmar Agendamento</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
