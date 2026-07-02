"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Scissors, Clock, Globe, Loader2, Check, X } from "lucide-react";

export default function SetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");

  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeWhatsapp, setStoreWhatsapp] = useState("");
  const [storeInstagram, setStoreInstagram] = useState("");
  const [storeSlug, setStoreSlug] = useState(slug || "");
  const [tenantId, setTenantId] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!slug) { router.push("/admin"); return; }
    const stored = localStorage.getItem("saas_tenant");
    if (stored) {
      try {
        const t = JSON.parse(stored);
        setStoreName(t.name || "");
        setStoreSlug(t.slug || slug);
        setTenantId(t.id || "");
      } catch {}
    }
  }, [slug, router]);

  const checkSlug = useCallback(async (value: string) => {
    if (!value || value.length < 3) { setSlugAvailable(null); return; }
    setCheckingSlug(true);
    try {
      const res = await fetch(`/api/tenants/check-slug?slug=${encodeURIComponent(value)}&currentId=${tenantId}`);
      const data = await res.json();
      setSlugAvailable(data.available);
    } catch {
      setSlugAvailable(null);
    }
    setCheckingSlug(false);
  }, [tenantId]);

  useEffect(() => {
    const timer = setTimeout(() => checkSlug(storeSlug), 400);
    return () => clearTimeout(timer);
  }, [storeSlug, checkSlug]);

  function normalizeSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSave() {
    if (!slug) return;
    setSaving(true);

    const finalSlug = normalizeSlug(storeSlug);

    await fetch(`/api/tenants/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: storeName,
        address: storeAddress,
        phone: storePhone,
        whatsapp: storeWhatsapp,
        instagram: storeInstagram,
        ...(finalSlug !== slug ? { slug: finalSlug, subdomain: finalSlug } : {}),
      }),
    });

    setSaving(false);
    setDone(true);
  }

  if (done) {
    const finalSlug = normalizeSlug(storeSlug);
    const siteUrl = `https://barberplan-nine.vercel.app/${finalSlug}`;
    const adminUrl = `/admin`;

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <CheckCircle className="size-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Barbearia configurada!</h2>
          <p className="text-sm text-zinc-500 mb-6">Seu site já está no ar.</p>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Seu link público</p>
            <a href={siteUrl} target="_blank" className="text-sm text-primary font-medium hover:underline flex items-center gap-1.5">
              <Globe className="size-3.5" />
              {siteUrl}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push(`/admin/servicos`)} className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 justify-center">
              <Scissors className="size-4" /> Adicionar Serviços
            </button>
            <button onClick={() => router.push(`/admin/barbeiros`)} className="border border-zinc-300 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2 justify-center">
              <Clock className="size-4" /> Adicionar Barbeiros
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!slug) return null;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Configurar Barbearia</h1>
      <p className="text-sm text-zinc-500 mb-8">Preencha os dados da sua barbearia para começar.</p>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Nome da Barbearia</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              placeholder="Minha Barbearia"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Endereço da página</label>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2.5">
              <Globe className="size-3.5 shrink-0 text-zinc-400" />
              <span className="text-zinc-400">barberplan-nine.vercel.app/</span>
              <input
                value={storeSlug}
                onChange={(e) => setStoreSlug(normalizeSlug(e.target.value))}
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 p-0 focus:ring-0 min-w-[80px]"
                placeholder="minha-barbearia"
              />
            </div>
            {storeSlug.length >= 3 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {checkingSlug ? (
                  <Loader2 className="size-3 text-zinc-400 animate-spin" />
                ) : slugAvailable === true ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600">Disponível</span>
                  </>
                ) : slugAvailable === false ? (
                  <>
                    <X className="size-3 text-red-500" />
                    <span className="text-xs text-red-500">Indisponível</span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Endereço</label>
            <input
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              placeholder="Rua, número, bairro"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Telefone</label>
              <input
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                placeholder="(85) 3122-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">WhatsApp</label>
              <input
                value={storeWhatsapp}
                onChange={(e) => setStoreWhatsapp(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                placeholder="(85) 99999-0000"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Instagram</label>
            <input
              value={storeInstagram}
              onChange={(e) => setStoreInstagram(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              placeholder="@minhabarbearia"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving || slugAvailable === false}
              className="w-full bg-zinc-900 text-white font-semibold py-2.5 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? "Salvando..." : "Salvar e Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
