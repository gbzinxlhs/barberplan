"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ScissorsIcon, BarberPole, Comb, Mustache } from "@/components/barber-icons";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  DollarSign,
  Settings,
  ChevronRight,
  LogOut,
  Globe,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { useSaasUser } from "@/contexts/saas-user";

const navItems = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "agendamentos", label: "Agendamentos", icon: Calendar },
  { href: "servicos", label: "Serviços", icon: Scissors },
  { href: "barbeiros", label: "Barbeiros", icon: Users },
  { href: "horarios", label: "Horários", icon: Clock },
  { href: "financeiro", label: "Financeiro", icon: DollarSign },
  { href: "configuracoes", label: "Configurações", icon: Settings },
];

export default function TenantAdminLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const tenantSlug = params.tenant as string;
  const { user, logout } = useSaasUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!tenantSlug) return;
    fetch(`/api/tenants/${tenantSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tenant) {
          setTenant(data.tenant);
          if (user && user.tenantId && user.tenantId !== data.tenant.id) {
            router.push("/admin");
          } else {
            setAuthorized(true);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/admin");
      });
  }, [tenantSlug, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized || !tenant) return null;

  const basePath = `/${tenantSlug}/admin`;
  const currentLabel = navItems.find((i) => pathname === `${basePath}/${i.href}`)?.label
    || (pathname === basePath ? "Dashboard" : "");

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0`}>
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-2.5">
            <img src="/logo-barber-plan.png" alt="BarberPlan" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <span className="text-base font-bold text-white">BarberPlan</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Admin</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = `${basePath}/${item.href}`;
            const isActive = pathname === href || (item.href === "dashboard" && pathname === basePath);
            return (
              <Link
                key={item.href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="size-3 ml-auto text-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/50">
            <Comb className="w-5 h-auto opacity-50" />
            <div className="text-xs text-zinc-500">
              <p className="text-zinc-400 font-medium">{tenant.name}</p>
              <p className="capitalize">{user?.plan?.replace("_", " ") || ""}</p>
            </div>
          </div>
          <a
            href={`/${tenantSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-xs text-zinc-500 hover:text-primary hover:bg-zinc-800/50 transition-all"
          >
            <Globe className="size-3" />
            Ver site público
          </a>
          <button
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 transition-all"
          >
            <LogOut className="size-3" />
            Sair
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 opacity-[0.04] pointer-events-none overflow-hidden h-32">
          <Mustache className="absolute w-16 -bottom-2 -right-2 text-white" />
          <BarberPole className="absolute w-4 h-20 -bottom-4 -left-2 text-white" />
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-2 -ml-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 text-sm text-zinc-500 min-w-0">
            <span className="text-zinc-900 font-medium truncate">{tenant.name}</span>
            <span className="text-zinc-300 shrink-0">/</span>
            <span className="text-zinc-400 truncate">{currentLabel}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {user && (
              <span className="hidden sm:block text-xs text-zinc-400">{user.name} {user.surname}</span>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
