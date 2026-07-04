"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useSaasUser } from "@/contexts/saas-user";

const plans: Record<string, { name: string; monthly: number; annual: number }> = {
  starter: { name: "Starter", monthly: 39.9, annual: 407 },
  pro: { name: "Pro", monthly: 79.9, annual: 815 },
};

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setUser } = useSaasUser();

  const planSlug = searchParams.get("plan") || "starter";
  const billing = searchParams.get("billing") || "monthly";
  const isTrial = billing === "trial";

  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ name: "", surname: "", email: "", phone: "" });
  const [loginSaving, setLoginSaving] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{ pixQrCode: string; pixCopyPaste: string; paymentId: string; value: number; tenantSlug?: string } | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [nfseSelected, setNfseSelected] = useState(false);

  const plan = plans[planSlug];
  const price = !isTrial ? (billing === "monthly" ? plan.monthly : plan.annual) : 0;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginSaving(true);
    try {
      const res = await fetch("/api/auth/saas/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error); return; }
      setUser(data.user);
    } catch {
      setLoginError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoginSaving(false);
    }
  }

  async function handlePurchase() {
    if (!user) return;
    if (isTrial) {
      return handleTrialActivation();
    }
    setPixLoading(true);
    setError("");
    try {
      const res = await fetch("/api/asaas/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan: planSlug, billing, cpfCnpj, nfseSelected: nfseSelected && planSlug === "pro" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setPixData(data);
      if (data.tenantSlug) {
        localStorage.setItem("saas_tenant", JSON.stringify({ slug: data.tenantSlug }));
        setCreatedSlug(data.tenantSlug);
      }
    } catch {
      setError("Erro ao gerar pagamento. Tente novamente.");
    } finally {
      setPixLoading(false);
    }
  }

  async function handleTrialActivation() {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/saas-users/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan: planSlug, billing, nfseSelected: nfseSelected && planSlug === "pro" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser(data.user);
      localStorage.setItem("saas_tenant", JSON.stringify(data.tenant));
      setCreatedSlug(data.tenant?.slug || null);
      setDone(true);
    } catch {
      setError("Erro ao processar compra. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isTrial ? "Trial ativado!" : "Plano ativado!"}
          </h1>
          <p className="text-zinc-400 mb-2">
            {isTrial ? (
              <>Seu trial de 14 dias do <span className="text-primary font-semibold">{plan.name}</span> já está valendo.</>
            ) : (
              <>Seu plano <span className="text-primary font-semibold">{plan.name} ({billing === "monthly" ? "Mensal" : "Anual"})</span> está ativo.</>
            )}
          </p>
          <p className="text-sm text-zinc-500 mb-8">
            Sua barbearia está criada. Agora configure seus serviços e horários.
          </p>
          {createdSlug ? (
            <Link
              href={`/admin/setup?slug=${createdSlug}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Configurar Barbearia
              <ArrowLeft className="size-4 rotate-180" />
            </Link>
          ) : (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Ir para o Painel
              <ArrowLeft className="size-4 rotate-180" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 py-12">
        <Link href="/#planos" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="p-8 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">B</div>
              <span className="text-sm font-bold text-white">BarberPlan</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              {user ? (isTrial ? "Ativar Trial Grátis" : "Confirmar assinatura") : "Criar conta para continuar"}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {user ? "Revise os dados antes de confirmar." : "Crie sua conta para assinar o plano. Já tem conta? Informe o mesmo email."}
            </p>
          </div>

          {!user ? (
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Nome</label>
                    <input
                      value={loginForm.name}
                      onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                      placeholder="João"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Sobrenome</label>
                    <input
                      value={loginForm.surname}
                      onChange={(e) => setLoginForm({ ...loginForm, surname: e.target.value })}
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
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                    placeholder="joao@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="tel"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                    placeholder="(85) 99999-9999"
                  />
                </div>
                {loginError && <p className="text-xs text-red-400">{loginError}</p>}
                <button
                  type="submit"
                  disabled={loginSaving}
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {loginSaving ? "Conectando..." : "Criar conta / Entrar"}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-sm text-zinc-400">Plano</span>
                <span className="text-sm font-semibold text-white">{plan.name}</span>
              </div>

              {isTrial ? (
                <div className="py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="size-4" />
                    <span className="text-sm font-semibold">14 dias grátis — sem cartão</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Após o período, você pode assinar o plano mensal ou anual para continuar.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Ciclo</span>
                    <span className="text-sm font-semibold text-white">
                      {billing === "monthly" ? "Mensal" : "Anual"}
                      {billing === "annual" && (
                        <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">-15%</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Valor</span>
                    <span className="text-lg font-bold text-white">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}
                      <span className="text-sm font-normal text-zinc-500 ml-1">
                        {billing === "monthly" ? "/mês" : "/ano"}
                      </span>
                    </span>
                  </div>
                </>
              )}

              <div className="py-3 border-b border-zinc-800">
                <span className="text-sm text-zinc-400 block mb-2">Seus dados</span>
                <div className="text-sm text-zinc-300 space-y-1">
                  <p>{user.name} {user.surname}</p>
                  <p className="text-zinc-500">{user.email}</p>
                  <p className="text-zinc-500">{user.phone}</p>
                </div>
              </div>

              {!isTrial && !pixData && (
                <div className="py-3 border-b border-zinc-800">
                  <label className="block text-xs font-medium text-zinc-400 mb-1">CPF / CNPJ</label>
                  <input
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                    placeholder="000.000.000-00"
                  />
                </div>
              )}

              {planSlug === "pro" && !isTrial && !pixData && (
                <div className="py-3 border-b border-zinc-800">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={nfseSelected}
                      onChange={(e) => setNfseSelected(e.target.checked)}
                      className="mt-0.5 size-4 rounded border-zinc-600 bg-zinc-800 text-primary focus:ring-primary/40"
                    />
                    <div>
                      <span className="text-sm text-zinc-200 font-medium group-hover:text-white transition-colors">Incluir emissão de NFS-e</span>
                      <p className="text-xs text-zinc-500 mt-0.5">Emita notas fiscais de serviço automaticamente. Configure depois no painel.</p>
                    </div>
                  </label>
                </div>
              )}

              <div className="pt-2 space-y-2">
                {error && <p className="text-xs text-red-400">{error}</p>}

                {pixData ? (
                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-xl p-4 text-center">
                      <p className="text-xs text-zinc-400 mb-3">Escaneie o QR Code abaixo para pagar via Pix</p>
                      <img
                        src={`data:image/png;base64,${pixData.pixQrCode}`}
                        alt="Pix QR Code"
                        className="mx-auto w-48 h-48 rounded-lg"
                      />
                      <div className="mt-3">
                        <button
                          onClick={() => { navigator.clipboard.writeText(pixData.pixCopyPaste); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                          className="text-xs text-primary hover:underline"
                        >
                          {copied ? "Copiado!" : "Copiar código Pix"}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        Valor: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pixData.value)}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-600 text-center">
                      Após o pagamento, seu plano será ativado automaticamente.
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handlePurchase}
                      disabled={pixLoading}
                      className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                    >
                      {pixLoading ? "Gerando Pix..." : `Pagar com Pix — ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}`}
                    </button>
                    <p className="text-[10px] text-zinc-600 text-center">
                      Pagamento processado via Asaas. Aceitamos Pix.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
