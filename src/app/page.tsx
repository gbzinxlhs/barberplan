import Link from "next/link";
import {
  Calendar,
  BarChart3,
  MessageCircle,
  DollarSign,
  Building2,
  Scissors,
  Check,
  ChevronRight,
  ArrowRight,
  Star,
  Smartphone,
  MousePointerClick,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Agendamento Online",
    desc: "Clientes agendam direto pelo site. Escolhem barbeiro, serviço e horário em segundos.",
    icon: Calendar,
  },
  {
    title: "Painel Administrativo",
    desc: "Controle total da agenda, barbeiros, serviços e histórico de clientes.",
    icon: BarChart3,
  },
  {
    title: "Lembretes via WhatsApp",
    desc: "Confirmação automática e lembrete antes do horário. Reduza faltas em até 80%.",
    icon: MessageCircle,
  },
  {
    title: "Gestão Financeira",
    desc: "Relatórios de faturamento, comissões e despesas. Saiba exatamente quanto entrou.",
    icon: DollarSign,
  },
  {
    title: "Múltiplas Unidades",
    desc: "Gerencie várias barbearias em um único painel. Ideal para redes e franquias.",
    icon: Building2,
  },
  {
    title: "Catálogo de Serviços",
    desc: "Tabela de preços atualizada com fotos, duração e descrição de cada serviço.",
    icon: Scissors,
  },
];

const plans = [
  {
    name: "Starter",
    desc: "Perfeito para barbearias começando a digitalizar.",
    monthly: 49,
    annual: 499,
    features: [
      "Até 2 barbeiros",
      "Agendamento online",
      "Painel administrativo",
      "Lembretes WhatsApp",
      "Relatórios básicos",
    ],
  },
  {
    name: "Pro",
    desc: "Para barbearias com movimento moderado e equipe fixa.",
    monthly: 99,
    annual: 999,
    popular: true,
    features: [
      "Até 5 barbeiros",
      "Tudo do Starter",
      "Múltiplas unidades",
      "Gestão financeira",
      "Catálogo de produtos",
      "Suporte prioritário",
    ],
  },
  {
    name: "Enterprise",
    desc: "Solução completa para redes e franquias de barbearia.",
    monthly: 199,
    annual: 1999,
    features: [
      "Barbeiros ilimitados",
      "Tudo do Pro",
      "API personalizada",
      "Domínio próprio",
      "Integração Stripe",
      "Onboarding dedicado",
    ],
  },
];

function BarberPole() {
  return (
    <svg viewBox="0 0 24 80" className="h-40 w-auto" fill="none">
      <rect x="6" y="2" width="12" height="76" rx="6" className="fill-zinc-800" />
      <rect x="8" y="4" width="8" height="72" rx="4" fill="url(#stripe)" />
      <defs>
        <linearGradient id="stripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="18%" stopColor="#ef4444" />
          <stop offset="18%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="68%" stopColor="#ef4444" />
          <stop offset="68%" stopColor="#ffffff" />
          <stop offset="84%" stopColor="#ffffff" />
          <stop offset="84%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BarberChair() {
  return (
    <svg viewBox="0 0 120 160" className="w-40 h-auto" fill="none">
      <rect x="30" y="100" width="60" height="12" rx="4" className="fill-zinc-700" />
      <rect x="40" y="112" width="40" height="6" rx="2" className="fill-zinc-700" />
      <rect x="52" y="118" width="16" height="30" rx="3" className="fill-zinc-700" />
      <rect x="20" y="148" width="80" height="8" rx="4" className="fill-zinc-800" />
      <path d="M60 96 L60 70 Q60 40 90 30 L90 40 Q70 48 70 70 L70 96 Z" className="fill-zinc-700" />
      <path d="M60 96 L60 70 Q60 40 30 30 L30 40 Q50 48 50 70 L50 96 Z" className="fill-zinc-700" />
      <rect x="35" y="30" width="50" height="14" rx="6" className="fill-zinc-600" />
      <rect x="45" y="18" width="30" height="14" rx="5" className="fill-zinc-600" />
      <circle cx="60" cy="14" r="6" className="fill-zinc-500" />
      <ellipse cx="60" cy="110" rx="34" ry="6" className="fill-zinc-800" />
    </svg>
  );
}

function CombIcon() {
  return (
    <svg viewBox="0 0 100 40" className="w-24 h-auto" fill="none">
      <rect x="2" y="8" width="96" height="6" rx="2" className="fill-zinc-700" />
      <rect x="2" y="18" width="96" height="6" rx="2" className="fill-zinc-700" />
      <rect x="2" y="28" width="50" height="6" rx="2" className="fill-zinc-700" />
      <line x1="10" y1="8" x2="10" y2="34" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="20" y1="8" x2="20" y2="34" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="30" y1="8" x2="30" y2="34" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="40" y1="8" x2="40" y2="34" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="50" y1="8" x2="50" y2="34" className="stroke-zinc-600" strokeWidth="1.5" />
      <rect x="78" y="2" width="20" height="36" rx="3" className="fill-zinc-700" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              B
            </div>
            <span className="text-lg font-bold text-foreground">BarberPlan</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Acessar
            </Link>
            <Link
              href="#planos"
              className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Planos
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Sistema completo para barbearias
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
                  Gestão inteligente para sua{" "}
                  <span className="text-primary">barbearia</span>
                </h1>
                <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Agendamento online, gestão de clientes, controle financeiro e
                  lembretes via WhatsApp. Sua barbearia no piloto automático.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/admin"
                    className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    Começar Agora
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="#funcionalidades"
                    className="border border-border text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Funcionalidades
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
                <div className="relative flex items-center gap-6 p-8 rounded-2xl border border-border bg-card">
                  <BarberChair />
                  <div className="flex flex-col items-center gap-6">
                    <BarberPole />
                    <CombIcon />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scissors className="size-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { value: "500+", label: "Barbearias cadastradas" },
                { value: "10k+", label: "Agendamentos realizados" },
                { value: "98%", label: "Satisfação dos clientes" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-8 rounded-xl border border-border bg-card"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  Seu cliente agenda sem precisar ligar
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  A página de agendamento mostra os serviços, barbeiros e horários
                  disponíveis. O cliente escolhe, confirma e pronto. Tudo online,
                  sem telefonemas.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Cliente acessa pelo link da sua barbearia",
                    "Escolhe o serviço e o barbeiro preferido",
                    "Seleciona o melhor horário na agenda",
                    "Recebe confirmação automática no WhatsApp",
                  ].map((step, i) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-sm text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                    B
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Barbearia do Zé</div>
                    <div className="text-xs text-muted-foreground">barberplan.vercel.app/barbearia-do-ze</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-24 rounded bg-secondary" />
                  <div className="grid gap-2">
                    {["Corte Degradê - R$ 45", "Barba Completa - R$ 30", "Hidratação - R$ 25"].map((s) => (
                      <div
                        key={s}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary text-sm"
                      >
                        <span className="text-foreground">{s}</span>
                        <button className="text-xs font-semibold text-primary hover:underline">
                          Agendar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Tudo que sua barbearia precisa
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                Ferramentas completas para gerenciar agendamentos, equipe e
                finanças em um só lugar.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-card p-8">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-5">
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="planos" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Planos sob medida
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                Escolha o plano ideal para o tamanho da sua barbearia. Cancele
                quando quiser.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border ${
                    plan.popular
                      ? "border-primary bg-card ring-1 ring-primary"
                      : "border-border bg-card"
                  } p-8 relative`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Mais popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        R$ {plan.monthly}
                      </span>
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ou R$ {plan.annual}/ano (economize{" "}
                      {Math.round((1 - plan.annual / (plan.monthly * 12)) * 100)}%)
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-primary mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/admin"
                    className={`w-full flex items-center justify-center gap-2 font-semibold px-4 py-3 rounded-lg text-sm transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    Começar Agora
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Pronto para transformar sua barbearia?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Cadastre-se grátis e comece a receber agendamentos online em
              minutos.
            </p>
            <Link
              href="/admin"
              className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Criar Conta Gratuita
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
              B
            </div>
            <span className="font-semibold text-foreground">BarberPlan</span>
          </div>
          <p>&copy; 2026 BarberPlan. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
