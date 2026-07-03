"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
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
  ChevronDown,
  Smartphone,
  Globe,
  Users,
  Clock,
  Shield,
  Zap,
  Repeat,
  Headphones,
  Trophy,
  Store,
  TrendingUp,
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
import { SaasLogin } from "@/components/saas-login";
import { SaasUserProvider, useSaasUser } from "@/contexts/saas-user";

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
    slug: "starter",
    name: "Starter",
    desc: "Tudo que você precisa para começar.",
    monthly: 39.9,
    annual: 407,
    popular: true,
    trial: true,
    features: [
      "14 dias grátis — sem cartão",
      "Agendamento online 24h",
      "Painel admin completo",
      "Login do cliente (nome + WhatsApp)",
      "Histórico e cancelamento pelo cliente",
      "Métodos de pagamento (Pix, Dinheiro, Cartão)",
      "Até 3 barbeiros",
      "Subdomínio BarberPlan",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    desc: "Para barbearias que querem se destacar.",
    monthly: 79.9,
    annual: 815,
    highlight: "MAIS VANTAGEM",
    features: [
      "Tudo do Starter",
      "Domínio próprio (.com.br)",
      "Layout único personalizado",
      "2 atualizações de layout por mês",
      "Barbeiros ilimitados",
      "Relatórios financeiros avançados",
      "Suporte prioritário",
    ],
  },
];

const faqItems = [
  {
    q: "Precisa de cartão de crédito para testar?",
    a: "Não. São 14 dias grátis sem pedir cartão. Cancele quando quiser, sem burocracia.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem multa, sem taxa. Você mantém acesso até o fim do período já pago.",
  },
  {
    q: "Como meus clientes agendam?",
    a: "Cada barbearia ganha um link exclusivo (ex: sua.barberplan.com). O cliente abre, escolhe serviço, barbeiro e horário — pronto.",
  },
  {
    q: "Funciona para mais de uma unidade?",
    a: "Sim. O painel permite gerenciar múltiplas unidades. Ideal para redes e franquias.",
  },
];

export default function Home() {
  return (
    <SaasUserProvider>
      <HomeContent />
    </SaasUserProvider>
  );
}

function HomeContent() {
  const { user } = useSaasUser();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const destaquesRef = useRef<HTMLDivElement>(null);
  const entregaveisRef = useRef<HTMLDivElement>(null);
  const processoRef = useRef<HTMLDivElement>(null);
  const publicoRef = useRef<HTMLDivElement>(null);
  const planosRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const els = heroRef.current.querySelectorAll<HTMLElement>(".gsap-hero");
        gsap.set(els, { y: 40, opacity: 0 });
        gsap.to(els, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      const sections = [
        destaquesRef.current,
        entregaveisRef.current,
        processoRef.current,
        publicoRef.current,
        planosRef.current,
        ctaRef.current,
      ];

      sections.forEach((section) => {
        if (!section) return;
        const cards = section.querySelectorAll<HTMLElement>(".gsap-card");
        if (cards.length === 0) return;
        gsap.set(cards, { y: 40, opacity: 0 });
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });
      });

      ScrollTrigger.refresh();
    });

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      ctx.revert();
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* top announcement bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">🔥 Lançamento</span>
          <span className="text-zinc-300 font-medium">
            <span className="hidden sm:inline">Starter </span>14 dias grátis
          </span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-500 hidden sm:inline">Sem cartão</span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-500 hidden sm:inline">Cancele quando quiser</span>
          <Link href="#planos" className="text-primary font-semibold hover:underline ml-1">
            Ver planos →
          </Link>
        </div>
      </div>

      {/* header */}
      <header className="border-b border-zinc-800 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <HairClipper className="absolute w-8 top-4 right-32 text-white animate-sway" />
          <Comb className="absolute w-12 top-3 right-12 text-white animate-float" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground relative overflow-hidden">
              B
              <ScissorsIcon className="absolute -bottom-1 -right-1 w-3 text-primary-foreground/30" />
            </div>
            <span className="text-lg font-bold text-white">BarberPlan</span>
          </div>
          <div className="flex items-center gap-4">
            <SaasLogin />
            {user && user.plan !== "free" ? (
              <Link
                href="/admin"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Acessar
              </Link>
            ) : user ? (
              <Link
                href="#planos"
                className="text-sm text-primary hover:opacity-80 transition-opacity font-medium"
              >
                Escolher Plano
              </Link>
            ) : (
              <Link
                href="#planos"
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Planos
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section ref={heroRef} className="overflow-hidden relative bg-zinc-950">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none hidden lg:block">
            <BarberChair className="absolute w-16 -top-4 right-[15%] text-white animate-float" style={{ animationDelay: "-2s" }} />
            <Mustache className="absolute w-20 top-[20%] left-[5%] text-white animate-sway" style={{ animationDelay: "-1s" }} />
            <Comb className="absolute w-24 bottom-[15%] right-[8%] text-white animate-drift" style={{ animationDelay: "-3s" }} />
            <StraightRazor className="absolute w-14 bottom-[30%] left-[3%] text-white animate-sway" style={{ animationDelay: "-2.5s" }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="gsap-hero inline-flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1 text-xs font-medium text-zinc-400 mb-6">
                  <ScissorsIcon className="size-3 text-zinc-400" />
                  Sistema completo para barbearias
                </div>
                <h1 className="gsap-hero text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                  Gestão inteligente para sua{" "}
                  <span className="text-primary">barbearia</span>
                </h1>
                <p className="gsap-hero mt-5 text-lg text-zinc-400 max-w-xl leading-relaxed">
                  Agendamento online, gestão de clientes, controle financeiro e
                  lembretes via WhatsApp. Sua barbearia no piloto automático.
                </p>
                <div className="gsap-hero mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="#planos"
                    className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    Ver Planos e Preços
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
                  <BarberPole className="h-44 w-auto animate-spin-slow" />
                  <Comb className="w-28 h-auto animate-float" style={{ animationDelay: "-1s" }} />
                  <Mustache className="w-24 h-auto animate-sway" style={{ animationDelay: "-2s" }} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <ScissorsIcon className="size-8 text-primary" />
                  </div>
                </div>
                <ShavingBrush className="absolute w-8 -top-3 -right-3 text-white/20 animate-float" style={{ animationDelay: "-3.5s" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== DESTAQUES ===== */}
        <section ref={destaquesRef} className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                DESTAQUES
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Tudo em um só lugar
              </h2>
              <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
                Três pilares que fazem sua barbearia funcionar no piloto automático.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                  {
                    title: "Agendamento Online",
                    desc: "Clientes agendam 24h pelo link da sua barbearia. Sem telefonemas, sem atrito. Escolhem barbeiro, serviço e horário em segundos.",
                    icon: Calendar,
                  },
                  {
                    title: "Gestão de Clientes",
                    desc: "Histórico completo de cada cliente. Saiba o que ele já fez, quanto gastou e quando voltou. Fidelização na palma da mão.",
                    icon: Users,
                  },
                  {
                    title: "Controle Financeiro",
                    desc: "Relatórios de faturamento, comissões, despesas e métodos de pagamento. Saiba exatamente quanto entrou no caixa.",
                    icon: DollarSign,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="gsap-card rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 relative group hover:border-zinc-700 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== O QUE VOCÊ RECEBE ===== */}
        <section ref={entregaveisRef} className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                ENTREGÁVEIS
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                O que você vai receber
              </h2>
              <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
                Resultados concretos, entregáveis claros e sem surpresa no escopo.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Smartphone, label: "Página de agendamento responsiva" },
                { icon: Globe, label: "Link exclusivo da sua barbearia" },
                { icon: Clock, label: "Agenda sincronizada em tempo real" },
                { icon: MessageCircle, label: "Lembretes automáticos via WhatsApp" },
                { icon: Shield, label: "Dados seguros com criptografia SSL" },
                { icon: Zap, label: "Painel admin rápido e intuitivo" },
                { icon: Repeat, label: "Histórico completo de clientes" },
                { icon: Headphones, label: "Suporte via WhatsApp para dúvidas" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="gsap-card flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 group hover:border-zinc-700 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <span className="text-sm text-zinc-300 leading-snug">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== COMO FUNCIONA ===== */}
        <section ref={processoRef} className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                PROCESSO
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Como este projeto acontece
              </h2>
              <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
                Processo cristalino, com marcos e aprovações a cada etapa.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  num: "01",
                  title: "Cadastro",
                  desc: "Crie sua conta grátis em menos de 2 minutos. Sem cartão de crédito.",
                },
                {
                  num: "02",
                  title: "Setup",
                  desc: "Configure barbeiros, serviços e horários no painel admin.",
                },
                {
                  num: "03",
                  title: "Publicação",
                  desc: "Pronto! Sua página de agendamento já está no ar com link exclusivo.",
                },
                {
                  num: "04",
                  title: "Operação",
                  desc: "Clientes agendam online. Você recebe notificações e confirmações automáticas.",
                },
                {
                  num: "05",
                  title: "Crescimento",
                  desc: "Acompanhe relatórios, atraia mais clientes e expanda suas unidades.",
                },
              ].map((step) => (
                <div key={step.num} className="gsap-card text-center relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">{step.num}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PARA QUEM SERVE ===== */}
        <section ref={publicoRef} className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                PÚBLICO
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Para quem serve
              </h2>
              <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
                Sabemos exatamente quando e como esse serviço agrega valor.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Barbearia Individual",
                  desc: "Barbeiro autônomo que quer profissionalizar o agendamento e parar de perder clientes por telefone.",
                  icon: ScissorsIcon,
                },
                {
                  title: "Barbearia em Crescimento",
                  desc: "Equipe com 2 a 5 barbeiros que precisa de agenda compartilhada, controle financeiro e relatórios.",
                  icon: Store,
                },
                {
                  title: "Rede ou Franquia",
                  desc: "Múltiplas unidades gerenciadas em um só painel. Dados consolidados, visão estratégica do negócio.",
                  icon: Building2,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="gsap-card rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 relative group hover:border-zinc-700 transition-colors">
                    <Icon className="size-10 text-primary mb-5" />
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== PLANOS ===== */}
        <section ref={planosRef} id="planos" className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                INVESTIMENTO
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Menos de <span className="text-primary">R$1 por dia</span> pra sua barbearia decolar
              </h2>
              <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
                Plano anual com <span className="text-primary font-semibold">15% de desconto</span>. Cancele quando quiser, sem multa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {plans.map((plan, idx) => {
                const CornerIcon = [Mustache, BarberChair][idx];
                return (
                  <div
                    key={plan.name}
                    className={`gsap-card rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 ${
                      plan.highlight
                        ? "border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950"
                        : "border-primary/40 bg-zinc-900 ring-1 ring-primary/30"
                    }`}
                  >
                    <CornerIcon className={`absolute w-24 opacity-[0.04] -bottom-6 -right-6 text-white pointer-events-none`} />

                    {plan.highlight && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-zinc-700 tracking-wider">
                          {plan.highlight}
                        </span>
                      </div>
                    )}

                    {plan.trial && (
                      <div className="relative z-10">
                        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center py-2.5">
                          <span className="text-sm font-bold tracking-wide">🎯 14 DIAS GRÁTIS</span>
                          <span className="text-xs ml-2 opacity-80">— sem compromisso</span>
                        </div>
                      </div>
                    )}

                    <div className="p-8 pt-6 relative z-10">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                        <p className="text-sm text-zinc-500 mt-1">{plan.desc}</p>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-end gap-2">
                          <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                            R${plan.monthly.toFixed(0)},{String(Math.round((plan.monthly % 1) * 100)).padStart(2, "0")}
                          </span>
                          <span className="text-zinc-500 mb-1">/mês</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-zinc-500">ou</span>
                          <span className="text-base font-bold text-primary">R${plan.annual}/ano</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                            economize 15%
                          </span>
                        </div>
                        {plan.trial && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                            <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Teste grátis de 14 dias. Sem cartão de crédito.
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                            <Check className="size-4 text-primary mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/checkout?plan=${plan.slug}&billing=${plan.trial ? "trial" : "monthly"}`}
                        className={`w-full flex items-center justify-center gap-2 font-bold px-5 py-3.5 rounded-xl text-sm transition-all ${
                          plan.highlight
                            ? "border-2 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600"
                            : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
                        }`}
                      >
                        {plan.trial ? "Testar Grátis por 14 Dias" : "Assinar Agora"}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* trust bar */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-600">
                <span className="flex items-center gap-1.5"><svg className="size-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Cancele quando quiser</span>
                <span className="flex items-center gap-1.5"><svg className="size-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Suporte via WhatsApp</span>
                <span className="flex items-center gap-1.5"><svg className="size-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> Dados seguros (SSL)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
                <ScissorsIcon className="size-3.5 text-primary" />
                FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Perguntas frequentes
              </h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {faqItems.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-zinc-200">{item.q}</span>
                    <ChevronDown
                      className={`size-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section ref={ctaRef} className="relative overflow-hidden bg-zinc-950 border-t border-zinc-800">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none hidden sm:block">
            <BarberChair className="absolute w-20 top-[5%] left-[10%] text-white animate-float" style={{ animationDelay: "-1s" }} />
            <Comb className="absolute w-24 top-[10%] right-[15%] text-white animate-drift" style={{ animationDelay: "-3s" }} />
            <Mustache className="absolute w-28 bottom-[15%] left-[20%] text-white animate-sway" style={{ animationDelay: "-2s" }} />
            <ScissorsIcon className="absolute w-10 top-[40%] left-[40%] text-white animate-sway" style={{ animationDelay: "-1.5s" }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center relative z-10">
            <h2 className="gsap-card text-3xl sm:text-4xl font-bold text-white mb-4">
              Pronto para transformar sua barbearia?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Cadastre-se grátis e comece a receber agendamentos online em
              minutos.
            </p>
            <Link
              href="#planos"
              className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Ver Planos e Preços
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="border-t border-zinc-800 py-8 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <ScissorsIcon className="absolute w-6 bottom-4 right-[20%] text-white animate-sway" style={{ animationDelay: "-1s" }} />
          <Comb className="absolute w-10 top-2 left-[15%] text-white animate-float" style={{ animationDelay: "-2s" }} />
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
