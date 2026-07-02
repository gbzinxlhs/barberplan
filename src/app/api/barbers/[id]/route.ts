import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const barber = await prisma.barber.update({ where: { id }, data: body });
  return NextResponse.json({ barber });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.barber.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
