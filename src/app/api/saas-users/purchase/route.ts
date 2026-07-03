import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDefaultWorkingHours } from "@/lib/working-hours";

function generateSlug(name: string, surname: string): string {
  const base = `${name}-${surname}`
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, plan, billing } = body;

  if (!email || !plan) {
    return NextResponse.json({ error: "Email e plano são obrigatórios" }, { status: 400 });
  }

  if (!["starter", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  const user = await prisma.saasUser.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado. Crie uma conta primeiro." }, { status: 404 });
  }

  const isTrial = billing === "trial";

  // create tenant if user doesn't have one yet
  let tenantId = user.tenantId;
  if (!tenantId) {
    const slug = generateSlug(user.name, user.surname);
    const tenant = await prisma.tenant.create({
      data: {
        name: `${user.name} ${user.surname}`,
        slug,
        subdomain: slug,
        phone: user.phone,
        primaryColor: "#22c55e",
      },
    });
    await createDefaultWorkingHours(tenant.id);
    tenantId = tenant.id;
  }

  if (isTrial) {
    if (plan !== "starter") {
      return NextResponse.json({ error: "Trial disponível apenas para o plano Starter" }, { status: 400 });
    }
    const now = new Date();
    const planExpiresAt = new Date(now.setDate(now.getDate() + 14));

    const updated = await prisma.saasUser.update({
      where: { email },
      data: { plan: "starter_trial", planExpiresAt, tenantId },
    });

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    return NextResponse.json({ user: updated, tenant });
  }

  if (!["monthly", "annual"].includes(billing)) {
    return NextResponse.json({ error: "Ciclo de cobrança inválido" }, { status: 400 });
  }

  const now = new Date();
  let planExpiresAt: Date;

  if (billing === "monthly") {
    planExpiresAt = new Date(now.setMonth(now.getMonth() + 1));
  } else {
    planExpiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
  }

  const updated = await prisma.saasUser.update({
    where: { email },
    data: { plan, planExpiresAt, tenantId },
  });

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  return NextResponse.json({ user: updated, tenant });
}
