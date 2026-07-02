import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "super_admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      saasUsers: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          plan: true,
          planExpiresAt: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json({ tenants });
}
