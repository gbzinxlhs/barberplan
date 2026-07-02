const ASAAS_API = process.env.ASAAS_ENVIRONMENT === "production"
  ? "https://api.asaas.com/api/v3"
  : "https://sandbox.asaas.com/api/v3";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";

async function asaasFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${ASAAS_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY,
      ...(options.headers as Record<string, string>),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.description || "Asaas error");
  return data;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj?: string;
}

export interface AsaasPayment {
  id: string;
  value: number;
  netValue: number;
  billingType: "PIX" | "BOLETO" | "CREDIT_CARD";
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "CANCELLED";
  pixQrCode?: string | null;
  pixCopyPaste?: string | null;
  invoiceUrl?: string;
  dueDate: string;
  externalReference?: string;
}

export async function createCustomer(data: {
  name: string;
  email: string;
  phone: string;
  cpfCnpj?: string;
}): Promise<AsaasCustomer> {
  return asaasFetch("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function findCustomerByEmail(email: string): Promise<AsaasCustomer | null> {
  const data = await asaasFetch(`/customers?email=${encodeURIComponent(email)}`);
  return data.data?.[0] || null;
}

export async function updateCustomer(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  cpfCnpj?: string;
}): Promise<AsaasCustomer> {
  return asaasFetch(`/customers/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createPixPayment(data: {
  customer: string;
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
}): Promise<AsaasPayment & { pixQrCode: string; pixCopyPaste: string }> {
  const payment = await asaasFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      billingType: "PIX",
    }),
  });

  const pix = await asaasFetch(`/payments/${payment.id}/pixQrCode`);
  return { ...payment, pixQrCode: pix.encodedImage, pixCopyPaste: pix.payload };
}

export async function getPayment(id: string): Promise<AsaasPayment> {
  return asaasFetch(`/payments/${id}`);
}
