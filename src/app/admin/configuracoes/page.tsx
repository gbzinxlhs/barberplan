"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-8">Configurações</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Barbearia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Label>Telefone</Label>
                  <Input defaultValue="(85) 3122-0659" />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input defaultValue="(85) 98213-8203" />
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input defaultValue="Rua Canuto de Aguiar, 1428 - Meireles" />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input defaultValue="@brooklynfortaleza" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { day: "Segunda-feira", start: "09:00", end: "19:00" },
                  { day: "Terça-feira", start: "09:00", end: "19:00" },
                  { day: "Quarta-feira", start: "09:00", end: "19:00" },
                  { day: "Quinta-feira", start: "09:00", end: "19:00" },
                  { day: "Sexta-feira", start: "09:00", end: "19:00" },
                  { day: "Sábado", start: "09:00", end: "19:00" },
                  { day: "Domingo", start: "--:--", end: "--:--" },
                ].map((item) => (
                  <div key={item.day} className="flex items-center gap-4 py-2 border-b border-zinc-100 last:border-0">
                    <span className="text-sm text-zinc-900 w-32">{item.day}</span>
                    {item.start !== "--:--" ? (
                      <>
                        <input type="time" defaultValue={item.start} className="border border-zinc-300 rounded px-2 py-1 text-sm" />
                        <span className="text-zinc-400">—</span>
                        <input type="time" defaultValue={item.end} className="border border-zinc-300 rounded px-2 py-1 text-sm" />
                      </>
                    ) : (
                      <span className="text-sm text-zinc-400">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comissão dos Barbeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Percentual de Comissão (%)</Label>
                <Input type="number" defaultValue="30" className="max-w-[200px]" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">
              {saved ? "Salvo ✓" : "Salvar Configurações"}
            </Button>
          </div>
        </form>
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
          <Link href="/admin/agendamentos" className="text-zinc-500 hover:text-zinc-900">Agendamentos</Link>
          <Link href="/admin/servicos" className="text-zinc-500 hover:text-zinc-900">Serviços</Link>
          <Link href="/admin/barbeiros" className="text-zinc-500 hover:text-zinc-900">Barbeiros</Link>
          <Link href="/admin/financeiro" className="text-zinc-500 hover:text-zinc-900">Financeiro</Link>
          <Link href="/admin/configuracoes" className="text-zinc-900 font-medium">Configurações</Link>
        </nav>
      </div>
    </header>
  );
}
