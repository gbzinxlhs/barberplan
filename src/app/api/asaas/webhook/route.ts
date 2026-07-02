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
      // Parse externalReference as JSON (backward-compatible: if it's a plain userId, treat as pro/annual)
      let userId: string;
      let plan = "pro";
      let billing = "annual";

      try {
        const ref = JSON.parse(externalReference);
        userId = ref.userId;
        plan = ref.plan || "pro";
        billing = ref.billing || "annual";
      } catch {
        userId = externalReference;
      }

      const now = new Date();
      let planExpiresAt: Date;

      if (billing === "monthly") {
        planExpiresAt = new Date(now.setMonth(now.getMonth() + 1));
      } else {
        planExpiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
      }

      await prisma.saasUser.update({
        where: { id: userId },
        data: {
          plan,
          planExpiresAt,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
