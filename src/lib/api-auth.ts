import { NextResponse } from "next/server";
import { getAuthUser } from "./auth-saas";

export async function requireOwner(tenantId: string) {
  const auth = await getAuthUser();
  if (!auth) {
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }), user: null, tenant: null };
  }
  if (auth.user.tenantId !== tenantId) {
    return { error: NextResponse.json({ error: "Acesso negado" }, { status: 403 }), user: null, tenant: null };
  }
  return { error: null, user: auth.user, tenant: auth.tenant };
}

export async function requireSuperAdmin() {
  const auth = await getAuthUser();
  if (!auth) {
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }), user: null };
  }
  if (auth.user.role !== "super_admin") {
    return { error: NextResponse.json({ error: "Acesso negado" }, { status: 403 }), user: null };
  }
  return { error: null, user: auth.user };
}
