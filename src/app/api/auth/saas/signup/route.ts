import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSaasToken, setSaasTokenCookie } from "@/lib/auth-saas";

export async function POST(request: Request) {
  try {
    const { name, surname, email, phone } = await request.json();

    if (!name || !surname || !email || !phone) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const existing = await prisma.saasUser.findUnique({ where: { email } });

    let user;
    if (existing) {
      user = await prisma.saasUser.update({
        where: { email },
        data: { name, surname, phone },
      });
    } else {
      user = await prisma.saasUser.create({
        data: { name, surname, email, phone },
      });
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
      isNew: !existing,
    });

    setSaasTokenCookie(response, token);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao criar conta" }, { status: 500 });
  }
}
