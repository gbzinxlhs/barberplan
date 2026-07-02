import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const currentId = searchParams.get("currentId");

  if (!slug) {
    return NextResponse.json({ error: "Slug é obrigatório" }, { status: 400 });
  }

  const normalized = slug
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) {
    return NextResponse.json({ available: false, error: "Slug inválido" });
  }

  const existing = await prisma.tenant.findUnique({ where: { slug: normalized } });

  const available = !existing || existing.id === currentId;

  return NextResponse.json({ available, slug: normalized });
}
