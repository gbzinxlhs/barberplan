"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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

  useEffect(() => {
    if (!user || !tenant?.slug) {
      router.push("/");
      return;
    }
    const slug = tenant.slug;
    if (pathname.startsWith("/admin/setup") || pathname.startsWith("/admin/cadastro")) return;
    const targetPath = pathname === "/admin" || pathname === "/admin/"
      ? `/${slug}/admin`
      : `/${slug}${pathname}`;
    if (targetPath !== pathname) {
      router.replace(targetPath);
    }
  }, [user, tenant, pathname, router]);

  if (!user || !tenant?.slug) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-zinc-500">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
