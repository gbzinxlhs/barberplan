"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle } from "lucide-react";
import { useSaasUser } from "@/contexts/saas-user";

export function SaasLogin() {
  const { user, setUser } = useSaasUser();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const planLabel: Record<string, string> = {
    starter_trial: "Starter (Trial)",
    starter: "Starter",
    pro: "Pro",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/saas-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser(data.user);
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); }, 1500);
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 hidden sm:inline">{user.name.split(" ")[0]}</span>
          {user.plan !== "free" && (
            <span className="text-[10px] bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {planLabel[user.plan] || user.plan}
            </span>
          )}
          <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            {user.name[0]}
          </span>
          <button
            onClick={() => { localStorage.removeItem("saas_user"); setUser(null); }}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider"
          >
            Sair
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Entrar
        </button>
      )}

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md mx-4 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors z-10"
            >
              <X className="size-4" />
            </button>

            {done ? (
              <div className="p-10 text-center">
                <CheckCircle className="size-12 text-primary mx-auto mb-4" />
                <p className="text-white font-semibold text-lg">Conectado!</p>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-xl font-bold text-white">Criar conta ou entrar</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Crie sua conta para contratar um plano. Já tem conta? Informe o mesmo email.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Nome</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                        placeholder="João"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Sobrenome</label>
                      <input
                        value={form.surname}
                        onChange={(e) => setForm({ ...form, surname: e.target.value })}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                        placeholder="Silva"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                      placeholder="joao@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">WhatsApp / Telefone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                      placeholder="(85) 99999-9999"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {saving ? "Conectando..." : "Criar conta / Entrar"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
