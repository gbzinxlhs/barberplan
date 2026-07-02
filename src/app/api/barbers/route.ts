import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const body = await request.json();
    const { tenantSlug, name, bio } = body;
    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    const barber = await prisma.barber.create({
      data: { name, bio, tenantId: tenant.id },
    });
    return NextResponse.json({ barber }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
