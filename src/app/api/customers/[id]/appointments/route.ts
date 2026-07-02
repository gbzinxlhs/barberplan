import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { customerId: id, status: { not: "cancelled" } },
    include: {
      barber: true,
      service: true,
    },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json({ appointments });
}
