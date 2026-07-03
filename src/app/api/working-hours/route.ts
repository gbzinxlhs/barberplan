import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json({ error: "tenantId é obrigatório" }, { status: 400 });
  }

  const hours = await prisma.workingHour.findMany({
    where: { tenantId },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json({ hours });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { tenantId, hours } = body;

  if (!tenantId || !Array.isArray(hours)) {
    return NextResponse.json({ error: "tenantId e hours são obrigatórios" }, { status: 400 });
  }

  await prisma.workingHour.deleteMany({ where: { tenantId } });

  if (hours.length > 0) {
    await prisma.workingHour.createMany({
      data: hours.map((h: { dayOfWeek: number; startTime: string; endTime: string; isWorkingDay: boolean }) => ({
        tenantId,
        dayOfWeek: h.dayOfWeek,
        startTime: h.startTime,
        endTime: h.endTime,
        isWorkingDay: h.isWorkingDay,
      })),
    });
  }

  const updated = await prisma.workingHour.findMany({
    where: { tenantId },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json({ hours: updated });
}
