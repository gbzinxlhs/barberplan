import Link from "next/link";
import { getTenantBySlug } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ScissorsIcon,
  Comb,
  Mustache,
  BarberPole,
  BarberChair,
  StraightRazor,
  HairClipper,
  ShavingBrush,
} from "@/components/barber-icons";

const categoryIcons: Record<string, React.ReactNode> = {
  corte: <ScissorsIcon className="w-full h-full" />,
  barba: <Comb className="w-full h-full" />,
  combos: <BarberPole className="w-full h-full" />,
  depilacao: <StraightRazor className="w-full h-full" />,
  pele: <ShavingBrush className="w-full h-full" />,
  cabelo: <HairClipper className="w-full h-full" />,
  sobrancelha: <Mustache className="w-full h-full" />,
};

const categoryLabels: Record<string, string> = {
  corte: "Corte",
  barba: "Barba",
  combos: "Combos",
  depilacao: "Depilação",
  pele: "Pele",
  cabelo: "Cabelo",
  sobrancelha: "Sobrancelha",
};

const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.051 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const HERO_DEFAULT_IMAGE = "https://unsplash.com/photos/41HCQN43PwU/download?force=true&w=600";

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) notFound();

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id, active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const barbers = await prisma.barber.findMany({
    where: { tenantId: tenant.id, active: true },
  });

  const workingHours = await prisma.workingHour.findMany({
    where: { tenantId: tenant.id },
    orderBy: { dayOfWeek: "asc" },
  });

  const categories = [...new Set(services.map((s) => s.category))];
  const pc = tenant.primaryColor;
  const phoneDigits = (tenant.whatsapp || tenant.phone || "").replace(/\D/g, "");

  const navLinks = [
    { href: "#servicos", label: "SERVIÇOS" },
    ...(workingHours.length > 0 ? [{ href: "#horarios", label: "HORÁRIOS" }] : []),
    ...(barbers.length > 0 ? [{ href: "#equipe", label: "EQUIPE" }] : []),
    { href: "#localizacao", label: "LOCALIZAÇÃO" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ===== TOP BAR ===== */}
      <div className="hidden sm:block border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            {tenant.address && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="size-3" />
                {tenant.address}
              </span>
            )}
            {tenant.phone && (
              <span className="flex items-center gap-1.5">
                <PhoneIcon className="size-3" />
                {tenant.phone}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {tenant.instagram && (
              <a href={`https://instagram.com/${tenant.instagram.replace("@", "")}`} target="_blank" className="hover:text-white transition-colors">
                <InstagramIcon className="size-3.5" />
              </a>
            )}
            {phoneDigits && (
              <a href={`https://wa.me/${phoneDigits}`} target="_blank" className="hover:text-white transition-colors">
                <WhatsAppIcon className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/${slug}`} className="flex items-center gap-2.5">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: pc }}>
                {tenant.name[0]}
              </div>
            )}
            <span className="text-base font-bold text-white">{tenant.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-xs font-medium text-zinc-400 hover:text-white tracking-wider transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <Link
            href={`/${slug}/agendar`}
            className="inline-flex items-center gap-2 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            style={{ backgroundColor: pc }}
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 2v4M16 2v4M3 10h18M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <path d="M15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
              <path d="M18 22v-2" />
            </svg>
            AGENDAR HORÁRIO
          </Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none hidden sm:block">
          <BarberChair className="absolute w-28 -top-8 right-[18%] text-white animate-float" style={{ animationDelay: "-2s" }} />
          <BarberPole className="absolute w-8 h-36 top-[15%] left-[5%] text-white animate-spin-slow" />
          <Mustache className="absolute w-24 bottom-[20%] left-[12%] text-white animate-sway" style={{ animationDelay: "-1s" }} />
          <StraightRazor className="absolute w-20 bottom-[35%] right-[6%] text-white animate-drift" style={{ animationDelay: "-3s" }} />
        </div>

        <div className="absolute inset-0 opacity-[0.06]" style={{ background: `linear-gradient(135deg, ${pc}22 0%, transparent 50%, ${pc}11 100%)` }} />

        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                O estilo que você merece{" "}
                <span style={{ color: pc }}>pertinho de você</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg">
                Venha nos visitar e conhecer os nossos serviços e produtos. Agende seu horário online.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  href={`/${slug}/agendar`}
                  className="inline-flex items-center gap-2 text-white font-bold px-7 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-xl"
                  style={{ backgroundColor: pc }}
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 2v4M16 2v4M3 10h18M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                    <path d="M15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
                    <path d="M18 22v-2" />
                  </svg>
                  QUERO AGENDAR UM HORÁRIO
                </Link>
                {phoneDigits && (
                  <a href={`https://wa.me/${phoneDigits}`} target="_blank" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors font-medium">
                    <WhatsAppIcon className="size-4" />
                    Fale Conosco
                  </a>
                )}
              </div>
              <p className="mt-6 text-xs text-zinc-600">
                Corre para agendar o seu corte agora mesmo.
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
                <img
                  src={tenant.logo || HERO_DEFAULT_IMAGE}
                  alt={tenant.name}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center mb-14">
          <div className="w-10 h-10 mx-auto mb-4 opacity-40">
            <Mustache />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Nossos Serviços</h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
            Do clássico ao moderno, temos o cuidado ideal para você.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-zinc-500">Nenhum serviço disponível no momento.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catServices = services.filter((s) => s.category === cat);
              if (catServices.length === 0) return null;
              const IconComponent = categoryIcons[cat] || <ScissorsIcon className="w-full h-full" />;
              return (
                <div key={cat} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center p-2.5 mb-4" style={{ backgroundColor: pc + "18" }}>
                    <div style={{ color: pc }}>{IconComponent}</div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">{categoryLabels[cat] || cat}</h3>
                  <div className="space-y-2">
                    {catServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-zinc-300">{service.name}</span>
                        <span className="text-sm font-bold" style={{ color: pc }}>
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== EQUIPE ===== */}
      {barbers.length > 0 && (
        <section id="equipe" className="border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
            <div className="text-center mb-14">
              <div className="w-10 h-10 mx-auto mb-4 opacity-40">
                <Mustache />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Nossa Equipe</h2>
              <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                Profissionais dedicados a cuidar de você.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber, idx) => {
                const initials = barber.name.split(" ").map(n => n[0]).join("").slice(0, 2);
                const avColors = [
                  "from-blue-500 to-blue-700",
                  "from-emerald-500 to-emerald-700",
                  "from-purple-500 to-purple-700",
                  "from-amber-500 to-amber-700",
                  "from-rose-500 to-rose-700",
                ];
                return (
                  <div key={barber.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center group hover:border-zinc-700 transition-all">
                    {barber.photo ? (
                      <img src={barber.photo} alt={barber.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-2 ring-zinc-700" />
                    ) : (
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avColors[idx % avColors.length]} flex items-center justify-center text-xl font-bold text-white mx-auto mb-4 ring-2 ring-zinc-700`}>
                        {initials}
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-white">{barber.name}</h3>
                    {barber.bio && <p className="text-sm text-zinc-500 mt-1">{barber.bio}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== HORÁRIOS ===== */}
      {workingHours.length > 0 && (
        <section id="horarios" className="border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
            <div className="text-center mb-14">
              <div className="w-10 h-10 mx-auto mb-4 opacity-40">
                <Mustache />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Horários de Funcionamento</h2>
              <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                Confira nossos horários e venha nos visitar.
              </p>
            </div>
            <div className="max-w-md mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              {Array.from({ length: 7 }, (_, i) => {
                const wh = workingHours.find((w) => w.dayOfWeek === i);
                const isToday = new Date().getDay() === i;
                return (
                  <div key={i} className={`flex items-center justify-between px-6 py-3.5 border-b border-zinc-800/50 last:border-0 ${isToday ? "bg-zinc-800/30" : ""}`}>
                    <span className={`text-sm ${isToday ? "text-white font-semibold" : "text-zinc-300"}`}>
                      {daysOfWeek[i]}
                      {isToday && <span className="ml-2 text-[10px] uppercase tracking-wider font-bold" style={{ color: pc }}>Hoje</span>}
                    </span>
                    {wh && wh.isWorkingDay ? (
                      <span className="text-sm text-zinc-400">{wh.startTime} — {wh.endTime}</span>
                    ) : (
                      <span className="text-sm text-zinc-600">Fechado</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== LOCALIZAÇÃO / CONTATO ===== */}
      <section id="localizacao" className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center mb-14">
            <div className="w-10 h-10 mx-auto mb-4 opacity-40">
              <Mustache />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Onde nos encontrar</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
              Estamos prontos para receber você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-5">
              {tenant.address && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pc + "15", color: pc }}>
                    <MapPinIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Endereço</p>
                    <p className="text-sm text-zinc-300">{tenant.address}</p>
                  </div>
                </div>
              )}
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pc + "15", color: pc }}>
                    <PhoneIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Telefone</p>
                    <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">{tenant.phone}</p>
                  </div>
                </a>
              )}
              {phoneDigits && (
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pc + "15", color: pc }}>
                    <WhatsAppIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">WhatsApp</p>
                    <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">Fale conosco</p>
                  </div>
                </a>
              )}
              {tenant.instagram && (
                <a href={`https://instagram.com/${tenant.instagram.replace("@", "")}`} target="_blank" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pc + "15", color: pc }}>
                    <InstagramIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Instagram</p>
                    <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">{tenant.instagram}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                  <ScissorsIcon />
                </div>
                <p className="text-sm text-zinc-500">Agende seu horário e venha nos conhecer!</p>
                <Link
                  href={`/${slug}/agendar`}
                  className="inline-flex items-center gap-2 text-white font-bold text-xs px-5 py-2.5 rounded-lg mt-4 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: pc }}
                >
                  Agendar Horário
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              {tenant.logo ? (
                <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: pc }}>
                  {tenant.name[0]}
                </div>
              )}
              <span className="text-sm font-bold text-white">{tenant.name}</span>
            </div>

            <div className="flex items-center gap-4">
              {tenant.instagram && (
                <a href={`https://instagram.com/${tenant.instagram.replace("@", "")}`} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                  <InstagramIcon className="size-4" />
                </a>
              )}
              {phoneDigits && (
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                  <WhatsAppIcon className="size-4" />
                </a>
              )}
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="text-zinc-500 hover:text-white transition-colors text-xs flex items-center gap-1.5">
                  <PhoneIcon className="size-3.5" />
                  {tenant.phone}
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
