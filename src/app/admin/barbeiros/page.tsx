"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialBarbers = [
  { id: "1", name: "João", bio: "Especialista em cortes clássicos", photo: null, active: true },
  { id: "2", name: "Carlos", bio: "Mestre em barboterapia", photo: null, active: true },
  { id: "3", name: "Pedro", bio: "Especialista em degradê e cortes modernos", photo: null, active: true },
];

export default function AdminBarbers() {
  const [barbers, setBarbers] = useState(initialBarbers);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", bio: "" });

  function saveBarber(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      setBarbers(barbers.map((b) => b.id === editId ? { ...b, ...form } : b));
    } else {
      setBarbers([...barbers, { id: String(Date.now()), ...form, photo: null, active: true }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", bio: "" });
  }

  function edit(barber: any) {
    setEditId(barber.id);
    setForm({ name: barber.name, bio: barber.bio || "" });
    setShowForm(true);
  }

  function toggleActive(id: string) {
    setBarbers(barbers.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Barbeiros</h1>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", bio: "" }); }}>
            + Novo Barbeiro
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editId ? "Editar Barbeiro" : "Novo Barbeiro"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveBarber} className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Especialidade do barbeiro" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editId ? "Salvar" : "Criar"}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className={barber.active ? "" : "opacity-60"}>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-200 mx-auto mb-4 flex items-center justify-center text-2xl">
                  💈
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">{barber.name}</h3>
                {barber.bio && <p className="text-sm text-zinc-500 mt-1">{barber.bio}</p>}
                <div className="flex gap-2 justify-center mt-4">
                  <Button size="sm" variant="outline" onClick={() => edit(barber)}>Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(barber.id)}>
                    {barber.active ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
          <Link href="/admin/barbeiros" className="text-zinc-900 font-medium">Barbeiros</Link>
          <Link href="/admin/financeiro" className="text-zinc-500 hover:text-zinc-900">Financeiro</Link>
          <Link href="/admin/configuracoes" className="text-zinc-500 hover:text-zinc-900">Configurações</Link>
        </nav>
      </div>
    </header>
  );
}
