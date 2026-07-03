import { NextResponse } from "next/server";
import { clearSaasTokenCookie } from "@/lib/auth-saas";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearSaasTokenCookie(response);
  return response;
}
