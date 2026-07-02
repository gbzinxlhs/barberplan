import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new Response("ok");
  } catch {
    return new Response("error", { status: 500 });
  }
}
