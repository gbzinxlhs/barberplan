import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tenantSlug,
      barberId,
      serviceId,
      customerName,
      customerPhone,
      startTime,
      endTime,
    } = body;

    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    let customer = await prisma.customer.findUnique({
      where: { phone_tenantId: { phone: customerPhone, tenantId: tenant.id } },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          tenantId: tenant.id,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { name: customerName, totalVisits: { increment: 1 } },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "confirmed",
        tenantId: tenant.id,
        barberId,
        serviceId,
        customerId: customer.id,
      },
    });

    return NextResponse.json({ appointment, customer }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get("tenant");
  const date = searchParams.get("date");

  if (!tenantSlug) {
    return NextResponse.json({ error: "Tenant slug required" }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const where: any = { tenantId: tenant.id };
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.startTime = { gte: start, lte: end };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      barber: true,
      service: true,
      customer: true,
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ appointments });
}
