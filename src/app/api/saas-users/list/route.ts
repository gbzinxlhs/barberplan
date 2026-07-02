import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.saasUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { tenant: true },
  });

  return NextResponse.json({ users });
}
