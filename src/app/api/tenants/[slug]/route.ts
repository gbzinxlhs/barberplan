import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id, active: true },
    orderBy: { category: "asc" },
  });

  const barbers = await prisma.barber.findMany({
    where: { tenantId: tenant.id, active: true },
  });

  const workingHours = await prisma.workingHour.findMany({
    where: { tenantId: tenant.id },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json({ tenant, services, barbers, workingHours });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  if (auth.user.tenantId !== tenant.id) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.tenant.update({ where: { slug }, data: body });
  return NextResponse.json({ tenant: updated });
}
