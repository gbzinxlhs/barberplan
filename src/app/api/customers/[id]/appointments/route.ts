import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

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
