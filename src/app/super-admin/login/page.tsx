"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { useSuperAdmin } from "@/contexts/super-admin";
import { Loader2 } from "lucide-react";

export default function SuperAdminLogin() {
  const router = useRouter();
  const { login } = useSuperAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push("/super-admin");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <BarberPole className="absolute top-20 -right-10 w-40 h-96 text-zinc-400" />
        <Mustache className="absolute bottom-32 left-16 w-24 text-zinc-400" />
        <ScissorsIcon className="absolute top-1/3 left-1/4 w-20 text-zinc-400" />
      </div>

      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4 relative overflow-hidden">
            B
            <ScissorsIcon className="absolute -bottom-1.5 -right-1.5 w-3.5 text-primary-foreground/30" />
          </div>
          <h1 className="text-xl font-bold text-white">BarberPlan</h1>
          <p className="text-sm text-zinc-500 mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-medium rounded-lg px-4 py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-700 mt-6">
          Acesso restrito — apenas administradores
        </p>
      </div>
    </div>
  );
}
