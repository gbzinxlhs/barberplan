import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get("tenant") || "brooklyn";
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  const barbers = await prisma.barber.findMany({
    where: { tenantId: tenant.id },
  });
  return NextResponse.json({ barbers });
}

export async function POST(request: Request) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tenantSlug, name, bio } = body;
    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    if (auth.user.tenantId !== tenant.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const barber = await prisma.barber.create({
      data: { name, bio, tenantId: tenant.id },
    });
    return NextResponse.json({ barber }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
