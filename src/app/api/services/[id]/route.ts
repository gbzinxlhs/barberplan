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
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });

  if (auth.user.tenantId !== existing.tenantId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await request.json();
  const allowedFields = {
    name: body.name,
    description: body.description,
    price: body.price,
    duration: body.duration,
    category: body.category,
    active: body.active,
  };
  const filteredData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
  );
  const service = await prisma.service.update({ where: { id }, data: filteredData });
  return NextResponse.json({ service });
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
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });

  if (auth.user.tenantId !== existing.tenantId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
