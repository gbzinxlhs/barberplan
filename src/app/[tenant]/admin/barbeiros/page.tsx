"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Power, User } from "lucide-react";
import { BarberPole, Mustache, Razor } from "@/components/barber-icons";

const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];

export default function TenantAdminBarbers() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", bio: "" });

  async function loadBarbers() {
    if (!tenantSlug) return;
    setLoading(true);
    const res = await fetch(`/api/barbers?tenant=${tenantSlug}`);
    const data = await res.json();
    setBarbers(data.barbers || []);
    setLoading(false);
  }

  useEffect(() => { if (tenantSlug) loadBarbers(); }, [tenantSlug]);

  async function saveBarber(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/barbers/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSlug, ...form }),
      });
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", bio: "" });
    loadBarbers();
  }

  function edit(barber: any) {
    setEditId(barber.id);
    setForm({ name: barber.name, bio: barber.bio || "" });
    setShowForm(true);
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/barbers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    loadBarbers();
  }

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Razor className="absolute bottom-40 left-12 w-12 text-zinc-900" />
        <Mustache className="absolute top-32 right-1/3 w-16 text-zinc-900" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Barbeiros</h1>
          <p className="text-sm text-zinc-500 mt-1">{barbers.length} profissionais na equipe</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", bio: "" }); }}>
          <Plus className="size-4 mr-1.5" />Novo Barbeiro
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm mb-8 overflow-hidden max-w-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-900">{editId ? "Editar Barbeiro" : "Novo Barbeiro"}</h2>
          </div>
          <form onSubmit={saveBarber} className="p-6 space-y-4">
            <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Bio</Label><Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Especialidade do barbeiro" /></div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">{editId ? "Salvar" : "Criar"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-white rounded-xl border border-zinc-200 animate-pulse" />
          ))}
        </div>
      ) : barbers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <User className="size-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-sm text-zinc-500">Nenhum barbeiro cadastrado</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber, idx) => {
            const color = colors[idx % colors.length];
            const initials = barber.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
            return (
              <div key={barber.id} className={`group bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${!barber.active ? "opacity-50" : ""}`}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white`}>{initials}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-900">{barber.name}</h3>
                      <p className="text-xs text-zinc-400 truncate">{barber.bio || "Sem bio"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
                    <Button size="sm" variant="outline" onClick={() => edit(barber)} className="flex-1 text-xs h-8 text-zinc-700 hover:text-zinc-900">
                      <Pencil className="size-3 mr-1" />Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(barber.id, barber.active)} className={`text-xs h-8 ${barber.active ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"}`}>
                      <Power className="size-3 mr-1" />{barber.active ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex justify-center opacity-[0.03]">
        <Mustache className="w-16 h-auto text-zinc-900" />
      </div>
    </div>
  );
}
