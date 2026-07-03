"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { Globe, CheckCircle } from "lucide-react";

export default function TenantAdminSettings() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", phone: "", whatsapp: "", instagram: "",
  });

  useEffect(() => {
    if (!tenantSlug) return;
    fetch(`/api/tenants/${tenantSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tenant) {
          setTenant(data.tenant);
          setForm({
            name: data.tenant.name || "",
            address: data.tenant.address || "",
            phone: data.tenant.phone || "",
            whatsapp: data.tenant.whatsapp || "",
            instagram: data.tenant.instagram || "",
          });
        }
        setLoading(false);
      });
  }, [tenantSlug]);

  async function handleSave() {
    if (!tenantSlug) return;
    setSaving(true);
    await fetch(`/api/tenants/${tenantSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center min-h-[40vh]"><div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const siteUrl = `https://barberplan-nine.vercel.app/${tenantSlug}`;

  return (
    <div className="p-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
        <BarberPole className="absolute top-40 -right-10 w-32 h-80 text-zinc-900" />
        <Mustache className="absolute bottom-20 left-12 w-20 text-zinc-900" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Configurações</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie os dados da sua barbearia</p>
        </div>
      </div>

      <div className="max-w-lg mb-6 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Seu link público</p>
        <a href={siteUrl} target="_blank" className="text-sm text-primary font-medium hover:underline flex items-center gap-1.5">
          <Globe className="size-3.5" />{siteUrl}
        </a>
      </div>

      <div className="max-w-lg bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Nome da Barbearia</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Endereço</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Telefone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">WhatsApp</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Instagram</label>
            <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400" />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-zinc-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            {saved && <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle className="size-3" />Salvo!</span>}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center opacity-[0.03]"><ScissorsIcon className="w-16 h-auto text-white" /></div>
    </div>
  );
}
