import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSaasToken, setSaasTokenCookie } from "@/lib/auth-saas";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const user = await prisma.saasUser.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
    }

    let tenant = null;
    if (user.tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
    }

    const token = signSaasToken({
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        planExpiresAt: user.planExpiresAt,
        tenantId: user.tenantId,
        role: user.role,
      },
      tenant,
    });

    setSaasTokenCookie(response, token);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao fazer login" }, { status: 500 });
  }
}
