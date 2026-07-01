import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json({ tenant, services, barbers });
}
