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
import {
  BarberPole,
  BarberChair,
  Comb,
  Mustache,
  ScissorsIcon,
  StraightRazor,
  HairClipper,
  ShavingBrush,
} from "@/components/barber-icons";

const barberIcons = [
  { icon: BarberChair, w: "w-20", pos: "top-10 left-0" },
  { icon: BarberPole, w: "w-6", pos: "top-40 right-10" },
  { icon: Comb, w: "w-16", pos: "bottom-20 left-10" },
  { icon: Mustache, w: "w-14", pos: "bottom-10 right-0" },
  { icon: ScissorsIcon, w: "w-10", pos: "top-60 right-20" },
  { icon: StraightRazor, w: "w-16", pos: "top-20 left-20" },
  { icon: HairClipper, w: "w-10", pos: "bottom-40 right-10" },
  { icon: ShavingBrush, w: "w-6", pos: "bottom-10 left-0" },
];

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
      <header className="border-b border-border relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <HairClipper className="absolute w-8 top-4 right-32 text-zinc-900" />
          <Comb className="absolute w-12 top-3 right-12 text-zinc-900" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground relative overflow-hidden">
              B
              <ScissorsIcon className="absolute -bottom-1 -right-1 w-3 text-primary-foreground/30" />
            </div>
            <span className="text-lg font-bold text-zinc-900">BarberPlan</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
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
        <section className="overflow-hidden relative bg-zinc-950">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none hidden lg:block">
            <BarberChair className="absolute w-16 -top-4 right-[15%] text-white" />
            <Mustache className="absolute w-20 top-[20%] left-[5%] text-white" />
            <Comb className="absolute w-24 bottom-[15%] right-[8%] text-white" />
            <StraightRazor className="absolute w-14 bottom-[30%] left-[3%] text-white" />
            <ScissorsIcon className="absolute w-8 top-[40%] right-[3%] text-white" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1 text-xs font-medium text-zinc-400 mb-6">
                  <ScissorsIcon className="size-3 text-zinc-400" />
                  Sistema completo para barbearias
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                  Gestão inteligente para sua{" "}
                  <span className="text-primary">barbearia</span>
                </h1>
                <p className="mt-5 text-lg text-zinc-400 max-w-xl leading-relaxed">
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
                    className="border border-zinc-700 text-zinc-300 font-semibold px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Funcionalidades
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
                <div className="relative flex items-center gap-8 p-8 rounded-2xl border border-zinc-800 bg-zinc-900">
                  <BarberChair className="w-36 h-auto" />
                  <div className="flex flex-col items-center gap-5">
                    <BarberPole className="h-44 w-auto" />
                    <Comb className="w-28 h-auto" />
                    <Mustache className="w-24 h-auto" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <ScissorsIcon className="size-8 text-primary" />
                  </div>
                </div>
                <ShavingBrush className="absolute w-8 -top-3 -right-3 text-white/20" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none hidden sm:block">
            <Mustache className="absolute w-16 top-4 left-[20%] text-zinc-900" />
            <Comb className="absolute w-16 bottom-2 right-[15%] text-zinc-900" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { value: "500+", label: "Barbearias cadastradas", icon: Mustache },
                { value: "10k+", label: "Agendamentos realizados", icon: ScissorsIcon },
                { value: "98%", label: "Satisfação dos clientes", icon: Comb },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center p-8 rounded-xl border border-zinc-200 bg-zinc-50 relative overflow-hidden group"
                  >
                    <Icon className="absolute w-12 opacity-[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-900 group-hover:opacity-[0.1] transition-opacity" />
                    <div className="relative z-10">
                      <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-zinc-500">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none hidden lg:block">
            <BarberChair className="absolute w-24 top-[10%] right-[5%] text-white" />
            <StraightRazor className="absolute w-20 bottom-[20%] left-[3%] text-white" />
            <ShavingBrush className="absolute w-10 top-[30%] left-[8%] text-white" />
            <HairClipper className="absolute w-12 bottom-[10%] right-[15%] text-white" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-4">
                  <ScissorsIcon className="size-3.5 text-primary" />
                  Como funciona
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Seu cliente agenda sem precisar ligar
                </h2>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  A página de agendamento mostra os serviços, barbeiros e horários
                  disponíveis. O cliente escolhe, confirma e pronto. Tudo online,
                  sem telefonemas.
                </p>
                <div className="mt-8 space-y-5">
                  {[
                    { text: "Cliente acessa pelo link da sua barbearia", icon: HairClipper },
                    { text: "Escolhe o serviço e o barbeiro preferido", icon: Comb },
                    { text: "Seleciona o melhor horário na agenda", icon: StraightRazor },
                    { text: "Recebe confirmação automática no WhatsApp", icon: Mustache },
                  ].map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.text} className="flex items-start gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <span className="text-xs text-zinc-600 font-mono">0{i + 1}</span>
                          <p className="text-sm text-zinc-300 mt-0.5">{step.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-2xl blur" />
                <div className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden">
                  <Mustache className="absolute w-16 opacity-[0.06] -bottom-4 -right-4 text-white pointer-events-none" />
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <Comb className="w-4 h-auto" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Barbearia do Zé</div>
                      <div className="text-xs text-zinc-500">ze.barberplan.com</div>
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <ScissorsIcon className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Serviços</span>
                    </div>
                    <div className="grid gap-2">
                      {[
                        { name: "Corte Degradê", price: "R$ 45" },
                        { name: "Barba Completa", price: "R$ 30" },
                        { name: "Hidratação", price: "R$ 25" },
                        { name: "Corte + Barba", price: "R$ 65", popular: true },
                      ].map((s) => (
                        <div
                          key={s.name}
                          className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                            s.popular
                              ? "bg-primary/10 border border-primary/30"
                              : "bg-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {s.popular && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            <span className={s.popular ? "text-white" : "text-zinc-300"}>{s.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-500 text-xs">{s.price}</span>
                            <span className="text-xs font-semibold text-primary">Agendar</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none hidden lg:block">
            <BarberPole className="absolute w-6 h-32 top-[15%] left-[5%] text-zinc-900" />
            <ScissorsIcon className="absolute w-8 top-[45%] right-[8%] text-zinc-900" />
            <Comb className="absolute w-16 bottom-[10%] left-[10%] text-zinc-900" />
            <Mustache className="absolute w-14 bottom-[30%] right-[5%] text-zinc-900" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                Recursos
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
                Tudo que sua barbearia precisa
              </h2>
              <p className="mt-4 text-zinc-500 max-w-lg mx-auto">
                Ferramentas completas para gerenciar agendamentos, equipe e
                finanças em um só lugar.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 rounded-xl overflow-hidden">
              {features.map((item, idx) => {
                const Icon = item.icon;
                const BarbershopIcon = [
                  BarberChair, BarberPole, Comb, Mustache, ScissorsIcon, StraightRazor,
                ][idx % 6];
                return (
                  <div key={item.title} className="bg-white p-8 relative group">
                    <BarbershopIcon className="absolute w-16 opacity-[0.04] -bottom-4 -right-4 text-zinc-900 group-hover:opacity-[0.08] transition-opacity pointer-events-none" />
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-5 relative">
                      <Icon className="size-5 text-zinc-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2 relative">{item.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed relative">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="planos" className="relative overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none hidden lg:block">
            <Mustache className="absolute w-24 top-[8%] left-[50%] -translate-x-1/2 text-white" />
            <ShavingBrush className="absolute w-8 top-[30%] left-[8%] text-white" />
            <HairClipper className="absolute w-10 bottom-[20%] right-[8%] text-white" />
            <Comb className="absolute w-16 bottom-[10%] left-[5%] text-white" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                Investimento
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Planos sob medida
              </h2>
              <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
                Escolha o plano ideal para o tamanho da sua barbearia. Cancele
                quando quiser.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {plans.map((plan, idx) => {
                const CornerIcon = [BarberChair, BarberPole, Mustache][idx];
                return (
                  <div
                    key={plan.name}
                    className={`rounded-xl border ${
                      plan.popular
                        ? "border-primary bg-zinc-900 ring-1 ring-primary"
                        : "border-zinc-800 bg-zinc-900"
                    } p-8 relative overflow-hidden group`}
                  >
                    <CornerIcon className={`absolute w-20 opacity-[0.06] -bottom-6 -right-6 text-white group-hover:opacity-[0.1] transition-opacity pointer-events-none`} />
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full z-10">
                        Mais popular
                      </div>
                    )}
                    <div className="mb-6 relative z-10">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-zinc-400 mt-1">{plan.desc}</p>
                    </div>
                    <div className="mb-6 relative z-10">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">
                          R$ {plan.monthly}
                        </span>
                        <span className="text-sm text-zinc-400">/mês</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        ou R$ {plan.annual}/ano (economize{" "}
                        {Math.round((1 - plan.annual / (plan.monthly * 12)) * 100)}%)
                      </p>
                    </div>
                    <ul className="space-y-3 mb-8 relative z-10">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                          <Check className="size-4 text-primary mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/admin"
                      className={`w-full flex items-center justify-center gap-2 font-semibold px-4 py-3 rounded-lg text-sm transition-all relative z-10 ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      Começar Agora
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none hidden sm:block">
            <BarberChair className="absolute w-20 top-[5%] left-[10%] text-zinc-900" />
            <Comb className="absolute w-24 top-[10%] right-[15%] text-zinc-900" />
            <Mustache className="absolute w-28 bottom-[15%] left-[20%] text-zinc-900" />
            <BarberPole className="absolute w-8 h-28 bottom-[20%] right-[10%] text-zinc-900" />
            <ScissorsIcon className="absolute w-10 top-[40%] left-[40%] text-zinc-900" />
            <ShavingBrush className="absolute w-12 top-[60%] left-[5%] text-zinc-900" />
            <HairClipper className="absolute w-10 bottom-[5%] right-[30%] text-zinc-900" />
            <StraightRazor className="absolute w-16 top-[30%] right-[25%] text-zinc-900" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Pronto para transformar sua barbearia?
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
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

      <footer className="border-t border-zinc-800 py-8 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <ScissorsIcon className="absolute w-6 bottom-4 right-[20%] text-white" />
          <Comb className="absolute w-10 top-2 left-[15%] text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-white relative overflow-hidden">
              B
              <ScissorsIcon className="absolute -bottom-1 -right-1 w-2 text-white/30" />
            </div>
            <span className="font-semibold text-white">BarberPlan</span>
          </div>
          <p>&copy; 2026 BarberPlan. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
