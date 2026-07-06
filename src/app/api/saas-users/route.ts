import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function POST(request: Request) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, surname, email, phone } = body;

  if (!name || !surname || !email || !phone) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  const existing = await prisma.saasUser.findUnique({ where: { email } });

  if (existing) {
    const updated = await prisma.saasUser.update({
      where: { email },
      data: { name, surname, phone },
    });
    return NextResponse.json({ user: updated, isNew: false });
  }

  const user = await prisma.saasUser.create({
    data: { name, surname, email, phone },
  });

  return NextResponse.json({ user, isNew: true });
}

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
    return NextResponse.json({ user: null });
  }

  const planActive = user.plan !== "free" && (!user.planExpiresAt || user.planExpiresAt > new Date());

  let tenant = null;
  if (user.tenantId) {
    tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
  }

  return NextResponse.json({
    user,
    tenant,
    planActive,
  });
}
