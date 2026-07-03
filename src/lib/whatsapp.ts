import { prisma } from "@/lib/prisma";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) return `55${digits}`;
  if (digits.length === 10) return `55${digits}`;
  return digits;
}

export async function sendWhatsApp(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    console.log(`[WHATSAPP] (not configured) To: ${to} | ${body}`);
    return;
  }

  try {
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          To: `whatsapp:${formatPhone(to)}`,
          Body: body,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[WHATSAPP] Failed to send:", err);
    }
  } catch (error) {
    console.error("[WHATSAPP] Error:", error);
  }
}

export async function isProTenant(tenantId: string): Promise<boolean> {
  const owner = await prisma.saasUser.findFirst({
    where: { tenantId, plan: "pro" },
  });
  return !!owner;
}

export async function sendWhatsAppIfPro(
  tenantId: string,
  to: string,
  body: string
): Promise<void> {
  if (!(await isProTenant(tenantId))) {
    console.log(`[WHATSAPP] Skipped (not pro) To: ${to}`);
    return;
  }
  return sendWhatsApp(to, body);
}

export function formatDateTime(d: Date): string {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month} às ${hours}:${minutes}`;
}
