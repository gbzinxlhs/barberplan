import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function GET(request: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: {
      tenantId: auth.user.tenantId,
      nfseId: { not: null },
    },
    include: { service: true, customer: true },
    orderBy: { startTime: "desc" },
  });

  const nfseList = appointments.map((apt) => ({
    id: apt.nfseId,
    numero: apt.nfseNumero,
    pdfUrl: apt.nfsePdfUrl,
    cliente: apt.customer.name,
    servico: apt.service.name,
    valor: apt.service.price,
    data: apt.startTime,
    status: "emitida",
  }));

  return NextResponse.json({ notas: nfseList });
}
