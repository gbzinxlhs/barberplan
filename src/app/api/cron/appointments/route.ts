import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppIfPro, formatDateTime } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const results: Record<string, number> = {
    completed: 0,
    cancelledNoShow: 0,
    cancelledPending: 0,
    remindersSent: 0,
  };

  const completed = await prisma.appointment.updateMany({
    where: { status: "confirmed", endTime: { lte: now } },
    data: { status: "completed" },
  });
  results.completed = completed.count;

  const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const noShows = await prisma.appointment.updateMany({
    where: { status: "confirmed", startTime: { lte: thirtyMinAgo } },
    data: { status: "cancelled" },
  });
  results.cancelledNoShow = noShows.count;

  const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const pendingExpired = await prisma.appointment.updateMany({
    where: { status: "pending", startTime: { lte: fifteenMinAgo } },
    data: { status: "cancelled" },
  });
  results.cancelledPending = pendingExpired.count;

  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
  const reminders = await prisma.appointment.findMany({
    where: {
      status: "confirmed",
      reminderSent: false,
      startTime: {
        gte: new Date(now.getTime() + 50 * 60 * 1000),
        lte: new Date(now.getTime() + 70 * 60 * 1000),
      },
    },
    include: { service: true, barber: true, customer: true, tenant: true },
  });

  for (const apt of reminders) {
    const dateStr = formatDateTime(apt.startTime);
    const msg = [
      `⏰ *Lembrete!* Seu horário é em aproximadamente 1 hora.`,
      ``,
      `🪒 *${apt.tenant.name}*`,
      `💇 Serviço: ${apt.service?.name || "—"}`,
      `👤 Barbeiro: ${apt.barber?.name || "—"}`,
      `📅 Horário: ${dateStr}`,
      ``,
      `Chegando lá! 🫱🏻‍🫲🏾`,
    ].join("\n");

    await sendWhatsAppIfPro(apt.tenantId, apt.customer.phone, msg);

    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent: true },
    });
    results.remindersSent++;
  }

  return NextResponse.json({ ok: true, now: now.toISOString(), results });
}
