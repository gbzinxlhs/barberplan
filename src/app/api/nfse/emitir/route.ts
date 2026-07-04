import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";
import { emitirNfse } from "@/lib/gerando-nota-facil";

export async function POST(request: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json();
  const { appointmentId } = body;

  if (!appointmentId) {
    return NextResponse.json({ error: "appointmentId é obrigatório" }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: auth.user.tenantId } });
  if (!tenant || !tenant.nfseEnabled || !tenant.nfseToken) {
    return NextResponse.json({ error: "NFS-e não configurada" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true, customer: true },
  });
  if (!appointment) return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
  if (appointment.status !== "completed") return NextResponse.json({ error: "Apenas agendamentos finalizados podem gerar NFS-e" }, { status: 400 });
  if (appointment.nfseId) return NextResponse.json({ error: "NFS-e já emitida para este agendamento" }, { status: 400 });

  try {
    const result = await emitirNfse({
      token: tenant.nfseToken,
      clienteNome: appointment.customer.name,
      clienteDocumento: appointment.customer.phone || "",
      descricao: appointment.service.name,
      valor: appointment.service.price,
    });

    const nfseData = result?.data || result;

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        nfseId: nfseData?.id || nfseData?.nota_id || null,
        nfseNumero: nfseData?.numero || nfseData?.numero_nfse || null,
        nfsePdfUrl: nfseData?.pdf_url || nfseData?.url_pdf || null,
      },
    });

    return NextResponse.json({ success: true, nfse: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao emitir NFS-e" }, { status: 500 });
  }
}
