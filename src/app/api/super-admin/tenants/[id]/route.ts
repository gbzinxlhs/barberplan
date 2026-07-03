import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "super_admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;

  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) {
    return NextResponse.json({ error: "Barbearia não encontrada" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.workingHour.deleteMany({ where: { tenantId: id } });
    await tx.transaction.deleteMany({ where: { tenantId: id } });
    await tx.appointment.deleteMany({ where: { tenantId: id } });
    await tx.product.deleteMany({ where: { tenantId: id } });
    await tx.customer.deleteMany({ where: { tenantId: id } });
    await tx.barber.deleteMany({ where: { tenantId: id } });
    await tx.service.deleteMany({ where: { tenantId: id } });
    await tx.saasUser.updateMany({ where: { tenantId: id }, data: { tenantId: null } });
    await tx.tenant.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}
