import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppIfPro, formatDateTime } from "@/lib/whatsapp";

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
      paymentMethod,
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
        paymentMethod: paymentMethod || null,
        tenantId: tenant.id,
        barberId,
        serviceId,
        customerId: customer.id,
      },
    });

    const [service, barber] = await Promise.all([
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.barber.findUnique({ where: { id: barberId } }),
    ]);

    const dateStr = formatDateTime(new Date(startTime));
    const methodLabel =
      paymentMethod === "pix" ? "Pix"
      : paymentMethod === "dinheiro" ? "Dinheiro"
      : paymentMethod === "cartao" ? "Cartão"
      : "a confirmar";

    const customerMsg = [
      `✅ *Agendamento Confirmado!*`,
      ``,
      `🪒 *${tenant.name}*`,
      `👤 Barbeiro: ${barber?.name || "—"}`,
      `💇 Serviço: ${service?.name || "—"}`,
      `💰 Valor: R$ ${(service?.price ?? 0).toFixed(2)}`,
      `📅 Data: ${dateStr}`,
      `💳 Pagamento: ${methodLabel}`,
      ``,
      `Nos vemos lá! 🫱🏻‍🫲🏾`,
    ].join("\n");

    sendWhatsAppIfPro(tenant.id, customer.phone, customerMsg);

    const barberShopPhone = tenant.whatsapp || tenant.phone;
    if (barberShopPhone) {
      const barberMsg = [
        `📅 *Novo Agendamento!*`,
        ``,
        `👤 Cliente: ${customer.name}`,
        `📞 Telefone: ${customer.phone}`,
        `💇 Serviço: ${service?.name || "—"}`,
        `👤 Barbeiro: ${barber?.name || "—"}`,
        `📅 Data: ${dateStr}`,
        `💳 Pagamento: ${methodLabel}`,
      ].join("\n");

      sendWhatsAppIfPro(tenant.id, barberShopPhone, barberMsg);
    }

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
  const barberId = searchParams.get("barberId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

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
  if (barberId) {
    where.barberId = barberId;
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        barber: true,
        service: true,
        customer: true,
      },
      orderBy: { startTime: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.appointment.count({ where }),
  ]);

  return NextResponse.json({
    appointments,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
