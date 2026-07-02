import { NextResponse } from "next/server";
import { getSuperAdminCredentials, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const creds = getSuperAdminCredentials();

  if (email !== creds.email || password !== creds.password) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = signToken({ email, role: "super_admin" });

  return NextResponse.json({ token, user: { email, role: "super_admin" } });
}
