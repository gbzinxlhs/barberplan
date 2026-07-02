"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CheckCircle2, Clock, Percent, Store, MapPin, Phone, Globe } from "lucide-react";
import { BarberPole, Mustache } from "@/components/barber-icons";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const weekDays = [
    { day: "Segunda-feira", start: "09:00", end: "19:00" },
    { day: "Terça-feira", start: "09:00", end: "19:00" },
    { day: "Quarta-feira", start: "09:00", end: "19:00" },
    { day: "Quinta-feira", start: "09:00", end: "19:00" },
    { day: "Sexta-feira", start: "09:00", end: "19:00" },
    { day: "Sábado", start: "09:00", end: "19:00" },
    { day: "Domingo", start: "--:--", end: "--:--" },
  ];

  return (
    <div className="p-6 relative">
      {/* decorative bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Configurações</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie os dados da sua barbearia</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* informações */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100">
            <Store className="size-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900">Informações da Barbearia</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label>Nome da Barbearia</Label>
              <Input defaultValue="Brooklyn Barbearia Fortaleza" />
            </div>
            <div>
              <Label>Slug (URL da página)</Label>
              <Input defaultValue="brooklyn" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1.5">
                  <Phone className="size-3 text-zinc-400" /> Telefone
                </Label>
                <Input defaultValue="(85) 3122-0659" />
              </div>
              <div>
                <Label className="flex items-center gap-1.5">
                  <Phone className="size-3 text-zinc-400" /> WhatsApp
                </Label>
                <Input defaultValue="(85) 98213-8203" />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <MapPin className="size-3 text-zinc-400" /> Endereço
              </Label>
              <Input defaultValue="Rua Canuto de Aguiar, 1428 - Meireles" />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Globe className="size-3 text-zinc-400" /> Instagram
              </Label>
              <Input defaultValue="@brooklynfortaleza" />
            </div>
          </div>
        </div>

        {/* horários */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100">
            <Clock className="size-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900">Horários de Funcionamento</h2>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {weekDays.map((item) => (
                <div key={item.day} className="flex items-center gap-4 py-2 border-b border-zinc-100 last:border-0">
                  <span className="text-sm text-zinc-700 w-32 font-medium">{item.day}</span>
                  {item.start !== "--:--" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        defaultValue={item.start}
                        className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                      />
                      <span className="text-zinc-300">—</span>
                      <input
                        type="time"
                        defaultValue={item.end}
                        className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-400 italic">Fechado</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* comissão */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100">
            <Percent className="size-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900">Comissão dos Barbeiros</h2>
          </div>
          <div className="p-6">
            <div className="max-w-[200px]">
              <Label>Percentual de Comissão (%)</Label>
              <Input type="number" defaultValue="30" />
            </div>
          </div>
        </div>

        {/* save button */}
        <div className="flex justify-end">
          <Button type="submit" className={saved ? "bg-emerald-600 hover:bg-emerald-600" : ""}>
            {saved ? (
              <>
                <CheckCircle2 className="size-4 mr-1.5" />
                Salvo
              </>
            ) : (
              <>
                <Save className="size-4 mr-1.5" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>

      {/* decorative */}
      <div className="mt-10 flex justify-center opacity-[0.03]">
        <Mustache className="w-16 h-auto text-zinc-900" />
      </div>
    </div>
  );
}
