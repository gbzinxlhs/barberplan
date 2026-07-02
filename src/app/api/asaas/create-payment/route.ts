import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomer, findCustomerByEmail, updateCustomer, createPixPayment } from "@/lib/asaas";

export async function POST(request: Request) {
  try {
    const { email, plan, billing, cpfCnpj } = await request.json();

    if (!email || !plan || !billing) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const user = await prisma.saasUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const plans: Record<string, { name: string; monthly: number; annual: number }> = {
      starter: { name: "Starter", monthly: 39.9, annual: 407 },
      pro: { name: "Pro", monthly: 79.9, annual: 815 },
    };

    const planData = plans[plan];
    if (!planData) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const value = billing === "monthly" ? planData.monthly : planData.annual;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    let asaasCustomer = await findCustomerByEmail(email);
    if (asaasCustomer) {
      if (cpfCnpj) {
        asaasCustomer = await updateCustomer(asaasCustomer.id, {
          cpfCnpj: cpfCnpj.replace(/\D/g, ""),
        });
      }
    } else {
      asaasCustomer = await createCustomer({
        name: `${user.name} ${user.surname}`,
        email: user.email,
        phone: user.phone,
        cpfCnpj: cpfCnpj ? cpfCnpj.replace(/\D/g, "") : undefined,
      });
    }

    const payment = await createPixPayment({
      customer: asaasCustomer.id,
      value,
      dueDate: dueDate.toISOString().split("T")[0],
      description: `BarberPlan - Plano ${planData.name} (${billing === "monthly" ? "Mensal" : "Anual"})`,
      externalReference: user.id,
    });

    return NextResponse.json({
      paymentId: payment.id,
      value: payment.value,
      pixQrCode: payment.pixQrCode,
      pixCopyPaste: payment.pixCopyPaste,
      expiresAt: dueDate.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao criar pagamento" }, { status: 500 });
  }
}
