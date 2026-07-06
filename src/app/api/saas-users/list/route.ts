import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const users = await prisma.saasUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { tenant: true },
  });

  return NextResponse.json({ users });
}
