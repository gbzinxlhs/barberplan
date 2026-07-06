import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET(request: Request) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
  }

  const user = await prisma.saasUser.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ user: null, tenant: null });
  }

  let tenant = null;
  if (user.tenantId) {
    tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
  }

  const planActive =
    user.plan !== "free" &&
    (!user.planExpiresAt || user.planExpiresAt > new Date());

  return NextResponse.json({ user, tenant, planActive });
}
