"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Power, X, Trash2 } from "lucide-react";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { useSaasUser } from "@/contexts/saas-user";
import gsap from "gsap";

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
  const { tenant } = useSaasUser();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "", category: "corte" });
  const tenantSlug = tenant?.slug;

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  async function loadServices() {
    if (!tenantSlug) return;
    setLoading(true);
    const res = await fetch(`/api/services?tenant=${tenantSlug}`);
    const data = await res.json();
    setServices(data.services || []);
    setLoading(false);
  }

  useEffect(() => { if (tenantSlug) loadServices(); }, [tenantSlug]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current?.children) {
        gsap.from(headerRef.current.children, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
      if (bgRef.current?.children) {
        gsap.from(bgRef.current.children, {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: "power1.out",
        });
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loading && services.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tbody tr");
      if (rows.length > 0) {
        gsap.from(rows, {
          y: 12,
          opacity: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }
  }, [loading, services]);

  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.from(formRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [showForm]);

  async function saveService(e: React.FormEvent) {
    e.preventDefault();

    if (editService) {
      await fetch(`/api/services/${editService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          duration: Number(form.duration),
          category: form.category,
        }),
      });
    } else {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: tenantSlug,
          name: form.name,
          price: Number(form.price),
          duration: Number(form.duration),
          category: form.category,
        }),
      });
    }

    setShowForm(false);
    setEditService(null);
    setForm({ name: "", price: "", duration: "", category: "corte" });
    loadServices();
  }

  function edit(svc: any) {
    setEditService(svc);
    setForm({ name: svc.name, price: String(svc.price), duration: String(svc.duration), category: svc.category });
    setShowForm(true);
  }

  async function removeService(id: string, name: string) {
    if (!confirm(`Remover "${name}"? Esta ação não pode ser desfeita.`)) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    loadServices();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    loadServices();
  }

  return (
    <div className="p-6 relative">
      <div ref={bgRef} className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      <div ref={headerRef} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Serviços</h1>
          <p className="text-sm text-zinc-500 mt-1">{services.length} serviços cadastrados</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditService(null); setForm({ name: "", price: "", duration: "", category: "corte" }); }}>
          <Plus className="size-4 mr-1.5" />
          Novo Serviço
        </Button>
      </div>

      {showForm && (
        <div ref={formRef} className="bg-white rounded-xl border border-zinc-200 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-900">
              {editService ? "Editar Serviço" : "Novo Serviço"}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-600">
              <X className="size-4" />
            </button>
          </div>
          <form onSubmit={saveService} className="p-6 space-y-4">
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
            <div className="flex gap-2 pt-2">
              <Button type="submit">{editService ? "Salvar" : "Criar"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      <div ref={tableRef} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Serviço</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Duração</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Preço</th>
                <th className="text-center px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Ativo</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-zinc-400 text-sm">Carregando...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-zinc-400 text-sm">Nenhum serviço encontrado</td></tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-zinc-900">{svc.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                        {categories.find(c => c.value === svc.category)?.label || svc.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-500">{svc.duration} min</td>
                    <td className="px-5 py-4 text-sm text-right font-semibold text-zinc-900">{formatCurrency(svc.price)}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleActive(svc.id, svc.active)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                          svc.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-zinc-100 text-zinc-400 border-zinc-200"
                        }`}
                      >
                        <Power className="size-3" />
                        {svc.active ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => edit(svc)}>
                          <Pencil className="size-3.5 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeService(svc.id, svc.name)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="size-3.5 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]">
        <ScissorsIcon className="w-16 h-auto text-zinc-900" />
      </div>
    </div>
  );
}
