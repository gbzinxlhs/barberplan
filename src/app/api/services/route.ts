import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get("tenant") || "brooklyn";
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id },
    orderBy: { category: "asc" },
  });
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tenantSlug, name, price, duration, category } = body;
    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    if (auth.user.tenantId !== tenant.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const service = await prisma.service.create({
      data: { name, price: Number(price), duration: Number(duration), category, tenantId: tenant.id },
    });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
