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
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
            <div className="max-w-3xl">
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
          </div>
        </section>

        <section id="funcionalidades" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
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
                  <div
                    key={item.title}
                    className="bg-card p-8"
                  >
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
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
