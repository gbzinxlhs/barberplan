"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

const initialServices = [
  { id: "1", name: "Corte + Sobrancelha", price: 65, duration: 60, category: "combos", active: true },
  { id: "2", name: "Corte + Barba Express", price: 80, duration: 75, category: "combos", active: true },
  { id: "3", name: "Corte + Barboterapia", price: 90, duration: 90, category: "combos", active: true },
  { id: "4", name: "Corte + Limpeza de Pele", price: 90, duration: 90, category: "combos", active: true },
  { id: "5", name: "Corte + Barba + Sobrancelha", price: 95, duration: 90, category: "combos", active: true },
  { id: "6", name: "Depilação Nasal", price: 15, duration: 15, category: "depilacao", active: true },
  { id: "7", name: "Depilação de Orelha", price: 15, duration: 15, category: "depilacao", active: true },
  { id: "8", name: "Limpeza de Pele Individual", price: 50, duration: 30, category: "pele", active: true },
  { id: "9", name: "Selagem", price: 60, duration: 45, category: "cabelo", active: true },
  { id: "10", name: "Luzes + Corte", price: 190, duration: 180, category: "cabelo", active: true },
  { id: "11", name: "Platinado + Corte", price: 200, duration: 180, category: "cabelo", active: true },
  { id: "12", name: "Hidratação", price: 100, duration: 90, category: "cabelo", active: true },
];

const categories = [
  { value: "corte", label: "Corte" },
  { value: "barba", label: "Barba" },
  { value: "combos", label: "Combos" },
  { value: "depilacao", label: "Depilação" },
  { value: "pele", label: "Pele" },
  { value: "cabelo", label: "Cabelo" },
  { value: "sobrancelha", label: "Sobrancelha" },
];

export default function AdminServices() {
  const [services, setServices] = useState(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "", category: "corte" });

  function saveService(e: React.FormEvent) {
    e.preventDefault();
    if (editService) {
      setServices(services.map((s) =>
        s.id === editService.id ? { ...s, ...form, price: Number(form.price), duration: Number(form.duration) } : s
      ));
    } else {
      setServices([...services, { id: String(Date.now()), ...form, price: Number(form.price), duration: Number(form.duration), active: true }]);
    }
    setShowForm(false);
    setEditService(null);
    setForm({ name: "", price: "", duration: "", category: "corte" });
  }

  function edit(svc: any) {
    setEditService(svc);
    setForm({ name: svc.name, price: String(svc.price), duration: String(svc.duration), category: svc.category });
    setShowForm(true);
  }

  function toggleActive(id: string) {
    setServices(services.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Serviços</h1>
          <Button onClick={() => { setShowForm(true); setEditService(null); setForm({ name: "", price: "", duration: "", category: "corte" }); }}>
            + Novo Serviço
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editService ? "Editar Serviço" : "Novo Serviço"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveService} className="space-y-4">
                <div>
                  <Label>Nome do Serviço</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Duração (min)</Label>
                    <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Select options={categories} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editService ? "Salvar" : "Criar"}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Serviço</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Categoria</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Duração</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500">Preço</th>
                  <th className="text-center p-4 text-sm font-medium text-zinc-500">Ativo</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="p-4 text-sm font-medium text-zinc-900">{svc.name}</td>
                    <td className="p-4 text-sm text-zinc-500">{categories.find(c => c.value === svc.category)?.label}</td>
                    <td className="p-4 text-sm text-zinc-500">{svc.duration} min</td>
                    <td className="p-4 text-sm text-right font-medium">{formatCurrency(svc.price)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleActive(svc.id)}
                        className={`w-3 h-3 rounded-full inline-block ${svc.active ? "bg-green-500" : "bg-zinc-300"}`}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost" onClick={() => edit(svc)}>Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <Link href="/admin/agendamentos" className="text-zinc-500 hover:text-zinc-900">Agendamentos</Link>
          <Link href="/admin/servicos" className="text-zinc-900 font-medium">Serviços</Link>
          <Link href="/admin/barbeiros" className="text-zinc-500 hover:text-zinc-900">Barbeiros</Link>
          <Link href="/admin/financeiro" className="text-zinc-500 hover:text-zinc-900">Financeiro</Link>
          <Link href="/admin/configuracoes" className="text-zinc-500 hover:text-zinc-900">Configurações</Link>
        </nav>
      </div>
    </header>
  );
}
