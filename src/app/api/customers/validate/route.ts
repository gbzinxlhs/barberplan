import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { tenantSlug, name, phone } = await request.json();

    if (!tenantSlug || !name || !phone) {
      return NextResponse.json({ error: "tenantSlug, name and phone required" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    let customer = await prisma.customer.findUnique({
      where: { phone_tenantId: { phone, tenantId: tenant.id } },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name, phone, tenantId: tenant.id },
      });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
