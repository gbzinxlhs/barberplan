import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomer, findCustomerByEmail, updateCustomer, createPixPayment } from "@/lib/asaas";
import { createDefaultWorkingHours } from "@/lib/working-hours";

function generateSlug(name: string, surname: string): string {
  const base = `${name}-${surname}`
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

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

    // Create tenant if user doesn't have one yet
    let tenantId = user.tenantId;
    let tenant = tenantId ? await prisma.tenant.findUnique({ where: { id: tenantId } }) : null;
    if (!tenant) {
      const slug = generateSlug(user.name, user.surname);
      tenant = await prisma.tenant.create({
        data: {
          name: `${user.name} ${user.surname}`,
          slug,
          subdomain: slug,
          phone: user.phone,
          primaryColor: "#22c55e",
        },
      });
      await createDefaultWorkingHours(tenant.id);
      tenantId = tenant.id;
    }

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
      externalReference: JSON.stringify({ userId: user.id, plan, billing }),
    });

    return NextResponse.json({
      paymentId: payment.id,
      value: payment.value,
      pixQrCode: payment.pixQrCode,
      pixCopyPaste: payment.pixCopyPaste,
      expiresAt: dueDate.toISOString(),
      tenantSlug: tenant.slug,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao criar pagamento" }, { status: 500 });
  }
}
