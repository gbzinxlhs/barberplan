"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSaasUser } from "@/contexts/saas-user";
import { SaasUserProvider } from "@/contexts/saas-user";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SaasUserProvider>
      <AdminLayoutRedirect>{children}</AdminLayoutRedirect>
    </SaasUserProvider>
  );
}

function AdminLayoutRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, tenant } = useSaasUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user || !tenant) return;
    setReady(true);

    if (pathname.startsWith("/admin/setup") || pathname.startsWith("/admin/cadastro")) return;

    if (!tenant?.slug) {
      router.push("/");
      return;
    }

    const slug = tenant.slug;
    const targetPath = pathname === "/admin" || pathname === "/admin/"
      ? `/${slug}/admin`
      : `/${slug}${pathname}`;
    if (targetPath !== pathname) {
      router.replace(targetPath);
    }
  }, [user, tenant, pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="size-6 text-zinc-400 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
