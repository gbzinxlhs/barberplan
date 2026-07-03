import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-saas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.barber.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Barbeiro não encontrado" }, { status: 404 });

  if (auth.user.tenantId !== existing.tenantId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await request.json();
  const barber = await prisma.barber.update({ where: { id }, data: body });
  return NextResponse.json({ barber });
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
  const existing = await prisma.barber.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Barbeiro não encontrado" }, { status: 404 });

  if (auth.user.tenantId !== existing.tenantId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.barber.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
