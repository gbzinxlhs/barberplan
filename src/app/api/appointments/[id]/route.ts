import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";
import { sendWhatsApp, formatDateTime } from "@/lib/whatsapp";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true, barber: true, customer: true, tenant: true },
  });
  if (!existing) return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });

  if (auth.user.tenantId !== existing.tenantId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await request.json();
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: body.status },
  });

  const statusLabels: Record<string, string> = {
    confirmed: "confirmado ✅",
    cancelled: "cancelado ❌",
    completed: "finalizado ✅",
    pending: "pendente ⏳",
  };

  const label = statusLabels[body.status] || body.status;
  const dateStr = formatDateTime(existing.startTime);

  const msg = [
    `🪒 *${existing.tenant.name}*`,
    `Seu agendamento foi *${label}*!`,
    ``,
    `💇 Serviço: ${existing.service?.name || "—"}`,
    `👤 Barbeiro: ${existing.barber?.name || "—"}`,
    `📅 Data: ${dateStr}`,
  ].join("\n");

  sendWhatsApp(existing.customer.phone, msg);

  return NextResponse.json({ appointment });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });

  if (auth.user.tenantId !== existing.tenantId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
