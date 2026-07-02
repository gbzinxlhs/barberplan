import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayment } from "@/lib/asaas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payment = body.payment;

    if (!payment || !payment.id) {
      return NextResponse.json({ received: true });
    }

    const asaasPayment = await getPayment(payment.id);
    const externalReference = asaasPayment.externalReference;

    if (!externalReference) {
      return NextResponse.json({ received: true });
    }

    if (asaasPayment.status === "RECEIVED" || asaasPayment.status === "CONFIRMED") {
      const planExpiresAt = new Date();
      planExpiresAt.setFullYear(planExpiresAt.getFullYear() + 1);

      await prisma.saasUser.update({
        where: { id: externalReference },
        data: {
          plan: "pro",
          planExpiresAt,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
