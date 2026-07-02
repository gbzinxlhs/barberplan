"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import { BarberPole, Mustache, ScissorsIcon } from "@/components/barber-icons";
import { SuperAdminProvider, useSuperAdmin } from "@/contexts/super-admin";

const navItems = [
  { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/tenants", label: "Barbearias", icon: Store },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminProvider>
      <SuperAdminLayoutInner>{children}</SuperAdminLayoutInner>
    </SuperAdminProvider>
  );
}

function SuperAdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useSuperAdmin();

  useEffect(() => {
    if (!loading && !user && pathname !== "/super-admin/login") {
      router.push("/super-admin/login");
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && pathname === "/super-admin/login") {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full">
        <div className="p-5 border-b border-zinc-800">
          <Link href="/super-admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground relative overflow-hidden">
              B
              <ScissorsIcon className="absolute -bottom-1 -right-1 w-2.5 text-primary-foreground/30" />
            </div>
            <div>
              <span className="text-base font-bold text-white">BarberPlan</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Super Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800/50">
            <Shield className="size-4 text-primary" />
            <div className="text-xs text-zinc-500">
              <p className="text-zinc-400 font-medium">Super Admin</p>
              <p className="text-zinc-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/super-admin/login"); }}
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

      <main className="flex-1 ml-64">
        <header className="bg-zinc-900 border-b border-zinc-800 h-16 flex items-center px-6">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Shield className="size-4 text-primary" />
            <span className="text-zinc-200 font-medium">Super Admin</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">
              {navItems.find((i) => i.href === pathname)?.label || "Dashboard"}
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
